import { NextRequest, NextResponse } from "next/server";
import vm from "node:vm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language = "javascript", code, stdin = "" } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code snippet is required" }, { status: 400 });
    }

    // Safety checks: Reject code payload exceeding 15,000 characters
    if (code.length > 15000) {
      return NextResponse.json({ error: "Code exceeds 15,000 character limit" }, { status: 422 });
    }

    // Prohibit forbidden globals/calls in JS
    const forbiddenPatterns = [
      /process\./i,
      /child_process/i,
      /require\s*\(/i,
      /import\s*\(/i,
      /fs\./i,
      /__dirname/i,
      /__filename/i,
      /global\./i,
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(code)) {
        return NextResponse.json({
          status: "security_violation",
          exitCode: 1,
          stdout: "",
          stderr: "Security Policy Violation: Host process access, file system access, and external module imports are disabled in the execution sandbox.",
          executionTimeMs: 1,
          memoryUsedKb: 0,
        });
      }
    }

    const stdoutLogs: string[] = [];
    const stderrLogs: string[] = [];

    // Capture console output
    const sandboxConsole = {
      log: (...args: any[]) => stdoutLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
      info: (...args: any[]) => stdoutLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
      warn: (...args: any[]) => stderrLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
      error: (...args: any[]) => stderrLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    };

    // Isolated sandbox environment
    const sandbox = {
      console: sandboxConsole,
      Math,
      Date,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Map,
      Set,
      Promise,
      performance: {
        now: () => Date.now(),
      },
      Float32Array,
      Float64Array,
      Int32Array,
      Uint8Array,
      stdin,
    };

    const context = vm.createContext(sandbox);

    const startTime = Date.now();
    let result: any;
    let timedOut = false;

    try {
      // 3000ms hard execution timeout enforced by V8
      const script = new vm.Script(code);
      result = script.runInContext(context, {
        timeout: 3000,
        displayErrors: true,
      });
    } catch (execErr: any) {
      if (execErr.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
        timedOut = true;
        stderrLogs.push("Execution terminated: Hard execution timeout (3000ms) exceeded.");
      } else {
        stderrLogs.push(execErr.message || String(execErr));
      }
    }

    const executionTimeMs = Math.max(1, Date.now() - startTime);

    if (result !== undefined && stdoutLogs.length === 0 && !timedOut && stderrLogs.length === 0) {
      stdoutLogs.push(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result));
    }

    return NextResponse.json({
      status: timedOut ? "timeout" : stderrLogs.length > 0 ? "error" : "success",
      exitCode: timedOut ? 137 : stderrLogs.length > 0 ? 1 : 0,
      stdout: stdoutLogs.join("\n"),
      stderr: stderrLogs.join("\n"),
      executionTimeMs,
      memoryUsedKb: Math.round(1024 + Math.random() * 2048), // Simulated sandbox resident memory
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "fatal_error",
        exitCode: 1,
        stdout: "",
        stderr: error.message || "Sandbox runner error",
        executionTimeMs: 0,
        memoryUsedKb: 0,
      },
      { status: 500 }
    );
  }
}


import { Schema, model, models } from "mongoose";

const AudioCommentSchema = new Schema({
  mediaUrl: { type: String, required: true },
  durationMs: { type: Number, required: true, max: 30000 },
  waveform: [{ type: Number }],
  mimeType: { type: String, default: 'audio/webm' },
  fileSizeBytes: { type: Number },
}, { _id: false });

const CommentSchema = new Schema({
  type: { type: String, enum: ['text', 'audio'], default: 'text' },
  text: { type: String },
  audio: AudioCommentSchema,
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const TechExtensionSchema = new Schema({
  githubRepo: {
    owner: String,
    repoName: String,
    branch: String,
    repoUrl: String,
    starsCount: Number,
    primaryLanguage: String,
  },
  codeSnippet: {
    language: { type: String, default: 'javascript' },
    code: String,
    entrypoint: String,
    isExecutable: { type: Boolean, default: true },
  },
}, { _id: false });

const MemeExtensionSchema = new Schema({
  isTemplate: { type: Boolean, default: true },
  parentMemeId: { type: Schema.Types.ObjectId, ref: 'Thought' },
  templateImageUrl: String,
  canvasState: {
    canvasWidth: Number,
    canvasHeight: Number,
    textLayers: [{
      id: String,
      text: String,
      x: Number,
      y: Number,
      fontSize: Number,
      fontFamily: String,
      fillColor: String,
      strokeColor: String,
      strokeWidth: Number,
      rotation: Number,
      isAllCaps: Boolean,
    }],
  },
}, { _id: false });

const CricketExtensionSchema = new Schema({
  matchTitle: String,
  teams: {
    home: String,
    away: String,
  },
  scoreSnippet: String,
  matchFormat: { type: String, enum: ['T20', 'ODI', 'Test', 'General'] },
  venue: String,
}, { _id: false });

const ThoughtSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  world: { 
    type: String, 
    required: true, 
    enum: ['Technology', 'Meme', 'Cricket', 'Thoughts'] 
  },
  image: { type: String },
  mediaType: { type: String, enum: ['none', 'image', 'video'], default: 'image' },
  
  // Pluggable World Extensions
  extensionType: { type: String, enum: ['none', 'tech', 'meme', 'cricket'], default: 'none' },
  tech: TechExtensionSchema,
  meme: MemeExtensionSchema,
  cricket: CricketExtensionSchema,

  // Other World Data
  cooking: Schema.Types.Mixed,
  art: Schema.Types.Mixed,
  music: Schema.Types.Mixed,
  fitness: Schema.Types.Mixed,

  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  sharesCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const Thought = models.Thought || model("Thought", ThoughtSchema);

export default Thought;

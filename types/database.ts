// ==============================================================================
// SWITCH SOCIAL PLATFORM - DATABASE TYPES
// File: types/database.ts
// Official PostgREST & Supabase v2 Schema Definitions
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PostType = "standard" | "tech" | "meme" | "cricket";
export type ReactionType =
  | "upvote"
  | "downvote"
  | "skull"
  | "laugh"
  | "clown"
  | "cinema"
  | "fire";
export type NotificationType = "follow" | "reaction" | "comment" | "mention";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      worlds: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          world_id: string;
          content: string;
          post_type: PostType;
          is_edited: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          world_id: string;
          content: string;
          post_type?: PostType;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          world_id?: string;
          content?: string;
          post_type?: PostType;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          }
        ];
      };
      post_media: {
        Row: {
          id: string;
          post_id: string;
          media_url: string;
          media_type: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          media_url: string;
          media_type?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          media_url?: string;
          media_type?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_media_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          parent_comment_id: string | null;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          parent_comment_id?: string | null;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          parent_comment_id?: string | null;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      reactions: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          reaction_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          reaction_type?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reactions_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          actor_id: string;
          notification_type: string;
          reference_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          actor_id: string;
          notification_type: string;
          reference_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          actor_id?: string;
          notification_type?: string;
          reference_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience Type Aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type World = Database["public"]["Tables"]["worlds"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostMedia = Database["public"]["Tables"]["post_media"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Reaction = Database["public"]["Tables"]["reactions"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Follow = Database["public"]["Tables"]["follows"]["Row"];

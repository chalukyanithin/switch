import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { 
    type: String, 
    default: function(this: any) { 
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${this.username || 'User'}`; 
    } 
  },
  bio: { type: String, default: "Exploring the intersections of art and technology." },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true,
});

const User = models.User || model("User", UserSchema);

export default User;

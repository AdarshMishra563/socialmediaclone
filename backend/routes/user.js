const mongoose = require("mongoose");

// Comment Schema
const CommentSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Stores the username of the commenter
  text: { type: String, required: true }, // Stores the actual comment text
  createdAt: { type: Date, default: Date.now } // Adds a timestamp for comments
});

// Post Schema
const PostSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Image URL
  caption: String, // Caption for the post
  likes: { type: Number, default: 0 }, // Total likes count
  comments: { type: [CommentSchema], default: [] }, // Array of comments
  likedby: { type: [String], default: [] }, // Array of emails (users who liked)
  createdAt: { type: Date, default: Date.now } // Timestamp for post creation
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  number: {
    type: String, // Storing phone number as a string to avoid leading zero issues
    unique: true,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  posts: { type: [PostSchema], default: [] } // Array of user's posts
});

// Export the model
module.exports = mongoose.model("iosUser", UserSchema);

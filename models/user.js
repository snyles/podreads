const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const podcastSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  podcastId: {
    type: String
  }
})

const userSchema = new Schema({
    name: String,
    email: String,
    avatar: String,
    googleId: String,
    podcasts: [podcastSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

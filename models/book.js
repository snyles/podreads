const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: String,
    author: String,
    googleId: String,
    published: Date,
    thumbnail: String,
    collectedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);

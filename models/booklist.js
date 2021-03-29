const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const booklistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "My Reading List",
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booklist", booklistSchema);
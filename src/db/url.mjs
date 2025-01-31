import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
    index: true,
  },
  originalUrl: {
    type: String,
    required: true,
    index: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: String,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model("Url", UrlSchema);

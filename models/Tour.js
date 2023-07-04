import { model, models, Schema, mongoose } from "mongoose";

const TourSchema = new Schema({
  name: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  reservation: { type: Boolean, required: true },
  reservationPrice: { type: Number },
  images: { type: [String] },
  includes: { type: [String] },
  requirements: { type: [String] },
  review: { type: [String] },
  notes: { type: [String] },
  promo: { type: Boolean, required: true },
  withoutPromoPrice: { type: Number },
  // category: { type: mongoose.Types.ObjectId, ref: "Category" },
  // properties: { type: Object },
});

export const Tour = models?.Tour || model("Tour", TourSchema);

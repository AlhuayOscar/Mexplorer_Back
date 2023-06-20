import { model, models, Schema } from "mongoose";

const TourSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  reservation: { type: Boolean, required: true },
  reservationPrice: { type: Number, required: true },
  photos: { type: [String] },
  includes: { type: [String] },
  requirements: { type: [String] },
  review: { type: [String] },
  notes: { type: String },
  tickets: { type: Number },
  promo: { type: Boolean, required: true },
  promoPrice: { type: Number },
});

export const Tour = models?.Tour || model("Tour", TourSchema);

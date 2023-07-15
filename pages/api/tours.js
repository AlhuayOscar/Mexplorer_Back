import { Tour } from "@/models/Tour";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?._id) {
      res.json(await Tour.findOne({ _id: req.query._id }));
    } else {
      res.json(await Tour.find());
    }
  }

  if (method === "POST") {
    const {
      name,
      subtitle,
      description,
      duration,
      adultsPrice,
      childrenPrice,
      reservation,
      adultsReservationPrice,
      childrenReservationPrice,
      images,
      includes,
      requirements,
      currency,
      doesntIncludes,
      review,
      notes,
      promo,
      withoutPromoPrice,
    } = req.body;
    const tourDoc = await Tour.create({
      name,
      subtitle,
      description,
      duration,
      adultsPrice,
      childrenPrice,
      reservation,
      adultsReservationPrice,
      childrenReservationPrice,
      images,
      includes,
      requirements,
      currency,
      doesntIncludes,
      review,
      notes,
      promo,
      withoutPromoPrice,
    });
    res.json(tourDoc);
  }

  if (method === "PUT") {
    const {
      name,
      subtitle,
      description,
      duration,
      adultsPrice,
      childrenPrice,
      reservation,
      adultsReservationPrice,
      childrenReservationPrice,
      images,
      includes,
      requirements,
      review,
      doesntIncludes,
      notes,
      promo,
      currency,
      withoutPromoPrice,
      _id,
    } = req.body;
    await Tour.updateOne(
      { _id },
      {
        name,
        subtitle,
        description,
        duration,
        adultsPrice,
        childrenPrice,
        reservation,
        adultsReservationPrice,
        childrenReservationPrice,
        images,
        includes,
        doesntIncludes,
        requirements,
        review,
        notes,
        promo,
        currency,
        withoutPromoPrice,
      }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?._id) {
      await Tour.deleteOne({ _id: req.query?._id });
      res.json(true);
    }
  }
}

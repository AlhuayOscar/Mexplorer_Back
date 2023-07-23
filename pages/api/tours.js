import { Tour } from "@/models/Tour";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?._id) {
      return res.json(await Tour.findOne({ _id: req.query._id }));
    } else {
      return res.json(await Tour.find());
    }
  }

  if (method === "POST") {
    try {
      const {
        name,
        subtitle,
        description,
        duration,
        price,
        reservation,
        images,
        includes,
        requirements,
        doesntIncludes,
        review,
        notes,
        promo,
      } = req.body;
      const tourDoc = await Tour.create({
        name,
        subtitle,
        description,
        duration,
        price,
        reservation,
        images,
        includes,
        requirements,
        doesntIncludes,
        review,
        notes,
        promo,
      });
      return res.json(tourDoc);
    } catch (error) {
      return res.status(400).json({ msg: error });
    }
  }

  if (method === "PUT") {
    const {
      name,
      subtitle,
      description,
      duration,
      price,
      reservation,
      images,
      includes,
      requirements,
      doesntIncludes,
      review,
      notes,
      promo,
      _id,
    } = req.body;
    await Tour.updateOne(
      { _id },
      {
        name,
        subtitle,
        description,
        duration,
        price,
        reservation,
        images,
        includes,
        doesntIncludes,
        requirements,
        review,
        notes,
        promo,
      }
    );
    return res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?._id) {
      await Tour.deleteOne({ _id: req.query?._id });
      return res.json(true);
    }
  }
}

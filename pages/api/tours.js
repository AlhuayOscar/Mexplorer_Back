import {Tour} from "@/models/Tour";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?._id) {
      res.json(await Tour.findOne({_id:req.query._id}));
    } else {
      res.json(await Tour.find());
    }
  }

  if (method === 'POST') {
    const {name, subtitle, description, duration, price, reservation, reservationPrice, images, includes, requirements, review, notes, promo, promoPrice, category, properties} = req.body;
    const tourDoc = await Tour.create({
      name,subtitle, description, duration, price, reservation, reservationPrice, images, includes, requirements, review, notes, promo, promoPrice, category, properties
    })
    res.json(tourDoc);
  }

  if (method === 'PUT') {
    const {name, subtitle, description, duration, price, reservation, reservationPrice, images, includes, requirements, review, notes, promo, promoPrice, category, properties, _id} = req.body;
    await Tour.updateOne({_id}, {name, subtitle, description, duration, price, reservation, reservationPrice, images, includes, requirements, review, notes, promo, promoPrice, category, properties});
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?._id) {
      await Tour.deleteOne({_id:req.query?._id});
      res.json(true);
    }
  }
}
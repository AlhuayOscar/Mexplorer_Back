import {Tour} from "@/models/Tour";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Tour.findOne({_id:req.query.id}));
    } else {
      res.json(await Tour.find());
    }
  }

  if (method === 'POST') {
    const {title,description,price,images,category,properties} = req.body;
    const tourDoc = await Tour.create({
      title,description,price,images,category,properties,
    })
    res.json(tourDoc);
  }

  if (method === 'PUT') {
    const {title,description,price,images,category,properties,_id} = req.body;
    await Tour.updateOne({_id}, {title,description,price,images,category,properties});
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Tour.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}
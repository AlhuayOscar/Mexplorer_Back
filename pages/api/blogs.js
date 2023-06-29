
import { Blog } from "@/models/Blog";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  //   if (method === 'GET') {
  //     res.json(await Blog.find().populate('parent'));
  //   }

  if (method === "POST") {
    const { title, subtitle, description, images, date, location } = req.body;
    const blogDoc = await Blog.create({
      title,
      subtitle, description, images, date, location
    });
    res.json(blogDoc);
  }

  if (method === "PUT") {
    const { name, parentCategory, properties, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}

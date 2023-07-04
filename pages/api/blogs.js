import { Blog } from "@/models/Blog";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?._id) {
      res.json(await Blog.findOne({ _id: req.query._id }));
    } else {
      res.json(await Blog.find());
    }
  }

  if (method === "POST") {
    const { title, subtitle, description, images, date, location } = req.body;
    const blogDoc = await Blog.create({
      title,
      subtitle,
      description,
      images,
      date,
      location,
    });
    res.json(blogDoc);
  }

  if (method === "PUT") {
    const { title, subtitle, description, images, date, location, _id } =
      req.body;
    const blogDoc = await Blog.updateOne(
      { _id },
      {
        title,
        subtitle,
        description,
        images,
        date,
        location,
      }
    );
    res.json(blogDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Blog.deleteOne({ _id });
    res.json("ok");
  }
}

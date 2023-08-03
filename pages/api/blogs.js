import { Blog } from "@/models/Blog";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    try {
      if (req.query?._id) {
        return res.json(await Blog.findOne({ _id: req.query._id }));
      } else {
        return res.json(await Blog.find());
      }
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }

  if (method === "POST") {
    try {
      const {
        title,
        titleEng,
        subtitle,
        subtitleEng,
        description,
        descriptionEng,
        images,
        date,
        location,
      } = req.body;
      const blogDoc = await Blog.create({
        title,
        titleEng,
        subtitle,
        subtitleEng,
        description,
        descriptionEng,
        images,
        date,
        location,
      });
      return res.status(201).json(blogDoc);
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }

  if (method === "PUT") {
    try {
      const {
        title,
        titleEng,
        subtitle,
        subtitleEng,
        description,
        descriptionEng,
        images,
        date,
        location,
        _id,
      } = req.body;
      const blogDoc = await Blog.updateOne(
        { _id },
        {
          title,
          titleEng,
          subtitle,
          subtitleEng,
          description,
          descriptionEng,
          images,
          date,
          location,
        }
      );
      return res.json(blogDoc);
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }

  if (method === "DELETE") {
    try {
      const { _id } = req.query;
      await Blog.deleteOne({ _id });
      return res.json("ok");
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }
}

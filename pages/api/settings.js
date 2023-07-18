import { Settings } from "@/models/Settings";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    const settingsDoc = await Settings.findOne();
    res.json(settingsDoc);
  }

  if (method === "POST") {
    const { videoUrls, redirectUrls } = req.body;
    const settingsDoc = await Settings.create({
      videoUrls,
      redirectUrls,
    });
    res.json(settingsDoc);
  }

  if (method === "PUT") {
    const { videoUrls, redirectUrls } = req.body;
    const settingsDoc = await Settings.updateOne(
      {},
      {
        videoUrls,
        redirectUrls,
      }
    );
    res.json(settingsDoc);
  }

  if (method === "DELETE") {
    await Settings.deleteMany();
    res.json("ok");
  }
}

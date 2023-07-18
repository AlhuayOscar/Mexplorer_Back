import { Settings } from "@/models/Settings";
import { mongooseConnect } from "@/lib/mongoose";

// Establece la conexión a MongoDB
mongooseConnect();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Consulta la configuración (debe haber solo un documento en Settings)
      const settings = await Settings.findOne({});
      return res.status(200).json(settings);
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving settings." });
    }
  } else if (req.method === "POST") {
    try {
      // Obtén los datos del formulario desde el cuerpo de la solicitud
      const { videoUrls, urlName } = req.body;

      // Busca si ya existe la configuración en la base de datos
      const existingSettings = await Settings.findOne({});

      if (existingSettings) {
        // Si ya existe, actualiza los valores
        existingSettings.videoUrls = videoUrls;
        existingSettings.urlName = urlName;
        await existingSettings.save();
        return res.status(200).json(existingSettings);
      } else {
        // Si no existe, crea un nuevo documento de configuración
        const newSettings = new Settings({ videoUrls, urlName });
        await newSettings.save();
        return res.status(201).json(newSettings);
      }
    } catch (error) {
      return res.status(500).json({ error: "Error updating settings." });
    }
  } else if (req.method === "DELETE") {
    try {
      // Elimina la configuración (debe haber solo un documento en Settings)
      await Settings.deleteMany({});
      return res
        .status(200)
        .json({ message: "Settings deleted successfully." });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting settings." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}

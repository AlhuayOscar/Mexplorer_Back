import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";

export default async function handle(req, res) {
    try {
        await mongooseConnect();

        if (req.method === "GET") {
            const reviews = await Review.find();
            res.json(reviews);
        } else if (req.method === "DELETE") {
            const { id } = req.query;

            // Verificar que el ID proporcionado no sea nulo o vacío
            if (!id) {
                return res.status(400).json({ error: "El ID de la revisión no se proporcionó correctamente." });
            }

            // Eliminar la revisión con el ID proporcionado
            const deletedReview = await Review.findByIdAndDelete(id);

            // Verificar si se encontró y eliminó la revisión
            if (!deletedReview) {
                return res.status(404).json({ error: "La revisión no se encontró o no pudo ser eliminada." });
            }

            res.status(200).json({ message: "Revisión eliminada con éxito." });
        } else {
            res.status(405).json({ error: "Método no permitido." }); // Método no permitido (405 Method Not Allowed) para otras solicitudes
        }
    } catch (error) {
        console.error("Error al manejar la solicitud:", error);
        res.status(500).json({ error: "Error al manejar la solicitud" });
    }
}

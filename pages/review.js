import React, { useEffect, useState } from "react";
import axios from "axios";
import GridLoader from "react-spinners/GridLoader";
import Layout from "@/components/Layout";
import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";
import CustomPagination from "@/components/Pagination";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ITEMS_PER_PAGE = 15;

export default function DeleteReview({ review }) {
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedComments, setExpandedComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limitedReviews = reviews.slice(0, 3);

  // Función para manejar errores al cargar las reviews
  const handleLoadError = (error) => {
    console.error("Error al cargar las reviews:", error);

    // Mostrar SweetAlert con el mensaje de error
    MySwal.fire({
      icon: "error",
      title: "Hubo un error al buscar la información de las reseñas. ",
      text: "Por favor, contacte al Administrador o al Soporte.",
    });
  };

  // Todas las reviews
  const loadReviews = () => {
    axios
      .get("/api/reviews")
      .then((response) => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch(handleLoadError); // Utilizamos la función handleLoadError en el catch
  };

  // Eliminar una review específica
  const handleEliminarRevision = async (reviewId) => {
    try {
      await axios.delete(`/api/reviews?id=${reviewId}`);
      // Actualizar el estado local
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );
    } catch (error) {
      console.error("Error al eliminar la review:", error);

      // Mostrar SweetAlert con el mensaje de error
      MySwal.fire({
        icon: "error",
        title: "Hubo un error al eliminar la reseña ",
        text: `Está es la reseña: "${reviewId}" Porfavor, contacte al Administrador o al Soporte.`,
      });
    }
  };

  useEffect(() => {
    // Carga todas las reviews al cargar el componente
    loadReviews();
  }, []);

  // Expandir texto
  const handleToggleDescription = (commentId) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = reviews.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <div>
        <h2 className="btn-primary text-center">Comentarios</h2>
        <table className="basic mt-2">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Estrellas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="flex justify-center items-center h-screen w-screen">
                <GridLoader
                  loading={loading}
                  size={45}
                  color={"rgb(85, 66, 246)"}
                />
              </tr>
            ) : (
              paginatedReviews.map((review) => (
                <tr key={review._id} className="border-b">
                  <td className="p-4">{review.title}</td>
                  <td className="p-4">
                    {limitedReviews ? (
                      <div>
                        {expandedComments.includes(review._id) ? (
                          <p>{review.description}</p>
                        ) : review.description.length <= 100 ? (
                          <p>{review.description}</p>
                        ) : (
                          <p>{review.description.substring(0, 100)}</p>
                        )}
                        {review.description.length > 100 && (
                          <button
                            className="btn-primary"
                            onClick={() => handleToggleDescription(review._id)}
                          >
                            {expandedComments.includes(review._id)
                              ? "Mostrar menos"
                              : "Mostrar más"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        {showAllReviews && (
                          <div>
                            {expandedComments.includes(review.id) ? (
                              <p>{review.description}</p>
                            ) : review.description.length <= 100 ? (
                              <p>{review.description}</p>
                            ) : (
                              <p>{review.description.substring(0, 100)}</p>
                            )}
                            {review.description.length > 100 && (
                              <button
                                onClick={() =>
                                  handleToggleDescription(review.id)
                                }
                              >
                                {expandedComments.includes(review.id)
                                  ? "Mostrar menos"
                                  : "Mostrar más"}
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  <td className="p-4">{review.stars}</td>
                  <td className="p-4">
                    <button
                      className="btn-red flex justify-center aling-end"
                      onClick={() => handleEliminarRevision(review._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
}

// Obtener todos los datos del servidor (Review)
export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const review = await Review.findById(id);
  return {
    props: {
      review: JSON.parse(JSON.stringify(review)),
    },
  };
}

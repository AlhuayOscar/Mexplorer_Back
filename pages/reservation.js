import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import CustomPagination from "../components/Pagination.js";
import GridLoader from "react-spinners/GridLoader";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ITEMS_PER_PAGE = 15;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Función para manejar errores al cargar las reservas
  const handleLoadError = (error) => {
    console.error("Error al cargar las reservas:", error);

    // Mostrar SweetAlert con el mensaje de error
    MySwal.fire({
      icon: "error",
      title: "Hubo un error al buscar la información de las reservas.",
      text: "Por favor, contacte al Administrador o al Soporte.",
    });
  };

  useEffect(() => {
    axios
      .get("/api/orders")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(handleLoadError); // Utilizamos la función handleLoadError en el catch
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedReservation = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <h1>RESERVAS</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <GridLoader loading={loading} size={45} color={"rgb(85, 66, 246)"} />
        </div>
      ) : (
        <table className="basic">
          <thead>
            <tr>
              <th>Fecha de la reserva</th>
              <th>Tipo de orden</th>
              <th>Está pago?</th>
              <th>Datos del consumidor</th>
              <th>Productos</th>
              <th>Cantidad de personas</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservation.length > 0 &&
              paginatedReservation.map((order, index) => (
                <tr key={index}>
                  {order.kind === "Reserva" ? (
                    <>
                      <td>{new Date(order.date).toLocaleString()}</td>
                      <td>{order.kind}</td>
                      <td
                        className={
                          order.paid ? "text-green-600" : "text-red-600"
                        }
                      >
                        {order.paid ? "YES" : "NO"}
                      </td>
                      <td>
                        {order.name} {order.lastname}
                        <br />
                        {order.email}
                      </td>
                      <td>{order.persons}</td>
                      <td>
                        {order.line_items?.map((l) => (
                          <React.Fragment key={l.id}>
                            <td>
                              {l.price_data?.product_data?.name ||
                                "Tour sin registrar "}
                            </td>
                            <td>{l.quantity}</td>
                            <br />
                          </React.Fragment>
                        ))}
                      </td>
                    </>
                  ) : (
                    <td colSpan="6">
                      No hay información para tal fecha o tour.
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
}

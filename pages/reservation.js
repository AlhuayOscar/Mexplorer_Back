import React from "react";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomPagination from "../components/Pagination.js";

const ITEMS_PER_PAGE = 15;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
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
                      className={order.paid ? "text-green-600" : "text-red-600"}
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
                  <td colSpan="6">No hay información para tal fecha o tour.</td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
}

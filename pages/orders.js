import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import CustomPagination from "../components/Pagination.js";
import GridLoader from "react-spinners/GridLoader";

const ITEMS_PER_PAGE = 15;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setLoading(false);
    });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <h1>Pedidos</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <GridLoader loading={loading} size={45} color={"rgb(85, 66, 246)"} />
        </div>
      ) : (
        <table className="basic">
          <thead>
            <tr key="header">
              <th>Fecha</th>
              <th>Tipo de orden</th>
              <th>Está pago?</th>
              <th>Datos del consumidor</th>
              <th>Productos</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 &&
              paginatedOrders.map((order, index) => (
                <tr key={index}>
                  {order.kind === "Compra" ? (
                    <>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
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
                      <td>
                        {order.line_items?.map((item, index) => (
                          <div key={index}>
                            <span>
                              {item.price_data?.product_data?.name ||
                                "Tour sin registrar "}
                            </span>
                            <span>{item.quantity}</span>
                          </div>
                        ))}
                      </td>
                    </>
                  ) : (
                    <td colSpan="6">Información no disponible</td>
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

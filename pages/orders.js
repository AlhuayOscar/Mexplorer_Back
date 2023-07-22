import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Pedidos</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo de orden</th>
            <th>Está pago?</th>
            <th>Datos del consumidor</th>
            <th>Productos</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
              {order.kind === "Compra" ? <div>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.kind}</td>
                  <td className={order.paid ? "text-green-600" : "text-red-600"}>
                    {order.paid ? "YES" : "NO"}
                  </td>
                  <td>
                    {order.name} {order.lastname}
                    <br />
                    {order.email}
                  </td>
                  <td>
                    {order.line_items?.map((l) => (
                      <>
                        <td>
                          {l.price_data?.product_data?.name || "Tour sin registrar "}
                        </td>
                        <td>{l.quantity}</td>
                        <br />
                      </>
                    ))}
                  </td>
                  </div> : <div></div>}
                  </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

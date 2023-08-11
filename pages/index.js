import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import GridLoader from "react-spinners/GridLoader";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  Tooltip,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Title,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { chartColors, backgroundColors } from "./api/graphSettings.js";
import axios from "axios";
import Swal from "sweetalert2";

ChartJS.register(
  ArcElement,
  Tooltip,
  LinearScale,
  BarElement,
  Legend,
  PointElement,
  LineElement,
  Title,
  CategoryScale
);

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [tourData, setTourData] = useState([]);
  const [reservedToursCount, setReservedToursCount] = useState(0);
  const [unreservedToursCount, setUnreservedToursCount] = useState(0);
  const [recentTours, setRecentTours] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [valuesByMonth, setValuesByMonth] = useState([]);
  const [filteredValueMonths, setFilteredValueMonths] = useState([]);
  const [filteredOrdersMonth, setFilteredOrdersMonth] = useState([]);
  const [isPopupShown, setIsPopupShown] = useState(false);

  useEffect(() => {
    if (session) {
      try {
        axios
          .get("/api/tours")
          .then((response) => {
            setTourData(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(
              "Error buscando la ruta de información de los tours:",
              error
            );
            setIsLoading(false);
            Swal.fire({
              icon: "warning",
              title: "Error buscando la ruta de información de los tours:",
              text: "Por favor, contacte al Administrador o al Soporte.",
            });
          });
      } catch (error) {
        console.error("Error fetching tour data:", error);
        setIsLoading(false);
        Swal.fire({
          icon: "warning",
          title: "Error fetching tour data",
          text: "Por favor, contacte al Soporte.",
        });
      }
    }
  }, [session]);

  useEffect(() => {
    try {
      axios
        .get("/api/orders")
        .then((response) => {
          let count = 0;
          const names = [];
          const nameCounts = {};

          for (let index = 0; index < response.data.length; index++) {
            if (
              response.data[index].line_items &&
              response.data[index].line_items[0] &&
              response.data[index].line_items[0].price_data &&
              response.data[index].line_items[0].price_data.product_data &&
              response.data[index].line_items[0].price_data.product_data.name
            ) {
              const productName =
                response.data[index].line_items[0].price_data.product_data.name;
              names.push(productName);
              if (nameCounts[productName]) {
                nameCounts[productName] += 1;
              } else {
                nameCounts[productName] = 1;
              }
              count++;
            }
          }

          let maxCount = 0;
          let mostFrequentName = "";
          for (const name in nameCounts) {
            if (nameCounts[name] > maxCount) {
              maxCount = nameCounts[name];
              mostFrequentName = name;
            }
          }
          let modifiedName = mostFrequentName.replace(
            /(t[o0]+u[r0]+|Tour\s*[aA]\s*)/g,
            ""
          );
          modifiedName = modifiedName.replace(
            /(^\w{1})|(\s{1}\w{1})/g,
            (match) => match.toUpperCase()
          );
          setProductNames([modifiedName.trim()]);
        })
        .catch((error) => {
          console.error("Mucho cuidado por acá:", error);
          Swal.fire({
            icon: "warning",
            title: "Error realizando 'Fetching' a la información de ordenes",
            text: "Por favor, contacte al Administrador o al Soporte.",
          });
        });
    } catch (error) {
      console.error("Mucho cuidado por acá:", error);
      Swal.fire({
        icon: "warning",
        title: "Error realizando 'Fetching' a la información de ordenes",
        text: "Por favor, contacte al Administrador o al Soporte.",
      });
    }
  }, []);

  useEffect(() => {
    try {
      axios
        .get("/api/orders")
        .then((response) => {
          const valueMonths = [];
          const ordersMonth = new Array(12).fill(null);

          for (let index = 0; index < response.data.length; index++) {
            if (
              response.data[index].line_items &&
              response.data[index].createdAt
            ) {
              const lineItems = response.data[index].line_items;
              const createdAt = response.data[index].createdAt;
              const month = new Date(createdAt).getMonth();

              let totalValue = 0;

              for (let i = 0; i < lineItems.length; i++) {
                if (
                  lineItems[i].price_data &&
                  lineItems[i].price_data.unit_amount
                ) {
                  const unitAmountString = lineItems[i].price_data.unit_amount;
                  const unitAmount = Number(unitAmountString);
                  totalValue += unitAmount;
                }
              }

              if (valueMonths[month]) {
                valueMonths[month] += totalValue;
              } else {
                valueMonths[month] = totalValue;
              }

              if (ordersMonth[month]) {
                ordersMonth[month] += 1;
              } else {
                ordersMonth[month] = 1;
              }
            }
          }

          const formattedValueMonths = valueMonths.map((value) => {
            const formattedValue = (value / 100).toFixed(2).replace(".", ",");
            return formattedValue;
          });

          const filteredValueMonths = formattedValueMonths.filter(
            (value) => value !== undefined
          );
          const filteredOrdersMonth = ordersMonth.filter(
            (value) => value !== undefined
          );
          setFilteredValueMonths(filteredValueMonths);
          setFilteredOrdersMonth(filteredOrdersMonth);
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            icon: "warning",
            title: "Error encontrando la ruta de información de ordenes",
            text: "Por favor, contacte al Administrador o al Soporte.",
          });
        });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "warning",
        title: "Error encontrando la ruta de información de ordenes",
        text: "Por favor, contacte al Administrador o al Soporte.",
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoading && tourData.length > 0) {
      const reservedCount = tourData.filter((tour) => tour.reservation).length;
      const unreservedCount = tourData.filter(
        (tour) => !tour.reservation
      ).length;
      setReservedToursCount(reservedCount);
      setUnreservedToursCount(unreservedCount);

      const recentTours = tourData
        .slice(0, 4)
        .map((tour) => tour.name.slice(0, 7));
      setRecentTours(recentTours);
    }
  }, [isLoading, tourData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      if (
        !isPopupShown && // Verificamos si la ventana emergente aún no se ha mostrado
        (window.innerWidth <= 1000 ||
          window.innerWidth <= 800 ||
          window.innerWidth <= 600 ||
          window.innerWidth > 1900)
      ) {
        setIsPopupShown(true); // Marcamos que la ventana emergente se ha mostrado
        Swal.fire({
          title: "Debe refrescar la página",
          text: "La resolución ha cambiado. Para mejorar la calidad de los Gráficos, refresca la página.",
          icon: "info",
          confirmButtonText: "Refrescar",
          showCancelButton: true,
          cancelButtonText: "Omitir",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    };

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [isPopupShown]); // Agregamos isPopupShown como dependencia

  const lineChartData = {
    labels: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    datasets: [
      {
        type: "line",
        label: "Ventas",
        borderColor: "rgb(255, 99, 132, 0.5)",
        borderWidth: 2,
        fill: false,
        data: filteredOrdersMonth,
      },
      {
        type: "bar",
        label: productNames,
        backgroundColor: "rgb(75, 192, 192, 0.5)",
        data: filteredOrdersMonth,
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const tourCountData = {
    labels: ["Con reserva", "Sin reserva"],
    datasets: [
      {
        data: [reservedToursCount, unreservedToursCount],
        backgroundColor: backgroundColors.slice(0, 2),
        borderColor: chartColors.slice(0, 2),
        borderWidth: 1,
      },
    ],
  };

  const last5Tours = tourData.slice(-5);
  const uniqueNames = [...new Set(last5Tours.map((tour) => tour.name))];
  const uniquePrices = [
    ...new Set(last5Tours.map((tour) => tour.price.usd.adultsPrice)),
  ];
  console.log(last5Tours);
  console.log(uniquePrices);

  const tourPricesData = {
    labels: uniqueNames,
    datasets: [
      {
        data: uniquePrices,
        backgroundColor: backgroundColors.slice(2, 11),
        borderColor: chartColors.slice(2, 11),
        borderWidth: 1,
      },
    ],
  };

  const promoData = {
    labels: ["Con promo", "Sin promo"],
    datasets: [
      {
        data: [
          tourData.filter((tour) => tour.promo).length,
          tourData.filter((tour) => !tour.promo).length,
        ],
        backgroundColor: backgroundColors.slice(0, 2),
        borderColor: chartColors.slice(0, 2),
        borderWidth: 1,
      },
    ],
  };

  // const barChartData = {
  //   labels: recentTours,
  //   datasets: [
  //     {
  //       label: "Cantidad de Compras",
  //       data: [10, 20, 15, 5], // Aquí debes proporcionar los datos reales correspondientes a los tours recientes
  //       backgroundColor: backgroundColors[0],
  //     },
  //   ],
  // };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          ¡Bienvenido, <b>{session?.user?.name}</b>!
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-evenly items-center">
        <div className="max-w-[400px] max-h-[500px] shadow-md rounded-lg p-5">
          <h3 className="text-center">Cantidad de Tours</h3>
          <Doughnut
            data={tourCountData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
        <div className="max-w-[400px] max-h-[500px] shadow-md rounded-lg p-5">
          <h3 className="text-center">Precios de Últimos 5 Tours</h3>
          <Doughnut
            data={tourPricesData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
        <div className="max-w-[400px] max-h-[500px] shadow-md rounded-lg p-5">
          <h3 className="text-center">Promociones</h3>
          <Doughnut
            data={promoData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
      </div>
      <div className="max-w-[400px] shadow-md rounded-lg p-5 flex flex-col items-center justify-center mx-auto my-auto">
        <h3 className="text-center">Tour con más ventas</h3>
        <div
          className="chart-container"
          style={{ width: "100%", height: "250px" }}
        >
          <Line
            data={lineChartData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
      </div>
    </Layout>
  );
}

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
  const [productNames, setProductNames] = useState([]); // Estado para almacenar el array de nombres
  const [valuesByMonth, setValuesByMonth] = useState([]);
  const [filteredValueMonths, setFilteredValueMonths] = useState([]);
  const [filteredOrdersMonth, setFilteredOrdersMonth] = useState([]);
  useEffect(() => {
    if (session) {
      axios
        .get("/api/tours")
        .then((response) => {
          setTourData(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tour data:", error);
        });
    }
  }, [session]);
  useEffect(() => {
    axios
      .get("/api/orders")
      .then((response) => {
        let count = 0;
        const names = []; // Array temporal para almacenar los nombres
        const nameCounts = {}; // Objeto para almacenar la cuenta de cada nombre

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
            names.push(productName); // Agregar el nombre al array temporal
            // Incrementar la cuenta del nombre en el objeto nameCounts
            if (nameCounts[productName]) {
              nameCounts[productName] += 1;
            } else {
              nameCounts[productName] = 1;
            }

            count++;
          }
        }
        // Encontrar el nombre que aparece más veces
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
        ); // Eliminar "tour" y variantes, así como la letra "a" después de "tour" (con o sin espacios)
        modifiedName = modifiedName.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
          match.toUpperCase()
        ); // Capitalizar la primera letra de cada palabra
        setProductNames([modifiedName.trim()]); // Actualizar el estado con el nombre modificado y eliminar espacios en blanco
      })
      .catch((error) => {
        console.error("Acá la erraste pibe:", error);
      });
  }, []);
  useEffect(() => {
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
            const month = new Date(createdAt).getMonth(); // Obtener el mes (0-11)

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

        // Formatear valueMonths agregando una coma antes de los dos últimos caracteres
        const formattedValueMonths = valueMonths.map((value) => {
          const formattedValue = (value / 100).toFixed(2).replace(".", ",");
          return formattedValue;
        });

        // Eliminar los espacios vacíos en los arreglos
        const filteredValueMonths = formattedValueMonths.filter(
          (value) => value !== undefined
        );
        const filteredOrdersMonth = ordersMonth.filter(
          (value) => value !== undefined
        );
        setFilteredValueMonths(filteredValueMonths);
        setFilteredOrdersMonth(filteredOrdersMonth);
        // Imprimir los arreglos de suma total y cantidad total de órdenes por mes
        console.log("valueMonths:", filteredValueMonths);
        console.log("ordersMonth:", filteredOrdersMonth);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  // Seguimos para los que no son graficos abajo:
  useEffect(() => {
    if (!isLoading && tourData.length > 0) {
      const reservedCount = tourData.filter((tour) => tour.reservation).length;
      const unreservedCount = tourData.filter(
        (tour) => !tour.reservation
      ).length;
      setReservedToursCount(reservedCount);
      setUnreservedToursCount(unreservedCount);

      // Obtener los tours más recientes y acortar los nombres
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
        data: filteredOrdersMonth, //Acá
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
  if (isLoading || status === "loading") {
    return (
      <div className="bg-stone-800 flex flex-col justify-center items-center h-screen">
        <img
          src="/mex_logo.png"
          alt="Logo de México"
          className="mt-4 max-w-350px max-h-full animate-fadeIn"
        />
        <h1 className="mb-4 text-white">Cargando...</h1>
        <GridLoader
          size={15}
          color={"#fff"}
          loading={true}
          speedMultiplier={0.7}
        />
      </div>
    );
  }

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

  const uniquePrices = [...new Set(tourData.map((tour) => tour.price))];

  const tourPricesData = {
    labels: uniquePrices.map((price) => price.toString()),
    datasets: [
      {
        data: uniquePrices.map((price) => {
          return tourData.filter((tour) => tour.price === price).length;
        }),
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

  const barChartData = {
    labels: recentTours, // Utilizar los tours más recientes y acortados
    datasets: [
      {
        label: "Tours más recientes",
        data: [10, 20, 15, 5], // Aquí debes proporcionar los datos reales correspondientes a los tours recientes
        backgroundColor: backgroundColors[0],
      },
    ],
  };
  const chartOptions = {
    responsive: true,
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
      <div className="flex flex-row justify-evenly">
        <div className="max-w-[400px] max-h-[400px] shadow-md rounded-lg p-5">
          <h3 className="text-center">Cantidad de Tours</h3>
          <Doughnut
            data={tourCountData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
        <div className="max-w-[400px] max-h-[400px] shadow-md rounded-lg p-5">
          <h3 className="text-center">Precios de Tours</h3>
          <Doughnut
            data={tourPricesData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
        <div className="max-w-[400px] max-h-[400px] shadow-md rounded-lg p-5">
          <h3 className="text-center">Promociones</h3>
          <Doughnut
            data={promoData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
      </div>
      <div className="flex flex-row justify-evenly">
        <div className="max-w-[400px] max-h-[400px] shadow-md rounded-lg p-5">
          <h3 className="text-center">Cantidad de reservas </h3>
          <Bar
            data={barChartData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
      </div>
      <div className="max-w-[1400px] max-h-[1400px] shadow-md rounded-lg p-5">
        <h3 className="text-center">Tour con más ventas</h3>
        <Line
          data={lineChartData}
          options={chartOptions}
          className="pixelated-chart"
        />
      </div>
    </Layout>
  );
}

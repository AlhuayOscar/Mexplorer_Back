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
  const [bestTour, setBestTour] = useState(null);
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
        const tourFrequency = {};

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

            if (tourFrequency[productName]) {
              tourFrequency[productName]++;
            } else {
              tourFrequency[productName] = 1;
            }
          }
        }

        let maxFrequency = 0;
        let bestTourName = null;

        for (const productName in tourFrequency) {
          if (tourFrequency.hasOwnProperty(productName)) {
            const frequency = tourFrequency[productName];
            if (frequency > maxFrequency) {
              maxFrequency = frequency;
              bestTourName = productName;
            }
          }
        }

        if (bestTourName !== null) {
          const bestTourData = response.data.find(
            (item) =>
              item.line_items[0].price_data.product_data.name ===
                bestTourName &&
              item.line_items &&
              item.line_items[0] &&
              item.line_items[0].price_data &&
              item.line_items[0].price_data.product_data
          );
          setBestTour(bestTourData.line_items[0].price_data.product_data.name);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  
  console.log(bestTour);
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

  if (isLoading || status === "loading") {
    console.log(productNames);
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
  const chartOptions = {
    responsive: true,
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
        data: [300, 500, 100, 200, 400, 600, 900],
      },
      {
        type: "bar",
        //Acá va el arreglo de productNames
        label: bestTour,
        backgroundColor: "rgb(75, 192, 192, 0.5)",
        data: [200, 400, 700, 500, 300, 100, 800],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
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
        <div className="max-w-[400px] max-h-[400px] shadow-md rounded-lg p-5">
          <h3 className="text-center">Tour más vendido</h3>
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

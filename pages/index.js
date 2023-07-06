import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import GridLoader from "react-spinners/GridLoader";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [tourData, setTourData] = useState([]);
  const [reservedToursCount, setReservedToursCount] = useState(0);
  const [unreservedToursCount, setUnreservedToursCount] = useState(0);

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
    if (!isLoading && tourData.length > 0) {
      const reservedCount = tourData.filter((tour) => tour.reservation).length;
      const unreservedCount = tourData.filter(
        (tour) => !tour.reservation
      ).length;
      setReservedToursCount(reservedCount);
      setUnreservedToursCount(unreservedCount);
    }
  }, [isLoading, tourData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

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
        backgroundColor: [
          "#36a2eb",
          "#ff6384",
          "#ffce56",
          "#ff9f40",
          "#4bc0c0",
          "#8e44ad",
          "#f39c12",
          "#16a085",
          "#c0392b",
        ],
        borderColor: [
          "#36a2eb",
          "#ff6384",
          "#ffce56",
          "#ff9f40",
          "#4bc0c0",
          "#8e44ad",
          "#f39c12",
          "#16a085",
          "#c0392b",
        ],
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
        backgroundColor: [
          "#ffce56",
          "#ff6384",
          "#36a2eb",
          "#ff9f40",
          "#4bc0c0",
          "#8e44ad",
          "#f39c12",
          "#16a085",
          "#c0392b",
        ],
        borderColor: [
          "#ffce56",
          "#ff6384",
          "#36a2eb",
          "#ff9f40",
          "#4bc0c0",
          "#8e44ad",
          "#f39c12",
          "#16a085",
          "#c0392b",
        ],
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
        backgroundColor: [
          "#36a2eb",
          "#ff6384",
          "#ffce56",
          "#ff9f40",
          "#4bc0c0",
          "#8e44ad",
          "#f39c12",
          "#16a085",
          "#c0392b",
        ],
        borderColor: [
          "#36a2eb",
          "#ff6384",
          "#ffce56",
          "#ff9f40",
          "#4bc0c0",
          "#8e44ad",
          "#f39c12",
          "#16a085",
          "#c0392b",
        ],
        borderWidth: 1,
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
      <div className="flex flex-row">
        <div className="max-w-[400px] max-h-[400px]">
          <h3>Cantidad de Tours</h3>
          <Doughnut
            data={tourCountData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>

        <div className="max-w-[400px] max-h-[400px]">
          <h3>Precios de Tours</h3>
          <Doughnut
            data={tourPricesData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>

        <div className="max-w-[400px] max-h-[400px]">
          <h3>Promociones</h3>
          <Doughnut
            data={promoData}
            options={chartOptions}
            className="pixelated-chart"
          />
        </div>
      </div>
    </Layout>
  );
}

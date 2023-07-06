import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import GridLoader from "react-spinners/GridLoader";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <img
          src="/mex_logo.png"
          alt="Logo de México"
          className="mt-4 max-w-350px max-h-full animate-fadeIn"
        />
        <h1 className="mb-4">Cargando...</h1>
        <GridLoader
          size={15}
          color={"#000"}
          loading={true}
          speedMultiplier={0.7}
        />
      </div>
    );
  }

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
    </Layout>
  );
}

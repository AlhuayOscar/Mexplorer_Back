import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import TourForm from "@/components/TourForm";

export default function EditTourPage() {
  const [tourInfo, setTourInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/tours?_id=" + id).then((response) => {
      setTourInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Editar tour</h1>
      {tourInfo && <TourForm {...tourInfo} />}
    </Layout>
  );
}

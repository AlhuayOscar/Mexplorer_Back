import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import SettingsForm from "@/components/SettingsForm";

export default function EditSettingsPage() {
  const [settingsInfo, setSettingsInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/settings?_id=" + id).then((response) => {
      setSettingsInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1>Editar configuración</h1>
      {settingsInfo && <SettingsForm {...settingsInfo} />}
    </Layout>
  );
}

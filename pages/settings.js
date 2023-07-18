import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout.js";

const Settings = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const [redirectUrls, setRedirectUrls] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newRedirectUrl, setNewRedirectUrl] = useState("");

  // Función para obtener la configuración actual de la base de datos
  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      const { videoUrls, redirectUrls } = response.data || [];
      setVideoUrls(videoUrls || []);
      setRedirectUrls(redirectUrls || []);
    } catch (error) {
      // Manejo de errores
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/settings", { videoUrls, redirectUrls });
      // Si todo fue exitoso, redirige a otra página o muestra un mensaje de éxito
    } catch (error) {
      // Manejo de errores
    }
  };

  const handleNewVideoUrlChange = (e) => {
    setNewVideoUrl(e.target.value);
  };

  const handleNewRedirectUrlChange = (e) => {
    setNewRedirectUrl(e.target.value);
  };

  const handleAddNewUrls = () => {
    setVideoUrls([...videoUrls, newVideoUrl]);
    setRedirectUrls([...redirectUrls, newRedirectUrl]);
    setNewVideoUrl("");
    setNewRedirectUrl("");
  };

  return (
    <Layout>
      <div>
        <h1>Edit Settings</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Video URLs:</label>
            <ul>
              {videoUrls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
            <input
              type="text"
              value={newVideoUrl}
              onChange={handleNewVideoUrlChange}
            />
          </div>
          <div>
            <label>Redirect URLs:</label>
            <ul>
              {redirectUrls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
            <input
              type="text"
              value={newRedirectUrl}
              onChange={handleNewRedirectUrlChange}
            />
          </div>
          <button type="button" onClick={handleAddNewUrls}>
            Añadir Direcciones URL
          </button>
          <br />
        </form>
      </div>
    </Layout>
  );
};

export default Settings;

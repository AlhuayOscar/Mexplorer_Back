import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout.js";
const Settings = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const [redirectUrls, setRedirectUrls] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/settings", { videoUrls, redirectUrls });
      // Si todo fue exitoso, redirige a otra página o muestra un mensaje de éxito
    } catch (error) {
      // Manejo de errores
    }
  };

  return (
    <Layout>
      <div>
        <h1>Edit Settings</h1>
        <form onSubmit={handleSubmit}>
          <label>Video URLs:</label>
          <input
            type="text"
            value={videoUrls}
            onChange={(e) => setVideoUrls(e.target.value)}
          />
          <label>Redirect URLs:</label>
          <input
            type="text"
            value={redirectUrls}
            onChange={(e) => setRedirectUrls(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </Layout>
  );
};

export default Settings;

import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout.js";

const Settings = () => {
  const [urlData, setUrlData] = useState([]);
  const [newUrl, setNewUrl] = useState({ url: "", nick: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      const { videoUrls, urlName } = response.data || {};
      setUrlData(
        videoUrls.map((url, index) => ({
          url,
          nick: urlName[index],
        }))
      );
    } catch (error) {
      // Error handling
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both URL and Nick inputs are empty
    if (!newUrl.url.trim() && !newUrl.nick.trim()) {
      setErrorMessage("Por favor, colocar una URL y un Nick.");
      return;
    } else if (!newUrl.url.trim()) {
      setErrorMessage("Por favor, colocar una URL.");
      return;
    } else if (!newUrl.nick.trim()) {
      setErrorMessage("Por favor, colocar un Nick.");
      return;
    }

    try {
      await axios.post("/api/settings", {
        videoUrls: urlData.map((data) => data.url),
        urlName: urlData.map((data) => data.nick),
      });

      // If everything was successful, show the success message
      setSuccessMessage("Objetos subidos!");
    } catch (error) {
      // Error handling
    }
  };

  const handleNewUrlChange = (e) => {
    setNewUrl({ ...newUrl, url: e.target.value });
  };

  const handleNewNickChange = (e) => {
    setNewUrl({ ...newUrl, nick: e.target.value });
  };

  const handleAddNewUrl = () => {
    // Check if both URL and Nick inputs are empty or have only spaces
    if (!newUrl.url.trim() || !newUrl.nick.trim()) {
      setErrorMessage("Por favor, colocar una URL y un Nombre válidos.");
      return;
    }

    setUrlData([...urlData, { ...newUrl }]);
    setNewUrl({ url: "", nick: "" });
    setErrorMessage(""); // Clear any previous error message when adding a new URL
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Editar configuraciones</h1>
        {errorMessage && (
          <div className="bg-red-200 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-200 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">URLs:</label>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {urlData.map((data, index) => (
                  <tr key={index}>
                    
                    <td>{index + 1}</td>
                    <td>{data.nick}</td>
                    <td>{data.url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <input
              type="text"
              value={newUrl.url}
              onChange={handleNewUrlChange}
              placeholder="Coloca la URL aquí"
              className="border border-gray-300 px-2 py-1 w-full rounded"
            />
            <input
              type="text"
              value={newUrl.nick}
              onChange={handleNewNickChange}
              placeholder="Nombre de la URL"
              className="border border-gray-300 px-2 py-1 w-full rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleAddNewUrl}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Añadir URL
          </button>
          <br />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Settings;

import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout.js";

const Settings = () => {
  const [urlData, setUrlData] = useState([]);
  const [newUrl, setNewUrl] = useState({ url: "", nick: "" });
  const [successMessage, setSuccessMessage] = useState("");

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
    setUrlData([...urlData, { ...newUrl }]);
    setNewUrl({ url: "", nick: "" });
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Editar configuraciones</h1>
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
                  <th>URL</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {urlData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.url}</td>
                    <td>{data.nick}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <input
              type="text"
              value={newUrl.url}
              onChange={handleNewUrlChange}
              placeholder="Nueva URL"
              className="border border-gray-300 px-2 py-1 w-full rounded"
            />
            <input
              type="text"
              value={newUrl.nick}
              onChange={handleNewNickChange}
              placeholder="Nick"
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

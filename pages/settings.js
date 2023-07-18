import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout.js";

const Settings = () => {
  const [urlData, setUrlData] = useState([]);
  const [newUrl, setNewUrl] = useState({ url: "", nick: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Guardar cambios");

  // Define the array of companies and their associated colors
  const companyColors = {
    Facebook: { backgroundColor: "#3b5998", color: "#ffffff" },
    Instagram: { backgroundColor: "#e4405f", color: "#ffffff" },
    Trip: { backgroundColor: "#00af87", color: "#ffffff" }, // TripAdvisor
    Whatsapp: { backgroundColor: "#25d366", color: "#ffffff" },
  };

  // Function to get the style object based on the company name
  const getCompanyStyle = (company) => {
    const companyStyle = companyColors[company];
    return companyStyle ? companyStyle : {};
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };
  // Function to check if any URL or Nick input is filled
  const hasUrlsAndNick = () => {
    return urlData.length > 0 || (newUrl.url.trim() && newUrl.nick.trim());
  };

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
      setErrorMessage(
        "Si quiere realizar un cambio, Por favor colocar una URL y un Nick, "
      );
      setTimeout(clearMessages, 3500); // Clear the error message after 4.5 seconds
      return;
    } else if (!newUrl.url.trim()) {
      setErrorMessage("Por favor, colocar una URL.");
      setTimeout(clearMessages, 3500); // Clear the error message after 4.5 seconds
      return;
    } else if (!newUrl.nick.trim()) {
      setErrorMessage("Por favor, colocar un Nick.");
      setTimeout(clearMessages, 3500); // Clear the error message after 4.5 seconds
      return;
    }

    try {
      await axios.post("/api/settings", {
        videoUrls: urlData.map((data) => data.url),
        urlName: urlData.map((data) => data.nick),
      });

      // If everything was successful, show the success message
      setSuccessMessage("Objetos subidos!");

      // Reset the button text to "Guardar cambios" after saving changes
      setSaveButtonText("Guardar cambios");

      setTimeout(clearMessages, 2500); // Clear the success message after 4.5 seconds
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
     setTimeout(clearMessages, 2500); // Clear the error message after 4.5 seconds
     return;
   }

   setUrlData([...urlData, { ...newUrl }]);
   setNewUrl({ url: "", nick: "" });
   setErrorMessage(""); // Clear any previous error message when adding a new URL
 };

  const handleDelete = (index) => {
    const newData = [...urlData];
    newData.splice(index, 1);
    setUrlData(newData);
  };

  // Update the button text based on the state of URL data and inputs
  useEffect(() => {
    if (hasUrlsAndNick()) {
      setSaveButtonText("Mantener cambios");
    } else {
      setSaveButtonText("Guardar Cambios");
    }
  }, [urlData, newUrl]);

  // Update the button text when the user types in the inputs
  useEffect(() => {
    if (newUrl.url.trim() || newUrl.nick.trim()) {
      setSaveButtonText("Guardar Cambios");
    } else {
      setSaveButtonText("Mantener cambios");
    }
  }, [newUrl]);
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
                  <th>Eliminar</th> {/* New table header for delete button */}
                </tr>
              </thead>
              <tbody>
                {urlData.map((data, index) => (
                  <tr key={index}>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)} // Call handleDelete with the index
                      className="text-red-500 font-bold"
                    >
                      X
                    </button>
                    <td>{index + 1}</td>
                    <td style={getCompanyStyle(data.nick)}>{data.nick}</td>
                    <td>{data.url}</td>
                    <td></td>
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
            {saveButtonText}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Settings;

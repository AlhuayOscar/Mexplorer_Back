import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout.js";
import Swal from "sweetalert2";
import GridLoader from "react-spinners/GridLoader";

const Settings = () => {
  const [urlData, setUrlData] = useState([]);
  const [newUrl, setNewUrl] = useState({ url: "", nick: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Subir cambios");
  const [loading, setLoading] = useState(true);

  // Define the array of companies and their associated colors
  const companyColors = {
    Facebook: { backgroundColor: "#3b5998", color: "#ffffff" },
    Instagram: { backgroundColor: "#e4405f", color: "#ffffff" },
    Trip: { backgroundColor: "#00af87", color: "#ffffff" }, // TripAdvisor
    Whatsapp: { backgroundColor: "#25d366", color: "#ffffff" },
    Portada: { backgroundColor: "#AFC300", color: "#ffffff" },
    Autos: { backgroundColor: "#AFC300", color: "#ffffff" },
    Jetski: { backgroundColor: "#AFC300", color: "#ffffff" },
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
      setLoading(false);
    } catch (error) {
      // Error handling
      setLoading(false);
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
      setSuccessMessage("Peticion realizada!");

      // Reset the button text to "Subir Cambios" after saving changes
      setSaveButtonText("Subir cambios");

      setTimeout(clearMessages, 3500); // Clear the success message after 2.5 seconds
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
      setTimeout(clearMessages, 3500); // Clear the error message after 4.5 seconds
      return;
    }

    setUrlData([...urlData, { ...newUrl }]);
    setNewUrl({ url: "", nick: "" });
    setErrorMessage(""); // Clear any previous error message when adding a new URL
  };

  const handleDelete = (index) => {
    // Show the SweetAlert confirmation dialog
    Swal.fire({
      title: "¿Realmente quiere eliminarlo?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminalo",
      cancelButtonText: "Mejor no",
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user confirms the deletion, remove the item
        setUrlData((prevUrlData) => {
          const newData = [...prevUrlData];
          newData.splice(index, 1);
          return newData;
        });

        // Submit the form after deleting the item
        handleSubmit(new Event("submit"));
      }
    });
  };

  // Update the button text based on the state of URL data and inputs
  useEffect(() => {
    if (hasUrlsAndNick()) {
      setSaveButtonText("Mantener cambios");
    } else {
      setSaveButtonText("Subir cambios");
    }
  }, [urlData, newUrl]);

  // Update the button text when the user types in the inputs
  useEffect(() => {
    if (newUrl.url.trim() || newUrl.nick.trim()) {
      setSaveButtonText("Subir cambios");
    } else {
      setSaveButtonText("Mantener cambios");
    }
  }, [newUrl]);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Editar enlaces</h1>
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
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <GridLoader
              loading={loading}
              size={30}
              color={"rgb(85, 66, 246)"}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-2">Eliminar</th>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {urlData.map((data, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="border px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="text-red-500 font-bold"
                        >
                          X
                        </button>
                      </td>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td
                        className="border px-4 py-2"
                        style={getCompanyStyle(data.nick)}
                      >
                        {data.nick}
                      </td>
                      <td className="border px-4 py-2 max-w-[100px]">
                        <div
                          className="overflow-hidden whitespace-nowrap"
                          style={{
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {data.url}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <input
              type="text"
              value={newUrl.url}
              onChange={handleNewUrlChange}
              placeholder="Coloca la URL aquí"
              className="border border-gray-300 px-4 py-2 w-full rounded mt-2"
            />
            <input
              type="text"
              value={newUrl.nick}
              onChange={handleNewNickChange}
              placeholder="Nombre de la URL"
              className="border border-gray-300 px-4 py-2 w-full rounded mt-2"
            />
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
        )}
      </div>
    </Layout>
  );
};

export default Settings;

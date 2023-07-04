import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function TourForm({
  _id,
  name: existingName,
  subtitle: existingSubtitle,
  description: existingDescription,
  duration: existingDuration,
  price: existingPrice,
  reservation: existingReservation,
  reservationPrice: existingReservationPrice,
  images: existingImages,
  includes: existingIncludes,
  requirements: existingRequirements,
  notes: existingNotes,
  promo: existingPromo,
  withoutPromoPrice: existingPromoPrice,
  // category: assignedCategory,
  // properties: assignedProperties,
}) {
  const [name, setName] = useState(existingName || "");
  const [subtitle, setSubtitle] = useState(existingSubtitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [duration, setDuration] = useState(existingDuration || 0);
  const [price, setPrice] = useState(existingPrice || 0);
  const [reservation, setReservation] = useState(existingReservation || false);
  const [reservationPrice, setReservationPrice] = useState(
    existingReservationPrice || 0
  );
  const [images, setImages] = useState(existingImages || []);
  const [includes, setIncludes] = useState(existingIncludes || []);
  const [requirements, setRequirements] = useState(existingRequirements || []);
  const [notes, setNotes] = useState(existingNotes || "");
  const [promo, setPromo] = useState(existingPromo || false);
  const [withoutPromoPrice, setWithoutPromoPrice] = useState(existingPromoPrice || 0);

  // const [category, setCategory] = useState(assignedCategory || "");
  // const [tourProperties, setTourProperties] = useState(
  //   assignedProperties || {}
  // );
  const [goToTours, setGoToTours] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // const [categories, setCategories] = useState([]);
  const router = useRouter();
  // useEffect(() => {
  //   axios.get("/api/categories").then((result) => {
  //     setCategories(result.data);
  //   });
  // }, []);
  async function saveTour(ev) {
    ev.preventDefault();
    const data = {
      name,
      subtitle,
      description,
      duration,
      price,
      reservation,
      reservationPrice,
      images,
      includes,
      requirements,
      notes,
      promo,
      withoutPromoPrice,
      // category,
      // properties: tourProperties,
    };
    console.log(data);
    if (_id) {
      //update
      await axios.put("/api/tours", { ...data, _id });
    } else {
      //create
      await axios.post("/api/tours", data);
    }
    setGoToTours(true);
  }
  if (goToTours) {
    router.push("/tours");
  }
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }
  // function setTourProp(propName, value) {
  //   setTourProperties((prev) => {
  //     const newTourProps = { ...prev };
  //     newTourProps[propName] = value;
  //     return newTourProps;
  //   });
  // }
  // function handleIncludes(e) {
  //   const name = e.target.value;
  //   setIncludes((prev) => [...prev, name]);
  // }

  // const propertiesToFill = [];
  // if (categories.length > 0 && category) {
  //   let catInfo = categories.find(({ _id }) => _id === category);
  //   propertiesToFill.push(...catInfo.properties);
  //   while (catInfo?.parent?._id) {
  //     const parentCat = categories.find(
  //       ({ _id }) => _id === catInfo?.parent?._id
  //     );
  //     propertiesToFill.push(...parentCat.properties);
  //     catInfo = parentCat;
  //   }
  //   console.log(propertiesToFill, "propertiesToFill");
  // }

  function addIncludes() {
    setIncludes((prev) => [...prev, ""]);
  }

  function removeIncludes(indexToRemove) {
    setIncludes((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  function addRequirements() {
    setRequirements((prev) => [...prev, ""]);
  }

  function removeRequirements(indexToRemove) {
    setRequirements((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <form onSubmit={saveTour}>
      <label>Nombre del tour</label>
      <input
        type="text"
        placeholder="Nombre del tour"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <label>Pequeña descripción para la tarjeta</label>
      <textarea
        placeholder="Resumen de descripción"
        value={subtitle}
        onChange={(ev) => setSubtitle(ev.target.value)}
      />
      {/* <label>Categoría</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Sin categoría</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select> */}
      {/* {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <h2
                value={tourProperties[p.name]}
                onChange={(ev) => setTourProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <div key={v}>
                    <label>{v}</label>
                    <input type="checkbox" key={v} value={v} />
                  </div>
                ))}
              </h2>
            </div>
          </div>
        ))} */}
      <label>Duración (cantidad de horas)</label>
      <input
        type="number"
        value={duration}
        onChange={(ev) => setDuration(ev.target.value)}
      />
      <label>¿Se puede reservar?</label>
      <div className="flex">
        <label className="w-2">Sí</label>
        <input
          type="radio"
          name="opcion"
          value={reservation}
          onChange={(ev) => setReservation(true)}
        />
      </div>
      <div className="flex content-center">
        <label className="w-2">No</label>
        <input
          type="radio"
          name="opcion"
          value={reservation}
          onChange={(ev) => setReservation(false)}
        />
      </div>
      <div></div>
      {reservation === true ? (
        <div>
          <label>Precio de la reserva (en USD)</label>
          <input
            type="number"
            placeholder="precio"
            value={reservationPrice}
            onChange={(ev) => setReservationPrice(ev.target.value)}
          />
        </div>
      ) : (
        <div></div>
      )}

      <label>Fotos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Agregar imagen</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <div className="mb-2">
        <label>¿Qué incluye?</label>
        <button onClick={addIncludes} type="button">
          Añadir
        </button>
        {includes.length > 0 &&
          includes.map((include, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                value={include}
                className="mb-0"
                onChange={(ev) => {
                  const newIncludes = [...includes];
                  newIncludes[index] = ev.target.value;
                  setIncludes(newIncludes);
                }}
                placeholder="Nombre de include"
              />
              <button
                onClick={() => removeIncludes(index)}
                type="button"
                className="btn-red"
              >
                Eliminar
              </button>
            </div>
          ))}
      </div>
      <div className="mb-2">
        <label>¿Qué requiere?</label>
        <button onClick={addRequirements} type="button">
          Añadir
        </button>
        {requirements.length > 0 &&
          requirements.map((requirement, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                value={requirement}
                className="mb-0"
                onChange={(ev) => {
                  const newRequirement = [...requirements];
                  newRequirement[index] = ev.target.value;
                  setRequirements(newRequirement);
                }}
                placeholder="Requiere?"
              />
              <button
                onClick={() => removeRequirements(index)}
                type="button"
                className="btn-red"
              >
                Eliminar
              </button>
            </div>
          ))}
      </div>
      <label>Notas</label>
      <input
        type="text"
        placeholder="Notas sobre el tour"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <label>¿Tiene promo?</label>
      <label>
        <input
          type="radio"
          name="opcion"
          value={promo}
          onChange={(ev) => setPromo(true)}
        />
        Sí
      </label>
      <label>
        <input
          type="radio"
          name="opcion"
          value={promo}
          onChange={(ev) => setPromo(false)}
        />
        No
      </label>
      <div></div>
      {promo === true ? (
        <div>
          <label>Precio anterior (en USD)</label>
          <input
            type="number"
            placeholder="precio"
            value={withoutPromoPrice}
            onChange={(ev) => setWithoutPromoPrice(ev.target.value)}
          />
        </div>
      ) : (
        <div></div>
      )}

      <label>Descripción</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Precio del tour (en USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}

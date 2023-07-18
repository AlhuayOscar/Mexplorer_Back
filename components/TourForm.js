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
  childrenPrice: existingChildrenPrice,
  adultsPrice: existingAdultsPrice,
  reservation: existingReservation,
  childrenReservationPrice: existingChildrenReservationPrice,
  adultsReservationPrice: existingAdultsReservationPrice,
  images: existingImages,
  includes: existingIncludes,
  requirements: existingRequirements,
  notes: existingNotes,
  promo: existingPromo,
  withoutPromoPrice: existingPromoPrice,
  currency: existingCurrency,
}) {
  const [name, setName] = useState(existingName || "");
  const [subtitle, setSubtitle] = useState(existingSubtitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [duration, setDuration] = useState(existingDuration || 0);
  const [childrenPrice, setChildrenPrice] = useState(
    existingChildrenPrice || null
  );
  const [adultsPrice, setAdultsPrice] = useState(existingAdultsPrice || null);
  const [reservation, setReservation] = useState(existingReservation || false);
  const [childrenReservationPrice, setChildrenReservationPrice] = useState(
    existingChildrenReservationPrice || null
  );
  const [adultsReservationPrice, setAdultsReservationPrice] = useState(
    existingAdultsReservationPrice || null
  );
  const [images, setImages] = useState(existingImages || []);
  const [includes, setIncludes] = useState(existingIncludes || []);
  const [doesntIncludes, setDoesntIncludes] = useState(existingIncludes || []);
  const [requirements, setRequirements] = useState(existingRequirements || []);
  const [notes, setNotes] = useState(existingNotes || "");
  const [promo, setPromo] = useState(existingPromo || false);
  const [withoutPromoPrice, setWithoutPromoPrice] = useState(
    existingPromoPrice || 0
  );
  const [currency, setCurrency] = useState(existingCurrency || "");

  const [goToTours, setGoToTours] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // const [categories, setCategories] = useState([]);
  const router = useRouter();
  async function saveTour(ev) {
    ev.preventDefault();
    const data = {
      name,
      subtitle,
      description,
      duration,
      childrenPrice,
      adultsPrice,
      reservation,
      childrenReservationPrice,
      adultsReservationPrice,
      images,
      includes,
      doesntIncludes,
      requirements,
      notes,
      promo,
      withoutPromoPrice,
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

  function addDoesntIncludes() {
    setDoesntIncludes((prev) => [...prev, ""]);
  }

  function removeDoesntIncludes(indexToRemove) {
    setDoesntIncludes((prev) => {
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

  function addNote() {
    setNotes((prev) => [...prev, ""]);
  }

  function removeNote(indexToRemove) {
    setNotes((prev) => {
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
      <label>Descripción</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Duración (cantidad de horas)</label>
      <input
        type="number"
        value={duration}
        onChange={(ev) => setDuration(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
      />
      <div>
        <label>Moneda</label>
        <select
          value={currency}
          onChange={(ev) => setCurrency(ev.target.value)}
        >
          <option value="usd">USD</option>
          <option value="mxn">MXN</option>
        </select>
      </div>
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
          <label>Precio de la reserva para adultos(en USD)</label>
          <input
            type="number"
            placeholder="precio"
            value={adultsReservationPrice}
            onChange={(ev) => setAdultsReservationPrice(ev.target.value)}
            onWheel={(ev) => ev.preventDefault()}
          />
          <label>Precio de la reserva para niños(en USD)</label>
          <input
            type="number"
            placeholder="precio para "
            value={childrenReservationPrice}
            onChange={(ev) => setChildrenReservationPrice(ev.target.value)}
            onWheel={(ev) => ev.preventDefault()}
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
        <div>
          <label>¿Qué no incluye?</label>
          <button onClick={addDoesntIncludes} type="button">
            Añadir
          </button>
        </div>
        {doesntIncludes.length > 0 &&
          doesntIncludes.map((doesntInclude, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                value={doesntInclude}
                className="mb-0"
                onChange={(ev) => {
                  const newDoesntIncludes = [...doesntIncludes];
                  newDoesntIncludes[index] = ev.target.value;
                  setDoesntIncludes(newDoesntIncludes);
                }}
                placeholder="Nombre de no incluye"
              />
              <button
                onClick={() => removeDoesntIncludes(index)}
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
                placeholder="qué requiere?"
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

      <div className="mb-2">
        <label>Notas</label>
        <button onClick={addNote} type="button">
          Añadir
        </button>
        {notes.length > 0 &&
          notes.map((note, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                value={note}
                className="mb-0"
                onChange={(ev) => {
                  const newNote = [...notes];
                  newNote[index] = ev.target.value;
                  setNotes(newNote);
                }}
                placeholder="Notas"
              />
              <button
                onClick={() => removeNote(index)}
                type="button"
                className="btn-red"
              >
                Eliminar
              </button>
            </div>
          ))}
      </div>

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
            onWheel={(ev) => ev.preventDefault()}
          />
        </div>
      ) : (
        <div></div>
      )}

      <label>Precio del tour para adultos</label>
      <input
        type="number"
        placeholder="Precio en USD"
        min={1}
        value={adultsPrice}
        onChange={(ev) => setAdultsPrice(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
      />
      <label>Precio del tour para niños</label>
      <input
        type="number"
        placeholder="Precio en USD"
        value={childrenPrice}
        onChange={(ev) => setChildrenPrice(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
      />
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}

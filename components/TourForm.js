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
  reservation: existingReservation,
  images: existingImages,
  includes: existingIncludes,
  price: existingPrice,
  requirements: existingRequirements,
  notes: existingNotes,
  promo: existingPromo,
  unavailableDays: existingUnavailableDays,
  schedule: existingSchedule,
}) {
  const { mxn, usd } = existingPrice || {};
  const [unavailableDays, setUnavailableDays] = useState(
    existingUnavailableDays || []
  );
  const [schedule, setSchedule] = useState(existingSchedule || []);
  const [name, setName] = useState(existingName || "");
  const [subtitle, setSubtitle] = useState(existingSubtitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [duration, setDuration] = useState(existingDuration || null);
  const [childrenPriceUSD, setChildrenPriceUSD] = useState(
    existingPrice?.usd.childrenPrice || null
  );
  const [childrenPriceMXN, setChildrenPriceMXN] = useState(
    existingPrice?.mxn.childrenPrice || null
  );
  const [adultsPriceUSD, setAdultsPriceUSD] = useState(
    existingPrice?.usd.adultsPrice || null
  );
  const [adultsPriceMXN, setAdultsPriceMXN] = useState(
    existingPrice?.mxn.adultsPrice || null
  );
  const [reservation, setReservation] = useState(existingReservation || false);
  const [childrenReservationPriceUSD, setChildrenReservationPriceUSD] =
    useState(existingPrice?.usd.childrenReservationPrice || null);
  const [childrenReservationPriceMXN, setChildrenReservationPriceMXN] =
    useState(existingPrice?.mxn.childrenReservationPrice || null);
  const [adultsReservationPriceUSD, setAdultsReservationPriceUSD] = useState(
    existingPrice?.usd.adultsReservationPrice || null
  );
  const [adultsReservationPriceMXN, setAdultsReservationPriceMXN] = useState(
    existingPrice?.mxn.adultsReservationPrice || null
  );
  const [images, setImages] = useState(existingImages || []);
  const [includes, setIncludes] = useState(existingIncludes || []);
  const [doesntIncludes, setDoesntIncludes] = useState(existingIncludes || []);
  const [requirements, setRequirements] = useState(existingRequirements || []);
  const [notes, setNotes] = useState(existingNotes || "");
  const [promo, setPromo] = useState(existingPromo || false);
  const [withoutPromoPriceUSD, setWithoutPromoPriceUSD] = useState(
    existingPrice?.usd.withoutPromoAdultsPrice || null
  );
  const [withoutPromoPriceMXN, setWithoutPromoPriceMXN] = useState(
    existingPrice?.mxn.withoutPromoAdultsPrice || null
  );

  const [goToTours, setGoToTours] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function saveTour(ev) {
    ev.preventDefault();
    const data = {
      name,
      subtitle,
      description,
      duration,
      reservation,
      price: {
        usd: {
          adultsPrice: parseFloat(adultsPriceUSD),
          childrenPrice: parseFloat(childrenPriceUSD),
          adultsReservationPrice: parseFloat(adultsReservationPriceUSD),
          childrenReservationPrice: parseFloat(childrenReservationPriceUSD),
          withoutPromoAdultsPrice: parseFloat(withoutPromoPriceUSD),
        },
        mxn: {
          adultsPrice: parseFloat(adultsPriceMXN),
          childrenPrice: parseFloat(childrenPriceMXN),
          adultsReservationPrice: parseFloat(adultsReservationPriceMXN),
          childrenReservationPrice: parseFloat(childrenReservationPriceMXN),
          withoutPromoAdultsPrice: parseFloat(withoutPromoPriceMXN),
        },
      },
      images,
      includes,
      doesntIncludes,
      requirements,
      notes,
      promo,
      unavailableDays,
      schedule,
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

  function addSchedule() {
    setSchedule((prev) => [...prev, ""]);
  }

  function removeSchedule(indexToRemove) {
    setSchedule((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  const handleCheckboxChange = (ev) => {
    const value = parseInt(ev.target.value);
    const updatedUnavailableDays = [...unavailableDays];

    if (updatedUnavailableDays.includes(value)) {
      const index = updatedUnavailableDays.indexOf(value);
      if (index !== -1) {
        updatedUnavailableDays.splice(index, 1);
      }
    } else {
      updatedUnavailableDays.push(value);
    }
    setUnavailableDays(updatedUnavailableDays);
  };

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
      <label>Duración </label>
      <input
        type="number"
        placeholder="cantidad de horas"
        value={duration}
        onChange={(ev) => setDuration(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
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
          <label>Precio de la reserva para adultos</label>
          <input
            type="number"
            placeholder="Precio reserva en USD"
            value={adultsReservationPriceUSD}
            onChange={(ev) => setAdultsReservationPriceUSD(ev.target.value)}
            onWheel={(ev) => ev.preventDefault()}
          />
          <input
            type="number"
            placeholder="Precio reserva en MXN"
            value={adultsReservationPriceMXN}
            onChange={(ev) => setAdultsReservationPriceMXN(ev.target.value)}
            onWheel={(ev) => ev.preventDefault()}
          />
          <label>Precio de la reserva para niños</label>
          <input
            type="number"
            placeholder="Precio reserva para niños en USD"
            value={childrenReservationPriceUSD}
            onChange={(ev) => setChildrenReservationPriceUSD(ev.target.value)}
            onWheel={(ev) => ev.preventDefault()}
          />
          <input
            type="number"
            placeholder="Precio reserva para niños en MXN"
            value={childrenReservationPriceMXN}
            onChange={(ev) => setChildrenReservationPriceMXN(ev.target.value)}
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
                placeholder="Item a incluir"
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
      <div>
        <label>¿Qué días no está disponible?</label>
      </div>
      <div>
        <input
          name="unavailableDays"
          type="checkbox"
          value={0}
          onChange={handleCheckboxChange}
          checked={unavailableDays.includes(0)}
        />
        <label>Domingo</label>
        <input
          name="unavailableDays"
          type="checkbox"
          value={1}
          onChange={handleCheckboxChange}
          checked={unavailableDays.includes(1)}
        />
        <label>Lunes</label>
        <input
          name="unavailableDays"
          type="checkbox"
          value={2}
          onChange={handleCheckboxChange}
          checked={unavailableDays.includes(2)}
        />
        <label>Martes</label>
        <input
          name="unavailableDays"
          type="checkbox"
          value={3}
          onChange={handleCheckboxChange}
          checked={unavailableDays.includes(3)}
        />
        <label>Miércoles</label>
        <input
          name="unavailableDays"
          type="checkbox"
          value={4}
          onChange={handleCheckboxChange}
          checked={unavailableDays.includes(4)}
        />
        <label>Jueves</label>
        <input
          name="unavailableDays"
          type="checkbox"
          value={5}
          onChange={handleCheckboxChange}
          checked={unavailableDays.includes(5)}
        />
        <label>Viernes</label>
        <input
          name="unavailableDays"
          type="checkbox"
          value={6}
          onChange={handleCheckboxChange}
          checked={unavailableDays.includes(6)}
        />
        <label>Sábado</label>
      </div>
      <div className="mb-2">
        <label>¿En qué horarios está disponible?</label>
        <button onClick={addSchedule} type="button">
          Añadir
        </button>
        {schedule.length > 0 &&
          schedule.map((time, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="time"
                value={time}
                className="mb-0"
                onChange={(ev) => {
                  const newTime = [...schedule];
                  newTime[index] = ev.target.value;
                  setSchedule(newTime);
                }}
                placeholder="Añadir horario disponible"
              />
              <button
                onClick={() => removeSchedule(index)}
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
          <label>Precio anterior</label>
          <input
            type="number"
            placeholder="Precio en USD"
            value={withoutPromoPriceUSD}
            onChange={(ev) => setWithoutPromoPriceUSD(ev.target.value)}
            onWheel={(ev) => ev.preventDefault()}
          />
          <input
            type="number"
            placeholder="Precio en MXN"
            value={withoutPromoPriceMXN}
            onChange={(ev) => setWithoutPromoPriceMXN(ev.target.value)}
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
        value={adultsPriceUSD}
        onChange={(ev) => setAdultsPriceUSD(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
      />
      <input
        type="number"
        placeholder="Precio en MXN"
        min={1}
        value={adultsPriceMXN}
        onChange={(ev) => setAdultsPriceMXN(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
      />
      <label>Precio del tour para niños</label>
      <input
        type="number"
        placeholder="Precio en USD"
        value={childrenPriceUSD}
        onChange={(ev) => setChildrenPriceUSD(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
      />
      <input
        type="number"
        placeholder="Precio en MXN"
        value={childrenPriceMXN}
        onChange={(ev) => setChildrenPriceMXN(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
      />
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}

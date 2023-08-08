import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
const MySwal = withReactContent(Swal);

export default function TourForm({
  _id,
  name: existingName,
  nameEng: existingNameEng,
  subtitle: existingSubtitle,
  subtitleEng: existingSubtitleEng,
  description: existingDescription,
  descriptionEng: existingDescriptionEng,
  duration: existingDuration,
  images: existingImages,
  includes: existingIncludes,
  includesEng: existingIncludesEng,
  doesntIncludes: existingDoesntIncludes,
  doesntIncludesEng: existingDoesntIncludesEng,
  price: existingPrice,
  requirements: existingRequirements,
  requirementsEng: existingRequirementsEng,
  notes: existingNotes,
  notesEng: existingNotesEng,
  promo: existingPromo,
  unavailableDays: existingUnavailableDays,
  schedule: existingSchedule,
}) {
  const { mxn, usd } = existingPrice ?? {};
  const [unavailableDays, setUnavailableDays] = useState(
    existingUnavailableDays ?? []
  );
  const [schedule, setSchedule] = useState(existingSchedule ?? []);
  const [name, setName] = useState(existingName ?? "");
  const [nameEng, setNameEng] = useState(existingNameEng ?? "");
  const [subtitle, setSubtitle] = useState(existingSubtitle ?? "");
  const [subtitleEng, setSubtitleEng] = useState(existingSubtitleEng ?? "");
  const [description, setDescription] = useState(existingDescription ?? "");
  const [descriptionEng, setDescriptionEng] = useState(
    existingDescriptionEng ?? ""
  );
  const [duration, setDuration] = useState(existingDuration ?? null);
  const [childrenPriceUSD, setChildrenPriceUSD] = useState(
    existingPrice?.usd?.childrenPrice ?? null
  );
  const [childrenPriceMXN, setChildrenPriceMXN] = useState(
    existingPrice?.mxn?.childrenPrice ?? null
  );
  const [adultsPriceUSD, setAdultsPriceUSD] = useState(
    existingPrice?.usd?.adultsPrice ?? null
  );
  const [adultsPriceMXN, setAdultsPriceMXN] = useState(
    existingPrice?.mxn?.adultsPrice ?? null
  );
  const [images, setImages] = useState(existingImages ?? []);
  const [includes, setIncludes] = useState(existingIncludes ?? []);
  const [includesEng, setIncludesEng] = useState(existingIncludesEng ?? []);
  const [doesntIncludes, setDoesntIncludes] = useState(
    existingDoesntIncludes ?? []
  );
  const [doesntIncludesEng, setDoesntIncludesEng] = useState(
    existingDoesntIncludesEng ?? []
  );
  const [requirements, setRequirements] = useState(existingRequirements ?? []);
  const [requirementsEng, setRequirementsEng] = useState(
    existingRequirementsEng ?? []
  );
  const [notes, setNotes] = useState(existingNotes ?? "");
  const [notesEng, setNotesEng] = useState(existingNotesEng ?? "");
  const [promo, setPromo] = useState(existingPromo ?? false);
  const [withoutPromoPriceUSD, setWithoutPromoPriceUSD] = useState(
    existingPrice?.usd?.withoutPromoAdultsPrice ?? null
  );
  const [withoutPromoPriceMXN, setWithoutPromoPriceMXN] = useState(
    existingPrice?.mxn?.withoutPromoAdultsPrice ?? null
  );

  const [goToTours, setGoToTours] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  function checkRequiredFields() {
    const requiredFields = [
      { name: "Nombre del Tour", value: name },
      { name: "Duración del Tour", value: duration },
      {
        name: "Precio de Adultos en USD o MXN",
        value: adultsPriceUSD || adultsPriceMXN,
      },
      {
        name: "Precio de Niños en USD o MXN",
        value: childrenPriceUSD || childrenPriceMXN,
      },
    ];
    

    // Check if promo is selected, then check promo prices in USD or MXN
    if (promo) {
      const hasWithoutPromoPrice = withoutPromoPriceUSD || withoutPromoPriceMXN;

      if (!hasWithoutPromoPrice) {
        requiredFields.push({
          name: "Precio anterior para PROMO en USD o MXN",
          value: false,
        });
      }
    }

    const emptyFields = requiredFields.filter((field) => !field.value);

    if (emptyFields.length > 0) {
      MySwal.fire({
        icon: "warning",
        title: "Campos obligatorios incompletos",
        html: `Los siguientes campos son obligatorios:<br/>${emptyFields
          .map((field) => `- ${field.name}`)
          .join("<br/>")}`,
      });
      return false;
    }

    return true;
  }

  async function saveTour(ev) {
    ev.preventDefault();

    const isValid = checkRequiredFields();

    if (!isValid) {
      return;
    }

    const data = {
      name,
      nameEng,
      subtitle,
      subtitleEng,
      description,
      descriptionEng,
      duration,
      price: {
        usd: {
          adultsPrice: parseFloat(adultsPriceUSD),
          childrenPrice: parseFloat(childrenPriceUSD),
          withoutPromoAdultsPrice: parseFloat(withoutPromoPriceUSD),
        },
        mxn: {
          adultsPrice: parseFloat(adultsPriceMXN),
          childrenPrice: parseFloat(childrenPriceMXN),
          withoutPromoAdultsPrice: parseFloat(withoutPromoPriceMXN),
        },
      },
      images,
      includes,
      includesEng,
      doesntIncludes,
      doesntIncludesEng,
      requirements,
      requirementsEng,
      notes,
      notesEng,
      promo,
      unavailableDays,
      schedule,
    };

    console.log(data);
    if (_id) {
      // Update existing tour
      try {
        await axios.put("/api/tours", { ...data, _id });
        setGoToTours(true);
      } catch (error) {
        handleServerError(error);
      }
    } else {
      // Create a new tour
      try {
        await axios.post("/api/tours", data);
        setGoToTours(true);
      } catch (error) {
        handleServerError(error);
      }
    }
  }

  async function handleServerError(error) {
    if (error.response && error.response.status === 500) {
      MySwal.fire({
        icon: "question",
        title: "Error 500 - Información no encontrada en el servidor",
        text: "Por favor, ponerse en contacto con los administradores :/",
      });
    } else {
      // Handle other types of errors or display a generic error message.
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error en el servidor. Por favor, intenta nuevamente.",
      });
    }
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
  function addIncludesEng() {
    setIncludesEng((prev) => [...prev, ""]);
  }

  function removeIncludes(indexToRemove) {
    setIncludes((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  function removeIncludesEng(indexToRemove) {
    setIncludesEng((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  function addDoesntIncludes() {
    setDoesntIncludes((prev) => [...prev, ""]);
  }

  function addDoesntIncludesEng() {
    setDoesntIncludesEng((prev) => [...prev, ""]);
  }

  function removeDoesntIncludes(indexToRemove) {
    setDoesntIncludes((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  function removeDoesntIncludesEng(indexToRemove) {
    setDoesntIncludesEng((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  function addRequirements() {
    setRequirements((prev) => [...prev, ""]);
  }

  function addRequirementsEng() {
    setRequirementsEng((prev) => [...prev, ""]);
  }

  function removeRequirements(indexToRemove) {
    setRequirements((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  function removeRequirementsEng(indexToRemove) {
    setRequirementsEng((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  function addNote() {
    setNotes((prev) => [...prev, ""]);
  }

  function addNoteEng() {
    setNotesEng((prev) => [...prev, ""]);
  }

  function removeNote(indexToRemove) {
    setNotes((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  function removeNoteEng(indexToRemove) {
    setNotesEng((prev) => {
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
  function handleCancel() {
    // Use the router object to go back to the previous page
    router.back();
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
      <label>Nombre del tour en inglés</label>
      <input
        type="text"
        placeholder="Tour name"
        value={nameEng}
        onChange={(ev) => setNameEng(ev.target.value)}
      />
      <label>Pequeña descripción para la tarjeta</label>
      <textarea
        placeholder="Resumen de descripción"
        value={subtitle}
        onChange={(ev) => setSubtitle(ev.target.value)}
      />
      <label>Pequeña descripción para la tarjeta en inglés</label>
      <textarea
        placeholder="A little description"
        value={subtitleEng}
        onChange={(ev) => setSubtitleEng(ev.target.value)}
      />
      <label>Descripción</label>
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Descripción en inglés</label>
      <textarea
        placeholder="Description"
        value={descriptionEng}
        onChange={(ev) => setDescriptionEng(ev.target.value)}
      />
      <label>Duración </label>
      <input
        type="number"
        placeholder="cantidad de horas"
        value={duration}
        onChange={(ev) => setDuration(Math.max(1, ev.target.value))}
        onWheel={(ev) => ev.preventDefault()}
        min={1} // Agregamos esta línea para evitar números negativos o 0
      />
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
          <label>¿Qué incluye? (en inglés)</label>
          <button onClick={addIncludesEng} type="button">
            Añadir
          </button>
          {includesEng.length > 0 &&
            includesEng.map((includeEng, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={includeEng}
                  className="mb-0"
                  onChange={(ev) => {
                    const newIncludesEng = [...includesEng];
                    newIncludesEng[index] = ev.target.value;
                    setIncludesEng(newIncludesEng);
                  }}
                  placeholder="Item to include"
                />
                <button
                  onClick={() => removeIncludesEng(index)}
                  type="button"
                  className="btn-red"
                >
                  Eliminar
                </button>
              </div>
            ))}
        </div>
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
        <div>
          <label>¿Qué no incluye? (en inglés)</label>
          <button onClick={addDoesntIncludesEng} type="button">
            Añadir
          </button>
        </div>
        {doesntIncludesEng.length > 0 &&
          doesntIncludesEng.map((doesntIncludeEng, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                value={doesntIncludeEng}
                className="mb-0"
                onChange={(ev) => {
                  const newDoesntIncludesEng = [...doesntIncludesEng];
                  newDoesntIncludesEng[index] = ev.target.value;
                  setDoesntIncludesEng(newDoesntIncludesEng);
                }}
                placeholder="Item this tour doesn't includes"
              />
              <button
                onClick={() => removeDoesntIncludesEng(index)}
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
        <label>¿Qué requiere? (en inglés)</label>
        <button onClick={addRequirementsEng} type="button">
          Añadir
        </button>
        {requirementsEng.length > 0 &&
          requirementsEng.map((requirementEng, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                value={requirementEng}
                className="mb-0"
                onChange={(ev) => {
                  const newRequirementEng = [...requirementsEng];
                  newRequirementEng[index] = ev.target.value;
                  setRequirementsEng(newRequirementEng);
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
      <div className="mb-2">
        <label>Notas (en inglés)</label>
        <button onClick={addNoteEng} type="button">
          Añadir
        </button>
        {notesEng.length > 0 &&
          notesEng.map((noteEng, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                value={noteEng}
                className="mb-0"
                onChange={(ev) => {
                  const newNoteEng = [...notesEng];
                  newNoteEng[index] = ev.target.value;
                  setNotesEng(newNoteEng);
                }}
                placeholder="Notas"
              />
              <button
                onClick={() => removeNoteEng(index)}
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
            min={1} // Agregamos esta línea para evitar números negativos o 0
          />
          <input
            type="number"
            placeholder="Precio en MXN"
            value={withoutPromoPriceMXN}
            onChange={(ev) => setWithoutPromoPriceMXN(ev.target.value)}
            onWheel={(ev) => ev.preventDefault()}
            min={1} // Agregamos esta línea para evitar números negativos o 0
          />
        </div>
      ) : (
        <div></div>
      )}
      <label>Precio del tour para adultos</label>
      <input
        type="number"
        placeholder="Precio en USD"
        value={adultsPriceUSD}
        onChange={(ev) => setAdultsPriceUSD(Math.max(1, ev.target.value))}
        onWheel={(ev) => ev.preventDefault()}
        min={1} // Agregamos esta línea para evitar números negativos o 0
      />
      <input
        type="number"
        placeholder="Precio en MXN"
        value={adultsPriceMXN}
        onChange={(ev) => setAdultsPriceMXN(Math.max(1, ev.target.value))}
        onWheel={(ev) => ev.preventDefault()}
        min={1} // Agregamos esta línea para evitar números negativos o 0
      />
      <label>Precio del tour para niños</label>
      <input
        type="number"
        placeholder="Precio en USD"
        value={childrenPriceUSD}
        onChange={(ev) => setChildrenPriceUSD(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
        min={0} // Agregamos esta línea para evitar números negativos o 0
      />
      <input
        type="number"
        placeholder="Precio en MXN"
        value={childrenPriceMXN}
        onChange={(ev) => setChildrenPriceMXN(ev.target.value)}
        onWheel={(ev) => ev.preventDefault()}
        min={0} // Agregamos esta línea para evitar números negativos o 0
      />
      <div className="flex items-center justify-end gap-5">
        <button type="button" onClick={handleCancel} className="btn-default">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </div>
    </form>
  );
}

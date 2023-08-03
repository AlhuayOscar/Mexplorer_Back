import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function BlogForm({
  _id,
  title: existingTitle,
  titleEng: existingTitleEng,
  subtitle: existingSubtitle,
  subtitleEng: existingSubtitleEng,
  description: existingDescription,
  descriptionEng: existingDescriptionEng,
  images: existingImages,
  date: existingDate,
  location: existingLocation,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [titleEng, setTitleEng] = useState(existingTitleEng || "");
  const [subtitle, setSubtitle] = useState(existingSubtitle || "");
  const [subtitleEng, setSubtitleEng] = useState(existingSubtitleEng || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [descriptionEng, setDescriptionEng] = useState(existingDescriptionEng || "");
  const [images, setImages] = useState(existingImages || []);
  const [date, setDate] = useState(existingDate || "");
  const [location, setLocation] = useState(existingLocation || "");
  const [goToBlogs, setGoToBlogs] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function saveBlog(ev) {
    ev.preventDefault();
    const data = {
      title,
      titleEng,
      subtitle,
      subtitleEng,
      description,
      descriptionEng,
      images,
      date,
      location,
    };
    console.log(data)
    if (_id) {
      //update
      await axios.put("/api/blogs", { ...data, _id });
    } else {
      //create
      await axios.post("/api/blogs", data);
    }
    setGoToBlogs(true);
  }
  if (goToBlogs) {
    router.push("/blogs");
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

  return (
    <form onSubmit={saveBlog}>
      <label>Título</label>
      <input
        type="text"
        placeholder="Título del artículo"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Título (en inglés)</label>
      <input
        type="text"
        placeholder="Title"
        value={titleEng}
        onChange={(ev) => setTitleEng(ev.target.value)}
      />
      <label>Subtítulo</label>
      <input
        type="text"
        placeholder="Subtítulo del artículo"
        value={subtitle}
        onChange={(ev) => setSubtitle(ev.target.value)}
      />
      <label>Subtítulo (en inglés)</label>
      <input
        type="text"
        placeholder="Subtitle"
        value={subtitleEng}
        onChange={(ev) => setSubtitleEng(ev.target.value)}
      />
      <label>Cuerpo del artículo</label>
      <textarea
        placeholder="¿Qué querés escribir?"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Cuerpo del artículo (en inglés) </label>
      <textarea
        placeholder="What do you want to write?"
        value={descriptionEng}
        onChange={(ev) => setDescriptionEng(ev.target.value)}
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

      <label>Fecha</label>
      <input
        type="text"
        placeholder="Fecha de creación del post (DD-MM-AA)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}

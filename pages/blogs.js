import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.js";
import Link from "next/link.js";
import axios from "axios";
import CustomPagination from "../components/Pagination.js";
import GridLoader from "react-spinners/GridLoader";

const ITEMS_PER_PAGE = 15;

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/blogs").then((response) => {
      setBlogs(response.data);
      setLoading(false);
    });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = blogs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <Link className="btn-primary" href={"/blogs/new"}>
        Añadir nuevo post
      </Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Título de la publicación</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {/* GridLoader que se muestra mientras se cargan los blogs */}
          {loading ? (
            <tr>
              <td colSpan="2" className="flex justify-center items-center h-screen w-screen">
                <GridLoader
                  loading={loading}
                  size={45}
                  color={"rgb(85, 66, 246)"}
                />
              </td>
            </tr>
          ) : (
            paginatedBlogs.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>
                  <Link
                    className="btn-default"
                    href={"/blogs/edit/" + post._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Editar
                  </Link>
                  <Link className="btn-red" href={"/blogs/delete/" + post._id}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Eliminar
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
}

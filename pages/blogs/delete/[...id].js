import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteBlogPage() {
  const router = useRouter();
  const [blogInfo, setBlogInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/blogs?_id=" + id).then((response) => {
      setBlogInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push("/blogs");
  }
  async function deleteBlog() {
    await axios.delete("/api/blogs?_id=" + id);
    goBack();
  }
  return (
    <Layout>
      <h1 className="text-center">
        ¿¿De verdad querés borrar el post &nbsp;&quot;{blogInfo?.title}&quot;,
        Nico??
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteBlog} className="btn-red">
          SÍ
        </button>
        <button className="btn-default" onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  );
}

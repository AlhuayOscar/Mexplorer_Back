import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import BlogForm from "@/components/BlogForm";

export default function EditBlogPage() {
  const [blogInfo, setBlogInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/blogs?_id='+id).then(response => {
      setBlogInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Editar post</h1>
      {blogInfo && (
        <BlogForm {...blogInfo} />
      )}
    </Layout>
  );
}
import BlogForm from "@/components/BlogForm";
import Layout from "@/components/Layout";

export default function NewBlog() {
  return (
    <Layout>
      <h1>Nuevo Post</h1>
      <BlogForm />
    </Layout>
  );
}
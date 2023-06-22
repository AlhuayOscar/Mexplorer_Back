import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function DeleteTourPage() {
  const router = useRouter();
  const [tourInfo,setTourInfo] = useState();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/tours?id='+id).then(response => {
      setTourInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push('/tours');
  }
  async function deleteTour() {
    await axios.delete('/api/tours?id='+id);
    goBack();
  }
  return (
    <Layout>
      <h1 className="text-center">Do you really want to delete
        &nbsp;&quot;{tourInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteTour}
          className="btn-red">Yes</button>
        <button
          className="btn-default"
          onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  );
}

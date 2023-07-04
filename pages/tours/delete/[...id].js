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
    axios.get('/api/tours?_id='+id).then(response => {
      setTourInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push('/tours');
  }
  async function deleteTour() {
    await axios.delete('/api/tours?_id='+id);
    goBack();
  }
  return (
    <Layout>
      <h1 className="text-center">¿¿De verdad querés borrar el tour 
        &nbsp;&quot;{tourInfo?.name}&quot;, Nico??
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteTour}
          className="btn-red">SÍ</button>
        <button
          className="btn-default"
          onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  );
}

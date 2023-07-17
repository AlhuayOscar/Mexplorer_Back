// import Layout from "@/components/Layout";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function DeleteSettingsPage() {
//   const router = useRouter();
//   const [settingsInfo, setSettingsInfo] = useState();
//   const { id } = router.query;

//   useEffect(() => {
//     if (!id) {
//       return;
//     }
//     axios.get("/api/settings?_id=" + id).then((response) => {
//       setSettingsInfo(response.data);
//     });
//   }, [id]);

//   function goBack() {
//     router.push("/settings");
//   }

//   async function deleteSettings() {
//     await axios.delete("/api/settings?_id=" + id);
//     goBack();
//   }

//   return (
//     <Layout>
//       <h1 className="text-center">
//         ¿De verdad quieres borrar la configuración &nbsp;&quot;
//         {settingsInfo?.title}&quot;?
//       </h1>
//       <div className="flex gap-2 justify-center">
//         <button onClick={deleteSettings} className="btn-red">
//           SÍ
//         </button>
//         <button className="btn-default" onClick={goBack}>
//           NO
//         </button>
//       </div>
//     </Layout>
//   );
// }

import "aframe";
import "../aframe/dragRotate";
import "../aframe/zoomScale";
import { useEffect, useState } from "react";
import { apiFetch } from "../service/api";

export const Viewer = () => {
   const [objectUrl, setObjectUrl] = useState<string | null>(null);

   useEffect(() => {
     const viewerContext = localStorage.getItem("viewerContext");

     if (!viewerContext) return;

     const { roomId, objectId } = JSON.parse(viewerContext);

     const fetchObject = async () => {
       try {

        const url = import.meta.env.VITE_API_URL_MODEL;
         const response = await apiFetch(
           `${url}/viewer/rooms/${roomId}/objects/${objectId}`,
         );
         if (!response.ok) throw new Error("Erro ao buscar objeto 3D");

         const data = await response.json();
         setObjectUrl(data.objectUrl); 
       } catch (err) {
         console.error(err);
       }
     };

     fetchObject();
   }, []);

   if (!objectUrl) return <p>Carregando modelo 3D...</p>;

  return (
    <a-scene vr-mode-ui="false">
      <a-assets>
        <img id="background" src="/images/fundo_tecnologico.png" />

        <a-asset-item id="room-model" src={objectUrl}></a-asset-item>
      </a-assets>

      <a-sky src="#background"></a-sky>

      <a-gltf-model
        src="#room-model"
        position="0 -2 -20"
        rotation="0 0 0"
        scale="0.12 0.12 0.12"
        drag-rotate="speed: 1.0; limitY: true"
        zoom-scale="zoomSpeed: 0.5; minScale: 0.05; maxScale: 2.0"
      ></a-gltf-model>

      <a-camera position="0 1.6 0" look-controls="enabled: false">
        <a-cursor></a-cursor>
      </a-camera>
    </a-scene>
  );
};

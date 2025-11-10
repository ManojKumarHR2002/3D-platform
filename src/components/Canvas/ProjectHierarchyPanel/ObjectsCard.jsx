// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { selectObject } from "@store/slices/sceneSlice";


// export default function ObjectsCard({ scene, searchTerm }) {
//   const [objects, setObjects] = useState([]);
//   const selectedId = useSelector((state) => state.ui.selectedObjectId);

//   useEffect(() => {
//     if (scene) {
//       const interval = setInterval(() => {
//         setObjects(scene.getSceneObjects());
//       }, 1000); // Polling every second — can optimize later
//       return () => clearInterval(interval);
//     }
//   }, [scene]);

//   const handleSelect = (id) => {
//     if (scene) scene.selectObjectById(id);
//   };

//   const filtered = objects.filter((obj) =>
//     obj.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-2 bg-zinc-800 rounded-lg h-full overflow-y-auto">
//       <div className="text-sm text-gray-300 mb-2">Scene 1</div>
//       <ul className="space-y-1">
//         {filtered.map((obj) => (
//           <li
//             key={obj.id}
//             onClick={() => handleSelect(obj.id)}
//             className={`px-3 py-1 rounded cursor-pointer ${
//               selectedId === obj.id ? "bg-blue-700" : "hover:bg-zinc-700"
//             }`}
//           >
//             {obj.name}
//           </li>
//         ))}
//         {filtered.length === 0 && (
//           <li className="text-gray-500 text-xs px-3">No objects found</li>
//         )}
//       </ul>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectObject } from "@store/slices/sceneSlice";


export default function ObjectsCard({ scene, searchTerm }) {
  const dispatch = useDispatch();
  const objects = useSelector((state) => state.scene.objects);
  const selectedId = useSelector((state) => state.scene.selectedObjectId);
  const sceneInstance = useSelector((state) => state.scene.sceneInstance);

  
  const handleSelect = (id) => {
    dispatch(selectObject(id));
    const obj3D = sceneInstance?.scene.children.find(o => o.userData?.modelId === id);
    if (obj3D) sceneInstance.transformControls.attach(obj3D);
  };

  const filtered = objects.filter((obj) =>
    obj.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 bg-zinc-800 rounded-lg h-full overflow-y-auto">
      <div className="text-sm text-gray-300 mb-2">Scene 1</div>
      <ul className="space-y-1">
        {filtered.map((obj) => (
          <li
            key={obj.id}
            onClick={() => handleSelect(obj.id)}
            className={`px-3 py-1 rounded cursor-pointer ${
              selectedId === obj.id ? "bg-blue-700" : "hover:bg-zinc-700"
            }`}
          >
            {obj.name}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-gray-500 text-xs px-3">No objects found</li>
        )}
      </ul>
    </div>
  );
}

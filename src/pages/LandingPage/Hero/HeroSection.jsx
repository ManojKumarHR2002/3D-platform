import * as React from "react";

export function HeroSection() {
  return (
    <div className="mt-40 w-full max-w-[90%] max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-[66%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col self-stretch mx-5 my-auto text-center max-md:mt-10 max-md:max-w-full">
            <h1 className="text-4xl font-semibold text-white max-md:max-w-full">
              Lorem ipsum dolor sit amet!
            </h1>
            <p className="mt-6 mr-3.5 ml-4 text-lg font-medium text-center text-white text-opacity-80 max-md:mr-2.5 max-md:max-w-full">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat
            </p>
            {/* <button className="self-center p-2.5 mt-12 max-w-full text-sm font-bold text-center bg-violet-400 rounded-2xl shadow-[0px_2px_4px_rgba(0,0,0,0.12)] text-white text-opacity-90 w-[100px] max-md:mt-10">
              Get Started
            </button> */}
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[34%] max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff7700e6e2ab15fff7558afaf978f001dd8ef29d1c4fbe7a08cb9b395c436325?placeholderIfAbsent=true&apiKey=89a40ed617824239aa8e77522e0cfca9"
            alt="Hero illustration"
            className="object-contain grow w-full aspect-[1.1] rounded-[100px] max-md:mt-10"
          />
        </div>
      </div>
    </div>
  );
}



// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { useFrame } from "@react-three/fiber";
// import { useRef } from "react";
// import { Mesh } from "three";

// function RotatingCube() {
//   const cubeRef = useRef();

//   // Rotate the cube on each frame
//   useFrame(() => {
//     if (cubeRef.current) {
//       cubeRef.current.rotation.x += 0.01;
//       cubeRef.current.rotation.y += 0.01;
//     }
//   });

//   const handleClick = () => {
//     if (cubeRef.current) {
//       // Rotate the cube by 45 degrees when clicked
//       cubeRef.current.rotation.x += Math.PI / 4;
//       cubeRef.current.rotation.y += Math.PI / 4;
//     }
//   };

//   return (
//     <mesh ref={cubeRef} onClick={handleClick}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color="limegreen" />
//     </mesh>
//   );
// }

// export function HeroSection() {
//   return (
//     <div className="mt-40 w-full max-w-[90%] max-md:mt-10 max-md:max-w-full">
//       <div className="flex gap-5 max-md:flex-col">
//         <div className="flex flex-col w-[66%] max-md:ml-0 max-md:w-full">
//           <div className="flex flex-col self-stretch mx-5 my-auto text-center max-md:mt-10 max-md:max-w-full">
//             <h1 className="text-4xl font-semibold text-white max-md:max-w-full">
//               Lorem ipsum dolor sit amet!
//             </h1>
//             <p className="mt-6 mr-3.5 ml-4 text-lg font-medium text-center text-white text-opacity-80 max-md:mr-2.5 max-md:max-w-full">
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco
//               laboris nisi ut aliquip ex ea commodo consequat
//             </p>
//             <button className="self-center p-2.5 mt-12 max-w-full text-sm font-bold text-center bg-violet-400 rounded-2xl shadow-[0px_2px_4px_rgba(0,0,0,0.12)] text-white text-opacity-90 w-[100px] max-md:mt-10">
//               Get Started
//             </button>
//           </div>
//         </div>
//         <div className="flex flex-col ml-5 w-[34%] max-md:ml-0 max-md:w-full">
//           <Canvas
//             className="object-contain grow w-full aspect-[1.1] rounded-[100px] max-md:mt-10"
//             style={{ display: "block" }}
//           >
//             <ambientLight intensity={0.5} />
//             <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//             <RotatingCube />
//           </Canvas>
//         </div>
//       </div>
//     </div>
//   );
// }

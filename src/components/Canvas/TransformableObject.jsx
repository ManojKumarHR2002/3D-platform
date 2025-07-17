// src/components/Canvas/TransformableObject.jsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import * as THREE from "three";
import { objectStore } from "@/store/objectStore";

export default function TransformableObject({ object }) {
  const ref = useRef();
  const snap = useSnapshot(objectStore);
  const { camera } = useThree();

  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(...object.position);
      ref.current.rotation.set(...object.rotation);
      ref.current.scale.set(...object.scale);
    }
  }, [object]);

  const isSelected = snap.selectedObjectId === object.id;

  useFrame(() => {
    if (ref.current) {
      object.position = [ref.current.position.x, ref.current.position.y, ref.current.position.z];
      object.rotation = [ref.current.rotation.x, ref.current.rotation.y, ref.current.rotation.z];
      object.scale = [ref.current.scale.x, ref.current.scale.y, ref.current.scale.z];
    }
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        objectStore.selectedObjectId = object.id;
      }}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isSelected ? "orange" : "white"} />
      </mesh>
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial color="yellow" wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

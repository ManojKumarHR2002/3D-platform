import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Scene from "@classes/Scene";

export default function CanvasArea({ 
  sceneObjects = [],
  onApplyMaterial,
  onObjectSelect
}) {
  const sceneInstance = useRef(null);
  const objectsRef = useRef(new Map());
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Scene initialization with error handling
  useEffect(() => {
    try {
      sceneInstance.current = new Scene("myThreeJsCanvas");
      sceneInstance.current.initialize();
      sceneInstance.current.animate();
    } catch (error) {
      console.error("Scene initialization failed:", error);
      sceneInstance.current = null;
    }

    return () => {
      if (sceneInstance.current && typeof sceneInstance.current.cleanup === 'function') {
        sceneInstance.current.cleanup();
      }
      sceneInstance.current = null;
    };
  }, []);

  // Object management
  useEffect(() => {
    if (!sceneInstance.current) return;

    sceneObjects.forEach(obj => {
      if (!objectsRef.current.has(obj.id)) {
        const geometry = createGeometry(obj.type);
        const material = createMaterial(obj.material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...obj.position);
        mesh.userData.objectId = obj.id;
        sceneInstance.current.scene.add(mesh);
        objectsRef.current.set(obj.id, mesh);
      }
    });

    // Cleanup removed objects
    Array.from(objectsRef.current.keys()).forEach(id => {
      if (!sceneObjects.find(o => o.id === id)) {
        const mesh = objectsRef.current.get(id);
        if (mesh) {
          mesh.geometry.dispose();
          mesh.material.dispose();
          sceneInstance.current.scene.remove(mesh);
        }
        objectsRef.current.delete(id);
      }
    });
  }, [sceneObjects]);

  // Event handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (!sceneInstance.current) return;

    const materialData = JSON.parse(e.dataTransfer.getData('material'));
    const rect = e.currentTarget.getBoundingClientRect();
    
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, sceneInstance.current.camera);
    const intersects = raycaster.intersectObjects(Array.from(objectsRef.current.values()));

    if (intersects.length > 0 && onApplyMaterial) {
      const objectId = intersects[0].object.userData.objectId;
      const mesh = objectsRef.current.get(objectId);
      
      const newMaterial = createMaterial(materialData);
      mesh.material.dispose();
      mesh.material = newMaterial;
      
      onApplyMaterial(objectId, materialData);
    }
  };

  const handleClick = (e) => {
    if (!sceneInstance.current) return;

    const canvas = document.getElementById('myThreeJsCanvas');
    const rect = canvas.getBoundingClientRect();
    
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, sceneInstance.current.camera);
    const intersects = raycaster.intersectObjects(Array.from(objectsRef.current.values()));

    if (intersects.length > 0) {
      onObjectSelect(intersects[0].object.userData.objectId);
    }
  };

  // Event listeners
  useEffect(() => {
    const canvas = document.getElementById('myThreeJsCanvas');
    if (!canvas) return;

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('dragover', e => e.preventDefault());
    canvas.addEventListener('drop', handleDrop);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('dragover', e => e.preventDefault());
      canvas.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <div className="flex w-full h-full rounded-lg bg-neutral-600">
      <div className="flex-grow flex justify-center items-center w-full h-full rounded-xl overflow-hidden shadow-2xl">
        <canvas
          id="myThreeJsCanvas"
          className="w-full h-full bg-gray-950 border border-gray-700"
        />
      </div>
    </div>
  );
}

// Geometry and material helpers
function createGeometry(type) {
  switch(type) {
    case 'cube': return new THREE.BoxGeometry();
    case 'sphere': return new THREE.SphereGeometry(0.5);
    case 'cylinder': return new THREE.CylinderGeometry(0.5, 0.5, 1);
    case 'cone': return new THREE.ConeGeometry(0.5, 1);
    case 'plane': return new THREE.PlaneGeometry(1, 1);
    case 'torus': return new THREE.TorusGeometry(0.5, 0.2);
    default: return new THREE.BoxGeometry();
  }
}

function createMaterial(materialData) {
  if (!materialData) return new THREE.MeshStandardMaterial({ color: 0x888888 });
  
  const params = {
    color: new THREE.Color(materialData.baseColor || '#666666'),
    metalness: materialData.metallic || 0,
    roughness: 1 - (materialData.smoothness || 0.5)
  };

  const textureLoader = new THREE.TextureLoader();
  if (materialData.baseMap?.url) params.map = textureLoader.load(materialData.baseMap.url);
  if (materialData.normalMap?.url) params.normalMap = textureLoader.load(materialData.normalMap.url);

  return new THREE.MeshStandardMaterial(params);
}

// components/Canvas/CanvasArea.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useObjectStore } from '../../../store/objectStore';
import { useEnvironmentStore } from '../../../store/environmentStore';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const CanvasArea = () => {
  const mountRef = useRef(null);
  const { mode, hdriOption, skyboxOption } = useEnvironmentStore();
  const { objects, fetchObjects, listenToChanges } = useObjectStore();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    mountRef.current.appendChild(renderer.domElement);

    const loadEnvironment = () => {
      if (mode === 'hdri') {
        new RGBELoader()
          .setPath('/hdri/')
          .load(`${hdriOption}.hdr`, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            scene.background = texture;
          });
      } else if (mode === 'skybox') {
        const loader = new THREE.CubeTextureLoader();
        const urls = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(side => `/skybox/${skyboxOption}/${side}.jpg`);
        loader.load(urls, (texture) => {
          scene.environment = texture;
          scene.background = texture;
        });
      }
    };
    loadEnvironment();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    const objectMap = new Map();

    const loadObjects = () => {
      objectMap.clear();
      scene.clear();
      loadEnvironment();
      scene.add(dirLight);

      objects.forEach((obj) => {
        let mesh;
        if (obj.type === 'cube') {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
        } else if (obj.type === 'model' && obj.url) {
          const loader = new GLTFLoader();
          loader.load(obj.url, (gltf) => {
            const model = gltf.scene;
            model.position.set(...obj.position);
            model.rotation.set(...obj.rotation);
            model.scale.set(...obj.scale);
            scene.add(model);
            objectMap.set(obj.id, model);
          });
          return;
        }
        if (mesh) {
          mesh.position.set(...obj.position);
          mesh.rotation.set(...obj.rotation);
          mesh.scale.set(...obj.scale);
          scene.add(mesh);
          objectMap.set(obj.id, mesh);
        }
      });
    };

    fetchObjects().then(loadObjects);
    listenToChanges();

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    camera.position.z = 5;

    return () => {
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, [mode, hdriOption, skyboxOption, objects]);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default CanvasArea;

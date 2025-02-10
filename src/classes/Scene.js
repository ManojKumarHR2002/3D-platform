import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Scene {
  constructor(canvasId) {
    // Core components for Three.js initialization
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    // Camera params
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    // Additional components
    this.clock = undefined;
    this.controls = undefined;

    // Lighting
    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.z = 48;

    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    // Ensure parent element exists and get correct size
    const parent = canvas?.parentElement;
    if (parent) {
      this.renderer.setSize(parent.offsetWidth, parent.offsetHeight);
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Remove document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    window.addEventListener('resize', () => this.onWindowResize(), false);
  }


  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);

  }

  onWindowResize() {
     const canvas = this.renderer.domElement;
  const parent = canvas.parentElement;
  
  if (!parent) return; // Prevent errors if parent is not found

  const width = parent.offsetWidth;
  const height = parent.offsetHeight;

  // ✅ Update camera aspect ratio properly
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();

  // ✅ Resize renderer correctly
  this.renderer.setSize(width, height);
  this.renderer.setPixelRatio(window.devicePixelRatio); // Makes rendering crisp

  }
}

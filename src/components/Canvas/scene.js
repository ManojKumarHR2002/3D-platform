import * as THREE from 'three';

export default class Scene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) throw new Error('Canvas element not found');
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      antialias: true
    });
    this.mixers = [];
  }

  initialize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.z = 5;
    this.addLights();
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  animate() {
    const animateLoop = () => {
      requestAnimationFrame(animateLoop);
      this.mixers.forEach(mixer => mixer.update(0.016));
      this.renderer.render(this.scene, this.camera);
    };
    animateLoop();
  }

  cleanup() {
    // Dispose geometries and materials
    this.scene.traverse(child => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });

    // Clear scene
    while(this.scene.children.length > 0) { 
      this.scene.remove(this.scene.children[0]);
    }

    // Dispose renderer
    this.renderer.dispose();
    this.mixers = [];
  }
}
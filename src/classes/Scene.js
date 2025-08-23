import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Scene {
  constructor(canvasId) {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    this.clock = undefined;
    this.controls = undefined;

    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0x1a1a1a, 50, 200);


    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    const parent = canvas?.parentElement;
    if (parent) {
      this.renderer.setSize(parent.offsetWidth, parent.offsetHeight);
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      width / height,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.set(0, 20, 48);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(10, 32, 64);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    // Grid Helper
    const gridSize = 500;
    const divisions = 100;
    const gridHelper = new THREE.GridHelper(gridSize, divisions);
    this.scene.add(gridHelper);

    // Full-Length X & Y Axis Lines
    const xLineMaterial = new THREE.LineBasicMaterial({ color: 0xF74822 }); // Red for X-axis
    const yLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Green for Y-axis
    const zLineMaterial = new THREE.LineBasicMaterial({ color: 0x5694F9 }); // Blue for Z-axis
    
    const xLineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-gridSize / 2, 0, 0),
      new THREE.Vector3(gridSize / 2, 0, 0),
    ]);
    const yLineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -gridSize / 2, 0),
      new THREE.Vector3(0, gridSize / 2, 0),
    ]);
    const zLineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -gridSize / 2),
      new THREE.Vector3(0, 0, gridSize / 2),
    ]);

    const xAxisLine = new THREE.Line(xLineGeometry, xLineMaterial);
    const yAxisLine = new THREE.Line(yLineGeometry, yLineMaterial);
    const zAxisLine = new THREE.Line(zLineGeometry, zLineMaterial);


    this.scene.add(xAxisLine);
    this.scene.add(yAxisLine);
    this.scene.add(zAxisLine);


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

    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientWidth;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
}

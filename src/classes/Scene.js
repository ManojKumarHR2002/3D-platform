import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
export default class Scene {
  constructor(canvasId) {
    this.canvasId = canvasId;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.controls = null;

    this.ambientLight = null;
    this.directionalLight = null;

    this.resizeListener = null;
    this.animationId = null;

    this.mouse = new THREE.Vector2();
    this.mouseDownPosition = new THREE.Vector2();
    this.mouseMoved = false;
    this.raycaster = new THREE.Raycaster();
    this.INTERSECTED = null;
    this.selectedObjects = [];

    this.composer = null;
    this.outlinePass = null;

    this.animate = this.animate.bind(this);
    // this.onPointerMove = this.onPointerMove.bind(this); 
    // canvas.addEventListener('click', this.onClick.bind(this), false);
    this.onClick=this.onClick.bind(this);
    
  }

  initialize() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0x1a1a1a, 50, 200);

    // Canvas and Renderer
    const canvas = document.getElementById(this.canvasId);
    const parent = canvas?.parentElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(parent?.offsetWidth || window.innerWidth, parent?.offsetHeight || window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Camera
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(0, 20, 48);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Lights
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(10, 32, 64);
    this.directionalLight.castShadow = true;

    this.scene.add(this.ambientLight, this.directionalLight);

    // Helpers
    const gridSize = 500;
    const divisions = 100;
    this.scene.add(new THREE.GridHelper(gridSize, divisions));

    // XYZ Axis Lines
    this.addAxisLines(gridSize);

    // Clock
    this.clock = new THREE.Clock();

     // Postprocessing
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
    this.outlinePass.edgeThickness = 2.0;
    this.outlinePass.edgeStrength = 3.0;
    this.outlinePass.visibleEdgeColor.set(0xffffff);
    this.composer.addPass(this.outlinePass);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('../three.js-master/examples/textures/tri_pattern.jpg', (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      this.outlinePass.patternTexture = texture;
    });

    // const fxaaPass = new ShaderPass(FXAAShader);
    // fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    // this.composer.addPass(fxaaPass);

    // Mouse listener
    // canvas.addEventListener('pointermove', this.onPointerMove.bind(this), false);
    // canvas.addEventListener('click', this.onClick.bind(this),false);  
    canvas.addEventListener('mousedown', (event) => {
      this.mouseMoved = false;
      this.mouseDownPosition.set(event.clientX, event.clientY);
    });

    canvas.addEventListener('mousemove', (event) => {
      const dx = event.clientX - this.mouseDownPosition.x;
      const dy = event.clientY - this.mouseDownPosition.y;
      if (Math.sqrt(dx * dx + dy * dy) > 3) { // tolerance in pixels
        this.mouseMoved = true;
      }
    });

    canvas.addEventListener('mouseup', (event) => {
      if (!this.mouseMoved) {
        this.onClick(event); // call your click logic only if not dragged
      }
    });

    // Resize events
    this.resizeListener = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.resizeListener, false);
  }

  addAxisLines(size) {
    const createLine = (start, end, color) => {
      const material = new THREE.LineBasicMaterial({ color });
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      return new THREE.Line(geometry, material);
    };

    this.scene.add(
      createLine(new THREE.Vector3(-size / 2, 0, 0), new THREE.Vector3(size / 2, 0, 0), 0xF74822), // X
      createLine(new THREE.Vector3(0, -size / 2, 0), new THREE.Vector3(0, size / 2, 0), 0x00ff00), // Y
      createLine(new THREE.Vector3(0, 0, -size / 2), new THREE.Vector3(0, 0, size / 2), 0x5694F9)  // Z
    );
  }

  //  onPointerMove(event) {
  //   const canvas = this.renderer.domElement;
  //   const bounds = canvas.getBoundingClientRect();

  //   this.mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  //   this.mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

  //   this.checkIntersection();
  // }

  onClick(event) {
    const canvas = this.renderer.domElement;
    const bounds = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    this.mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    this.checkIntersection();
  }


  checkIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0 && intersects[0].object.type === 'Mesh') {
      const object = intersects[0].object;
      
      this.INTERSECTED = object;
      this.selectedObjects.length = 0;
      this.selectedObjects.push(object);
      this.outlinePass.selectedObjects = this.selectedObjects;
      console.log('Clicked:', object.name || object.uuid);      
    } else {
      this.INTERSECTED = null;
      this.selectedObjects.length = 0;
      this.outlinePass.selectedObjects = [];
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.render();
  }

  start() {
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  render() {
    this.composer.render();
  }

  onWindowResize() {
    const canvas = this.renderer.domElement;
    const parent = canvas.parentElement;

    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  dispose() {
    this.stop();

    const canvas = this.renderer.domElement;
    // canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('click', this.onClick);


    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener, false);
      this.resizeListener = null;
    }

    if (this.controls?.dispose) {
      this.controls.dispose();
    }
  }
}

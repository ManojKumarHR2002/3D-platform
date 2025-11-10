import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { selectObject } from '@store/slices/sceneSlice';

export default class Scene {
  constructor(canvasId, dispatch) {
    this.canvasId = canvasId;
    this.dispatch = dispatch; // ✅ Store Redux dispatch

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
    this.onClick = this.onClick.bind(this);

    this.transformControls = null;
    this.currentTransformMode = 'translate';

    this.previousTransform = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      scale: new THREE.Vector3(),
    };
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0x1a1a1a, 50, 200);

    const canvas = document.getElementById(this.canvasId);
    const parent = canvas?.parentElement;

    canvas.oncontextmenu = (e) => e.preventDefault();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(parent?.offsetWidth || window.innerWidth, parent?.offsetHeight || window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(0, 20, 48);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // ✅ Add TransformControls to scene
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.setMode(this.currentTransformMode);
    this.scene.add(this.transformControls.getHelper());

    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value;
    });

    this.initializeHotkeys();

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(10, 32, 64);
    this.directionalLight.castShadow = true;
    this.scene.add(this.ambientLight, this.directionalLight);

    const gridSize = 500;
    const divisions = 100;
    this.scene.add(new THREE.GridHelper(gridSize, divisions));

    this.addAxisLines(gridSize);

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

    // Selection Events
    canvas.addEventListener('mousedown', (event) => {
      this.mouseMoved = false;
      this.mouseDownPosition.set(event.clientX, event.clientY);
    });

    canvas.addEventListener('mousemove', (event) => {
      const dx = event.clientX - this.mouseDownPosition.x;
      const dy = event.clientY - this.mouseDownPosition.y;
      if (Math.sqrt(dx * dx + dy * dy) > 3) {
        this.mouseMoved = true;
      }
    });

    canvas.addEventListener('mouseup', (event) => {
      if (!this.mouseMoved && event.button === 0) {
        this.onClick(event);
      }
    });

    // Resize
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
      createLine(new THREE.Vector3(-size / 2, 0, 0), new THREE.Vector3(size / 2, 0, 0), 0xf74822),
      createLine(new THREE.Vector3(0, -size / 2, 0), new THREE.Vector3(0, size / 2, 0), 0x00ff00),
      createLine(new THREE.Vector3(0, 0, -size / 2), new THREE.Vector3(0, 0, size / 2), 0x5694f9)
    );
  }

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
      this.previousTransform.position.copy(object.position);
      this.previousTransform.rotation.copy(object.rotation);
      this.previousTransform.scale.copy(object.scale);

      this.selectedObjects.length = 0;
      this.selectedObjects.push(object);
      this.outlinePass.selectedObjects = this.selectedObjects;

      this.transformControls.attach(object);

      const modelId = object.userData?.modelId;
      if (modelId && this.dispatch) {
        this.dispatch(selectObject(modelId));
        console.log('Selected model ID:', modelId);
      }

      console.log('Selected object:', object.name || object.uuid);
    } else {
      this.INTERSECTED = null;
      this.selectedObjects.length = 0;
      this.outlinePass.selectedObjects = [];
      this.transformControls.detach();
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

  initializeHotkeys() {
    window.addEventListener('keydown', (event) => {
      switch (event.key.toLowerCase()) {
        case 'g':
          this.transformControls.setMode('translate');
          break;
        case 'r':
          this.transformControls.setMode('rotate');
          break;
        case 's':
          this.transformControls.setMode('scale');
          break;
        case 'escape':
          this.transformControls.detach();
          break;
      }
    });
  }

  getSceneObjects() {
    return this.scene.children
      .flatMap((child) => (child.type === "Group" ? child.children : [child]))
      .filter((obj) => obj.type === 'Mesh' && obj.userData?.modelId)
      .map((obj) => ({
        id: obj.userData.modelId,
        name: obj.name || obj.userData.modelId || obj.uuid,
      }));
  }

  selectObjectById(modelId) {
    const object = this.scene.children
      .flatMap((child) => (child.type === "Group" ? child.children : [child]))
      .find((obj) => obj.userData?.modelId === modelId);

    if (!object) return;

    this.INTERSECTED = object;
    this.previousTransform.position.copy(object.position);
    this.previousTransform.rotation.copy(object.rotation);
    this.previousTransform.scale.copy(object.scale);

    this.selectedObjects.length = 0;
    this.selectedObjects.push(object);
    this.outlinePass.selectedObjects = this.selectedObjects;
    this.transformControls.attach(object);

    if (this.dispatch) {
      this.dispatch(selectObject(modelId));
    }
  }


  dispose() {
    this.stop();

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('mousedown', this.onClick);
    canvas.removeEventListener('mousemove', this.onClick);
    canvas.removeEventListener('mouseup', this.onClick);

    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener, false);
      this.resizeListener = null;
    }

    if (this.controls?.dispose) {
      this.controls.dispose();
    }
  }
}

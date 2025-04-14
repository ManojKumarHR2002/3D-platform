import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { UIManager } from "./UIManager";

export default class Scene {
  constructor(canvasId) {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.fov = 45;
    this.nearPlane = 0.1;
    this.farPlane = 10000;
    this.canvasId = canvasId;
    this.clock = undefined;
    this.controls = undefined;
    this.ambientLight = undefined;
    this.directionalLight = undefined;
    this.uiManager = undefined;
    this.groundPlane = undefined;
  }

  createGroundPlane() {
    const planeSize = 1000;
    const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });

    this.groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.position.y = -0.5;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);

    const gridHelper = new THREE.GridHelper(
      planeSize,
      planeSize / 10,
      0x555555,
      0x333333
    );
    gridHelper.position.y = -0.49;
    this.scene.add(gridHelper);
  }

  createInfiniteAxes() {
    const axesSize = 1000;
    const axesLineWidth = 3;

    const axesGeometry = new THREE.BufferGeometry();
    const axesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: axesLineWidth,
    });

    const axesPositions = new Float32Array([
      0,
      0,
      0,
      axesSize,
      0,
      0,
      0,
      0,
      0,
      0,
      axesSize,
      0,
      0,
      0,
      0,
      0,
      0,
      axesSize,
      0,
      0,
      0,
      -axesSize,
      0,
      0,
      0,
      0,
      0,
      0,
      -axesSize,
      0,
      0,
      0,
      0,
      0,
      0,
      -axesSize,
    ]);

    const axesColors = new Float32Array([
      1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1,
    ]);

    axesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(axesPositions, 3)
    );
    axesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(axesColors, 3)
    );

    const axesLines = new THREE.LineSegments(axesGeometry, axesMaterial);
    axesLines.position.y = 0.1;
    this.scene.add(axesLines);
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);

    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 500;

    this.createGroundPlane();
    this.createInfiniteAxes();
    this.uiManager = new UIManager(this);
    this.uiManager.startRenderLoop(this.renderer);

    this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(10, 32, 64);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 500;
    this.scene.add(this.directionalLight);

    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.uiManager.startRenderLoop(this.renderer);
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

  cleanup() {
    this.uiManager.stopRenderLoop();
    window.removeEventListener("resize", () => this.onWindowResize());
  }

  addLight(type, options = {}) {
    let light;
    const color = new THREE.Color(options.color || 0xffffff);
    const intensity = options.intensity ?? 1;
    const position = options.position || [0, 10, 10];
    const shadowEnabled = options.shadow !== false;

    switch (type) {
      case "ambient":
        light = new THREE.AmbientLight(color, intensity);
        break;
      case "directional":
        light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...position);
        light.castShadow = shadowEnabled;
        if (shadowEnabled) {
          light.shadow.mapSize.width = 2048;
          light.shadow.mapSize.height = 2048;
          light.shadow.camera.near = 0.5;
          light.shadow.camera.far = 500;
        }
        break;
      case "point":
        light = new THREE.PointLight(color, intensity, 50, 0.1);
        light.position.set(...position);
        light.castShadow = shadowEnabled;
        if (shadowEnabled) {
          light.shadow.mapSize.width = 1024;
          light.shadow.mapSize.height = 1024;
        }
        break;
      case "spot":
        light = new THREE.SpotLight(color, intensity);
        light.position.set(...position);
        light.castShadow = shadowEnabled;
        light.angle = options.angle || Math.PI / 4;
        light.penumbra = options.penumbra || 0.1;
        if (shadowEnabled) {
          light.shadow.mapSize.width = 1024;
          light.shadow.mapSize.height = 1024;
        }
        break;
      default:
        return null;
    }

    this.scene.add(light);

    let helper;
    if (type === "point") {
      helper = new THREE.PointLightHelper(light, 1);
    }

    if (helper) {
      helper.name = `light-helper-${light.id}`;
      this.scene.add(helper);
    }

    return {
      id: Date.now(),
      light,
      type,
      color: color.getHex(),
      intensity,
      position: [...position],
      visible: true,
      castShadow: shadowEnabled,
    };
  }

  updateLight(lightObj, properties) {
    if (!lightObj?.light) return;

    if (properties.color !== undefined) {
      lightObj.light.color.setHex(properties.color);
    }

    if (properties.intensity !== undefined) {
      lightObj.light.intensity = properties.intensity;
    }

    if (properties.position !== undefined && lightObj.light.position) {
      lightObj.light.position.set(...properties.position);
      lightObj.position = [...properties.position];
    }

    if (properties.visible !== undefined) {
      lightObj.light.visible = properties.visible;
    }

    if (
      properties.castShadow !== undefined &&
      lightObj.light.castShadow !== undefined
    ) {
      lightObj.light.castShadow = properties.castShadow;
    }

    const helper = this.scene.children.find(
      (obj) => obj.name === `light-helper-${lightObj.light.id}`
    );
    if (helper && helper.update) helper.update();
  }

  removeLight(lightObj) {
    if (!lightObj?.light) return;

    const helper = this.scene.children.find(
      (obj) => obj.name === `light-helper-${lightObj.light.id}`
    );
    if (helper) this.scene.remove(helper);

    this.scene.remove(lightObj.light);
    if (lightObj.light.dispose) lightObj.light.dispose();
  }
}

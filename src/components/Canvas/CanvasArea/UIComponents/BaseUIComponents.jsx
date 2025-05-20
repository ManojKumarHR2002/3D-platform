import * as THREE from "three";

export class BaseUIComponent {
  constructor(uiManager, options = {}) {
    this.uiManager = uiManager;
    this.isActive = true;
    this.mesh = null;
    this.position = options.position || [0, 0, 0];
    this.scale = options.scale || [1, 1, 1];
    this.color = options.color || 0xffffff;
    // --- LOCK/UNLOCK STATE ---
    this.locked = {
      position: false,
      rotation: false,
      scale: false,
    };
    // --- VISIBILITY STATE ---
    this.visible = options.visible !== undefined ? options.visible : true;
  }

  // --- LOCK/UNLOCK HELPERS ---
  setLock(property, isLocked) {
    if (this.locked.hasOwnProperty(property)) {
      this.locked[property] = isLocked;
    }
  }
  isLocked(property) {
    return !!this.locked[property];
  }

  // --- VISIBILITY HELPERS ---
  setVisible(isVisible) {
    this.visible = isVisible;
    if (this.mesh) {
      this.mesh.visible = isVisible;
    }
  }
  isVisible() {
    return this.visible;
  }

  // --- OVERRIDE: Only allow transform if not locked ---
  setPosition(newPosition) {
    if (!this.isLocked('position')) {
      this.position = newPosition;
      if (this.mesh) this.mesh.position.set(...newPosition);
    }
  }
  setRotation(newRotation) {
    if (!this.isLocked('rotation')) {
      if (this.mesh) {
        this.mesh.rotation.set(...newRotation);
      }
    }
  }
  setScale(newScale) {
    if (!this.isLocked('scale')) {
      this.scale = newScale;
      if (this.mesh) this.mesh.scale.set(...newScale);
    }
  }

  createMesh() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(...this.position);
    this.mesh.scale.set(...this.scale);
    this.mesh.visible = this.visible;
    return this.mesh;
  }

  update() {
    // To be implemented by specific components
  }

  render() {
    if (!this.mesh) {
      this.createMesh();
      this.uiManager.addComponent(this);
    }
  }

  destroy() {
    this.uiManager.removeComponent(this);
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
  }
}

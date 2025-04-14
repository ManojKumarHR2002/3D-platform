import * as THREE from "three";

export class BaseUIComponent {
  constructor(uiManager, options = {}) {
    this.uiManager = uiManager;
    this.isActive = true;
    this.mesh = null;
    this.position = options.position || [0, 0, 0];
    this.scale = options.scale || [1, 1, 1];
    this.color = options.color || 0xffffff;
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

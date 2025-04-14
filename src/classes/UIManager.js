import * as THREE from "three";

export class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.uiComponents = [];
    this.renderLoopId = null;
    this.uiScene = new THREE.Scene();
    this.uiCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  addComponent(component) {
    this.uiComponents.push(component);
    if (component.mesh) {
      this.uiScene.add(component.mesh);
    }
  }

  removeComponent(component) {
    this.uiComponents = this.uiComponents.filter((c) => c !== component);
    if (component.mesh) {
      this.uiScene.remove(component.mesh);
    }
  }

  startRenderLoop(renderer) {
    if (this.renderLoopId) return;

    const render = () => {
      // Update UI components
      this.uiComponents.forEach((component) => {
        if (component.update) component.update();
      });

      // Render UI on top of main scene
      renderer.clearDepth(); // Important for UI to render on top
      renderer.render(this.uiScene, this.uiCamera);

      this.renderLoopId = requestAnimationFrame(render);
    };

    render();
  }

  stopRenderLoop() {
    if (this.renderLoopId) {
      cancelAnimationFrame(this.renderLoopId);
      this.renderLoopId = null;
    }
  }
}

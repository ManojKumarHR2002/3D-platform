// src/models/Model.js

class Model {
    constructor(id, modelPath, position, rotation, scale, properties) {
      this.id = id;
      this.modelPath = modelPath;
      this.position = position || { x: 0, y: 0, z: 0 };
      this.rotation = rotation || { x: 0, y: 0, z: 0 };
      this.scale = scale || { x: 1, y: 1, z: 1 };
      this.properties = properties || {};
    }
  
    setPosition(newPosition) {
      this.position = newPosition;
    }
  
    setRotation(newRotation) {
      this.rotation = newRotation;
    }
  
    setScale(newScale) {
      this.scale = newScale;
    }
  
    toJSON() {
      return JSON.stringify({
        id: this.id,
        modelPath: this.modelPath,
        position: this.position,
        rotation: this.rotation,
        scale: this.scale,
        properties: this.properties,
      });
    }
  
    static fromJSON(json) {
      const data = JSON.parse(json);
      return new Model(
        data.id,
        data.modelPath,
        data.position,
        data.rotation,
        data.scale,
        data.properties
      );
    }
  }
  
  export default Model;
  
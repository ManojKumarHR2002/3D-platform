// src/models/Model.js

class Model {
    constructor(id,name, modelPath, position, rotation, scale, properties) {
      this.id = id;
      this.name = name || "Unnamed";
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

    setName(newName) {
      this.name = newName;
    }
  
    toJSON() {
      return JSON.stringify({
        id: this.id,
        name: this.name,
        modelPath: this.modelPath,
        position: this.position,
        rotation: this.rotation,
        scale: this.scale,
        properties: this.properties,
      });
    }
  
    static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new Model(
      data.id,
      data.name,
      data.modelPath,
      data.position,
      data.rotation,
      data.scale,
      data.properties
    );
}

  }
  
  export default Model;
  
// src/components/Canvas/EnvironmentSettings.jsx
import React from "react";
import { useEnvironmentStore } from "../../store/environmentStore";
import { useThree } from "@react-three/fiber";

const EnvironmentSettings = () => {
  const {
    environmentType,
    selectedOption,
    setEnvironmentType,
    setSelectedOption,
  } = useEnvironmentStore();

  const handleTypeChange = (e) => {
    setEnvironmentType(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
      <div>
        <label>Environment Type: </label>
        <select value={environmentType} onChange={handleTypeChange}>
          <option value="skybox">Skybox</option>
          <option value="hdri">HDRI</option>
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>{environmentType === "skybox" ? "Skybox" : "HDRI"} Option: </label>
        <select value={selectedOption} onChange={handleOptionChange}>
          {environmentType === "skybox" ? (
            <>
              <option value="skybox1">Skybox 1</option>
              <option value="skybox2">Skybox 2</option>
              <option value="skybox3">Skybox 3</option>
            </>
          ) : (
            <>
              <option value="studio">Studio</option>
              <option value="sunset">Sunset</option>
              <option value="dawn">Dawn</option>
            </>
          )}
        </select>
      </div>
    </div>
  );
};

export default EnvironmentSettings;

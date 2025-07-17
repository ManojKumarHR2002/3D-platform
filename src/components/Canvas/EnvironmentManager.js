// src/components/Canvas/EnvironmentManager.jsx
import React, { useMemo } from "react";
import { Environment } from "@react-three/drei";
import { useEnvironmentStore } from "../../store/environmentStore";

const EnvironmentManager = () => {
  const { environmentType, selectedOption } = useEnvironmentStore();

  const environmentPath = useMemo(() => {
    if (environmentType === "skybox") {
      return `/skyboxes/${selectedOption}/`; // directory with 6 skybox images
    } else {
      return `/hdris/${selectedOption}.hdr`; // HDRI image
    }
  }, [environmentType, selectedOption]);

  if (environmentType === "skybox") {
    return (
      <Environment
        files={[
          `${environmentPath}px.jpg`,
          `${environmentPath}nx.jpg`,
          `${environmentPath}py.jpg`,
          `${environmentPath}ny.jpg`,
          `${environmentPath}pz.jpg`,
          `${environmentPath}nz.jpg`,
        ]}
        background
      />
    );
  } else {
    return <Environment files={environmentPath} background />;
  }
};

export default EnvironmentManager;

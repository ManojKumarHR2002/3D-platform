import * as THREE from "three";

// Neon Edge Outline Shader - Only highlights model edges
export const neonOutlineShader = {
  uniforms: {
    diffuse: { value: new THREE.Color(0x00ff00) },
    opacity: { value: 1.0 },
    glowIntensity: { value: 1.5 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      vWorldPosition = worldPosition.xyz;
      vViewPosition = -mvPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 diffuse;
    uniform float opacity;
    uniform float glowIntensity;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Calculate view-independent edge factor
      float edgeFactor = 1.0 - abs(dot(normal, viewDir));
      
      // Calculate surface curvature using derivatives
      vec3 dFdxPos = dFdx(vWorldPosition);
      vec3 dFdyPos = dFdy(vWorldPosition);
      vec3 xnormal = normalize(cross(dFdxPos, normal));
      vec3 ynormal = normalize(cross(dFdyPos, normal));
      float curvature = abs(dot(xnormal, ynormal));
      
      // Combine edge detection methods
      float edge = max(
        step(0.3, edgeFactor),           // View-dependent edges
        step(0.2, 1.0 - curvature)       // Geometric edges
      );
      
      // Smooth transition for edge
      float smoothEdge = smoothstep(0.0, 0.8, edge);
      
      // Discard non-edge fragments
      if (smoothEdge < 0.1) {
        discard;
      }
      
      // Calculate final color with edge intensity
      vec3 finalColor = diffuse * glowIntensity;
      float finalOpacity = opacity * smoothEdge;
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `
}; 

import { useObjectStore } from '../../store/objectStore';

const TransformableObject = () => {
  const transformRef = useRef();
  const { mode } = useTransformStore();
  const objectRef = useRef();
  const { setSelectedObject } = useObjectStore();

  useEffect(() => {
    if (transformRef.current) {
      transformRef.current.setMode(mode);
    }
  }, [mode]);

  return (
    <TransformControls
      ref={transformRef}
      object={objectRef.current}
      mode={mode}
    >
      <mesh
        ref={objectRef}
        position={[0, 0, 0]}
        onClick={() => setSelectedObject('your-cube-object-id')} // Replace with dynamic id if multiple
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </TransformControls>
  );
};

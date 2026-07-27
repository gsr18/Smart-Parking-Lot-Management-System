import React, { Component, ReactNode, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ParkingSlot } from '../../types';
import { Slot3D } from './Slot3D';
import { ParkingGrid2DFallback } from './ParkingGrid2DFallback';
import { useParkingStore } from '../../store/useParkingStore';

interface ParkingLotCanvas3DProps {
  slots: ParkingSlot[];
  onSelectSlot: (slot: ParkingSlot) => void;
}

interface CanvasErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  public state: CanvasErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error) {
    console.warn('WebGL 3D Canvas error caught, falling back to 2D grid:', error);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const ParkingLotCanvas3D: React.FC<ParkingLotCanvas3DProps> = ({ slots, onSelectSlot }) => {
  const { viewMode, toggleViewMode } = useParkingStore();
  const [hasWebGLError, setHasWebGLError] = useState(false);

  if (viewMode === '2d' || hasWebGLError) {
    return <ParkingGrid2DFallback slots={slots} onSelectSlot={onSelectSlot} />;
  }

  // Calculate 3D grid layout positions for slots
  const slotsPerRow = 6;
  const spacingX = 2.8;
  const spacingZ = 4.8;

  const fallback = <ParkingGrid2DFallback slots={slots} onSelectSlot={onSelectSlot} />;

  return (
    <CanvasErrorBoundary fallback={fallback}>
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden glass-card border border-slate-800">
        {/* View Mode Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={toggleViewMode}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            Switch to 2D Grid
          </button>
        </div>

        <Canvas
          camera={{ position: [0, 18, 22], fov: 45 }}
          onError={() => setHasWebGLError(true)}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 15]} intensity={1.2} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={10}
            maxDistance={35}
          />

          {/* Asphalt Ground Floor Plane */}
          <mesh position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[40, 40]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={40} blur={1.5} far={10} />

          {/* 3D Parking Slots Grid */}
          <group position={[-((slotsPerRow - 1) * spacingX) / 2, 0, -((Math.ceil((slots?.length || 0) / slotsPerRow) - 1) * spacingZ) / 2]}>
            {(slots || []).map((slot, index) => {
              const row = Math.floor(index / slotsPerRow);
              const col = index % slotsPerRow;
              const posX = col * spacingX;
              const posZ = row * spacingZ;

              return (
                <Slot3D
                  key={slot.id}
                  slot={slot}
                  position={[posX, 0, posZ]}
                  onClick={onSelectSlot}
                />
              );
            })}
          </group>

          <Environment preset="city" />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
};

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { ParkingSlot } from '../../types';

interface Slot3DProps {
  slot: ParkingSlot;
  position: [number, number, number];
  onClick: (slot: ParkingSlot) => void;
}

export const Slot3D: React.FC<Slot3DProps> = ({ slot, position, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const vehicleRef = useRef<THREE.Group>(null);

  // Subtle floating animation for vehicle model if occupied
  useFrame((state) => {
    if (vehicleRef.current && slot.status === 'OCCUPIED') {
      vehicleRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05 + 0.3;
    }
  });

  const getSlotColor = () => {
    switch (slot.status) {
      case 'AVAILABLE':
        return '#10b981'; // Emerald Green
      case 'OCCUPIED':
        return '#6366f1'; // Indigo Blue
      case 'DISABLED':
        return '#f43f5e'; // Rose Red
      default:
        return '#64748b';
    }
  };

  return (
    <group position={position}>
      {/* Parking Slot Ground Bay */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(slot);
        }}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[2.2, 0.1, 4]} />
        <meshStandardMaterial
          color={getSlotColor()}
          roughness={0.4}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* White Parking Line Markers */}
      <mesh position={[-1.15, 0.06, 0]}>
        <boxGeometry args={[0.08, 0.02, 4.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1.15, 0.06, 0]}>
        <boxGeometry args={[0.08, 0.02, 4.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Slot Label Text */}
      <Text
        position={[0, 0.12, 1.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {slot.slotNumber}
      </Text>

      {/* 3D Vehicle Representation if Occupied */}
      {slot.status === 'OCCUPIED' && (
        <group ref={vehicleRef} position={[0, 0.3, 0]}>
          {/* Car Chassis Body */}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[1.6, 0.7, 3.2]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Car Roof Cabin */}
          <mesh position={[0, 0.7, -0.2]}>
            <boxGeometry args={[1.3, 0.5, 1.8]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Wheels */}
          <mesh position={[-0.8, 0, 1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.8, 0, 1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.8, 0, -1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.8, 0, -1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}
    </group>
  );
};

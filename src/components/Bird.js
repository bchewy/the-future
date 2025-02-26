import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MathUtils, Vector3, AdditiveBlending, Color, DoubleSide } from 'three';

const Bird = ({ memory, onClick }) => {
  const meshRef = useRef();
  const wingsRef = useRef();
  const tailRef = useRef();
  const photoRef = useRef();
  const ribbonRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Load the drawing as a texture using drei's useTexture
  const texture = useTexture(memory.drawingUrl);
  
  // Get bird color from memory or use default - ensure all birds have a color
  const birdColor = memory.birdColor || '#ffffff';
  
  // Convert hex color to Three.js color
  const birdGlowColor = new Color(birdColor);
  const birdBodyColor = new Color(birdColor).multiplyScalar(0.9); // Slightly darker for body
  const ribbonColor = new Color(birdColor).multiplyScalar(1.2); // Brighter for ribbon
  
  // Animation parameters - enhanced for more movement
  const speed = useRef(0.01 + Math.random() * 0.01); // Keep the same speed
  const xAmplitude = useRef(1.5 + Math.random() * 1.0); // Increased horizontal movement
  const yAmplitude = useRef(0.5 + Math.random() * 0.5); // Vertical movement
  const zAmplitude = useRef(1.5 + Math.random() * 1.0); // Increased depth movement
  const initialPosition = useRef(new Vector3(memory.position.x, memory.position.y, memory.position.z));
  const time = useRef(Math.random() * 100);
  const wingFlapSpeed = useRef(0.2 + Math.random() * 0.1); // Wing flapping speed
  
  // Flight path parameters
  const flightRadius = useRef(3 + Math.random() * 5); // Random radius for circular flight
  const flightPhase = useRef(Math.random() * Math.PI * 2); // Random starting phase
  const verticalOffset = useRef(Math.random() * 2 - 1); // Random vertical offset
  
  // Handle hover state
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);
  
  // Animation loop
  useFrame(() => {
    if (meshRef.current) {
      // Update time
      time.current += speed.current;
      
      // More complex flight pattern - combination of circular and wave motion
      const xPos = initialPosition.current.x + Math.sin(time.current * 0.3 + flightPhase.current) * xAmplitude.current;
      const yPos = initialPosition.current.y + Math.sin(time.current * 0.5) * yAmplitude.current + verticalOffset.current;
      const zPos = initialPosition.current.z + Math.cos(time.current * 0.3 + flightPhase.current) * zAmplitude.current;
      
      // Apply position
      meshRef.current.position.x = xPos;
      meshRef.current.position.y = yPos;
      meshRef.current.position.z = zPos;
      
      // Rotate bird to face direction of movement
      const xDiff = xPos - meshRef.current.position.x;
      const zDiff = zPos - meshRef.current.position.z;
      if (Math.abs(xDiff) > 0.01 || Math.abs(zDiff) > 0.01) {
        meshRef.current.rotation.y = Math.atan2(xDiff, zDiff);
      }
      
      // Add slight banking effect when turning
      meshRef.current.rotation.z = -Math.sin(time.current * 0.3) * 0.1;
      
      // Scale effect on hover - increased for better visibility
      meshRef.current.scale.x = MathUtils.lerp(
        meshRef.current.scale.x,
        hovered ? 3.0 : 1,
        0.1
      );
      meshRef.current.scale.y = MathUtils.lerp(
        meshRef.current.scale.y,
        hovered ? 3.0 : 1,
        0.1
      );
      meshRef.current.scale.z = MathUtils.lerp(
        meshRef.current.scale.z,
        hovered ? 3.0 : 1,
        0.1
      );
      
      // Animate wings - more pronounced flapping
      if (wingsRef.current) {
        wingsRef.current.rotation.z = Math.sin(time.current * wingFlapSpeed.current * 10) * 1.2;
      }
      
      // Animate tail - more pronounced movement
      if (tailRef.current) {
        tailRef.current.rotation.x = Math.sin(time.current * 0.5) * 0.5;
      }
      
      // Animate photo - gentle swinging motion
      if (photoRef.current) {
        photoRef.current.rotation.y = Math.sin(time.current * 0.2) * 0.1;
        photoRef.current.position.y = Math.sin(time.current * 0.3) * 0.05 - 0.8; // Swinging below the bird
      }
      
      // Animate ribbon
      if (ribbonRef.current) {
        ribbonRef.current.rotation.z = Math.sin(time.current * 0.3) * 0.1;
        ribbonRef.current.rotation.x = Math.cos(time.current * 0.2) * 0.05;
      }
    }
  });
  
  return (
    <group position={[0, 0, 0]} ref={meshRef} onClick={() => onClick(memory)} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* DOVE SHAPE - ENHANCED VISIBILITY */}
      <group>
        {/* Dove body - more elongated and visible */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1.5, 0.7, 0.9]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color={birdBodyColor} emissive={birdBodyColor} emissiveIntensity={1.5} />
        </mesh>
        
        {/* Dove neck - thinner and longer */}
        <mesh position={[0.6, 0.15, 0]} rotation={[0, 0, Math.PI/4]} scale={[0.7, 1, 0.7]}>
          <cylinderGeometry args={[0.15, 0.25, 0.4, 16]} />
          <meshStandardMaterial color={birdBodyColor} emissive={birdBodyColor} emissiveIntensity={1.5} />
        </mesh>
        
        {/* Dove head - smaller and more defined */}
        <mesh position={[0.9, 0.3, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={birdBodyColor} emissive={birdBodyColor} emissiveIntensity={1.5} />
        </mesh>
        
        {/* Dove eyes - smaller and more defined */}
        <mesh position={[1.05, 0.4, 0.1]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[1.05, 0.4, -0.1]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        
        {/* Dove beak - smaller and more pointed */}
        <mesh position={[1.15, 0.25, 0]} rotation={[0, 0, -0.1]}>
          <coneGeometry args={[0.04, 0.15, 16]} />
          <meshStandardMaterial color="#e6e6e6" />
        </mesh>
        
        {/* Dove wings - will be animated */}
        <group ref={wingsRef}>
          {/* Left wing - more wing-shaped and visible */}
          <mesh position={[0, 0.1, 0.5]} rotation={[0.2, 0.3, 0.2]} scale={[1, 1, 1]}>
            <planeGeometry args={[1.5, 0.7]} />
            <meshStandardMaterial 
              color={birdBodyColor} 
              side={DoubleSide} 
              emissive={birdBodyColor} 
              emissiveIntensity={1.5}
              transparent={true}
              opacity={0.95}
            />
          </mesh>
          
          {/* Right wing - more wing-shaped and visible */}
          <mesh position={[0, 0.1, -0.5]} rotation={[0.2, -0.3, -0.2]} scale={[1, 1, 1]}>
            <planeGeometry args={[1.5, 0.7]} />
            <meshStandardMaterial 
              color={birdBodyColor} 
              side={DoubleSide} 
              emissive={birdBodyColor} 
              emissiveIntensity={1.5}
              transparent={true}
              opacity={0.95}
            />
          </mesh>
          
          {/* Wing details - feather lines - more visible */}
          <mesh position={[0, 0.1, 0.5]} rotation={[0.2, 0.3, 0.2]} scale={[0.95, 0.95, 0.95]}>
            <planeGeometry args={[1.5, 0.7]} />
            <meshStandardMaterial 
              color={new Color(birdColor).multiplyScalar(1.3)} 
              side={DoubleSide} 
              emissive={birdColor} 
              emissiveIntensity={1.8}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
          
          <mesh position={[0, 0.1, -0.5]} rotation={[0.2, -0.3, -0.2]} scale={[0.95, 0.95, 0.95]}>
            <planeGeometry args={[1.5, 0.7]} />
            <meshStandardMaterial 
              color={new Color(birdColor).multiplyScalar(1.3)} 
              side={DoubleSide} 
              emissive={birdColor} 
              emissiveIntensity={1.8}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        </group>
        
        {/* Dove tail - more fan-shaped and visible */}
        <group ref={tailRef}>
          <mesh position={[-1.0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
            <planeGeometry args={[0.9, 0.6]} />
            <meshStandardMaterial 
              color={birdBodyColor} 
              side={DoubleSide} 
              emissive={birdBodyColor} 
              emissiveIntensity={1.5}
              transparent={true}
              opacity={0.95}
            />
          </mesh>
          
          {/* Tail details - more visible */}
          <mesh position={[-1.0, 0, 0]} rotation={[0, 0, 0]} scale={[0.95, 0.95, 0.95]}>
            <planeGeometry args={[0.9, 0.6]} />
            <meshStandardMaterial 
              color={new Color(birdColor).multiplyScalar(1.3)} 
              side={DoubleSide} 
              emissive={birdColor} 
              emissiveIntensity={1.8}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        </group>
        
        {/* Ribbon connecting bird to photo frame */}
        <group ref={ribbonRef}>
          {/* Left ribbon strand */}
          <mesh position={[0, -0.3, 0.15]} rotation={[0, 0, Math.PI/4]} scale={[0.05, 0.6, 0.05]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={ribbonColor} 
              emissive={ribbonColor} 
              emissiveIntensity={1.5}
            />
          </mesh>
          
          {/* Right ribbon strand */}
          <mesh position={[0, -0.3, -0.15]} rotation={[0, 0, -Math.PI/4]} scale={[0.05, 0.6, 0.05]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={ribbonColor} 
              emissive={ribbonColor} 
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
        
        {/* Memory photo carried by the bird - repositioned to hang below */}
        <group ref={photoRef} position={[0, -0.8, 0]}>
          {/* Photo frame */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[0.7, 0.7, 0.1]}>
            <boxGeometry args={[1, 1, 0.1]} />
            <meshStandardMaterial 
              color="#8a6d3b" 
              emissive="#8a6d3b" 
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Photo - Front side */}
          <mesh position={[0, 0, 0.06]} rotation={[0, 0, 0]} scale={[0.6, 0.6, 0.01]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} transparent={true} side={DoubleSide} />
          </mesh>
          
          {/* Photo - Back side */}
          <mesh position={[0, 0, -0.06]} rotation={[0, Math.PI, 0]} scale={[0.6, 0.6, 0.01]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} transparent={true} side={DoubleSide} />
          </mesh>
          
          {/* Frame border - Front side */}
          <mesh position={[0, 0, 0.07]} rotation={[0, 0, 0]} scale={[0.65, 0.65, 0.01]}>
            <ringGeometry args={[0.85, 1, 32]} />
            <meshStandardMaterial 
              color={new Color(birdColor).multiplyScalar(1.4)} 
              emissive={birdColor} 
              emissiveIntensity={2.0}
              side={DoubleSide}
            />
          </mesh>
          
          {/* Frame border - Back side */}
          <mesh position={[0, 0, -0.07]} rotation={[0, Math.PI, 0]} scale={[0.65, 0.65, 0.01]}>
            <ringGeometry args={[0.85, 1, 32]} />
            <meshStandardMaterial 
              color={new Color(birdColor).multiplyScalar(1.4)} 
              emissive={birdColor} 
              emissiveIntensity={2.0}
              side={DoubleSide}
            />
          </mesh>
          
          {/* Frame glow - Front side */}
          <mesh position={[0, 0, 0.08]} rotation={[0, 0, 0]} scale={[0.7, 0.7, 0.01]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent={true} 
              opacity={0.4} 
              blending={AdditiveBlending} 
              side={DoubleSide} 
            />
          </mesh>
          
          {/* Frame glow - Back side */}
          <mesh position={[0, 0, -0.08]} rotation={[0, Math.PI, 0]} scale={[0.7, 0.7, 0.01]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent={true} 
              opacity={0.4} 
              blending={AdditiveBlending} 
              side={DoubleSide} 
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default Bird;

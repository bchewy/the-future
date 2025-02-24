import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { useDatabase } from './DatabaseProvider';
import Bird from './Bird';
import MemoryModal from './MemoryModal';

// Sky theme definitions
const skyThemes = {
  sunset: {
    name: "Peaceful Sunset",
    description: "A serene pink and purple sunset sky, symbolizing the beautiful end of a journey.",
    sky: {
      distance: 450000,
      sunPosition: [0, 0.05, -1],
      inclination: 0.1,
      azimuth: 0.25,
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.75
    },
    lights: [
      { type: 'ambient', intensity: 0.4, color: "#ffd6e0" },
      { type: 'directional', position: [0, 0.05, -1], intensity: 1.2, color: "#ff9e7a" },
      { type: 'directional', position: [-5, 5, -2], intensity: 0.3, color: "#9370db" }
    ],
    fog: { color: "#e0a0c0", near: 20, far: 100 },
    stars: { visible: true, count: 1000, opacity: 0.3 }
  },
  night: {
    name: "Starry Night",
    description: "A deep blue night sky filled with stars, representing eternal peace and the infinite beyond.",
    sky: {
      distance: 450000,
      sunPosition: [0, -0.5, 0],
      inclination: 0,
      azimuth: 0.25,
      turbidity: 10,
      rayleigh: 5,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8
    },
    lights: [
      { type: 'ambient', intensity: 0.1, color: "#0a1a3f" },
      { type: 'directional', position: [0, 10, 0], intensity: 0.08, color: "#b0c8ff" },
      { type: 'directional', position: [-5, 5, -2], intensity: 0.04, color: "#6a82fb" }
    ],
    fog: { color: "#070b18", near: 25, far: 90 },
    stars: { visible: true, count: 8000, opacity: 1 }
  },
  dawn: {
    name: "New Dawn",
    description: "A hopeful golden sunrise, symbolizing new beginnings and the light that remains after loss.",
    sky: {
      distance: 450000,
      sunPosition: [0, 0.1, 1],
      inclination: 0.2,
      azimuth: 0.25,
      turbidity: 6,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.82
    },
    lights: [
      { type: 'ambient', intensity: 0.4, color: "#fff1d6" },
      { type: 'directional', position: [0, 0.1, 1], intensity: 1.5, color: "#ffa530" },
      { type: 'directional', position: [-5, 5, -2], intensity: 0.3, color: "#ffecd2" }
    ],
    fog: { color: "#ffcb8c", near: 30, far: 120 },
    stars: { visible: false, count: 0, opacity: 0 }
  },
  ethereal: {
    name: "Ethereal Realm",
    description: "A mystical teal and violet sky, representing the spiritual realm where souls find peace.",
    sky: {
      distance: 450000,
      sunPosition: [0, 0.3, 0],
      inclination: 0.4,
      azimuth: 0.25,
      turbidity: 4,
      rayleigh: 2,
      mieCoefficient: 0.01,
      mieDirectionalG: 0.85
    },
    lights: [
      { type: 'ambient', intensity: 0.35, color: "#7F7FD5" },
      { type: 'directional', position: [5, 10, 5], intensity: 0.8, color: "#91EAE4" },
      { type: 'directional', position: [-5, 5, -2], intensity: 0.4, color: "#86A8E7" }
    ],
    fog: { color: "#614385", near: 15, far: 100 },
    stars: { visible: true, count: 3000, opacity: 0.6 }
  },
  daylight: {
    name: "Clear Daylight",
    description: "A bright blue sky with gentle clouds, representing clarity, truth and the enduring light of memory.",
    sky: {
      distance: 450000,
      sunPosition: [1, 1, 0],
      inclination: 0.6,
      azimuth: 0.1,
      turbidity: 8,
      rayleigh: 1,
      mieCoefficient: 0.003,
      mieDirectionalG: 0.8
    },
    lights: [
      { type: 'ambient', intensity: 0.5, color: "#e2eeff" },
      { type: 'directional', position: [1, 1, 0], intensity: 1.2, color: "#ffffff" },
      { type: 'directional', position: [-1, 0.5, 0.2], intensity: 0.3, color: "#b3d9ff" }
    ],
    fog: { color: "#e2eeff", near: 50, far: 150 },
    stars: { visible: false, count: 0, opacity: 0 }
  }
};

const MemorialSky = () => {
  const { getMemories } = useDatabase();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('sunset');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  // Get the active theme
  const activeTheme = skyThemes[currentTheme];
  
  // Fetch memories on component mount
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const memoriesData = await getMemories();
        // Only use the database memories, no preloaded birds
        setMemories(memoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching memories:', error);
        // If there's an error, show empty array
        setMemories([]);
        setLoading(false);
      }
    };
    
    fetchMemories();
  }, [getMemories]);
  
  // Handle bird click
  const handleBirdClick = (memory) => {
    setSelectedMemory(memory);
  };
  
  // Close memory modal
  const closeModal = () => {
    setSelectedMemory(null);
  };
  
  // Toggle theme selector
  const toggleThemeSelector = () => {
    setShowThemeSelector(!showThemeSelector);
  };
  
  // Change theme
  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    setShowThemeSelector(false);
  };
  
  return (
    <div className="memorial-sky-container">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        {/* Lights based on active theme */}
        {activeTheme.lights.map((light, index) => {
          if (light.type === 'ambient') {
            return <ambientLight key={index} intensity={light.intensity} color={light.color} />;
          } else if (light.type === 'directional') {
            return <directionalLight key={index} position={light.position} intensity={light.intensity} color={light.color} />;
          }
          return null;
        })}
        
        {/* Fog for atmospheric effect */}
        <fog attach="fog" args={[activeTheme.fog.color, activeTheme.fog.near, activeTheme.fog.far]} />
        
        {/* Sky based on active theme */}
        <Sky 
          distance={activeTheme.sky.distance} 
          sunPosition={activeTheme.sky.sunPosition} 
          inclination={activeTheme.sky.inclination} 
          azimuth={activeTheme.sky.azimuth} 
          turbidity={activeTheme.sky.turbidity}
          rayleigh={activeTheme.sky.rayleigh}
          mieCoefficient={activeTheme.sky.mieCoefficient}
          mieDirectionalG={activeTheme.sky.mieDirectionalG}
        />
        
        {/* Stars based on active theme */}
        {activeTheme.stars.visible && (
          <Stars 
            radius={100} 
            depth={50} 
            count={activeTheme.stars.count} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5}
            opacity={activeTheme.stars.opacity || 1}
          />
        )}
        
        {/* Birds - only showing the ones from the database */}
        <Suspense fallback={null}>
          {memories.map((memory) => (
            <Bird 
              key={memory.id} 
              memory={memory} 
              onClick={handleBirdClick} 
            />
          ))}
        </Suspense>
        
        {/* Camera controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true} 
          zoomSpeed={0.6} 
          panSpeed={0.5} 
          rotateSpeed={0.5} 
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="ui-overlay">
        {/* App explanation */}
        <div className="app-explanation">
          <h1>Forever in Our Hearts</h1>
          <p>A shared space for family and friends to honor and remember our beloved through messages carried by memorial doves.</p>
          <div className="explanation-details">
            <div className="explanation-item">
              <span className="explanation-icon">🕊️</span>
              <span>Each dove carries a cherished memory</span>
            </div>
            <div className="explanation-item">
              <span className="explanation-icon">👆</span>
              <span>Click on a dove to read the memory</span>
            </div>
            <div className="explanation-item">
              <span className="explanation-icon">🎨</span>
              <span>Add your own memory to honor them</span>
            </div>
          </div>
        </div>
        
        {/* Theme selector button */}
        <div className="theme-selector-toggle">
          <button onClick={toggleThemeSelector} className="theme-button">
            Change Sky Theme
          </button>
        </div>
        
        {/* Theme selector panel */}
        {showThemeSelector && (
          <div className="theme-selector-panel">
            <h3>Choose a Backdrop for Your Memories</h3>
            <div className="theme-options">
              {Object.entries(skyThemes).map(([key, theme]) => (
                <div 
                  key={key} 
                  className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                  onClick={() => changeTheme(key)}
                >
                  <h4>{theme.name}</h4>
                  <p>{theme.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Create memory button */}
        <div className="create-memory-button">
          <Link to="/upload">
            <button className="create-button">
              <span className="button-icon">🕊️</span>
              <span className="button-text">Share Your Memory</span>
            </button>
          </Link>
        </div>
      </div>
      
      {/* Memory modal */}
      {selectedMemory && (
        <MemoryModal memory={selectedMemory} onClose={closeModal} />
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading memories...</p>
        </div>
      )}
    </div>
  );
};

export default MemorialSky;

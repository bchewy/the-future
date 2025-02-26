import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Cloud } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { useDatabase } from './DatabaseProvider';
import Bird from './Bird';
import MemoryModal from './MemoryModal';

// Sky theme definitions
const skyThemes = {
  sunset: {
    name: "Purple Sunset",
    description: "A dreamlike sunset with vibrant pink and purple hues painting the sky in a stunning display of color.",
    color: "#ff00ff",
    sky: {
      distance: 450000,
      sunPosition: [0, 0.01, -1],
      inclination: 0.05,
      azimuth: 0.25,
      turbidity: 3,
      rayleigh: 0.5,
      mieCoefficient: 0.001,
      mieDirectionalG: 0.999
    },
    lights: [
      { type: 'ambient', intensity: 1.0, color: "#ffffff" },
      { type: 'directional', position: [0, 0.1, -1], intensity: 4.0, color: "#ff3366" },
      { type: 'directional', position: [-3, 0.5, -1], intensity: 3.0, color: "#cc33ff" },
      { type: 'directional', position: [3, 0.2, -1], intensity: 2.5, color: "#ff9966" },
      { type: 'directional', position: [0, -0.5, 0.5], intensity: 2.0, color: "#9900cc" }
    ],
    fog: { color: "#ff6699", near: 35, far: 120 },
    stars: { visible: true, count: 2000, opacity: 0.5 },
    clouds: [
      { position: [0, 0, -15], opacity: 0.7, speed: 0.05, width: 22, depth: 2, segments: 22, color: "#ffdddd" },
      { position: [-15, 5, -18], opacity: 0.5, speed: 0.08, width: 18, depth: 1.5, segments: 18, color: "#ffe0e0" },
      { position: [12, -4, -15], opacity: 0.6, speed: 0.04, width: 15, depth: 1, segments: 15, color: "#ffd6e0" }
    ]
  },
  galaxy: {
    name: "Cosmic Galaxy",
    description: "A breathtaking view of a distant galaxy with vibrant nebulae and cosmic dust, representing the vastness of eternity.",
    color: "#000000",
    sky: {
      distance: 450000,
      sunPosition: [0, -0.5, 0],
      inclination: 0,
      azimuth: 0.25,
      turbidity: 0.5,
      rayleigh: 0.01,
      mieCoefficient: 0.0001,
      mieDirectionalG: 0.999
    },
    lights: [
      { type: 'ambient', intensity: 0.8, color: "#ffffff" },
      { type: 'directional', position: [5, 3, 2], intensity: 1.5, color: "#ff00ff" },
      { type: 'directional', position: [-5, 2, -2], intensity: 1.2, color: "#00ffff" },
      { type: 'directional', position: [0, -3, 5], intensity: 1.0, color: "#ffff00" },
      { type: 'directional', position: [-3, -1, -3], intensity: 0.8, color: "#ff3300" },
      { type: 'directional', position: [4, 0, 4], intensity: 0.6, color: "#00ff66" }
    ],
    fog: { color: "#000000", near: 20, far: 100 },
    stars: { visible: true, count: 30000, opacity: 1 },
    clouds: []
  },
  paradise: {
    name: "Tropical Paradise",
    description: "A vivid turquoise and gold sky reminiscent of tropical waters and sunsets, celebrating life's most beautiful moments.",
    color: "#00ffff",
    sky: {
      distance: 450000,
      sunPosition: [0, 0.3, -0.8],
      inclination: 0.3,
      azimuth: 0.25,
      turbidity: 1,
      rayleigh: 0.05,
      mieCoefficient: 0.0005,
      mieDirectionalG: 0.999
    },
    lights: [
      { type: 'ambient', intensity: 1.2, color: "#ffffff" },
      { type: 'directional', position: [1, 1, -1], intensity: 3.0, color: "#ff9f1c" },
      { type: 'directional', position: [-1, 0.5, 0], intensity: 2.0, color: "#00ffcc" },
      { type: 'directional', position: [0, -0.5, 1], intensity: 1.5, color: "#ff5500" },
      { type: 'directional', position: [2, 0, -2], intensity: 1.0, color: "#ffcc00" }
    ],
    fog: { color: "#80e5e5", near: 40, far: 120 },
    stars: { visible: false, count: 0, opacity: 0 },
    clouds: [
      { position: [0, 5, -15], opacity: 0.6, speed: 0.3, width: 28, depth: 2, segments: 25, color: "#ffeecc" },
      { position: [-18, 0, -12], opacity: 0.7, speed: 0.2, width: 18, depth: 1, segments: 16, color: "#ffddaa" }
    ]
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
        
        {/* Clouds based on active theme */}
        {activeTheme.clouds && activeTheme.clouds.map((cloud, index) => (
          <Cloud 
            key={`cloud-${index}`}
            position={cloud.position}
            opacity={cloud.opacity}
            speed={cloud.speed}
            width={cloud.width}
            depth={cloud.depth}
            segments={cloud.segments}
            color={cloud.color}
          />
        ))}
        
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
                  <div className="theme-preview-container">
                    <div 
                      className="theme-color-preview" 
                      style={{ 
                        background: `linear-gradient(to right, ${theme.color}, ${theme.lights[0].color})`,
                        boxShadow: theme.stars.visible ? `0 0 10px 1px ${theme.lights[1]?.color || '#ffffff'}` : 'none'
                      }}
                    >
                      {theme.stars.visible && (
                        <div className="theme-stars-preview"></div>
                      )}
                    </div>
                    <div className="theme-info">
                      <h4>{theme.name}</h4>
                      <p>{theme.description}</p>
                    </div>
                  </div>
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

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from './DatabaseProvider';
import BiographyGenerator from './BiographyGenerator';

// Create a style element for keyframes
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const UploadDrawing = () => {
  const { uploadDrawing } = useDatabase();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const canvasRef = useRef(null);
  
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBiographyGenerator, setShowBiographyGenerator] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [birdColor, setBirdColor] = useState('#ffffff');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Enhanced color options with more choices
  const colorOptions = [
    { id: 'white', value: '#ffffff', name: 'Pure White' },
    { id: 'gold', value: '#ffd700', name: 'Eternal Gold' },
    { id: 'blue', value: '#87ceeb', name: 'Peaceful Blue' },
    { id: 'purple', value: '#9370db', name: 'Spiritual Purple' },
    { id: 'pink', value: '#ffb6c1', name: 'Loving Pink' },
    { id: 'teal', value: '#20b2aa', name: 'Tranquil Teal' },
    { id: 'orange', value: '#ffa500', name: 'Warm Orange' },
    { id: 'green', value: '#90ee90', name: 'Gentle Green' },
    { id: 'red', value: '#ff6347', name: 'Passionate Red' },
    { id: 'lavender', value: '#e6e6fa', name: 'Soft Lavender' }
  ];
  
  // Add the keyframes style to the document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = spinKeyframes;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Add custom styles for input and textarea focus states
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      input:focus, textarea:focus {
        border-color: #9370db !important;
        background-color: #fff !important;
        box-shadow: 0 0 0 3px rgba(147, 112, 219, 0.15) !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check if file is an image
      if (!selectedFile.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      setSelectedFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      
      setError('');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setError('Please enter a name for your memorial');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    if (!selectedFile) {
      setError('Please upload an image');
      return;
    }
    
    try {
      setLoading(true);
      console.log(`Creating memorial with color: ${birdColor}`); // Debug log
      
      // Pass the bird color to the uploadDrawing function
      await uploadDrawing(selectedFile, name, message, 'dove', birdColor);
      setLoading(false);
      
      // Show animation before navigating
      setIsAnimating(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setLoading(false);
      setError('Error creating memorial bird. Please try again.');
      console.error('Upload error:', error);
    }
  };
  
  // Handle file upload click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Move to next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    // Clear any previous errors when moving to next step
    setError('');
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Move to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    // Clear any previous errors when moving to previous step
    setError('');
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Bird release animation
  useEffect(() => {
    if (isAnimating && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      let birdY = canvas.height / 2;
      let birdX = canvas.width / 2;
      let birdSize = 20;
      let opacity = 1;
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bird with the selected color
        const r = parseInt(birdColor.slice(1, 3), 16);
        const g = parseInt(birdColor.slice(3, 5), 16);
        const b = parseInt(birdColor.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        
        // Draw dove shape
        ctx.beginPath();
        // Body
        ctx.ellipse(birdX, birdY, birdSize, birdSize/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(birdX + birdSize/1.5, birdY - birdSize/4, birdSize/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Wings
        ctx.beginPath();
        ctx.ellipse(birdX - birdSize/4, birdY - birdSize/2, birdSize/1.5, birdSize/4, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(birdX - birdSize/4, birdY + birdSize/2, birdSize/1.5, birdSize/4, -Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.beginPath();
        ctx.moveTo(birdX - birdSize, birdY);
        ctx.lineTo(birdX - birdSize*1.5, birdY - birdSize/3);
        ctx.lineTo(birdX - birdSize*1.5, birdY + birdSize/3);
        ctx.closePath();
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(birdX, birdY, birdSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.1})`;
        ctx.fill();
        
        // Update position and size
        birdY -= 2;
        birdX += Math.sin(birdY / 20) * 2;
        birdSize = Math.max(5, birdSize - 0.2);
        opacity = Math.max(0, opacity - 0.01);
        
        if (birdY > -birdSize && opacity > 0) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animate();
      
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isAnimating, birdColor]);
  
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      background: 'linear-gradient(135deg, #614385, #516395)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto',
      padding: '20px 0'
    }}>
      {isAnimating ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: 'linear-gradient(135deg, #614385, #516395)'
        }}>
          <canvas ref={canvasRef} width={800} height={600} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }} />
          <div style={{
            textAlign: 'center',
            color: 'white',
            zIndex: 2,
            animation: 'fadeIn 1s ease',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '30px',
            borderRadius: '15px',
            backdropFilter: 'blur(5px)',
            maxWidth: '500px'
          }}>
            <h2 style={{
              fontSize: '32px',
              marginBottom: '15px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>Your memorial bird is taking flight...</h2>
            <p style={{
              fontSize: '18px',
              opacity: 0.9,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              lineHeight: 1.6
            }}>Carrying your love and memories into the eternal sky</p>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
          width: '95%',
          maxWidth: '800px',
          margin: '20px auto',
          position: 'relative',
          overflow: 'visible',
          boxSizing: 'border-box',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '6px',
            background: 'linear-gradient(90deg, #9370db, #614385, #516395)'
          }}></div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <button 
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#666',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Return to Memorial Sky
            </button>
          </div>
          
          <h2 style={{
            marginBottom: '25px',
            color: '#333',
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: 600
          }}>Share Your Memory</h2>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '30px',
            padding: '0 10px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep >= 1 ? '#9370db' : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                color: currentStep >= 1 ? 'white' : '#999',
                marginBottom: '10px',
                transition: 'all 0.3s ease',
                boxShadow: currentStep >= 1 ? '0 0 0 5px rgba(147, 112, 219, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)' : '0 2px 5px rgba(0, 0, 0, 0.1)'
              }}>1</div>
              <div style={{
                fontSize: '14px',
                color: currentStep >= 1 ? '#9370db' : '#999',
                fontWeight: currentStep >= 1 ? 600 : 500,
                transition: 'all 0.3s ease'
              }}>Personalize</div>
            </div>
            <div style={{
              flex: 1,
              height: '3px',
              background: '#f0f0f0',
              position: 'relative',
              zIndex: 0
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: currentStep >= 2 ? '100%' : currentStep >= 1 ? '50%' : '0',
                background: '#9370db',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep >= 2 ? '#9370db' : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                color: currentStep >= 2 ? 'white' : '#999',
                marginBottom: '10px',
                transition: 'all 0.3s ease',
                boxShadow: currentStep >= 2 ? '0 0 0 5px rgba(147, 112, 219, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)' : '0 2px 5px rgba(0, 0, 0, 0.1)'
              }}>2</div>
              <div style={{
                fontSize: '14px',
                color: currentStep >= 2 ? '#9370db' : '#999',
                fontWeight: currentStep >= 2 ? 600 : 500,
                transition: 'all 0.3s ease'
              }}>Share</div>
            </div>
            <div style={{
              flex: 1,
              height: '3px',
              background: '#f0f0f0',
              position: 'relative',
              zIndex: 0
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: currentStep >= 3 ? '100%' : '0',
                background: '#9370db',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep >= 3 ? '#9370db' : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                color: currentStep >= 3 ? 'white' : '#999',
                marginBottom: '10px',
                transition: 'all 0.3s ease',
                boxShadow: currentStep >= 3 ? '0 0 0 5px rgba(147, 112, 219, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)' : '0 2px 5px rgba(0, 0, 0, 0.1)'
              }}>3</div>
              <div style={{
                fontSize: '14px',
                color: currentStep >= 3 ? '#9370db' : '#999',
                fontWeight: currentStep >= 3 ? 600 : 500,
                transition: 'all 0.3s ease'
              }}>Release</div>
            </div>
          </div>
          
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              color: '#d32f2f',
              padding: '12px 15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              borderLeft: '3px solid #d32f2f',
              animation: 'fadeIn 0.3s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Choose Color and Upload Image */}
            {currentStep === 1 && (
              <div className="step-content">
                <h3 style={{ 
                  fontSize: '22px', 
                  color: '#333',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>Add a Photo or Keepsake</h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  Choose a color for your memorial dove and upload a photo or image that reminds you of them.
                </p>
                
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    marginBottom: '12px', 
                    color: '#333',
                    fontWeight: '500'
                  }}>Select a color for your dove</h3>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '12px',
                    justifyContent: 'center' 
                  }}>
                    {colorOptions.map((color) => (
                      <div
                        key={color.id}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: color.value,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: birdColor === color.value 
                            ? '2px solid #4a90e2' 
                            : '2px solid transparent',
                          boxShadow: birdColor === color.value 
                            ? '0 0 0 2px rgba(74, 144, 226, 0.3)' 
                            : 'none',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        onClick={() => setBirdColor(color.value)}
                      >
                        {birdColor === color.value && (
                          <div style={{
                            color: ['#ffffff', '#f5f5f5', '#e6e6fa'].includes(color.value) ? '#333' : 'white',
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}>✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    marginBottom: '12px', 
                    color: '#333',
                    fontWeight: '500'
                  }}>Upload a photo or drawing</h3>
                  <div 
                    style={{
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#f9f9f9',
                      transition: 'all 0.2s ease',
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={handleUploadClick}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {!selectedFile ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          backgroundColor: '#e6f2ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '8px'
                        }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#4a90e2"/>
                          </svg>
                        </div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#555' }}>
                          Drag and drop an image here, or click to select
                        </p>
                        <span style={{ 
                          fontSize: '13px', 
                          color: '#888',
                          display: 'block'
                        }}>
                          Recommended: Square image, 500x500 pixels or larger
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        minHeight: '200px'
                      }}>
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            borderRadius: '4px'
                          }}
                        />
                        <button 
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s ease'
                          }}
                          onClick={() => setSelectedFile(null)}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="white"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '24px',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      backgroundColor: 'transparent',
                      color: currentStep === 1 ? '#ccc' : '#555',
                      cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: '500',
                      flex: '1'
                    }}
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: !selectedFile ? '#ccc' : '#4a90e2',
                      color: 'white',
                      cursor: !selectedFile ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: '500',
                      flex: '1'
                    }}
                    onClick={nextStep}
                    disabled={!selectedFile}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Enter Details */}
            {currentStep === 2 && (
              <div className="step-content">
                <h3 style={{ 
                  fontSize: '22px', 
                  color: '#333',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>Share Your Thoughts</h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  Tell us how you'd like to be identified and share a special memory or message in their honor.
                </p>
                
                <div style={{ marginBottom: '24px' }}>
                  <label 
                    htmlFor="name" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      fontSize: '16px',
                      color: '#555',
                      fontWeight: '500'
                    }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={loading}
                    className={name ? 'has-value' : ''}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      fontSize: '16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#333',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  />
                  {!name && <div style={{ 
                    fontSize: '13px', 
                    color: '#888',
                    marginTop: '4px'
                  }}>This field is required</div>}
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <label 
                    htmlFor="message" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      fontSize: '16px',
                      color: '#555',
                      fontWeight: '500'
                    }}
                  >
                    Your Memory or Message
                  </label>
                  <div style={{
                    position: 'relative',
                    marginBottom: '4px'
                  }}>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share a memory, message, or what they meant to you..."
                      rows={5}
                      disabled={loading}
                      className={message ? 'has-value' : ''}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        boxSizing: 'border-box',
                        color: '#333',
                        minHeight: '120px',
                        resize: 'vertical',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                        lineHeight: '1.5',
                      }}
                    />
                    <button 
                      type="button" 
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        color: '#4a90e2',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => setShowBiographyGenerator(true)}
                      disabled={loading}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Help Me Write
                    </button>
                  </div>
                  {!message && (
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#888',
                      marginTop: '4px'
                    }}>
                      This field is required
                    </div>
                  )}
                </div>

                {showBiographyGenerator && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(3px)'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '24px',
                      width: '90%',
                      maxWidth: '600px',
                      maxHeight: '80vh',
                      overflow: 'auto',
                      position: 'relative',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}>
                      <button 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          fontSize: '24px',
                          lineHeight: '24px',
                          cursor: 'pointer',
                          color: '#999',
                          padding: '4px 8px'
                        }}
                        onClick={() => setShowBiographyGenerator(false)}
                      >
                        ×
                      </button>
                      <BiographyGenerator 
                        onSelectBiography={(biography) => {
                          setMessage(biography);
                          setShowBiographyGenerator(false);
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '24px',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      backgroundColor: 'transparent',
                      color: currentStep === 1 ? '#ccc' : '#555',
                      cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: '500',
                      flex: '1'
                    }}
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: !name.trim() || !message.trim() ? '#ccc' : '#4a90e2',
                      color: 'white',
                      cursor: !name.trim() || !message.trim() ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: '500',
                      flex: '1'
                    }}
                    onClick={nextStep}
                    disabled={!name.trim() || !message.trim()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Review and Submit */}
            {currentStep === 3 && (
              <div className="step-content">
                <h3 style={{ 
                  fontSize: '22px', 
                  color: '#333',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>Review Your Tribute</h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  Please review your memory before adding it to our shared memorial space.
                </p>
                
                <div style={{
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ 
                        fontSize: '16px', 
                        color: '#555',
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>Image</h4>
                      <div style={{
                        width: '100%',
                        maxWidth: '200px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ 
                        fontSize: '16px', 
                        color: '#555',
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>Color</h4>
                      <div style={{ 
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: birdColor,
                        border: '2px solid #eee',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                      }}></div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ 
                        fontSize: '16px', 
                        color: '#555',
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>Name</h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#333',
                        margin: 0
                      }}>{name}</p>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ 
                        fontSize: '16px', 
                        color: '#555',
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>Message</h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#333',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>{message}</p>
                    </div>
                  </div>
                </div>
                
                <div className="release-note">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ float: 'left', marginRight: '10px' }}>
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="#9370db"/>
                  </svg>
                  <p>
                    When you release this dove, your memory will join others in our shared memorial space. 
                    Each message is a tribute to their legacy and a testament to how they touched our lives.
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '24px',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      backgroundColor: 'transparent',
                      color: currentStep === 2 ? '#ccc' : '#555',
                      cursor: currentStep === 2 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: '500',
                      flex: '1'
                    }}
                    onClick={prevStep}
                    disabled={currentStep === 2}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: loading ? '#ccc' : '#9370db',
                      color: 'white',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: '500',
                      flex: '1',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '50%',
                          borderTopColor: 'white',
                          animation: 'spin 1s ease-in-out infinite'
                        }}></div>
                        Creating...
                      </>
                    ) : (
                      'Release Your Memorial Dove'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
      
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTopColor: 'white',
            animation: 'spin 1s ease-in-out infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{
            color: 'white',
            fontSize: '20px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>Creating your memorial dove...</p>
        </div>
      )}
    </div>
  );
};

export default UploadDrawing;

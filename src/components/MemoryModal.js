import React from 'react';

const MemoryModal = ({ memory, onClose }) => {
  if (!memory) return null;

  return (
    <div className="memory-modal">
      <div className="memory-header">
        <h2>A Tribute from {memory.name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="memory-content">
        <div className="drawing-container">
          <img 
            src={memory.drawingUrl} 
            alt={`A cherished memory shared by ${memory.name}`} 
            className="memory-drawing"
          />
        </div>
        
        <div className="message-container">
          <p className="memory-message">{memory.message}</p>
          <p className="memory-signature">— Shared with love by {memory.name}</p>
        </div>
      </div>
    </div>
  );
};

export default MemoryModal;

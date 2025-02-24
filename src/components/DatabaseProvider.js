import React, { createContext, useContext, useState } from 'react';
import dbService from '../db';

// Create Database context
const DatabaseContext = createContext();

// Custom hook to use the database
export const useDatabase = () => useContext(DatabaseContext);

const DatabaseProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Upload a drawing and its associated memory
  const uploadDrawing = async (drawingFile, name, message, birdType = 'dove', birdColor = '#ffffff') => {
    try {
      setIsLoading(true);
      console.log(`DatabaseProvider: Uploading with color ${birdColor}`); // Debug log
      const result = await dbService.addMemory(drawingFile, name, message, birdType, birdColor);
      return result;
    } catch (error) {
      console.error('Error uploading drawing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get all memories
  const getMemories = async () => {
    try {
      setIsLoading(true);
      const memories = await dbService.getMemories();
      return memories;
    } catch (error) {
      console.error('Error getting memories:', error);
      // Return empty array on error
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Value to be provided to consumers
  const value = {
    uploadDrawing,
    getMemories,
    isLoading
  };
  
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider; 
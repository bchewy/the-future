import { v4 as uuidv4 } from 'uuid';

// Sample memories about a single person from different loved ones
const sampleMemories = [
  {
    id: '1',
    name: 'Michael, son',
    message: 'Dad, I still hear your voice guiding me through difficult decisions. Your wisdom lives on in everything I do. I remember how you taught me to fish at our cabin, patiently showing me how to cast the line just right. Those Saturday mornings working on the car together taught me more than just mechanics—they taught me about life, persistence, and the value of hard work.',
    drawingUrl: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-04-15T12:00:00Z',
    position: { x: -10, y: 4, z: -5 },
    flyingPattern: 'hover',
    birdType: 'dove',
    birdColor: '#ffffff'
  },
  {
    id: '2',
    name: 'Emma, daughter',
    message: 'Dad, you taught me strength in the face of adversity. When I face challenges, I remember how you never gave up, even in your final days. I cherish the memory of you walking me down the aisle, and how you always made time to attend every recital and game, no matter how busy you were at work. Your laugh could fill a room, and I still hear it when I think of the silly jokes you used to tell.',
    drawingUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2022-09-12T09:15:00Z',
    position: { x: -8, y: 6, z: 15 },
    flyingPattern: 'hover',
    birdType: 'dove',
    birdColor: '#9370db'
  },
  {
    id: '3',
    name: 'Sarah, wife',
    message: 'To my beloved husband of 45 years: Our dance continues, just in different realms now. I look for signs of you in every sunset. I miss our morning coffee conversations and the way you would quietly bring me flowers "just because." Your kindness to everyone you met, your integrity in all your dealings, and your unwavering love for our family created a legacy that continues to inspire all who knew you.',
    drawingUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-07-07T18:20:00Z',
    position: { x: 18, y: 3, z: 3 },
    flyingPattern: 'hover',
    birdType: 'dove',
    birdColor: '#ffb6c1'
  }
];

// Simplified database service - no Electron
const dbService = {
  // Get all memories
  getMemories: async () => {
    console.log('Using sample memories');
    return sampleMemories;
  },

  // Add a new memory
  addMemory: async (drawingFile, name, message, birdType = 'dove', birdColor = '#ffffff') => {
    const memoryId = uuidv4();
    
    // Create memory object
    const memoryData = {
      id: memoryId,
      name,
      message,
      createdAt: new Date().toISOString(),
      position: {
        x: Math.random() * 40 - 20, // Random position between -20 and 20
        y: Math.random() * 6 + 2,   // Lower height between 2 and 8
        z: Math.random() * 40 - 20  // Random position between -20 and 20
      },
      flyingPattern: 'hover', 
      birdType: 'dove',
      birdColor
    };
    
    // Create object URL for the drawing
    memoryData.drawingUrl = URL.createObjectURL(drawingFile);
    
    // Add new memory to the beginning of the array
    sampleMemories.unshift(memoryData);
    
    return memoryData;
  }
};

export default dbService; 
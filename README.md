# Sky of Memories

A communal space for people to share memories of loved ones through drawings that appear as birds in a virtual sky.

## Project Overview

Sky of Memories is an interactive memorial application that allows users to:

1. Upload drawings that transform into birds flying in a virtual sky
2. Attach personal messages or memories to each drawing
3. Click on birds to view the associated memories
4. Generate heartfelt farewell messages using templates

This project was inspired by interactive art installations like those created by teamLab, bringing a digital communal space for remembrance and reflection.

## Features

- **3D Sky Environment**: A beautiful, immersive sky scene with stars and gentle animations
- **Interactive Birds**: Each bird represents a drawing uploaded by a user
- **Memory Sharing**: Users can upload drawings and attach personal messages
- **Message Generator**: Helps users craft meaningful farewell messages
- **Responsive Design**: Works on both desktop and mobile devices
- **Offline Storage**: Uses SQLite for local storage of memories

## Technical Implementation

- **Frontend**: React with React Three Fiber for 3D rendering
- **3D Graphics**: Three.js for the 3D environment and bird animations
- **Storage**: Local SQLite database for storing drawings and memory data
- **Desktop App**: Electron for cross-platform desktop application
- **Routing**: React Router for navigation between views

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Running as Desktop App with SQLite

1. Start the React development server:
   ```
   npm start
   ```
2. In a separate terminal, start the Electron app:
   ```
   npm run electron-dev
   ```
3. For production build:
   ```
   npm run electron-build
   ```
4. To package the app for distribution:
   ```
   npm run package
   ```

## Usage

### Viewing Memories

- Visit the home page to see the memorial sky with birds
- Click on any bird to view the associated memory
- Use the camera controls to navigate the 3D space

### Adding a Memory

1. Click the "Create Memory" button
2. Enter your name and a message
3. Upload a drawing or use the "Generate Message" feature for help with the text
4. Submit to add your memory to the sky

## Future Enhancements

- Drawing canvas for creating drawings directly in the app
- VR support for immersive viewing experience
- Additional bird animations and interactions
- Audio messages attachment
- Timeline view of memories
- Private memorial spaces for families

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by teamLab's interactive art installations
- Created as a compassionate space for remembrance and healing

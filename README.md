# Forever in Our Hearts

A beautiful, interactive memorial web application that allows family and friends to share and preserve memories of a loved one who has passed away.

## About the Application

Forever in Our Hearts is a digital memorial space where family and friends can contribute their personal memories, tributes, and photographs to honor someone special. These shared memories take the form of doves flying in a beautiful interactive sky, creating a peaceful, collective memorial experience.

## Features

- **Interactive Memorial Sky**: A serene 3D environment where memory doves fly
- **Memory Sharing**: Add your personal tributes with photos and heartfelt messages
- **Customizable Doves**: Choose colors for your memorial doves to represent your connection
- **Message Templates**: Helpful templates to inspire your tribute messages
- **Atmospheric Themes**: Select from various sky themes to change the memorial atmosphere
- **Responsive Design**: Accessible on desktop and mobile devices

## Technical Overview

- **Frontend**: Built with React and styled with inline styles for a clean, modern UI
- **3D Graphics**: Powered by Three.js (via React Three Fiber) for immersive sky and dove animation
- **Memory Storage**: Uses browser storage for persistence
- **Routing**: React Router for page navigation

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
4. Open your browser to `http://localhost:3000`

## Usage Guide

### Viewing the Memorial

- Visit the home page to see the memorial sky with flying doves
- Click on any dove to view the associated memory and photo
- Use the camera controls to navigate the 3D space
- Change the sky theme using the "Change Sky Theme" button in the top right

### Adding Your Memory

1. Click the "Share Your Memory" button at the bottom of the screen
2. Follow the 3-step process:
   - **Personalize**: Choose a dove color and upload a photo
   - **Share**: Write your name and message (use the "Help Me Write" button for inspiration)
   - **Release**: Review your tribute and release your memorial dove
3. Watch as your dove takes flight and joins others in the memorial sky

## Customization

The application can be customized in several ways:

- **Sky Themes**: Choose from Peaceful Sunset, Starry Night, New Dawn, Ethereal Realm, or Clear Daylight
- **Dove Colors**: Select from ten different colors to represent your relationship or feeling
- **Memory Messages**: Write your own or use the provided templates for inspiration

## Project Structure

- `/src/components/` - React components for the UI
- `/src/components/Bird.js` - 3D dove rendering and animation
- `/src/components/MemorialSky.js` - Main memorial view with 3D sky
- `/src/components/UploadDrawing.js` - Interface for adding new memories
- `/src/components/BiographyGenerator.js` - Message templates
- `/src/db.js` - Memory storage implementation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

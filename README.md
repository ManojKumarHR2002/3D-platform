# 3D Platform with React Fiber

An interactive 3D platform built using **React Fiber** and **Three.js**. This platform allows real-time camera controls, object interaction, and dynamic animations to create immersive web experiences.

## Features

- **React Fiber & Three.js**: Efficient 3D rendering for interactive scenes.
- **Camera Controls**: Smooth, real-time camera movement and object interaction.
- **Animations**: Support for dynamic object animations.
- **Responsive Design**: Optimized for all device types.
- **Modular Architecture**: Reusable React components for better scalability.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   
2. Navigate to the project directory:
   ```bash
    cd your-repo-name
  
3. Install dependencies:
   ```bash
    npm install

4. Configure Supabase

   - Set up a Supabase project.

   - Create a private bucket in Supabase storage to store the 3D models.

   - Copy your Supabase URL, anonymous key, and bucket name, then add them to a .env file in the project root:
      ```bash
      VITE_SUPABASE_URL=<your-supabase-url>
      VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
      VITE_SUPABASE_BUCKET_NAME=<your-supabase-bucket-name>

5. Create a Custom Policy for Storage Access

   1. To allow the anon role to SELECT, INSERT, UPDATE, and DELETE objects in the Supabase storage bucket:

   2. Go to Supabase Dashboard → Storage.

   3. Select your bucket.

   4. Navigate to the Policies tab.

      - Click New Policy and set the following values:

      - Policy Name: Allow anon full access

      - Role: anon

      - Permissions: SELECT, INSERT, UPDATE, DELETE

   5. Click Save Policy.

5. Start the development server:
   ```bash
    npm run dev

The application will be available at http://localhost:3000.

## Usage

- Use your mouse or touch gestures to move the camera around.
- Interact with objects within the 3D scene by clicking or hovering over them.
- Animations will play based on user interactions.
  
## Built With

- **React Fiber** - React renderer for Three.js
- **Three.js** - JavaScript 3D library for rendering
- **@react** - three/drei - Useful helpers for React Fiber
- **React** - JavaScript library for building user interfaces

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with improvements or features.
  

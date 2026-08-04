import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import HoloCart3D from './HoloCart3D.jsx'

function App() {
  const [showHolo, setShowHolo] = useState(false);

  useEffect(() => {
    const handleToggle = (e) => {
      setShowHolo(e.detail.show);
    };
    window.addEventListener('toggleHoloCart', handleToggle);
    
    // Check initial state
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer && cartItemsContainer.innerHTML.includes('vazio')) {
        setShowHolo(true);
    }
    
    return () => window.removeEventListener('toggleHoloCart', handleToggle);
  }, []);

  if (!showHolo) return null;

  return (
    <Canvas 
        camera={{ position: [0, 2, 8], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
    >
      <React.Suspense fallback={null}>
        <HoloCart3D />
      </React.Suspense>
    </Canvas>
  );
}

function initReactApp() {
  const container = document.getElementById('holo-container');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
}

// Inicia imediatamente (o container já deve existir no HTML)
initReactApp();

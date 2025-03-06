import Image from "next/image";
import Header from './components/Header';
import UnityLoader from './components/UnityLoader';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <Header />
      
      <main className="flex-1 relative">
        <div id="unity-container">
          <canvas id="unity-canvas" tabIndex="-1"></canvas>
          <div id="unity-loading-bar">
            <div id="unity-logo"></div>
            <div id="unity-progress-bar-empty">
              <div id="unity-progress-bar-full"></div>
            </div>
          </div>
          <div id="unity-warning"></div>
          <div className="absolute bottom-4 right-4">
            <button className="fullscreen-button">Fullscreen</button>
          </div>
        </div>
        <UnityLoader />
      </main>
    </div>
  );
}

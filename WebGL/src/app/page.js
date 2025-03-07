import Image from "next/image";
import Header from './components/Header';
import UnityLoader from './components/UnityLoader';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      <Header />
      
      <main className="flex-1 relative w-full h-[calc(100vh-110px)]">
        <div id="unity-container" className="w-full h-full">
          <canvas id="unity-canvas" className="w-full h-full bg-[#1a1a1a]" tabIndex="-1"></canvas>
          <div id="unity-loading-bar" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden">
            <div id="unity-logo" className="w-[154px] h-[130px] bg-[url('/TemplateData/unity-logo-dark.png')] bg-no-repeat bg-center"></div>
            <div id="unity-progress-bar-empty" className="w-[141px] h-[18px] mt-[10px] ml-[6.5px] bg-[url('/TemplateData/progress-bar-empty-dark.png')] bg-no-repeat bg-center">
              <div id="unity-progress-bar-full" className="w-0 h-[18px] mt-[10px] bg-[url('/TemplateData/progress-bar-full-dark.png')] bg-no-repeat bg-center"></div>
            </div>
          </div>
          <div id="unity-warning" className="absolute left-1/2 top-[5%] transform -translate-x-1/2 bg-white p-[10px] hidden"></div>
          <div className="absolute bottom-4 left-4">
            <button className="fullscreen-button bg-[#2a2a2a] hover:bg-[#444] text-white py-2 px-4 rounded cursor-pointer transition-colors duration-200 text-sm">Fullscreen</button>
          </div>
        </div>
        <UnityLoader />
      </main>
      
      <Footer />
    </div>
  );
}

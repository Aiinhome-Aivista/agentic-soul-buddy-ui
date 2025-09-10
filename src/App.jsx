import { BrowserRouter } from "react-router-dom";
import Index from "./common/routes/Index";
import { ContextProvider } from "./common/helper/Context";
import VideoBackground from "./common/background/Videobackground";
import DarkVeil from "./common/background/DarkVeil";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const App = () => (
  <PrimeReactProvider>
    <div className="overflow-hidden bg-black/50" style={{ width: '100%', height: '100%', position: 'relative', padding: 0, margin: 0 }}>
      <ContextProvider>
        <div
          className="w-full h-full"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, opacity: 0.6 }}
        >
          <VideoBackground />
          <DarkVeil hueShift={186} speed={1} />
        </div>
        <BrowserRouter>
          <Index />
        </BrowserRouter>
      </ContextProvider>
    </div>
  </PrimeReactProvider>
);

export default App;

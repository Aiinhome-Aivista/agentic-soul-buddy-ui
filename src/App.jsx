import { BrowserRouter } from "react-router-dom";
import Index from "./common/routes/Index";
import { ContextProvider } from "./common/helper/Context";
import SeoHelper from "./common/helper/SeoHelper";
import VideoBackground from "./common/background/VideoBackground";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const App = () => (
  <PrimeReactProvider>
    <div className="overflow-y-auto bg-black/50" style={{ width: '100%', height: '100%', position: 'relative', padding: 0, margin: 0 }}>
      <ContextProvider>
        <div
          className="w-full h-full"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        >
          <VideoBackground />
          {/* <DarkVeil hueShift={186} speed={1} /> */}
        </div>
        <BrowserRouter basename="/devloperzn/">
          <SeoHelper />
          <Index />
        </BrowserRouter>
      </ContextProvider>
    </div>
  </PrimeReactProvider>
);

export default App;

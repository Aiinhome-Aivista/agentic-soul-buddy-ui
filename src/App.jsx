import { BrowserRouter } from "react-router-dom";
import Galaxy from "./common/background/GalaxyBackground";
import Index from "./common/routes/Index";
import { ContextProvider } from "./common/helper/Context";

const App = () => (
  <div className="overflow-hidden" style={{ width: '100%', height: '100%', position: 'relative', padding: 0, margin: 0 }}>
    <ContextProvider>
      {/* <VantaBackground /> */}
      <div
        className="w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      >
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={false}
          density={1}
          glowIntensity={0.4}
          saturation={0.5}
          hueShift={240}
        />
      </div>
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    </ContextProvider>
  </div>
);

export default App;

import { BrowserRouter } from "react-router-dom";
import Galaxy from "./common/background/GalaxyBackground";
import Index from "./common/routes/Index";

const App = () => (
  <div className="overflow-hidden" style={{ width: '100%', height: '100%', position: 'relative', padding: 0, margin: 0 }}>
    <div
      className="w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
    >
      <Galaxy
        mouseRepulsion={true}
        mouseInteraction={false}
        density={1.5}
        glowIntensity={0.5}
        saturation={0.8}
        hueShift={240}
      />
    </div>
    <BrowserRouter>
      <Index />
    </BrowserRouter>
  </div>
);

export default App;

import { BrowserRouter } from "react-router-dom";
import Index from "./common/routes/Index";
import { ContextProvider } from "./common/helper/Context";
import { ThemeProvider } from "./common/helper/ThemeContext";
import VideoBackground from "./common/background/VideoBackground";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const App = () => (
  <PrimeReactProvider>
    <ThemeProvider>
      <div className="overflow-y-auto bg-background-light dark:bg-background-dark transition-colors duration-300" style={{ width: '100%', height: '100%', position: 'relative', padding: 0, margin: 0 }}>
        <ContextProvider>
          <div
            className="w-full h-full dark:opacity-60"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, opacity: 0.6 }}
          >
            <VideoBackground />
            {/* <DarkVeil hueShift={186} speed={1} /> */}
          </div>
          <BrowserRouter>
            <Index />
          </BrowserRouter>
        </ContextProvider>
      </div>
    </ThemeProvider>
  </PrimeReactProvider>
);

export default App;

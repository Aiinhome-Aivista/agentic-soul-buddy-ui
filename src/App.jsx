import { BrowserRouter } from "react-router-dom";
import Index from "./common/routes/Index";
import { ContextProvider } from "./common/helper/Context";
import { ThemeProvider } from "./common/helper/ThemeContext";
import VideoBackground from "./common/background/VideoBackground";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const App = () => (
  <PrimeReactProvider>
    <ThemeProvider>
      <div className="overflow-y-auto transition-colors duration-300" style={{ width: '100%', height: '100%', position: 'relative', padding: 0, margin: 0 }}>
        <VideoBackground />
        <ContextProvider>
          <BrowserRouter>
            <Index />
          </BrowserRouter>
        </ContextProvider>
      </div>
    </ThemeProvider>
  </PrimeReactProvider>
);

export default App;

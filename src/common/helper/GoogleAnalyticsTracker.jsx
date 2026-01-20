import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GoogleAnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', 'G-K9SH6JXNEM', {
                page_path: location.pathname + location.search
            });
        }
    }, [location]);

    return null;
};

export default GoogleAnalyticsTracker;

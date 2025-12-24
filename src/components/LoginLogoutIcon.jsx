import React, { useContext } from "react";
import { Context } from "../common/helper/Context";

function LoginLogoutIcon({ handleStop }) {
    const { isLoggedIn, setIsLoggedIn, setAudioUrl, setLoginModal } = useContext(Context);

    const handleClick = () => {
        if (isLoggedIn) {
            // Clear all storage first
            localStorage.removeItem('userId');
            localStorage.removeItem('sessionId');
            localStorage.clear();
            sessionStorage.clear();

            // Then update state
            setIsLoggedIn(false);
            if (handleStop) handleStop();
            setAudioUrl(null);

            // Force page reload to ensure complete logout
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } else {
            setLoginModal(true)
        }
    };

    return (
        <div
            className="relative flex items-center gap-2 w-[4.8rem] h-[1.7rem] overflow-hidden rounded-[1rem] border-2 border-[#333333] bg-[#474747]/22 px-1.5 cursor-pointer"
            onClick={handleClick}>
            {/* When logged out: knob left, show Login on the right */}
            {!isLoggedIn && (
                <>
                    <span className="invisible text-[0.75rem] font-medium">.</span>
                    <span className="ml-auto text-[0.75rem] font-medium text-[#7D7E7F] pointer-events-none">
                        Sign In
                    </span>
                </>
            )}

            {/* When logged in: knob right, show Logout on the left */}
            {isLoggedIn && (
                <>
                    <span className="pr-[0.5rem] text-[0.75rem] font-medium text-[#7D7E7F] pointer-events-none">
                        Logout
                    </span>
                    <span className="invisible text-[0.75rem] font-medium">.</span>
                </>
            )}

            {/* Knob */}
            <div
                className={`absolute top-[0.25rem] left-[0.25rem] h-[1rem] w-[1rem] rounded-full bg-[#d9d9d9]/54 transition-transform duration-300 ease-in-out pointer-events-none ${isLoggedIn ? "translate-x-[2.8rem]" : "translate-x-0"
                    }`}
            />
        </div>
    );
}

export default LoginLogoutIcon;
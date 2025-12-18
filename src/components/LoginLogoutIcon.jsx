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
            handleStop();
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
            className="relative flex items-center justify-between w-[4.3rem] h-[1.7rem] overflow-hidden rounded-[1rem] border-2 border-[#333333] bg-[#474747]/22 px-1">
            {/* When logged out: knob left, show Login on the right */}
            {!isLoggedIn && (
                <>
                    <span className="invisible text-[0.75rem] font-medium">.</span>
                    <span className="cursor-default ml-auto text-[0.75rem] pr-[0.376rem] font-medium text-[#7D7E7F]">
                        Login
                    </span>
                </>
            )}

            {/* When logged in: knob right, show Logout on the left */}
            {isLoggedIn && (
                <>
                    <span className="cursor-pointer text-[0.75rem] font-medium text-[#7D7E7F]" onClick={handleClick}>
                        Logout
                    </span>
                    <span className="invisible text-[0.75rem] font-medium">.</span>
                </>
            )}

            {/* Knob */}
            <div
                className={`cursor-pointer absolute top-[0.25rem] h-[1rem] w-[1rem] rounded-full bg-[#d9d9d9]/54 transition-transform duration-300 ease-in-out ${isLoggedIn ? "translate-x-[2.59rem]" : "translate-x-0"
                    }`}
                onClick={handleClick}
            />
        </div>
    );
}

export default LoginLogoutIcon;
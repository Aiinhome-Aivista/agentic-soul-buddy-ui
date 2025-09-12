import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Context } from "../common/helper/Context";

function LoginLogoutIcon() {
    const { isLoggedIn, setLoginModal, setIsLoggedIn } = useContext(Context);

    const handleClick = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
            sessionStorage.clear();
        } else {
            setLoginModal(true);
        }
    };

    return (
        <div
            className="relative flex items-center justify-center w-[130px] h-[36px] rounded-3xl bg-[#474747]/30 border border-gray-500 cursor-pointer overflow-hidden"
            onClick={handleClick}
        >
            {/* Sliding Circle (background only) */}
            <motion.div
                initial={false}
                animate={{ x: isLoggedIn ? 92 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-[3px] left-[3px] h-[30px] w-[30px] rounded-full bg-[#d9d9d9]/80"
            />

            {/* Text always centered and above circle */}
            <span className="z-10 text-sm font-semibold text-white">
                {isLoggedIn ? "Logout" : "Login"}
            </span>
        </div>
    );
}

export default LoginLogoutIcon;
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
            setIsLoggedIn(true);
        }
    };

    return (
        <div
            className="relative flex items-center justify-center w-[113px] h-[41px]  cursor-pointer overflow-hidden "
               style={{
    background:"rgba(36, 33, 33, 1)",
        border: "2px solid #474747",
        borderRadius: "29px",
        
      }}
            onClick={handleClick}
        >
            {/* Sliding Circle (background only) */}
            <motion.div
                initial={false}
                animate={{ x: isLoggedIn ? 77 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-[5px] left-[3px] h-[28px] w-[28px] rounded-full bg-[#d9d9d9]/54 "
            />

            {/* Text always centered and above circle */}
             <div className="flex items-center justify-center w-full z-10">
             <span
              style={{
            fontSize: "18px",
            fontWeight: 500,
            fontFamily: "'Nunito', sans-serif",
            color:"#7D7E7F"
          }}
          className={` ${
            isLoggedIn ? "mr-6" : "ml-6"
          }`}
        >
            {isLoggedIn ? "Logout" : "Login"}
        </span>
            </div>
        </div>
    );
}

export default LoginLogoutIcon;
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../common/helper/Context";
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

function LoginLogoutIcon({ handleStop }) {
    const { isLoggedIn, setIsLoggedIn, setAudioUrl, setLoginModal, setDisclaimerModal, setContactModal, setProfileModal, setFaqModal, setAccountModal } = useContext(Context);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Get user name from localStorage and extract initials
    const userName = localStorage.getItem('name') || '';
    const getInitials = (name) => {
        if (!name) return '';
        const words = name.trim().split(' ').filter(word => word.length > 0);
        if (words.length === 0) return '';
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };
    const initials = getInitials(userName);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear all storage first
        localStorage.removeItem('userId');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('name');
        localStorage.clear();
        sessionStorage.clear();

        // Then update state
        setIsLoggedIn(false);
        if (handleStop) handleStop();
        setAudioUrl(null);
        setShowDropdown(false);

        // Redirect to intro page
        navigate('/');
    };

    const handleMenuClick = (action) => {
        setShowDropdown(false);
        switch (action) {
            case 'profile':
                setProfileModal(true);
                break;
            case 'account':
                setAccountModal(true);
                break;
            case 'Terms & Conditions':
                navigate('/terms');
                break;
            case 'disclaimer':
                navigate('/disclaimer');
                break;
            case 'contact':
                navigate('/contact');
                break;
            case 'faq':
                setFaqModal(true);
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                break;
        }
    };

    const handleSignIn = () => {
        setLoginModal(true);
    };

    // When logged in, show user profile with initials and name
    if (isLoggedIn) {
        return (
            <div className="relative" ref={dropdownRef}>
                {/* Header - Name Section (always visible) */}
                <div
                    className={`flex items-center gap-2 p-1 h-[2.5rem] rounded-2xl border-2 border-[#333333] bg-[#474747]/22 backdrop-blur-md cursor-pointer hover:bg-[#474747]/40 transition-all duration-300 ${showDropdown ? 'opacity-0' : 'opacity-100'
                        }`}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    {/* Initials Icon */}
                    <div className="w-6 h-6 rounded-full bg-[#d9d9d9]/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[0.65rem] font-semibold text-[#d9d9d9]">
                            {initials}
                        </span>
                    </div>
                    {/* User Name */}
                    <span className="text-[0.75rem] font-medium text-[#d9d9d9]/80 truncate">
                        {userName}
                    </span>
                </div>

                {/* Expandable Menu - Absolute positioned overlay */}
                <div
                    className="absolute top-0 right-0 flex flex-col rounded-2xl border-2 border-[#333333] bg-[#2a2a2a]/95 backdrop-blur-xl z-50"
                    style={{
                        width: '200px',
                        opacity: showDropdown ? 1 : 0,
                        transform: showDropdown ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
                        transformOrigin: 'top right',
                        boxShadow: showDropdown ? '0 8px 32px rgba(0, 0, 0, 0.4)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: showDropdown ? 'auto' : 'none',
                        visibility: showDropdown ? 'visible' : 'hidden'
                    }}
                >
                    {/* Header inside dropdown */}
                    <div
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#474747]/40 transition-colors cursor-pointer"
                        onClick={() => setShowDropdown(false)}
                    >
                        <div className="w-6 h-6 rounded-full bg-[#d9d9d9]/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-[0.65rem] font-semibold text-[#d9d9d9]">
                                {initials}
                            </span>
                        </div>
                        <span className="text-[0.75rem] font-medium text-[#d9d9d9] truncate flex-1">
                            {userName}
                        </span>
                    </div>

                    {/* Menu Items */}
                    <div className="border-t border-[#333333]">
                        <button
                            onClick={() => handleMenuClick('profile')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#d9d9d9]/70 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
                        >
                            <PersonOutlineRoundedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Profile</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('account')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#d9d9d9]/70 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
                        >
                            <ManageAccountsOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Account</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('Terms & Conditions')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#d9d9d9]/70 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
                        >
                            <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Terms & Conditions</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('disclaimer')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#d9d9d9]/70 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
                        >
                            <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Disclaimer</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('faq')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#d9d9d9]/70 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer "
                        >
                            <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">FAQ</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('contact')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#d9d9d9]/70 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
                        >
                            <EmailOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Contact Us</span>
                        </button>
                        <div className="border-t border-[#333333] mx-2 my-1"></div>
                        <button
                            onClick={() => handleMenuClick('logout')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#d9d9d9]/70 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
                        >
                            <LogoutRoundedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // When logged out, show sign in toggle
    return (
        <div
            className="relative flex items-center gap-2 w-[4.8rem] h-[2.5rem] overflow-hidden rounded-[1rem] border-2 border-[#333333] bg-[#474747]/22 px-1.5 cursor-pointer"
            onClick={handleSignIn}>
            <span className="invisible text-[0.75rem] font-medium">.</span>
            <span className="ml-auto text-[0.75rem] font-medium text-[#7D7E7F] pointer-events-none">
                Sign In
            </span>
            {/* Knob */}
            <div
                className="absolute left-[0.25rem] h-[1rem] w-[1rem] rounded-full bg-[#d9d9d9]/54 transition-transform duration-300 ease-in-out pointer-events-none"
            />
        </div>
    );
}

export default LoginLogoutIcon;
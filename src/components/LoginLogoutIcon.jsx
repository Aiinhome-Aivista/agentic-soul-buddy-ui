import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../common/helper/Context";
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

function LoginLogoutIcon({ handleStop }) {
    const { isLoggedIn, setIsLoggedIn, setAudioUrl, setLoginModal, setDisclaimerModal, setContactModal, setProfileModal, setFaqModal } = useContext(Context);
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

        // Force page reload to ensure complete logout
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const handleMenuClick = (action) => {
        setShowDropdown(false);
        switch (action) {
            case 'profile':
                setProfileModal(true);
                break;
            case 'account':
                // Handle account action
                console.log('Account clicked');
                break;
            case 'Terms & Conditions':
                navigate('/terms');
                break;
            case 'disclaimer':
                navigate('/disclaimer');
                break;
            case 'contact':
                setContactModal(true);
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 border-border-light dark:border-[#333333] bg-white/50 dark:bg-[#474747]/22 backdrop-blur-md cursor-pointer hover:bg-gray-100 dark:hover:bg-[#474747]/40 transition-all duration-300 ${showDropdown ? 'opacity-0' : 'opacity-100'
                        }`}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    {/* Initials Icon */}
                    <div className="w-6 h-6 rounded-full bg-primary/30 dark:bg-[#d9d9d9]/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[0.65rem] font-semibold text-primary-dark dark:text-[#d9d9d9] transition-colors">
                            {initials}
                        </span>
                    </div>
                    {/* User Name */}
                    <span className="text-[0.75rem] font-medium text-text-muted dark:text-[#d9d9d9]/80 truncate transition-colors">
                        {userName}
                    </span>
                </div>

                {/* Expandable Menu - Absolute positioned overlay */}
                <div
                    className="absolute top-0 right-0 flex flex-col rounded-2xl border-2 border-border-light dark:border-[#333333] bg-white/95 dark:bg-[#2a2a2a]/95 backdrop-blur-xl z-50"
                    style={{
                        width: '200px',
                        opacity: showDropdown ? 1 : 0,
                        transform: showDropdown ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
                        transformOrigin: 'top right',
                        boxShadow: showDropdown ? '0 8px 32px rgba(0, 0, 0, 0.2)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: showDropdown ? 'auto' : 'none',
                        visibility: showDropdown ? 'visible' : 'hidden'
                    }}
                >
                    {/* Header inside dropdown */}
                    <div
                        className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 dark:hover:bg-[#474747]/40 transition-colors cursor-pointer"
                        onClick={() => setShowDropdown(false)}
                    >
                        <div className="w-6 h-6 rounded-full bg-primary/30 dark:bg-[#d9d9d9]/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-[0.65rem] font-semibold text-primary-dark dark:text-[#d9d9d9] transition-colors">
                                {initials}
                            </span>
                        </div>
                        <span className="text-[0.75rem] font-medium text-text-main dark:text-[#d9d9d9] truncate flex-1 transition-colors">
                            {userName}
                        </span>
                    </div>

                    {/* Menu Items */}
                    <div className="border-t border-border-light dark:border-[#333333]">
                        <button
                            onClick={() => handleMenuClick('profile')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted dark:text-[#d9d9d9]/70 hover:bg-primary/10 dark:hover:bg-white/10 hover:text-text-main dark:hover:text-white transition-colors text-left"
                        >
                            <PersonOutlineRoundedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Profile</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('account')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted dark:text-[#d9d9d9]/70 hover:bg-primary/10 dark:hover:bg-white/10 hover:text-text-main dark:hover:text-white transition-colors text-left"
                        >
                            <ManageAccountsOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Account</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('Terms & Conditions')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted dark:text-[#d9d9d9]/70 hover:bg-primary/10 dark:hover:bg-white/10 hover:text-text-main dark:hover:text-white transition-colors text-left"
                        >
                            <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Terms & Conditions</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('disclaimer')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted dark:text-[#d9d9d9]/70 hover:bg-primary/10 dark:hover:bg-white/10 hover:text-text-main dark:hover:text-white transition-colors text-left"
                        >
                            <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Disclaimer</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('faq')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#d9d9d9]/70 hover:bg-white/10 hover:text-white transition-colors text-left"
                        >
                            <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">FAQ</span>
                        </button>
                        <button
                            onClick={() => handleMenuClick('contact')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted dark:text-[#d9d9d9]/70 hover:bg-primary/10 dark:hover:bg-white/10 hover:text-text-main dark:hover:text-white transition-colors text-left"
                        >
                            <EmailOutlinedIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-[13px]">Contact Us</span>
                        </button>
                        <div className="border-t border-border-light dark:border-[#333333] mx-2 my-1"></div>
                        <button
                            onClick={() => handleMenuClick('logout')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted dark:text-[#d9d9d9]/70 hover:bg-primary/10 dark:hover:bg-white/10 hover:text-text-main dark:hover:text-white transition-colors text-left"
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
            className="relative flex items-center gap-2 px-4 py-2 overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-md cursor-pointer hover:from-violet-500/30 hover:to-purple-500/30 hover:border-white/30 hover:scale-105 transition-all duration-300 group"
            onClick={handleSignIn}>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400/0 to-purple-400/0 group-hover:from-violet-400/10 group-hover:to-purple-400/10 transition-all duration-300"></div>
            {/* Icon */}
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <PersonOutlineRoundedIcon sx={{ fontSize: '0.85rem', color: '#d9d9d9' }} />
            </div>
            <span className="text-[14px] font-medium text-white/90 group-hover:text-white transition-colors">
                Sign In
            </span>
        </div>
    );
}

export default LoginLogoutIcon;
import React, { useContext } from 'react';
import "../../styles/modal.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import { Context } from '../helper/Context';

export default function ContactModal() {
    const { setContactModal } = useContext(Context);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-md animate-fadeIn z-50">
            <div className="glass-card flex flex-col items-center relative overflow-hidden animate-slideUp rounded-3xl"
                style={{ width: 'min(500px, calc(100% - 48px))' }}
            >
                {/* Header */}
                <div className="w-full flex items-center justify-between px-8 py-5 border-b border-border-light dark:border-white/10">
                    <h2 className="text-2xl font-bold text-text-main dark:text-white cursor-default transition-colors">Contact Us</h2>
                    <CloseRoundedIcon
                        onClick={() => setContactModal(false)}
                        className="cursor-pointer hover:bg-primary/10 dark:hover:bg-white/20 rounded-full p-1 transition-all text-text-muted dark:text-white/70"
                        sx={{ fontSize: '1.75rem' }}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-5 w-full px-8 py-8">

                    {/* Email */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 dark:bg-white/5 border border-border-light dark:border-white/10 hover:bg-primary/10 dark:hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-white/20 transition-all">
                            <EmailOutlinedIcon sx={{ fontSize: '1.5rem' }} className="text-primary-dark dark:text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-text-muted dark:text-white/50 transition-colors">Email Address</span>
                            <span className="text-text-main dark:text-white font-medium select-all transition-colors">support@soulbuddy.app</span>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 dark:bg-white/5 border border-border-light dark:border-white/10 hover:bg-primary/10 dark:hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-white/20 transition-all">
                            <PhoneIphoneRoundedIcon sx={{ fontSize: '1.5rem' }} className="text-primary-dark dark:text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-text-muted dark:text-white/50 transition-colors">Mobile Number</span>
                            <span className="text-text-main dark:text-white font-medium select-all transition-colors">9876543210</span>
                        </div>
                    </div>

                    {/* Website */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 dark:bg-white/5 border border-border-light dark:border-white/10 hover:bg-primary/10 dark:hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-white/20 transition-all">
                            <LanguageRoundedIcon sx={{ fontSize: '1.5rem' }} className="text-primary-dark dark:text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-text-muted dark:text-white/50 transition-colors">Website</span>
                            <a href="https://www.soulbuddy.com" target="_blank" rel="noopener noreferrer" className="text-primary-dark dark:text-blue-400 hover:text-primary-deep dark:hover:text-blue-300 font-medium transition-colors">
                                www.soulbuddy.com
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

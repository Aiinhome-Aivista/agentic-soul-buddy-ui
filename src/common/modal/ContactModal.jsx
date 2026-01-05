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
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md animate-fadeIn z-50">
            <div className="glass-card flex flex-col items-center relative overflow-hidden animate-slideUp rounded-3xl"
                style={{ width: 'min(500px, calc(100% - 48px))' }}
            >
                {/* Header */}
                <div className="w-full flex items-center justify-between px-8 py-5 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white cursor-default">Contact Us</h2>
                    <CloseRoundedIcon
                        onClick={() => setContactModal(false)}
                        className="cursor-pointer hover:bg-white/20 rounded-full p-1 transition-all"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.75rem' }}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-5 w-full px-8 py-8">

                    {/* Email */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <EmailOutlinedIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-white/50">Email Address</span>
                            <span className="text-white font-medium select-all">soulBuddy@gmail.com</span>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <PhoneIphoneRoundedIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-white/50">Mobile Number</span>
                            <span className="text-white font-medium select-all">9876543210</span>
                        </div>
                    </div>

                    {/* Website */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <LanguageRoundedIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-white/50">Website</span>
                            <a href="https://www.soulbuddy.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                www.soulbuddy.com
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

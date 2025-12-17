import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import BoltIcon from '@mui/icons-material/Bolt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';

export default function WellBeingProfile({ onClose }) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-[2%] bg-black/10 backdrop-blur-sm animate-fadeIn z-50">
            <div className="glass-card flex flex-col items-center w-[30%] relative overflow-hidden rounded-3xl p-6 max-h-[90vh]">

                {/* Header */}
                <div className="w-full flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white text-center w-full">
                        Summary of your Well-being Profile
                    </h2>
                    <button onClick={onClose} className="absolute right-4 top-4 hover:bg-white/10 rounded-full p-1 transition">
                        <CloseRoundedIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                    </button>
                </div>

                {/* Main Gauge Card */}
                <div className="rounded-2xl p-4 w-full mb-4 shadow-sm relative bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white">Negative effects level</span>
                        <span className="bg-red-400/20 text-red-300 px-2 py-0.5 rounded text-sm font-semibold">High</span>
                    </div>
                    <br></br>

                    {/* Person Image Placeholder */}
                    {/* <div className="flex justify-center mb-4 relative"> */}
                        {/* <div className="w-32 h-40 bg-gray-200 rounded-lg overflow-hidden relative"> */}
                            {/* Placeholder for person image - using usage of colored div or SVG if no image available */}
                            {/* <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg> */}
                        {/* </div> */}
                    {/* </div> */}

                    {/* Gauge Slider */}
                    <div className="relative pt-6 pb-2 px-2">
                        {/* Tooltip for 'Your level' */}
                        <div className="absolute right-[10%] top-0 flex flex-col items-center">
                            <div className="bg-white text-black text-xs px-2 py-1 rounded mb-1">Your level</div>
                            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-white"></div>
                        </div>
                        <br></br>

                        <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-200 via-green-200 to-red-400 relative">
                            <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-red-400 rounded-full shadow"></div>
                        </div>
                        <div className="flex justify-between text-xs text-white/50 mt-1 font-medium">
                            <span>Low</span>
                            <span>Normal</span>
                            <span>Medium</span>
                            <span>High</span>
                        </div>
                    </div>

                    {/* Alert Box */}
                    <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-3 mt-4 flex gap-3 items-start">
                        <div className="bg-red-400 rounded-full p-1 text-white shrink-0">
                            <WarningRoundedIcon sx={{ fontSize: "1rem" }} />
                        </div>
                        <div>
                            <div className="font-bold text-red-200 text-sm">HIGH level</div>
                            <p className="text-red-100/80 text-xs mt-1 leading-snug">
                                High levels of negative effects can lead to constant procrastination, increased worrying, reduced energy and well-being
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    {/* Card 1 */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                        <div className="bg-green-400/20 p-2 rounded-lg text-green-300">
                            <CrisisAlertIcon />
                        </div>
                        <div>
                            <div className="text-xs text-white/60">Main difficulty</div>
                            <div className="font-bold text-white text-sm">Worry</div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                        <div className="bg-green-400/20 p-2 rounded-lg text-green-300">
                            <CalendarMonthIcon />
                        </div>
                        <div>
                            <div className="text-xs text-white/60">Challenging period</div>
                            <div className="font-bold text-white text-sm">Few weeks</div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                        <div className="bg-green-400/20 p-2 rounded-lg text-green-300">
                            <BoltIcon />
                        </div>
                        <div>
                            <div className="text-xs text-white/60">Trigger</div>
                            <div className="font-bold text-white text-sm truncate max-w-[80px]">Family</div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                        <div className="bg-green-400/20 p-2 rounded-lg text-green-300">
                            <BatteryAlertIcon />
                        </div>
                        <div>
                            <div className="text-xs text-white/60">Energy level</div>
                            <div className="font-bold text-white text-sm">Low</div>
                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-full bg-[#D9D9D9] text-black/95 font-bold text-lg hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2) transition-colors"
                >
                    Continue
                </button>

            </div>
        </div>
    );
}

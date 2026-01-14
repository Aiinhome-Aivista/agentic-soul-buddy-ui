import React, { useEffect, useState, useContext } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import MoodOutlinedIcon from "@mui/icons-material/MoodOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WcIcon from "@mui/icons-material/Wc";

import { apiService } from "../../service/apiService";
import { POST_url1 } from "../../connection/connection";

export default function AccountModal({ OnClose }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    setError("User ID not found");
                    setLoading(false);
                    return;
                }

                const payload = {
                    user_id: userId,
                };

                const response = await apiService({
                    url: POST_url1.user_details,
                    method: "POST", // Using POST as body is required
                    data: payload,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response && response.success) {
                    setUserData(response.data.user);
                } else {
                    console.error("Failed to load user details:", response);
                    setError("Failed to load user details");
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError("An error occurred while fetching details.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const InfoItem = ({ icon, label, value }) => (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm hover:bg-white/10 transition-colors">
            <div className="bg-white/10 p-2 rounded-lg text-white">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs text-white/50">{label}</div>
                <div className="font-bold text-white text-sm truncate" title={value}>
                    {value || "N/A"}
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-[2%] bg-black/10 backdrop-blur-sm animate-fadeIn z-50">
            <div className="glass-card flex flex-col items-center w-full max-w-md relative overflow-hidden rounded-3xl p-6 max-h-[90vh] transition-all duration-500">

                {/* Header */}
                <div className="w-full flex justify-between items-center mb-6 z-10">
                    <h2 className="text-xl font-bold text-white">Account Details</h2>
                    <button
                        onClick={OnClose}
                        className="hover:bg-white/10 rounded-full p-1 transition-colors cursor-pointer"
                    >
                        <CloseRoundedIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                    </button>
                </div>

                <div className="w-full overflow-y-auto custom-scrollbar pr-1">
                    <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 4px;
            }
          `}</style>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <p className="text-white/60 text-sm animate-pulse">Loading details...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <p className="text-red-300 mb-4">{error}</p>
                            <button
                                onClick={OnClose}
                                className="px-6 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : userData ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                            <div className="col-span-1 sm:col-span-2">
                                <InfoItem
                                    icon={<PersonOutlineRoundedIcon />}
                                    label="Full Name"
                                    value={userData.full_name}
                                />
                            </div>

                            <div className="col-span-1 sm:col-span-2">
                                <InfoItem
                                    icon={<EmailOutlinedIcon />}
                                    label="Email"
                                    value={userData.email}
                                />
                            </div>

                            <InfoItem
                                icon={<CalendarMonthIcon />}
                                label="Age"
                                value={userData.age}
                            />

                            <InfoItem
                                icon={<WcIcon />}
                                label="Gender"
                                value={userData.gender}
                            />

                            <InfoItem
                                icon={<WorkOutlineOutlinedIcon />}
                                label="Work"
                                value={userData.work}
                            />

                            <InfoItem
                                icon={<FavoriteBorderRoundedIcon />}
                                label="Relationship"
                                value={userData.relationship}
                            />

                            <InfoItem
                                icon={<MonitorHeartOutlinedIcon />}
                                label="Health"
                                value={userData.health}
                            />

                            <InfoItem
                                icon={<MoodOutlinedIcon />}
                                label="Emotional State"
                                value={userData.emotional_state}
                            />

                            {/* <div className="col-span-1 sm:col-span-2 mt-2">
                 <div className="text-xs text-center text-white/30">
                    Member since: {new Date(userData.created_at).toLocaleDateString()}
                 </div>
              </div> */}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

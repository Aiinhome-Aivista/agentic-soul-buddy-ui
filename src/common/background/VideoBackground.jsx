import React from "react";
import "../../styles/videoBackground.css";
import bgvideo from "../../assets/video/galaxy.mp4"

export default function VideoBackground() {
    return (
        <div className="video-background">
            <video autoPlay loop muted playsInline className="video-content">
                <source src={bgvideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
import { useEffect, useRef } from "react";

const CanvasVisualizer = ({
    audioRef,
    width = 400,
    height = 200,
    barWidth = 6,       // thickness of each bar
    gap = 2,            // space between bars
    minBarHeight = 8,   // minimum height for visibility
    fps = 30,           // limit animation speed
    sensitivity = 10     // higher = taller bars
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const lastDrawTime = useRef(0);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const audio = audioRef.current;
        if (!audio) return;

        // Helper: draw pill-shaped bar
        const drawPillBar = (ctx, x, y, width, height) => {
            const radius = width / 2;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        };

        const setupAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 2048;
                analyserRef.current.smoothingTimeConstant = 0.5; // between 0 and 1
            }

            // Create source node only if it doesn't exist for this audio element
            if (!sourceRef.current) {
                sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
                sourceRef.current.connect(analyserRef.current);
                // Only connect analyser to destination once
                analyserRef.current.connect(audioContextRef.current.destination);
            }

            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
            requestAnimationFrame(draw);
        };

        const draw = (time) => {
            animationRef.current = requestAnimationFrame(draw);

            // Throttle animation
            if (time && time - lastDrawTime.current < 1000 / fps) return;
            lastDrawTime.current = time || 0;

            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteTimeDomainData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const sliceWidth = (canvas.width / dataArray.length) * (barWidth + gap);
            let x = gap / 2;

            for (let i = 0; i < dataArray.length; i += 4) {
                const v = dataArray[i] / 128.0 - 1; // normalize [-1, 1]
                let barHeight = Math.abs(v) * sensitivity * 20; // boost with sensitivity

                // Apply minimum height
                barHeight = Math.max(barHeight, minBarHeight);

                const yTop = canvas.height / 2 - barHeight / 2;
                const barFullHeight = barHeight;

                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                drawPillBar(ctx, x, yTop, barWidth, barFullHeight);
                ctx.fill();

                x += sliceWidth;
            }
        };

        // Start drawing when audio plays
        audio.addEventListener("play", setupAudio);

        // If audio is already playing when the component mounts, start the visualizer.
        if (!audio.paused) {
            setupAudio();
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            audio?.removeEventListener("play", setupAudio);

            // Closing the context is the most robust way to release the audio element
            // and ensure it can be connected again on the next mount.
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null; // Ensure it's recreated on next mount
            }
        };
    }, [audioRef, barWidth, gap, minBarHeight, fps, sensitivity, height, width]); // Added height and width



    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="relative z-10 rounded-lg shadow-lg bg-black/30"
        />
    );
};

export default CanvasVisualizer;
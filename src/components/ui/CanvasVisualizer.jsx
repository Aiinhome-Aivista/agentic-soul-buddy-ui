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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const audio = audioRef.current;
        let audioContext = null;
        let analyser;
        let source;
        let dataArray;

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
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.5; // between 0 and 1
            dataArray = new Uint8Array(analyser.fftSize);

            source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            draw();
        };

        const draw = (time) => {
            animationRef.current = requestAnimationFrame(draw);

            // Throttle animation
            if (time && time - lastDrawTime.current < 1000 / fps) return;
            lastDrawTime.current = time || 0;

            analyser.getByteTimeDomainData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const sliceWidth = (canvas.width / dataArray.length) * (barWidth + gap);
            let x = 0;

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

        audio.addEventListener("play", setupAudio);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            audio.removeEventListener("play", setupAudio);
            if (audioContext) audioContext.close();
        };
    }, [audioRef, barWidth, gap, minBarHeight, fps, sensitivity]);

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

import { useContext, useEffect, useRef, useState } from "react";
import { Context } from '../helper/Context'
import { useDebounce } from "../hooks/useDebounce";

export const VoiceRecognizer = ({ isRecording, setIsRecording }) => {
    const { setRecognizedText } = useContext(Context)
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('SpeechRecognition API not supported in this browser.');
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setRecognizedText(transcript);
            console.log('Recognized text:', transcript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            // Do not setIsRecording(false) here
        };

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
            // Do not setIsRecording(false) here
        };

        return () => {
            recognitionRef.current?.abort();
        };
    }, [setRecognizedText]); // Remove setIsRecording from dependency

    const debouncedIsRecording = useDebounce(isRecording, 200);

    useEffect(() => {
        if (debouncedIsRecording && !isListening) {
            recognitionRef.current?.start();
        } else if (!debouncedIsRecording && isListening) {
            recognitionRef.current?.stop();
        }
    }, [debouncedIsRecording, isListening]);
// ... existing code ...

    return null;
};
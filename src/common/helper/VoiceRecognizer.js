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
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setRecognizedText(transcript)
            console.log('Recognized text:', transcript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
            setIsRecording(false);
        };

        return () => {
            recognitionRef.current?.abort();
        };
    }, [setRecognizedText, setIsRecording]);

    const debouncedIsRecording = useDebounce(isRecording, 200);

    useEffect(() => {
        if (debouncedIsRecording && !isListening) {
            recognitionRef.current?.start();
        } else if (!debouncedIsRecording && isListening) {
            recognitionRef.current?.stop();
        }
    }, [debouncedIsRecording, isListening]);

    return null;
};
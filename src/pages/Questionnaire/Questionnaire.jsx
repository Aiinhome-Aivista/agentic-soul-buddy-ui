import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from './questions';
import QuestionCard from './QuestionCard';

const Questionnaire = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        } else {
            navigate('/'); // Go back to home or previous page
        }
    };

    const handleSelectOption = (option) => {
        const isMultiple = currentQuestion.type === 'Multiple Select';

        if (isMultiple) {
            setAnswers(prev => {
                const currentAnswers = prev[currentQuestion.id] || [];
                if (currentAnswers.includes(option)) {
                    return { ...prev, [currentQuestion.id]: currentAnswers.filter(a => a !== option) };
                } else {
                    return { ...prev, [currentQuestion.id]: [...currentAnswers, option] };
                }
            });
            // For multiple select, do NOT auto advance
        } else {
            setAnswers({ ...answers, [currentQuestion.id]: option });
            // Auto advance for single select / agreement
            setTimeout(() => {
                handleNext();
            }, 250); // Slight delay for visual feedback
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            // Finish flow - handle submission here
            console.log('Final Answers:', answers);
            // Navigate to result or dashboard
            navigate('/dashboard'); // Placeholder
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const currentAnswer = answers[currentQuestion.id];

    return (
        <div className="min-h-screen bg-[#f8f6f2] flex flex-col font-sans">
            {/* Header / Progress Bar */}
            <div className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

              
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <span className="font-serif italic text-xl font-bold text-gray-800">Soul Buddy</span>
                </div>

                <span className="text-xs font-medium text-gray-500">
                    {currentIndex + 1} / {questions.length}
                </span>
            </div>

            {/* Progress Bar (Thin green line) */}
            <div className="w-full h-1 bg-gray-200">
                <div
                    className="h-full bg-green-600 transition-all duration-300 ease-out"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center py-10">
                <QuestionCard
                    question={currentQuestion}
                    onSelectOption={handleSelectOption}
                    onNext={handleNext}
                    selectedOptions={Array.isArray(currentAnswer) ? currentAnswer : (currentAnswer ? [currentAnswer] : [])}
                />
            </div>
        </div>
    );
};

export default Questionnaire;

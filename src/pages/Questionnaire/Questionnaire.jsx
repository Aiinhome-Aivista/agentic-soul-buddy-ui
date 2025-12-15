import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../common/helper/Context';
import LoginModal from '../../common/modal/LoginModal';
import { questions } from './questions';
import QuestionCard from './QuestionCard';

const Questionnaire = () => {
    const navigate = useNavigate();
    const { setLoginModal, loginModal } = useContext(Context);
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
        const isMultiple = currentQuestion.type?.toLowerCase()?.includes('multiple');

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
            navigate('/');
            // Open Login Modal
            // setLoginModal(true);

        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const currentAnswer = answers[currentQuestion.id];

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Header / Progress Bar */}
            <div className="w-full px-8 py-6 flex items-center justify-between sticky top-0 z-10">
                <button
                    onClick={handleBack}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                {/* Progress Bar Label */}
                <div className="flex-1 mx-8 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <span className="text-sm font-bold text-white/90 font-mono">
                    {currentIndex + 1}/{questions.length}
                </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-start py-10 w-full overflow-y-auto">
                <QuestionCard
                    question={currentQuestion}
                    onSelectOption={handleSelectOption}
                    onNext={handleNext}
                    selectedOptions={Array.isArray(currentAnswer) ? currentAnswer : (currentAnswer ? [currentAnswer] : [])}
                />
            </div>
            {loginModal && <LoginModal OnClose={() => setLoginModal(false)} />}
        </div >
    );
};

export default Questionnaire;

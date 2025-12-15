import React from 'react';
import { Card } from 'primereact/card';

const QuestionCard = ({ question, onSelectOption, onNext, selectedOptions = [] }) => {
    const isMultiple = question.type?.toLowerCase()?.includes('multiple');
    const isAgreement = question.type === 'Agreement Scale';

    const handleOptionClick = (option) => {
        onSelectOption(option);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg px-4 pb-24">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8 leading-snug">
                {question.text}
            </h2>

            <div className={`w-full flex ${isAgreement ? 'flex-row justify-between items-center gap-1' : 'flex-col gap-4'}`}>
                {question.options.map((option, index) => {
                    const isSelected = selectedOptions.includes(option);

                    if (isAgreement) {
                        // Special styling for agreement scale typically has bubbles or a slider-like feel
                        // But for now, let's just make them buttons or labels. 
                        // Based on the "Strongly disagree" to "Strongly agree" usually it's a row of 5 circles or similar.
                        // The table just lists them as options. I will render them as distinct buttons for now.
                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className={`flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-all
                            ${isSelected ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-gray-700'}
                        `}
                            >
                                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-colors
                            ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-300'}
                         `}>
                                    {/* We could use icons or just sizes here, but for now simple circles */}
                                </div>
                                <span className="text-xs sm:text-sm text-center max-w-[80px]">{option}</span>
                            </button>
                        )
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ease-in-out group
                  ${isSelected
                                    ? 'border-green-500 bg-green-50 shadow-sm'
                                    : 'border-white bg-white shadow-sm hover:border-green-300 hover:shadow-md'
                                }
                `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center
                        ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-400'}
                   `}>
                                    {isSelected && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-lg ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                    {option}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {isMultiple && (
                <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center z-50 pointer-events-none">
                    <button
                        onClick={onNext}
                        disabled={selectedOptions.length === 0}
                        className={`px-8 py-3 rounded-full font-medium transition-all shadow-lg pointer-events-auto 
                            ${selectedOptions.length > 0
                                ? 'bg-[#40916c] text-white hover:bg-[#2d6a4f] hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        `}
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;

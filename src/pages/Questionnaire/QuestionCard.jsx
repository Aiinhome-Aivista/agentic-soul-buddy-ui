import React from 'react';
import { Card } from 'primereact/card';

const QuestionCard = ({ question, onSelectOption, onNext, selectedOptions = [] }) => {
    const isMultiple = question.type?.toLowerCase()?.includes('multiple');
    const isAgreement = question.type === 'Agreement Scale';

    const handleOptionClick = (option) => {
        onSelectOption(option);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg px-4 pb-10 flex-1 min-h-full">
            <h2 className="font-['Nunito'] font-bold text-[20px] leading-none tracking-normal text-center text-white mb-2 drop-shadow-md">
                {question.text}
            </h2>
            {question.description && (
                <p className="text-center text-white/60 mb-28 text-sm max-w-md drop-shadow-sm font-medium">
                    {question.description}
                </p>
            )}

            <div className={`w-full flex ${isAgreement ? 'flex-row justify-between items-center gap-1' : 'flex-col items-center gap-3'}`}>
                {question.options.map((option, index) => {
                    const isSelected = selectedOptions.includes(option);

                    if (isAgreement) {
                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className={`flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-all
                            ${isSelected ? 'text-white font-bold opacity-100' : 'text-white/50 hover:text-white/80'}
                        `}
                            >
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
                            ${isSelected ? 'border-white bg-white/20 scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-white/30 hover:border-white/60'}
                         `}>
                                </div>
                                <span className="text-[10px] sm:text-xs text-center max-w-[80px] font-medium tracking-wide">{option}</span>
                            </button>
                        )
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className={`w-full max-w-[374px] h-[35px] text-left px-4 rounded-[10px] border transition-all duration-300 ease-out group relative overflow-hidden backdrop-blur-sm flex items-center
                  ${isSelected
                                    ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
                                }
                `}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className={`font-['Nunito'] font-bold text-[12px] leading-none tracking-normal transition-colors duration-300 ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                                    {option}
                                </span>

                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                     ${isSelected ? 'border-white bg-white scale-100 opacity-100' : 'border-white/30 scale-90 opacity-0 group-hover:opacity-50'}
                                `}>
                                    {isSelected && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {isMultiple && (
                <div className="w-full flex justify-center mt-auto pt-6">
                    <div className="w-full flex justify-center">
                        <button
                            onClick={onNext}
                            disabled={selectedOptions.length === 0}
                            className={`w-full max-w-[374px] h-[35px] rounded-[10px] border font-['Nunito'] font-bold transition-all shadow-lg transform active:scale-95 flex items-center justify-center
                            ${selectedOptions.length > 0
                                    ? 'bg-white text-[#434141D8] border-white hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                    : 'bg-white/10 text-white/30 border-white/5 cursor-not-allowed'}
                        `}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;

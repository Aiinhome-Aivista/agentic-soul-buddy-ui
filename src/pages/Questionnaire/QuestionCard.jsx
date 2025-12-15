import React from 'react';
import { Card } from 'primereact/card';
import ThumbDownIcon from '../../assets/icons/thumb_down.svg';
import SemiDisagreeIcon from '../../assets/icons/Group 14.svg';
import NeutralIcon from '../../assets/icons/psychology_alt.svg';
import SemiAgreeIcon from '../../assets/icons/Group 15.svg';
import ThumbUpIcon from '../../assets/icons/thumb_up.svg';

const QuestionCard = ({ question, onSelectOption, onNext, selectedOptions = [] }) => {
    const isMultiple = question.type?.toLowerCase()?.includes('multiple');
    const isAgreement = question.type === 'Agreement Scale';

    const handleOptionClick = (option) => {
        onSelectOption(option);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg px-4 pb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-2 leading-snug drop-shadow-md">
                {question.text}
            </h2>
            {question.description && (
                <p className="text-center text-white/60 mb-8 text-sm max-w-md drop-shadow-sm font-medium">
                    {question.description}
                </p>
            )}

            {isAgreement ? (
                <div className="w-full flex flex-col gap-2">
                    {/* Icon Container */}
                    <div className="w-full h-16 bg-white/10 rounded-2xl flex items-center justify-between px-2 sm:px-4 relative border border-white/10">
                        {question.options.map((option, index) => {
                            const isSelected = selectedOptions.includes(option);

                            // Icons for 5-point scale: 0=Strongly Disagree, 4=Strongly Agree
                            const getIcon = (idx) => {
                                const iconClass = `w-6 h-6 sm:w-8 sm:h-8 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-40'}`;

                                switch (idx) {
                                    case 0: return <img src={ThumbDownIcon} alt="Strongly Disagree" className={iconClass} />;
                                    case 1: return <img src={SemiDisagreeIcon} alt="Disagree" className={iconClass} />;
                                    case 2: return <img src={NeutralIcon} alt="Neutral" className={iconClass} />;
                                    case 3: return <img src={SemiAgreeIcon} alt="Agree" className={iconClass} />;
                                    case 4: return <img src={ThumbUpIcon} alt="Strongly Agree" className={iconClass} />;
                                    default: return null;
                                }
                            };

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(option)}
                                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl transition-all duration-300
                                        ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
                                >
                                    {/* Selection Background shape (only visible if selected) */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-white/20 rounded-xl" />
                                    )}
                                    {getIcon(index)}
                                </button>
                            );
                        })}
                    </div>
                    {/* Labels */}
                    <div className="flex justify-between w-full px-2">
                        <span className="text-[10px] sm:text-xs text-white/50 font-medium tracking-wide">Strongly disagree</span>
                        <span className="text-[10px] sm:text-xs text-white/50 font-medium tracking-wide">Strongly Agree</span>
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col gap-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedOptions.includes(option);
                        /* Normal Options Rendering logic below (re-using existing map but filtered out) */


                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ease-out group relative overflow-hidden backdrop-blur-sm
                  ${isSelected
                                        ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                        : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
                                    }
                `}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className={`text-lg transition-colors duration-300 ${isSelected ? 'text-white font-semibold' : 'text-white/80 group-hover:text-white'}`}>
                                        {option}
                                    </span>

                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                     ${isSelected ? 'border-white bg-white scale-100 opacity-100' : 'border-white/30 scale-90 opacity-0 group-hover:opacity-50'}
                                `}>
                                        {isSelected && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {isMultiple && (
                <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center z-50 pointer-events-none">
                    <div className="w-full max-w-lg pointer-events-auto">
                        <button
                            onClick={onNext}
                            disabled={selectedOptions.length === 0}
                            className={`w-full py-4 rounded-full font-bold transition-all shadow-lg transform active:scale-95
                            ${selectedOptions.length > 0
                                    ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'}
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

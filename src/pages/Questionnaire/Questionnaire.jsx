import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../common/helper/Context';
import LoginModal from '../../common/modal/LoginModal';
import SignupModal2 from '../../common/modal/signupafterquestions';
import SubscriptionPlane from '../../common/modal/SubscribtionPlane';
import QuestionCard from './QuestionCard';
import { apiService } from '../../service/apiService';
import { get_url1 } from '../../connection/connection';

const Questionnaire = () => {
    const navigate = useNavigate();
    const { setLoginModal, loginModal, setSignupModal2, signupModal2 } = useContext(Context);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptionModal, setSubscriptionModal] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await apiService({
                    url: get_url1.questions,
                    method: 'GET'
                });

                if (response.error) {
                    setError(response.message || 'Failed to fetch questions');
                } else {
                    setQuestions(response);
                }
            } catch (err) {
                setError('Failed to load questions. Please try again.');
                console.error('Error fetching questions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

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

            setSignupModal2(true);
            // navigate('/');
            // setLoginModal(true);

        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleSignupSuccess = () => {
        setSignupModal2(false);
        setSubscriptionModal(true);
    };

    const handleSubscriptionClose = () => {
        setSubscriptionModal(false);
        navigate('/');
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className="text-white text-xl font-semibold">Loading questions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-black/10 backdrop-blur-sm">
                <div className="text-red-400 text-xl font-semibold">{error}</div>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className="text-white text-xl font-semibold">No questions available</div>
            </div>
        );
    }

    const currentAnswer = answers[currentQuestion?.id];

    return (
        <>
            {!signupModal2 && !subscriptionModal ? (
                <div
                    className="fixed inset-0 flex flex-col items-center justify-center gap-[2%] bg-black/10 backdrop-blur-sm animate-fadeIn z-5">
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
                                className="h-full bg-white/60 transition-all duration-300 ease-out rounded-full"
                                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <div className="text-sm font-bold font-mono">
                            <span className="text-white">{currentIndex + 1}</span>
                            <span className="text-white/60">/{questions.length}</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-start pb-10 w-full overflow-y-auto">
                        <QuestionCard
                            question={currentQuestion}
                            onSelectOption={handleSelectOption}
                            onNext={handleNext}
                            selectedOptions={Array.isArray(currentAnswer) ? currentAnswer : (currentAnswer ? [currentAnswer] : [])}
                        />
                    </div>
                    {loginModal && <LoginModal OnClose={() => setLoginModal(false)} />}
                </div>
            ) : signupModal2 ? (
                <SignupModal2
                    OnClose={() => setSignupModal2(false)}
                    onSuccess={handleSignupSuccess}
                    answers={answers}
                />
            ) : subscriptionModal ? (
                <SubscriptionPlane OnClose={handleSubscriptionClose} />
            ) : null}
        </>
    );
};

export default Questionnaire;



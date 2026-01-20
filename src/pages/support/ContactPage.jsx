import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { Toast } from 'primereact/toast';
import { apiService } from "../../service/apiService";
import { POST_url1 } from "../../connection/connection";

const ContactPage = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
    const [transitionColor, setTransitionColor] = useState('bg-primary-dark');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };


    const showSuccess = (message) => {
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000,
            style: { background: 'linear-gradient(135deg, #8aa399 0%, #61897c 100%)', color: '#fff', borderRadius: '12px', border: 'none' },
            contentStyle: { background: 'transparent' }
        });
    };

    const showError = (message) => {
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
            style: { background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '12px', border: 'none' },
            contentStyle: { background: 'transparent' }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            showError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await apiService({
                url: POST_url1.contact_us,
                method: 'POST',
                data: {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                }
            });

            if (response && response.success) {
                showSuccess('Email sent successfully! We will get back to you soon.');
                setSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                showError(response?.message || 'Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showError('An error occurred while sending your message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactMethods = [
        {
            icon: "mail",
            title: "Email Us",
            description: "For general inquiries and support",
            value: "support@souljunction.life",
            action: "mailto:support@souljunction.life"
        },
        {
            icon: "schedule",
            title: "Response Time",
            description: "We typically respond within",
            value: "24-48 hours",
            action: null
        }
    ];

    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "Go to the login page and click 'Forgot Password'. Follow the instructions sent to your email."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, you can cancel at any time. Your access continues until the end of your billing period."
        },
        {
            question: "Is my data private?",
            answer: "Absolutely. We never sell your data and use industry-standard encryption to protect your information."
        }
    ];

    const handleNavigateWithTransition = (e, path, color = 'bg-primary-dark') => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTransitionOrigin({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        setTransitionColor(color);
        setIsTransitioning(true);

        setTimeout(() => {
            navigate(path);
        }, 800);
    };

    const handleGoBack = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTransitionOrigin({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        setTransitionColor('bg-background-dark');
        setIsTransitioning(true);

        setTimeout(() => {
            navigate(-1);
        }, 800);
    };


    return (
        <div className="min-h-screen bg-background-dark text-gray-100 font-display">
            {/* Page Transition Overlay */}
            {isTransitioning && (
                <div
                    className={`fixed inset-0 z-[100] pointer-events-none ${transitionColor}`}
                    style={{
                        clipPath: `circle(150% at ${transitionOrigin.x}px ${transitionOrigin.y}px)`,
                        animation: 'expandFromButton 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    }}
                />
            )}
            <style>{`
                @keyframes expandFromButton {
                    from {
                        clip-path: circle(0% at ${transitionOrigin.x}px ${transitionOrigin.y}px);
                    }
                    to {
                        clip-path: circle(150% at ${transitionOrigin.x}px ${transitionOrigin.y}px);
                    }
                }
            `}</style>
            <Toast ref={toast} position="top-right" className="custom-toast" />
            <style>{`
                .custom-toast .p-toast-message {
                    backdrop-filter: blur(10px);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                }
                .custom-toast .p-toast-message-success {
                    background: linear-gradient(135deg, #8aa399 0%, #61897c 100%) !important;
                    border: none !important;
                    border-radius: 12px !important;
                }
                .custom-toast .p-toast-message-error {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
                    border: none !important;
                    border-radius: 12px !important;
                }
                .custom-toast .p-toast-message-content {
                    color: #fff !important;
                    padding: 1rem !important;
                }
                .custom-toast .p-toast-summary {
                    font-weight: 600 !important;
                    color: #fff !important;
                }
                .custom-toast .p-toast-detail {
                    color: rgba(255, 255, 255, 0.9) !important;
                    margin-top: 0.25rem !important;
                }
                .custom-toast .p-toast-icon-close {
                    color: #fff !important;
                }
                .custom-toast .p-toast-message-icon {
                    display: none !important;
                }
            `}</style>
            {/* Header */}
            <header className="w-full border-b border-white/5 bg-background-dark/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
                    <div onClick={() => navigate('/')} className="flex items-center gap-3 text-white cursor-pointer group">
                        <h2 className="text-3xl font-semibold tracking-wide uppercase text-primary">Soul Junction</h2>
                    </div>
                    <button onClick={handleGoBack} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-16 px-6 md:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent"></div>
                <div className="absolute top-10 left-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="max-w-[900px] mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
                        <span className="material-symbols-outlined">waving_hand</span>
                        <span className="text-sm font-semibold uppercase tracking-wider">We're Here For You</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6">
                        Contact <span className="font-serif italic text-secondary">Us</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Have questions, feedback, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-8 px-6 md:px-12 ">
                <div className="max-w-[1000px] mx-auto">
                    <div className="flex flex-wrap justify-center gap-6">
                        {contactMethods.map((method, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-secondary/30 transition-all duration-300 text-center w-full md:w-80"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 ">
                                    <span className="material-symbols-outlined text-2xl text-secondary">{method.icon}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
                                <p className="text-gray-500 text-sm mb-2">{method.description}</p>
                                {method.action ? (
                                    <a href={method.action} className="text-primary hover:text-primary-dark transition-colors font-medium">
                                        {method.value}
                                    </a>
                                ) : (
                                    <span className="text-white font-medium">{method.value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & FAQ */}
            <section className="py-12 px-6 md:px-12">
                <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                        <h2 className="text-2xl font-light text-white mb-6">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                                >
                                    <option value="" className="bg-background-dark">Select a topic</option>
                                    <option value="general" className="bg-background-dark">General Inquiry</option>
                                    <option value="support" className="bg-background-dark">Technical Support</option>
                                    <option value="billing" className="bg-background-dark">Billing Question</option>
                                    <option value="feedback" className="bg-background-dark">Feedback</option>
                                    <option value="partnership" className="bg-background-dark">Partnership</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Your Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-xl bg-primary-dark text-white font-medium hover:bg-primary-deep transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* FAQ Section */}
                    <div>
                        <h2 className="text-2xl font-light text-white mb-6">Frequently Asked</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                                >
                                    <h3 className="text-lg font-medium text-white mb-2 flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary mt-0.5">help</span>
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed pl-9">{faq.answer}</p>
                                </div>
                            ))}
                        </div>

                        {/* Additional Help */}
                        {/* <div className="mt-8 p-6 bg-gradient-to-br from-primary-dark/20 to-primary-deep/20 rounded-2xl border border-primary/20">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-2xl text-primary">lightbulb</span>
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-2">Looking for more answers?</h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        Check out our comprehensive help center for guides, tutorials, and troubleshooting tips.
                                    </p>
                                    <button className="text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1">
                                        <span>Visit Help Center</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ContactPage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./../components/Footer";

const IntroPage = () => {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
    const [transitionColor, setTransitionColor] = useState('bg-primary-dark');
    // Testimonials Logic
    const testimonials = [
        {
            quote: "I didn't realize how much noise I was carrying until I found this quiet corner. It's the only app that feels like an exhale.",
            name: "Elena R.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8joqQH76wY929nfMjdCWo90o3YvVrmxLVPT6leihiEFLEotvvSkJl5aSyKDHUcIL2WaaKCKI60M2m4vwYnu7NSD5Xy--Ck59MHJBuQec18_i_gzEO8qoH8bujRpFwmVND68NVoOeXIGiT5PKnRuzNS7LnolI4ZJZ8LssidI1De_1-EYMxLLu78_B7qCOKHQq2qWGRR37gMiZdg210fN7YwbgZVa2vCiwh6X9IE3t31aSri0GpGi2cipvNINfq6wdpAYZP9ThecLd-",
            type: "image"
        },
        {
            quote: "Finally, a space that doesn't demand my attention but gently invites it. The assessment was deeply affirming.",
            name: "Marcus T.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN7p8auJo-NBCsnU4RY-wGmsGfInt9QvOJxcOChQiBqmPg7R8GyeKICVAJt6nwfu3bVlL_p0JrvKrCJTKBuX_p85SshYp-6oN20vebjaoOXblJIfmhF_n9Vcws1kuSq-4yT8FHNUYQhVLqfDny4U3sHoNwsNN8-yPBzkpX50aJOe56EarGsiGN5iI6tgxvLHppDncvC5OmmolYLpGZ90jQKHk3ZYUVGLot6z-EPvkMuXts9p6w9flUSisZvqiZk1zB7Plpx40u4Wcv",
            type: "image"
        },
        {
            quote: "It feels less like a subscription and more like a membership to a secret garden. My safe harbor.",
            name: "Sarah J.",
            initials: "SJ",
            type: "initials"
        },
        {
            quote: "The daily rituals have become my anchor. In a chaotic world, this is the one place I know I can find peace.",
            name: "David K.",
            initials: "DK",
            type: "initials"
        },
        {
            quote: "I love that it doesn't gamify my wellbeing. No streaks, no pressure, just genuine support when I need it.",
            name: "Maya L.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8joqQH76wY929nfMjdCWo90o3YvVrmxLVPT6leihiEFLEotvvSkJl5aSyKDHUcIL2WaaKCKI60M2m4vwYnu7NSD5Xy--Ck59MHJBuQec18_i_gzEO8qoH8bujRpFwmVND68NVoOeXIGiT5PKnRuzNS7LnolI4ZJZ8LssidI1De_1-EYMxLLu78_B7qCOKHQq2qWGRR37gMiZdg210fN7YwbgZVa2vCiwh6X9IE3t31aSri0GpGi2cipvNINfq6wdpAYZP9ThecLd-",
            type: "image"
        },
        {
            quote: "Sleeping better, thinking clearer. The audio soundscapes are pure magic.",
            name: "James P.",
            initials: "JP",
            type: "initials"
        }
    ];

    // Double the testimonials for seamless loop
    const loopedTestimonials = [...testimonials, ...testimonials];
    // Set up scroll-triggered animations
    useEffect(() => {
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        });

        // Observe all elements with scroll-animate class
        const animatedElements = document.querySelectorAll('.scroll-animate');
        animatedElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const handleEnterSpace = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTransitionOrigin({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        setIsTransitioning(true);

        setTimeout(() => {
            navigate('/home');
        }, 800);
    };

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

    return (
        <div className="min-h-screen bg-background-dark text-gray-100 font-display overflow-x-hidden selection:bg-secondary/30">
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
            <style>
                {`
                    @keyframes expandFromButton {
                        from {
                            clip-path: circle(0% at ${transitionOrigin.x}px ${transitionOrigin.y}px);
                        }
                        to {
                            clip-path: circle(150% at ${transitionOrigin.x}px ${transitionOrigin.y}px);
                        }
                    }
                    
                    /* Scroll Animation Classes */
                    .scroll-animate {
                        opacity: 0;
                        transform: translateY(60px);
                        transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                                    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
                    }
                    
                    .scroll-animate.animate-visible {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    .scroll-animate-left {
                        opacity: 0;
                        transform: translateX(-80px);
                        transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                                    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
                    }
                    
                    .scroll-animate-left.animate-visible {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    
                    .scroll-animate-right {
                        opacity: 0;
                        transform: translateX(80px);
                        transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                                    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
                    }
                    
                    .scroll-animate-right.animate-visible {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    
                    .scroll-animate-scale {
                        opacity: 0;
                        transform: scale(0.85);
                        transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
                                    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
                    }
                    
                    .scroll-animate-scale.animate-visible {
                        opacity: 1;
                        transform: scale(1);
                    }
                    
                    .scroll-animate-fade {
                        opacity: 0;
                        transition: opacity 1s ease-out;
                    }
                    
                    .scroll-animate-fade.animate-visible {
                        opacity: 1;
                    }
                    
                    /* Stagger delays */
                    .delay-1 { transition-delay: 0.1s; }
                    .delay-2 { transition-delay: 0.2s; }
                    .delay-3 { transition-delay: 0.3s; }
                    .delay-4 { transition-delay: 0.4s; }
                    .delay-5 { transition-delay: 0.5s; }
                    .delay-6 { transition-delay: 0.6s; }
                    
                    /* Float animation for decorative elements */
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .animate-float-delayed {
                        animation: float 6s ease-in-out infinite;
                        animation-delay: -3s;
                    }
                `}
            </style>

            {/* Header */}
            <header className="w-full border-b border-white/5 bg-background-dark/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
                    <div className="flex items-center gap-3 text-white cursor-pointer group">
                        <h2 className="text-3xl font-extrabold tracking-wide uppercase text-primary">Soul Junction</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        {/* <a href="#" className="text-sm font-medium text-text-muted hover:text-primary-dark transition-colors">Philosophy</a>
                        <a href="#" className="text-sm font-medium text-text-muted hover:text-primary-dark transition-colors">The Journey</a>
                        <a href="#" className="text-sm font-medium text-text-muted hover:text-primary-dark transition-colors">Community</a> */}
                        {/* <Link to="/wave" className="text-sm font-medium text-text-muted hover:text-primary-dark transition-colors">Login</Link> */}
                    </nav>
                    <div className="flex items-center gap-4">
                        <button onClick={handleEnterSpace} className="hidden md:flex cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-primary-dark text-white text-sm font-medium hover:bg-primary-deep transition-colors shadow-sm">
                            <span>Begin</span>
                        </button>
                        <button onClick={(e) => handleNavigateWithTransition(e, '/contact', 'bg-secondary')} className="hidden md:flex cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-secondary text-black text-sm font-medium hover:bg-secondary/90 transition-colors shadow-sm">
                            <span>Contact Us</span>
                        </button>
                        <button className="md:hidden text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative flex flex-col justify-center pt-16 pb-20 md:pt-24 md:pb-28 px-6 md:px-12 max-w-[1280px] mx-auto w-full">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="scroll-animate scroll-animate-left flex flex-col gap-8 md:w-1/2 md:pr-12 text-center md:text-left z-10">
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit mx-auto md:mx-0">
                                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                                <span className="text-xs font-semibold uppercase tracking-widest">Sanctuary Open</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.02em] text-white text-balance">
                                A Quiet Space to <br /><span className="font-serif italic text-primary">Come Back to Yourself.</span>
                            </h1>
                            <p className="text-lg font-light leading-relaxed text-gray-300 max-w-lg mx-auto md:mx-0 text-balance">
                                A digital sanctuary for when the noise gets too loud. No notifications, no endless scrolls. Just a path back to your center.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start items-center">
                            <button onClick={handleEnterSpace} className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary-dark text-white text-base font-medium shadow-lg shadow-primary-dark/20 hover:bg-primary-deep hover:translate-y-[-1px] transition-all duration-300">
                                <span className="tracking-wide">Begin with Stillness</span>
                            </button>
                            <span className="text-sm text-text-muted italic">Join 12,000+ others finding quiet.</span>
                        </div>
                    </div>
                    <div className="scroll-animate scroll-animate-right delay-2 w-full md:w-1/2 relative z-0">
                        <div className="aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-primary/10">
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/30 to-transparent z-10"></div>
                            <div className="w-full h-full bg-center bg-cover scale-100 hover:scale-105 transition-transform duration-[2s] ease-in-out" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtsFWOKGwg0007EeBFBqALbjMgMfSOUa0ND0UKGmjYfmKoAypTX_vIMOZ2Dtplnn2yuQ9d4vJ4o2B4rz3nGahTGJgxfBY3R-3F-lG_8A7JPaQ4W62GbFlNTtwcShJN30ep5WvOxIjKSKihy6heCLV4kF-YuCML6NuBYvUhrTPyg8NbECHwTpWU8-yw6mPZIgF0Ex7cI8Oq2j9pXtfvXkFhZ6MybrvjmUHLhvl7xRlM7bYXF7WKI_cGrMWTzuoypd-zE4aRXtFtRHkq')" }}></div>
                        </div>
                        <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
                        <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float-delayed"></div>
                    </div>
                </div>
            </section>

            {/* Benefits Banner */}
            <section className="w-full border-y border-white/5 py-8 bg-white/5">
                <div className="scroll-animate max-w-[1280px] mx-auto px-6 md:px-12 flex flex-wrap justify-center md:justify-between items-center gap-8 hover:opacity-100 transition-opacity duration-500">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-widest hidden md:block">Mindfully designed for:</span>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">spa</span>
                        <span className="text-sm font-medium text-gray-300">Emotional Safety</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">no_accounts</span>
                        <span className="text-sm font-medium text-gray-300">Private Reflection</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">psychology</span>
                        <span className="text-sm font-medium text-gray-300">Cognitive Rest</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">verified_user</span>
                        <span className="text-sm font-medium text-gray-300">Ethical Design</span>
                    </div>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto text-center">
                <div className="scroll-animate flex flex-col gap-6 items-center">
                    <span className="scroll-animate scroll-animate-scale material-symbols-outlined text-5xl text-secondary mb-4 font-light">graphic_eq</span>
                    <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
                        Modern life is loud. <br className="hidden md:block" />
                        <span className="font-serif italic text-primary">Inner peace is quiet.</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                        We spend our days reacting—to pings, demands, and endless information. Your nervous system wasn't built for constant urgency. It was built for rhythm, cycles, and rest.
                    </p>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-20 bg-white/5">
                <div className="px-6 md:px-12 max-w-[1280px] mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                        <div className="scroll-animate scroll-animate-left flex flex-col gap-8">
                            <h3 className="text-2xl font-serif italic text-secondary text-center md:text-left">What this isn't</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4 opacity-60">
                                    <span className="material-symbols-outlined text-red-400">close</span>
                                    <div>
                                        <h4 className="font-bold text-white">Another productivity tool</h4>
                                        <p className="text-sm text-text-muted mt-1">We don't optimize you. We help you be you.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 opacity-60">
                                    <span className="material-symbols-outlined text-red-400">close</span>
                                    <div>
                                        <h4 className="font-bold text-white">Gamified mindfulness</h4>
                                        <p className="text-sm text-text-muted mt-1">No streaks to lose. No badges to earn. Just peace.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 opacity-60">
                                    <span className="material-symbols-outlined text-red-400">close</span>
                                    <div>
                                        <h4 className="font-bold text-white">Social media</h4>
                                        <p className="text-sm text-text-muted mt-1">No feeds. No likes. No performance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="scroll-animate scroll-animate-right delay-2 flex flex-col gap-8 relative">
                            <div className="hidden md:block absolute -left-12 lg:-left-12 top-0 bottom-0 w-px bg-white/10"></div>
                            <h3 className="text-2xl font-serif italic text-primary text-center md:text-left">What this is</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    <div>
                                        <h4 className="font-bold text-white">A digital retreat center</h4>
                                        <p className="text-sm text-text-muted mt-1">A curated space designed to lower your cortisol instantly.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    <div>
                                        <h4 className="font-bold text-white">Self-paced restoration</h4>
                                        <p className="text-sm text-text-muted mt-1">Resources that wait for you, available whenever you are ready.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    <div>
                                        <h4 className="font-bold text-white">Deep, not wide</h4>
                                        <p className="text-sm text-text-muted mt-1">Quality guidance over quantity of content.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Membership Section */}
            <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="scroll-animate scroll-animate-left lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                            <div className="absolute inset-0 bg-primary-dark/20 z-10"></div>
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJdMyjwKo1ed4KViaAMeXLNG8O8Mk51H2QWUz4iljGjzJnCJeCzQDd89RYrar5g0IPghMeFv_Ve1-NHc0ycaK1oE5ZcIcJyNKvSjGIiTffY9NH-reHsISIjmzddk0121MJAPawEfuLaKzggm3uOe-Jjuox-bu3yjm2chTy-OYTIQTDvXSTPnwHzhal5zG0XtgstpAEs2iqXEFXC4xvPPipaczfOJgARUHADlcAS3HPnMDcCnrLFhMdK0dJtovOnTWGeFAutW8jnRx1')" }}></div>
                        </div>
                    </div>
                    <div className="scroll-animate scroll-animate-right delay-2 lg:w-1/2 flex flex-col gap-6">
                        <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider rounded-full w-fit">Relationship, not Transaction</div>
                        <h2 className="text-3xl md:text-4xl font-light text-white">
                            Not something you use. <br />
                            <span className="font-serif italic text-secondary">Something you return to.</span>
                        </h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Think of your membership not as a subscription fee, but as an offering to your future self. It's the key to a room that is always clean, quiet, and ready to receive you—even if you haven't visited in weeks.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            We don't punish absence. We celebrate return.
                        </p>
                        <div className="pt-4">
                            <button className="text-primary font-bold border-b-2 border-primary/30 hover:border-primary transition-colors pb-1">Read our pledge to you</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
                <div className="scroll-animate bg-gradient-to-br from-secondary/10 to-primary/10 rounded-3xl p-8 md:p-16 overflow-hidden relative border border-white/10">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white mb-6">
                            <span className="material-symbols-outlined">support_agent</span>
                            <span className="text-sm font-semibold uppercase tracking-wider">We're Here to Help</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
                            Have Questions? <span className="font-serif italic text-secondary">We're Listening.</span>
                        </h2>

                        <p className="text-lg md:text-xl font-light leading-relaxed text-white/90 mb-8">
                            Whether you need support, have feedback, or just want to connect with our team, we're here for you.
                            Your journey matters to us, and we're committed to ensuring you have the best experience possible.
                        </p>

                        <button
                            onClick={(e) => handleNavigateWithTransition(e, '/contact', 'bg-secondary')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary text-background-dark font-semibold hover:bg-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <span>Contact Us</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>

                        {/* <p className="text-sm text-white/60 mt-6">
                            Average response time: 24-48 hours
                        </p> */}
                    </div>
                </div>
            </section>

            {/* Journey Steps */}
            <section className="py-20 bg-white/5">
                <div className="px-6 md:px-12 max-w-[1280px] mx-auto">
                    <div className="scroll-animate text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-light text-white">The Journey Home</h2>
                        <p className="mt-4 text-text-muted">A gentle structure for your spiritual unfolding.</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connector line for desktop */}
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-white/10 -z-10 w-[80%] mx-auto"></div>

                        <div className="scroll-animate scroll-animate-scale delay-1 flex flex-col items-center text-center gap-4 group">
                            <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                                <span className="material-symbols-outlined text-3xl text-primary">person_search</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">1. The Reflection</h3>
                            <p className="text-sm text-text-muted leading-relaxed px-2">A non-judgmental assessment to see where your spirit currently rests.</p>
                        </div>
                        <div className="scroll-animate scroll-animate-scale delay-2 flex flex-col items-center text-center gap-4 group">
                            <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                                <span className="material-symbols-outlined text-3xl text-primary">draw</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">2. The Blueprint</h3>
                            <p className="text-sm text-text-muted leading-relaxed px-2">Receive a personalized map of practices tailored to your emotional profile.</p>
                        </div>
                        <div className="scroll-animate scroll-animate-scale delay-3 flex flex-col items-center text-center gap-4 group">
                            <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                                <span className="material-symbols-outlined text-3xl text-primary">self_improvement</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">3. The Practice</h3>
                            <p className="text-sm text-text-muted leading-relaxed px-2">Small, daily rituals. Guided audio, journaling prompts, and silence.</p>
                        </div>
                        <div className="scroll-animate scroll-animate-scale delay-4 flex flex-col items-center text-center gap-4 group">
                            <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                                <span className="material-symbols-outlined text-3xl text-primary">all_inclusive</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">4. The Integration</h3>
                            <p className="text-sm text-text-muted leading-relaxed px-2">Monthly circles to integrate insights and deepen your inner oneness.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Personalization */}
            <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto w-full">
                <div className="scroll-animate bg-gradient-to-br from-primary-dark to-primary-deep rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-light mb-6">Personalization, <span className="font-serif italic text-secondary">Without Labels.</span></h2>
                        <p className="text-lg md:text-xl font-light leading-relaxed text-white/90 mb-8">
                            We don't categorize you as "stressed" or "anxious." You are complex and ever-changing. Our system flows with your energy, suggesting softer practices for tender days and deeper work for days of strength.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                <span className="material-symbols-outlined text-secondary mt-1">waves</span>
                                <div>
                                    <h4 className="font-bold">Fluid Adaptation</h4>
                                    <p className="text-sm text-white/70 mt-1">Inputs your mood daily to shift your recommended flow.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                <span className="material-symbols-outlined text-secondary mt-1">fingerprint</span>
                                <div>
                                    <h4 className="font-bold">Your Unique Rhythm</h4>
                                    <p className="text-sm text-white/70 mt-1">Learns the time of day you find most peace.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 dark:bg-background-dark overflow-hidden">
                <div className="max-w-[1280px] mx-auto text-center mb-10 px-6">
                    <p className="text-sm font-bold uppercase tracking-widest text-text-muted">Whispers from the community</p>
                </div>

                <div className="relative w-full overflow-hidden mask-gradient">
                    <style>{`
                        @keyframes scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-scroll {
                            animation: scroll 40s linear infinite;
                        }
                        .mask-gradient {
                            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                        }
                        .animate-scroll:hover {
                            animation-play-state: paused;
                        }
                    `}</style>
                    <div className="flex gap-6 w-max animate-scroll px-4">
                        {loopedTestimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow min-w-[300px] w-[350px] md:w-[400px] border"
                                style={{
                                    backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                                    borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)'
                                }}
                            >
                                <p className="text-text-muted italic text-sm leading-relaxed text-left">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3 mt-auto">
                                    {testimonial.type === 'image' ? (
                                        <div className="w-8 h-8 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${testimonial.image}')` }}></div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0">
                                            {testimonial.initials}
                                        </div>
                                    )}
                                    <span className="text-xs font-bold  text-[#fff]">{testimonial.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Privacy Pledge */}
            <section className="py-12 bg-background-dark border-t border-white/5">
                <div className="px-6 md:px-12 max-w-[900px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 mb-4 text-text-muted/80">
                        <span className="material-symbols-outlined text-lg">lock</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Your Data is Sacred</span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                        We believe your spiritual journey is private. We never sell your data, we don't use manipulative algorithms to keep you scrolling, and you can export your journal entries or delete your account fully at any time. This is a safe container.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 md:px-12 bg-white/5 w-full">
                <div className="scroll-animate max-w-[720px] mx-auto flex flex-col items-center text-center gap-8">
                    <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
                        The door is open. <br />
                        <span className="font-serif italic text-primary">Will you step inside?</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-lg mx-auto">
                        Begin your journey to inner oneness today. No pressure. No rush. Just peace.
                    </p>
                    <div className="flex flex-col w-full items-center gap-4">
                        <button onClick={handleEnterSpace} className="w-full max-w-xs h-14 rounded-full bg-primary-dark text-white text-lg font-medium shadow-xl shadow-primary-dark/25 hover:scale-105 hover:bg-primary-deep transition-all duration-300 cursor-pointer">
                            Enter the Space
                        </button>
                        <p className="text-xs text-gray-500">Free 7-day sanctuary pass included.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default IntroPage;

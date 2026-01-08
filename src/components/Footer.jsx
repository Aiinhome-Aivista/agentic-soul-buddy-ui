import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-background-dark border-t border-white/10 pt-16 pb-8 px-6 md:px-12">
            <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-white cursor-pointer" onClick={() => navigate('/')}>
                            <span className="text-lg font-extrabold tracking-wide uppercase">Soul Junction</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                            A mindful technology company dedicated to human flourishing and spiritual oneness.
                        </p>
                    </div>
                    <div className="flex gap-16 flex-wrap">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Get In Touch</h4>
                            <a href="/contact" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-primary transition-colors">Contact Us</a>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Legal</h4>
                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-primary transition-colors">Terms of Use</a>
                            <a href="/cookie-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-primary transition-colors">Cookie Policy</a>
                            <a href="/subscription-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-primary transition-colors">Subscription Policy</a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">© 2026 Soul Junction Inc. All rights reserved.</p>
                    {/* <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                        <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
                        </a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;

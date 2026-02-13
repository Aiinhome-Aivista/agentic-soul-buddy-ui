import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { apiService } from '../../service/apiService';
import { get_url1 } from '../../connection/connection';
import { devUrl1 } from '../../env/env';

const Blog = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All Stories");
    const [categories, setCategories] = useState([]);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
    const [transitionColor, setTransitionColor] = useState('bg-background-dark');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await apiService({
                    url: get_url1.blogposts,
                    method: 'GET'
                });
                console.log("Blog API Response:", response);

                let posts = [];
                if (response?.data && Array.isArray(response.data)) {
                    posts = response.data;
                } else if (Array.isArray(response)) {
                    posts = response;
                }

                if (posts.length > 0) {

                    const sortedPosts = posts.sort((a, b) => {
                        // is_pinned can be 1/0 or true/false
                        const isPinnedA = a.is_pinned === 1 || a.is_pinned === true;
                        const isPinnedB = b.is_pinned === 1 || b.is_pinned === true;

                        if (isPinnedA && !isPinnedB) return -1;
                        if (!isPinnedA && isPinnedB) return 1;
                        return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
                    });
                    setBlogPosts(sortedPosts);
                } else {
                    console.error("Invalid blog data format or empty", response);
                    setBlogPosts([]);
                }
            } catch (err) {
                console.error("Failed to fetch blogs", err);
                setError("Failed to load stories.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService({
                    url: get_url1.categories,
                    method: 'GET'
                });
                if (response?.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                } else if (Array.isArray(response)) {
                    setCategories(response);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const filteredPosts = blogPosts
        .filter(post => {
            const matchesCategory = selectedCategory === "All Stories" || (post.category_name || post.category) === selectedCategory;
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.content_preview || post.content || "").toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const displayedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            navigate('/');
        }, 800);
    };

    // Helper to process image URL
    const getImageUrl = (imagePath) => {
        // Default image (peaceful landscape) if no image path is provided
        if (!imagePath) return 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8joqQH76wY929nfMjdCWo90o3YvVrmxLVPT6leihiEFLEotvvSkJl5aSyKDHUcIL2WaaKCKI60M2m4vwYnu7NSD5Xy--Ck59MHJBuQec18_i_gzEO8qoH8bujRpFwmVND68NVoOeXIGiT5PKnRuzNS7LnolI4ZJZ8LssidI1De_1-EYMxLLu78_B7qCOKHQq2qWGRR37gMiZdg210fN7YwbgZVa2vCiwh6X9IE3t31aSri0GpGi2cipvNINfq6wdpAYZP9ThecLd-';
        if (imagePath.startsWith('http')) return imagePath;
        return `${devUrl1}${imagePath.replace(/^\/+/, '')}`;
    };

    // Helper to strip HTML for description
    const stripHtml = (html) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    return (
        <div className="bg-background-dark text-main antialiased overflow-x-hidden selection:bg-primary/30  min-h-screen">
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
            <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

            <header className="w-full border-b border-white/5 bg-background-dark/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
                    <div onClick={() => navigate('/')} className="flex items-center gap-3 text-white cursor-pointer group">
                        <h2 className="text-3xl font-semibold tracking-wide uppercase text-primary">Souljunction</h2>
                    </div>
                    <button onClick={handleGoBack} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>
            </header>

            <section className="py-10 px-20 md:px-24 bg-white/[0.01] border-t border-white/5">
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
                        <div className="max-w-2xl w-full flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-4xl md:text-5xl  text-white tracking-tight mb-6">
                                    Blogs &amp; <span className="italic text-primary">Stories</span>
                                </h2>
                                <p className="text-text-muted text-lg font-light leading-relaxed">Deep dives into the art of being, curated for your quiet moments.</p>
                            </div>

                            {/* Search Icon (Added here) */}
                            <div
                                className={`flex items-center justify-center -mr-160 bg-white/5 border border-white/10 rounded-full transition-all duration-500 ease-in-out group/search h-9 mt-2 ml-4 ${isSearchExpanded ? 'w-48 px-3' : 'w-9 justify-center'
                                    }`}
                                onMouseEnter={() => setIsSearchExpanded(true)}
                                onMouseLeave={() => !searchQuery && setIsSearchExpanded(false)}
                            >
                                <button
                                    onClick={() => {
                                        if (searchQuery) {
                                            setSearchQuery("");
                                        }
                                    }}
                                    className={`flex items-center  shrink-0 transition-colors ${isSearchExpanded ? 'text-primary' : 'text-text-muted group-hover/search:text-primary'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {isSearchExpanded && searchQuery ? 'close' : 'search'}
                                    </span>
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`bg-transparent border-none text-[10px] text-white focus:outline-none transition-all duration-500 ${isSearchExpanded ? 'w-full ml-2 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                                        }`}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1 cursor-pointer">
                            <button
                                onClick={() => handleCategoryClick("All Stories")}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "All Stories" ? 'bg-primary text-white' : 'bg-white/5 text-text-muted hover:bg-primary hover:text-white'}`}
                            >
                                All Stories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.category_name || cat.name)}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === (cat.category_name || cat.name) ? 'bg-primary text-white' : 'bg-white/5 text-text-muted hover:bg-primary hover:text-white'}`}
                                >
                                    {cat.category_name || cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-400">
                            <p>{error}</p>
                        </div>
                    ) : displayedPosts.length === 0 ? (
                        <div className="text-center py-20 text-text-muted">
                            <p className="text-xl">No blog posts found.</p>
                            <p className="text-sm mt-2 opacity-70">Check back later for new stories.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                                {displayedPosts.map((post) => (
                                    <div key={post.id} className="h-full">
                                        <div className="bg-surface-dark rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl hover:border-primary/30 transition-all duration-700 flex flex-col h-full group">
                                            <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => navigate(`/blog/details/${post.id}`)}>
                                                <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${getImageUrl(post.image_url || post.featured_image || post.image)}')` }}></div>
                                            </div>
                                            <div className="p-8 flex flex-col flex-grow">
                                                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4">{post.category_name || post.category || "General"}</span>
                                                <h3 className="text-2xl  text-white mb-4 leading-snug">{post.title}</h3>
                                                <p className="text-text-muted font-light text-sm leading-relaxed mb-6">{stripHtml(post.content_preview || post.content).substring(0, 120)}...</p>
                                                <button className="mt-auto inline-flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-widest group/link cursor-pointer transition-colors" onClick={() => navigate(`/blog/details/${post.id}`)}>
                                                    Read Journal
                                                    <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-12 pb-12">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all ${currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'text-text-muted hover:border-primary hover:text-white'}`}
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>

                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentPage === page ? 'bg-primary text-white scale-110' : 'bg-white/5 text-text-muted hover:bg-white/10 text-white'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all ${currentPage === totalPages ? 'text-white/20 cursor-not-allowed' : 'text-text-muted hover:border-primary hover:text-white'}`}
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>


            {/* <Footer /> */}
            <Footer />

        </div>
    );
};

export default Blog;
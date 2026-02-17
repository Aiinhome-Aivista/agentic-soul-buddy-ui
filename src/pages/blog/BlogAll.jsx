import React, { useState, useEffect, useRef } from 'react';
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
    const [selectedSubCategory, setSelectedSubCategory] = useState("All Subcategories");
    const [categories, setCategories] = useState([]);
    const [isSearchExpanded, setIsSearchExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
    const [transitionColor, setTransitionColor] = useState('bg-background-dark');
    const categoryScrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    url: get_url1.subcategories,
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
        setSelectedSubCategory("All Subcategories");
        setActiveDropdown(null);
        setCurrentPage(1);
    };

    const checkScrollButtons = () => {
        if (categoryScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scrollCategories = (direction) => {
        if (categoryScrollRef.current) {
            const scrollAmount = 200;
            categoryScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        checkScrollButtons();
        const handleResize = () => checkScrollButtons();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [categories]);

    const filteredPosts = blogPosts
        .filter(post => {
            const postCategory = post.category_name || post.category || "";
            const postSubCategory = post.subcategory_name || post.subcategory || "";

            const matchesCategory = selectedCategory === "All Stories" || postCategory === selectedCategory;
            const matchesSubCategory = selectedSubCategory === "All Subcategories" || postSubCategory === selectedSubCategory;

            const matchesSearch = searchQuery === "" ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                postCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                postSubCategory.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSubCategory && matchesSearch;
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

    // Helper function to create URL-friendly slug from title
    const createSlug = (title) => {
        return encodeURIComponent(title.replace(/\s+/g, '-'));
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
                        <img src={get_url1.logo} alt="Souljunction" className="h-10 w-10 rounded-full object-cover" />
                        <h2 className="text-3xl font-semibold tracking-wide uppercase text-primary">Souljunction</h2>
                    </div>
                    <button onClick={handleGoBack} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>
            </header>

            <section className="py-10 px-20 md:px-24 bg-white/[0.01] border-t border-white/5">
                <div className="max-w-360 mx-auto">
                    <div className="flex justify-between items-start mb-12">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl text-white tracking-tight mb-3">
                                Blogs &amp; <span className="italic text-primary">Stories</span>
                            </h2>
                            <p className="text-text-muted text-lg font-light leading-relaxed">Deep dives into the art of being, curated for your quiet moments.</p>
                        </div>

                        {/* Search Bar - Persistently Open */}
                        <div
                            className={`flex items-center justify-center bg-white/5 border border-white/10 rounded-full transition-all duration-500 ease-in-out group/search h-9 mt-2 ml-4 w-60 px-3`}
                        >
                            <button
                                onClick={() => {
                                    if (searchQuery) {
                                        setSearchQuery("");
                                    }
                                }}
                                className={`flex items-center shrink-0 transition-colors text-primary`}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {searchQuery ? 'close' : 'search'}
                                </span>
                            </button>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-transparent border-none text-[10px] text-white focus:outline-none transition-all duration-500 w-full ml-2 opacity-100`}
                            />
                        </div>
                    </div>


                    <div className="relative mb-20 max-w-310 mx-auto z-60 h-11 pointer-events-none">

                        <button
                            onClick={() => scrollCategories('left')}
                            disabled={!canScrollLeft}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center transition-all z-[70] pointer-events-auto ${canScrollLeft ? 'text-text-muted hover:border-primary hover:text-white bg-white/5' : 'text-white/20 cursor-not-allowed bg-white/5'}`}
                        >
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>


                        <div className="absolute inset-0 pointer-events-none ">
                            <div
                                ref={categoryScrollRef}
                                onScroll={checkScrollButtons}
                                className="overflow-x-auto hide-scrollbar -mb-60 pb-64 pt-1 cursor-pointer pointer-events-auto"
                            >
                                <div className="flex gap-4 w-fit mx-auto px-10 pointer-events-none">
                                    <div className="relative group pointer-events-auto">
                                        <div
                                            className={`flex items-center h-full rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer ${selectedCategory === "All Stories" ? 'bg-primary text-white scale-105 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/5 text-text-muted hover:bg-primary hover:text-white'}`}
                                        >
                                            <button
                                                onClick={() => {
                                                    if (selectedCategory === "All Stories") {
                                                        setActiveDropdown(activeDropdown === "all" ? null : "all");
                                                    } else {
                                                        handleCategoryClick("All Stories");
                                                    }
                                                }}
                                                className="px-6 py-1.5 rounded-l-full h-full flex items-center cursor-pointer"
                                            >
                                                All Stories
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === "all" ? null : "all");
                                                }}
                                                className={`px-3 py-1.5 rounded-r-full transition-colors flex items-center h-full cursor-pointer ${activeDropdown === "all" ? 'text-white' : ''}`}
                                            >
                                                <span className={`material-symbols-outlined text-sm transition-transform duration-300 cursor-pointer ${activeDropdown === "all" ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                            </button>
                                        </div>
                                        {activeDropdown === "all" && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute top-full left-0 mt-3 w-56 bg-surface-dark/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 cursor-pointer"
                                            >
                                                <div className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-white italic">
                                                    No Subcategories
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {categories.map((cat, index) => {
                                        const categoryName = cat.category_name || cat.name;
                                        const categoryId = cat.id || categoryName || index;
                                        const hasSubcategories = cat.subcategories?.length > 0;
                                        const isOpen = activeDropdown === categoryId;
                                        const isSelected = selectedCategory === categoryName;

                                        // Dynamic label: show subcategory name if selected, otherwise category name
                                        const displayLabel = (isSelected && selectedSubCategory !== "All Subcategories")
                                            ? selectedSubCategory
                                            : categoryName;

                                        return (
                                            <div key={categoryId} className="relative group pointer-events-auto">
                                                <div
                                                    className={`flex items-center h-full rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer ${isSelected ? 'bg-primary text-white scale-105 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/5 text-text-muted hover:bg-primary hover:text-white'}`}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            if (isSelected && selectedSubCategory !== "All Subcategories") {
                                                                // If a subcategory is selected, clicking the label resets to base category
                                                                setSelectedSubCategory("All Subcategories");
                                                                setActiveDropdown(null);
                                                            } else if (isSelected) {
                                                                setActiveDropdown(isOpen ? null : categoryId);
                                                            } else {
                                                                handleCategoryClick(categoryName);
                                                            }
                                                        }}
                                                        className="px-6 py-1.5 rounded-l-full h-full flex items-center cursor-pointer"
                                                    >
                                                        {displayLabel}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDropdown(isOpen ? null : categoryId);
                                                        }}
                                                        className={`px-3 py-1.5 rounded-r-full transition-colors flex items-center h-full cursor-pointer ${isOpen ? 'text-white' : ''}`}
                                                    >
                                                        <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                            expand_more
                                                        </span>
                                                    </button>
                                                </div>


                                                {isOpen && (
                                                    <div
                                                        ref={dropdownRef}
                                                        className="absolute top-full left-0 mt-3 w-56 bg-surface-dark/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                                                    >
                                                        <div className="py-3 px-2">
                                                            {hasSubcategories ? (
                                                                <>
                                                                    {cat.subcategories.map((sub, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={() => {
                                                                                setSelectedCategory(categoryName);
                                                                                setSelectedSubCategory(sub);
                                                                                setActiveDropdown(null);
                                                                                setCurrentPage(1);
                                                                            }}
                                                                            className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer mb-1 ${selectedSubCategory === sub ? 'text-primary bg-white/5 rounded-full' : 'text-white hover:bg-white/5 rounded-full'}`}
                                                                        >
                                                                            {sub}
                                                                        </button>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <div className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white italic">
                                                                    No Subcategories
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Arrow - Absolutely positioned */}
                        <button
                            onClick={() => scrollCategories('right')}
                            disabled={!canScrollRight}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center transition-all z-[70] pointer-events-auto ${canScrollRight ? 'text-text-muted hover:border-primary hover:text-white bg-white/5' : 'text-white/20 cursor-not-allowed bg-white/5'}`}
                        >
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
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
                            <span className="material-symbols-outlined text-6xl mb-2">article_shortcut</span>
                            <p className="text-xl">No blog posts found.</p>
                            {/* <p className="text-sm mt-2 opacity-70">Check back later for new stories.</p> */}
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                                {displayedPosts.map((post) => (
                                    <div key={post.id} className="h-full">
                                        <div className="bg-surface-dark rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl hover:border-primary/30 transition-all duration-700 flex flex-col h-full group">
                                            <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => navigate(`/blog/${createSlug(post.title)}`)}>
                                                <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${getImageUrl(post.image_url || post.featured_image || post.image)}')` }}></div>
                                            </div>
                                            <div className="p-8 flex flex-col flex-grow">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCategoryClick(post.category_name || post.category || "General");
                                                        }}
                                                        className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] cursor-pointer hover:text-primary transition-colors"
                                                    >
                                                        {post.category_name || post.category || "General"}
                                                    </span>
                                                    {(post.subcategory_name || post.subcategory) && (
                                                        <>
                                                            <span className="text-[10px] text-white/20">•</span>
                                                            <span
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedCategory(post.category_name || post.category || "General");
                                                                    setSelectedSubCategory(post.subcategory_name || post.subcategory);
                                                                    setCurrentPage(1);
                                                                    setActiveDropdown(null);
                                                                }}
                                                                className="text-[10px] font-black text-primary uppercase tracking-[0.3em] cursor-pointer hover:text-white transition-colors"
                                                            >
                                                                {post.subcategory_name || post.subcategory}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl  text-white mb-4 leading-snug">{post.title}</h3>
                                                <p className="text-text-muted font-light text-sm leading-relaxed mb-6">{stripHtml(post.content_preview || post.content).substring(0, 120)}...</p>
                                                <button className="mt-auto inline-flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-widest group/link cursor-pointer transition-colors" onClick={() => navigate(`/blog/${createSlug(post.title)}`)}>
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
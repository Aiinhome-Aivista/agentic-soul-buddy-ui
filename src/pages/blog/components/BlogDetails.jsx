import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer';
import { apiService } from '../../../service/apiService';
import { get_url1, POST_url1, devUrl1 } from '../../../connection/connection';
import SocialShare from './SocialShare';

const BlogDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
  const [transitionColor, setTransitionColor] = useState('bg-background-dark');

  // Helper to parse tags
  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
      return tags.split(',').map(t => t.trim());
    } catch (e) {
      return tags.split(',').map(t => t.trim());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all blogs to find the one matching the title
        const allResponse = await apiService({
          url: get_url1.blogposts,
          method: 'GET'
        });

        let blogsList = [];
        if (Array.isArray(allResponse)) {
          blogsList = allResponse;
        } else if (allResponse?.data && Array.isArray(allResponse.data)) {
          blogsList = allResponse.data;
        } else if (allResponse?.data) {
          blogsList = [allResponse.data];
        }

        console.log("Details Debug - API Response (all blogs):", allResponse);
        console.log("Details Debug - Blogs List:", blogsList);

        setAllBlogs(blogsList);


        const decodedTitle = decodeURIComponent(title).replace(/-/g, ' ');
        console.log("Details Debug - Title from URL:", title, "Decoded:", decodedTitle);


        const currentBlog = blogsList.find(b =>
          b.title.toLowerCase() === decodedTitle.toLowerCase()
        );
        console.log("Details Debug - Found Blog:", currentBlog);

        if (currentBlog) {
          setBlog(currentBlog);
          // Update document title with blog title
          document.title = `${currentBlog.title} - Souljunction`;

          // Fetch related blogs using the filter API
          fetchRelatedBlogs(currentBlog);
        } else {
          setError("Blog not found.");
          document.title = "Blog Not Found - Souljunction";
        }

      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load blog details.");
        document.title = "Error - Souljunction";
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);

    // Cleanup: reset title when component unmounts
    return () => {
      document.title = "Souljunction";
    };
  }, [title]);

  // Fetch related blogs using the filter API
  const fetchRelatedBlogs = async (currentBlog) => {
    try {
      const filterPayload = {
        category_name: currentBlog.category_name || currentBlog.category,
        tags: parseTags(currentBlog.tags)
      };

      console.log("Fetching related blogs with filter:", filterPayload);

      const response = await apiService({
        url: POST_url1.related_blogs,
        method: 'POST',
        data: filterPayload
      });

      console.log("Related blogs API response:", response);

      // Extract blogs from response
      let relatedBlogsList = [];
      if (response?.data && Array.isArray(response.data)) {
        relatedBlogsList = response.data;
      } else if (Array.isArray(response)) {
        relatedBlogsList = response;
      }

      // Filter out the current blog and limit to 6
      const filteredRelated = relatedBlogsList
        .filter(b => b.id !== currentBlog.id)
        .slice(0, 6);

      setRelatedBlogs(filteredRelated);
    } catch (err) {
      console.error("Failed to fetch related blogs:", err);
      setRelatedBlogs([]);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8joqQH76wY929nfMjdCWo90o3YvVrmxLVPT6leihiEFLEotvvSkJl5aSyKDHUcIL2WaaKCKI60M2m4vwYnu7NSD5Xy--Ck59MHJBuQec18_i_gzEO8qoH8bujRpFwmVND68NVoOeXIGiT5PKnRuzNS7LnolI4ZJZ8LssidI1De_1-EYMxLLu78_B7qCOKHQq2qWGRR37gMiZdg210fN7YwbgZVa2vCiwh6X9IE3t31aSri0GpGi2cipvNINfq6wdpAYZP9ThecLd-';
    if (imagePath.startsWith('http')) return imagePath;
    return `${devUrl1}${imagePath.replace(/^\/+/, '')}`;
  };

  // Helper function to create URL-friendly slug from title
  const createSlug = (title) => {
    return encodeURIComponent(title.replace(/\s+/g, '-'));
  };

  const handleGoBack = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTransitionOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setTransitionColor('bg-[#1a1f1d]');
    setIsTransitioning(true);

    setTimeout(() => {
      navigate('/blog/all');
    }, 800);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Logic for Previous, Next
  const currentBlogId = blog?.id;

  // Filter related blogs by search query (client-side)
  const filteredRelatedBlogs = relatedBlogs.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find current index for Prev/Next
  const currentIndex = allBlogs.findIndex(b => b.id === currentBlogId);
  const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextPost = currentIndex !== -1 && currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="bg-[#1a1f1d] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6a8c7e]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-[#1a1f1d] min-h-screen flex flex-col justify-center items-center text-[#e5e7eb] gap-4">
        <p className="text-xl text-red-400">{error || "Blog not found"}</p>
        <button onClick={() => navigate('/blog/all')} className="text-[#6a8c7e] hover:underline">
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f1d] text-[#e5e7eb] overflow-x-hidden selection:bg-[#6a8c7e]/30 min-h-screen">
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
      `}</style>

      <header className="w-full border-b border-white/5 bg-[#1a1f1d]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
          <div onClick={() => navigate('/blog/all')} className="flex items-center gap-3 text-white cursor-pointer group">
            <img src={get_url1.logo} alt="Souljunction" className="h-10 w-10 rounded-full object-cover" />
            <h2 className="text-3xl font-semibold tracking-wide uppercase text-[#6a8c7e]">Souljunction</h2>
          </div>
          <button onClick={handleGoBack} className="flex items-center gap-2 text-[#9ca3af] hover:text-[#6a8c7e] transition-colors cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </header>

      <main className="pt-10 pb-24">

        <section className="max-w-[1360px] mx-auto px-6 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <nav className="flex items-center gap-2 text-base text-[#9ca3af] mb-4 md:mb-0">
              <button
                onClick={() => navigate('/')}
                className="hover:text-[#6a8c7e] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span className="text-white/20 select-none">&gt;</span>
              <button
                onClick={() => navigate('/blog/all')}
                className="hover:text-[#6a8c7e] transition-colors cursor-pointer"
              >
                Blogs
              </button>
              <span className="text-white/20 select-none">&gt;</span>
              <span
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white font-medium truncate max-w-[200px] md:max-w-[400px] cursor-pointer hover:text-[#6a8c7e] transition-colors"
                title={blog.title}
              >
                {blog.title}
              </span>
            </nav>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">{blog.author_name || "Unknown Author"}</p>
                <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest">
                  {new Date(blog.created_at || blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border border-[#6a8c7e]/20 p-0.5">
                <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8joqQH76wY929nfMjdCWo90o3YvVrmxLVPT6leihiEFLEotvvSkJl5aSyKDHUcIL2WaaKCKI60M2m4vwYnu7NSD5Xy--Ck59MHJBuQec18_i_gzEO8qoH8bujRpFwmVND68NVoOeXIGiT5PKnRuzNS7LnolI4ZJZ8LssidI1De_1-EYMxLLu78_B7qCOKHQq2qWGRR37gMiZdg210fN7YwbgZVa2vCiwh6X9IE3t31aSri0GpGi2cipvNINfq6wdpAYZP9ThecLd-')" }}></div>
              </div>
              <div className="text-left md:hidden">
                <p className="text-sm font-medium text-white">{blog.author_name || "Unknown Author"}</p>
                <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest">
                  {new Date(blog.created_at || blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center max-w-[800px] mx-auto">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.15] text-balance mb-6">
              {(() => {
                const words = blog.title.split(' ');
                const totalWords = words.length;

                // Determine how many words to style based on title length
                let wordsToStyle = 2;
                if (totalWords > 10) {
                  wordsToStyle = 4;
                } else if (totalWords > 6) {
                  wordsToStyle = 3;
                }

                if (totalWords <= wordsToStyle) {
                  return <span className="italic text-[#6a8c7e]">{blog.title}</span>;
                }

                const mainPart = words.slice(0, -wordsToStyle).join(' ');
                const styledPart = words.slice(-wordsToStyle).join(' ');
                return (
                  <>
                    {mainPart} <span className="italic text-[#6a8c7e]">{styledPart}</span>
                  </>
                );
              })()}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block px-5 py-1.5 bg-[#6a8c7e]/10 border border-[#6a8c7e]/20 text-[#6a8c7e] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                {blog.category_name || blog.category || "Story"}
              </span>
              {(blog.subcategory_name || blog.subcategory) && (
                <>
                  <span className="text-[#9ca3af] text-[10px]">•</span>
                  <span className="inline-block px-5 py-1.5 bg-[#6a8c7e]/20 border border-[#6a8c7e]/30 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                    {blog.subcategory_name || blog.subcategory}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>
        <section className="max-w-[1000px] mx-auto px-6 mb-24">
          <div className="w-full aspect-[21/10] rounded-3xl overflow-hidden shadow-2xl relative border border-white/5">
            <div className="absolute inset-0 bg-[#1a1f1d]/20"></div>
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${getImageUrl(blog.image_url || blog.featured_image || blog.image)}')` }}></div>
          </div>
        </section>
        <div className="max-w-[1360px] mx-auto  flex flex-col lg:flex-row justify-between gap-12 lg:gap-0">
          <article className="lg:w-[75%] max-w-[950px] text-lg md:text-xl text-[#e5e7eb]/90  [&_img]:rounded-2xl [&_img]:overflow-hidden lg:pr-8">
            {blog.content ? (
              <div className="prose prose-invert max-w-none">
                {blog.content_preview && (
                  <div dangerouslySetInnerHTML={{ __html: blog.content_preview }} />

                )}
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            ) : (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content_preview }}
              />
            )}


            {/* Tags */}
            {blog.tags && parseTags(blog.tags).length > 0 && (
              <div className="flex items-center gap-4 py-8 clear-both">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest shrink-0">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {parseTags(blog.tags).map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-[#232926] border border-white/10 rounded-full text-xs text-[#9ca3af] uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="flex items-center gap-4 border-t border-white/10  pt-5 clear-both">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest shrink-0">Share:</h3>
              <SocialShare />
            </div>

            {/* Post Navigation */}
            <div className="pt-15 grid grid-cols-1 md:grid-cols-2 gap-30 md:gap-40">
              {
                prevPost ? (
                  <div
                    onClick={() => navigate(`/blog/${createSlug(prevPost.title)}`)}
                    className="cursor-pointer group p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-left"
                  >
                    <p className="text-xs uppercase tracking-widest text-[#6a8c7e] mb-2 group-hover:translate-x-1 transition-transform">Previous Post</p>
                    <h4 className="text-white font-medium group-hover:text-[#6a8c7e] transition-colors">{prevPost.title}</h4>
                  </div>
                ) : <div />
              }

              {
                nextPost ? (
                  <div
                    onClick={() => navigate(`/blog/${createSlug(nextPost.title)}`)}
                    className="cursor-pointer group p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-right"
                  >
                    <p className="text-xs uppercase tracking-widest text-[#6a8c7e] mb-2 group-hover:-translate-x-1 transition-transform">Next Post</p>
                    <h4 className="text-white font-medium group-hover:text-[#6a8c7e] transition-colors">{nextPost.title}</h4>
                  </div>
                ) : <div />
              }
            </div>
          </article>
          <aside className="lg:w-[28%]">
            <div className="sticky top-32 space-y-10">
              <div className="bg-[#232926] rounded-3xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-light text-white">Related <span className="italic text-[#6a8c7e]">Articles</span></h3>
                  <div
                    className={`flex items-center bg-white/5 border border-white/10 rounded-full transition-all duration-500 ease-in-out group/search h-9 ${isSearchExpanded ? 'w-40 px-3' : 'w-9 justify-center'
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
                      className={`flex items-center justify-between shrink-0 transition-colors ${isSearchExpanded ? 'text-[#6a8c7e]' : 'text-[#9ca3af] group-hover/search:text-[#6a8c7e]'
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
                <div
                  className={`space-y-4 overflow-y-auto pr-2 ${filteredRelatedBlogs.length > 0 ? 'max-h-[500px]' : 'max-h-[400px]'}`}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#6a8c7e4d transparent'
                  }}
                >
                  {filteredRelatedBlogs.length > 0 ? (
                    filteredRelatedBlogs.map(rb => (
                      <div
                        key={rb.id}
                        onClick={() => navigate(`/blog/${createSlug(rb.title)}`)}
                        className="group cursor-pointer flex gap-3 items-center"
                      >
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-[#121413]">
                          <img src={getImageUrl(rb.image_url)} alt={rb.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-white group-hover:text-[#6a8c7e] transition-colors line-clamp-2 mb-1">
                            {rb.title}
                          </h4>
                          <p className="text-[10px] text-[#9ca3af]">
                            {new Date(rb.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center min-h-[350px]">
                      <span className="material-symbols-outlined text-5xl text-[#6a8c7e]/30 mb-4">article_shortcut</span>
                      <p className="text-sm text-[#9ca3af] italic">No related posts found.</p>
                    </div>
                  )}
                </div>
              </div>


            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetails;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer';
import { apiService } from '../../../service/apiService';
import { get_url1, devUrl1 } from '../../../connection/connection';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        // Fetch current blog details
        const response = await apiService({
          url: `${get_url1.blogposts}/${id}`,
          method: 'GET'
        });

        let blogData = null;
        if (Array.isArray(response) && response.length > 0) {
          blogData = response[0];
        } else if (response?.data) {
          blogData = Array.isArray(response.data) ? response.data[0] : response.data;
        } else {
          blogData = response;
        }

        if (!blogData) throw new Error("Blog not found");
        setBlog(blogData);

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

        // Find current blog from the list
        // parsedId because params are strings
        const parsedId = parseInt(id);
        console.log("Details Debug - ID:", id, "Parsed:", parsedId);

        const currentBlog = blogsList.find(b => b.id === parsedId || b.id == id);
        console.log("Details Debug - Found Blog:", currentBlog);

        if (currentBlog) {
          setBlog(currentBlog);
        } else {
          setError("Blog not found.");
        }

      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8joqQH76wY929nfMjdCWo90o3YvVrmxLVPT6leihiEFLEotvvSkJl5aSyKDHUcIL2WaaKCKI60M2m4vwYnu7NSD5Xy--Ck59MHJBuQec18_i_gzEO8qoH8bujRpFwmVND68NVoOeXIGiT5PKnRuzNS7LnolI4ZJZ8LssidI1De_1-EYMxLLu78_B7qCOKHQq2qWGRR37gMiZdg210fN7YwbgZVa2vCiwh6X9IE3t31aSri0GpGi2cipvNINfq6wdpAYZP9ThecLd-';
    if (imagePath.startsWith('http')) return imagePath;
    return `${devUrl1}${imagePath.replace(/^\/+/, '')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Logic for Related, Previous, Next
  const currentBlogId = parseInt(id);

  // Filter related by category, exclude current, and apply search query
  const relatedBlogs = allBlogs
    .filter(b => {
      const matchesCategory = b.id !== currentBlogId && (b.category_id === blog?.category_id || b.category === blog?.category);
      const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .slice(0, 7);

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
      <main className="pt-16 pb-24">
        <section className="max-w-[1360px] mx-auto px-6 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <button onClick={() => navigate('/blog/all')} className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-[#6a8c7e] transition-colors group mb-4 md:mb-0 cursor-pointer">
              <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>

              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Return to Journey</span>
            </button>
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

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Lora'] text-white leading-[1.15] text-balance mb-6">
              {blog.title}
            </h1>
            <span className="inline-block px-5 py-1.5 bg-[#6a8c7e]/10 border border-[#6a8c7e]/20 text-[#6a8c7e] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full ">
              {blog.category_name || blog.category || "Story"}
            </span>
          </div>
        </section>
        <section className="max-w-[1000px] mx-auto px-6 mb-20">
          <div className="w-full aspect-[21/10] rounded-3xl overflow-hidden shadow-2xl relative border border-white/5">
            <div className="absolute inset-0 bg-[#1a1f1d]/20"></div>
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${getImageUrl(blog.image_url || blog.featured_image || blog.image)}')` }}></div>
          </div>
        </section>
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col lg:flex-row justify-between gap-12 lg:gap-0">
          <article className="lg:w-[66%] max-w-[800px] text-lg md:text-xl text-[#e5e7eb]/90 leading-relaxed [&>p]:mb-8 [&>p]:leading-[1.9] lg:pr-12">
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
              <div className="flex items-center gap-4 mt-10 mb-4">
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

            {/* Share Button (Moved here) */}
            <div className="flex items-center gap-4 border-t border-white/10 pt-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest shrink-0">Share:</h3>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 bg-[#1a1f1d] border border-white/10 hover:bg-white/5 text-[#9ca3af] hover:text-white px-2 py-2 rounded-full transition-all group"
              >
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">link</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em]">{copied ? "Link Copied!" : "Copy Link"}</span>
              </button>
            </div>

            {/* Post Navigation */}
            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-30 md:gap-40">
              {
                prevPost ? (
                  <div
                    onClick={() => navigate(`/blog/details/${prevPost.id}`)}
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
                    onClick={() => navigate(`/blog/details/${nextPost.id}`)}
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
                <div className="space-y-4">
                  {relatedBlogs.length > 0 ? (
                    relatedBlogs.map(rb => (
                      <div
                        key={rb.id}
                        onClick={() => navigate(`/blog/details/${rb.id}`)}
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
                    <p className="text-sm text-[#9ca3af] italic">No related posts found.</p>
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
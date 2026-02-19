import React from "react";
import { Helmet } from "react-helmet-async";
import { devUrl1 } from "../../connection/connection";

const SeoBlogDetails = ({ blog }) => {
    if (!blog) return null;

    const stripHtml = (html = "") => {
        try {
            const tmp = document.createElement("div");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        } catch {
            return html.replace(/<[^>]*>/g, "");
        }
    };

    const title = blog.meta_title || `${blog.title} | SoulJunction`;
    const description =
        blog.meta_description ||
        stripHtml(blog.content_preview || blog.content).substring(0, 160);

    const keywords =
        blog.meta_keywords ||
        (Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags) ||
        "";

    // Slug fallback from title for canonical URL if slug is missing
    const slug = blog.slug || blog.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const canonical =
        blog.canonical_url || `${window.location.origin}/blog/${slug}`;

    const robots =
        blog.index_status === "noindex" ? "noindex, nofollow" : "index, follow";

    // Prefix relative image paths with devUrl1
    const image_url = blog.image_url || blog.featured_image || blog.image;
    const image = image_url
        ? (image_url.startsWith('http') ? image_url : `${devUrl1}${image_url.replace(/^\/+/, '')}`)
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8joqQH76wY929nfMjdCWo90o3YvVrmxLVPT6leihiEFLEotvvSkJl5aSyKDHUcIL2WaaKCKI60M2m4vwYnu7NSD5Xy--Ck59MHJBuQec18_i_gzEO8qoH8bujRpFwmVND68NVoOeXIGiT5PKnRuzNS7LnolI4ZJZ8LssidI1De_1-EYMxLLu78_B7qCOKHQq2qWGRR37gMiZdg210fN7YwbgZVa2vCiwh6X9IE3t31aSri0GpGi2cipvNINfq6wdpAYZP9ThecLd-';


    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description,
        image,
        keywords,
        author: {
            "@type": "Person",
            name: blog.author_name || "SoulJunction"
        },
        datePublished: blog.created_at,
        mainEntityOfPage: canonical
    };


    return (
        <Helmet>
            <title>{title}</title>

            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={blog.author_name || "SoulJunction"} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Schema */}
            <script type="application/ld+json">
                {JSON.stringify(articleSchema)}
            </script>
        </Helmet>
    );
};

export default SeoBlogDetails;

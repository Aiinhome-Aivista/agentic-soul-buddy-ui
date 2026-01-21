import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { get_url1 } from '../../connection/connection';

const SeoHelper = ({
    title: defaultTitle = "Soul Junction",
    description: defaultDescription = "Your wellness companion",
    keywords: defaultKeywords = "",
    image: defaultImage = "/og-image.jpg",
    type = 'website',
    author = 'Soul Junction'
}) => {
    const location = useLocation();
    const [seoData, setSeoData] = useState(null);

    useEffect(() => {
        const fetchSeoData = async () => {
            try {
                const response = await fetch(get_url1.seo);
                if (response.ok) {
                    const data = await response.json();

                    // Match current path with page_url from API
                    const currentPath = location.pathname;
                    const matchedSeo = data.find(item => item.page_url === currentPath);

                    if (matchedSeo) {
                        setSeoData(matchedSeo);
                    } else {
                        // Fallback or maintain default if no match
                        // Optionally look for a default entry (e.g. empty string or specific default)
                        const defaultSeo = data.find(item => item.page_url === "");
                        if (defaultSeo) {
                            setSeoData(defaultSeo);
                        } else {
                            setSeoData(null);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching SEO data:", error);
            }
        };

        fetchSeoData();
    }, [location.pathname]);

    // Use fetched data or fallback to props/defaults
    const title = seoData?.seo_title || defaultTitle;
    const description = seoData?.meta_description || defaultDescription;
    const keywords = seoData?.target_keyword || defaultKeywords;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {defaultImage && <meta property="og:image" content={defaultImage} />}
            <meta property="og:url" content={window.location.href} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {defaultImage && <meta name="twitter:image" content={defaultImage} />}
        </Helmet>
    );
};

export default SeoHelper;

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { get_url1 } from '../../connection/connection';

const SeoHelper = ({
    title: defaultTitle = "Souljunction",
    description: defaultDescription = "Souljunction is a safe space for emotional wellness, therapy, self-healing, and inner growth",
    keywords: defaultKeywords = "emotional wellness, mental health support, therapy platform",
    image: defaultImage = "https://aivista.co.in/souljuntion/logo",
    type = 'website',
    author = 'Souljunction'
}) => {
    const location = useLocation();
    const [seoData, setSeoData] = useState(null);

    useEffect(() => {
        const fetchSeoData = async () => {
            try {
                const response = await fetch(get_url1.seo);
                if (response.ok) {
                    const data = await response.json();

                    const currentPath = location.pathname;
                    // console.log("SEO: Current Path:", currentPath);
                    // console.log("SEO: API Data:", data);

                    // Normalize path: clean slashes for consistent matching
                    // 1. Remove trailing slash if length > 1 (e.g. /pricing/ -> /pricing)
                    // 2. Ensure leading slash (e.g. pricing -> /pricing)
                    let normalizedPath = currentPath;
                    if (normalizedPath.endsWith('/') && normalizedPath.length > 1) {
                        normalizedPath = normalizedPath.slice(0, -1);
                    }
                    if (!normalizedPath.startsWith('/')) {
                        normalizedPath = '/' + normalizedPath;
                    }

                    // console.log("SEO: Normalized Path:", normalizedPath);

                    const matchedSeo = data.find(item => {
                        let itemPath = item.page_url || ""; // handle null/undefined

                        // Normalize item path similarly
                        if (itemPath.endsWith('/') && itemPath.length > 1) {
                            itemPath = itemPath.slice(0, -1);
                        }
                        if (itemPath && !itemPath.startsWith('/')) {
                            itemPath = '/' + itemPath;
                        }

                        return itemPath === normalizedPath;
                    });

                    if (matchedSeo) {
                        // console.log("SEO: Match found:", matchedSeo);
                        setSeoData(matchedSeo);
                    } else {
                        // console.log("SEO: No direct match found. Looking for default.");
                        // Fallback to default (empty string or root)
                        const defaultSeo = data.find(item => item.page_url === "" || item.page_url === "/");
                        if (defaultSeo) {
                            setSeoData(defaultSeo);
                        } else {
                            setSeoData(null);
                        }
                    }
                } else {
                    console.warn("SEO: API response not OK");
                }
            } catch (error) {
                console.error("SEO: Error fetching data:", error);
            }
        };

        fetchSeoData();
    }, [location.pathname]);

    // Use fetched data or fallback to props/defaults
    const title = seoData?.seo_title || defaultTitle;
    // console.log( "111111111------"  , title);
    const description = seoData?.meta_description || defaultDescription;
    // console.log( "2222222222222------" , description);
    const keywords = seoData?.target_keyword || defaultKeywords;
    // console.log( "333333333333333------" , keywords);

    const canonical = `https://www.souljunction.life${location.pathname}`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <link rel="canonical" href={canonical} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {defaultImage && <meta property="og:image" content={defaultImage} />}
            <meta property="og:url" content={canonical} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {defaultImage && <meta name="twitter:image" content={defaultImage} />}
        </Helmet>
    );
};

export default SeoHelper;

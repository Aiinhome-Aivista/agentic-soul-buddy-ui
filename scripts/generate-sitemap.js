import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.souljunction.life';
const BLOGS_API = 'https://aivista.co.in/souljuntion/blogs/published';
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');

// Helper to create clean URL slug from blog title
function createSlug(title) {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Format date to ISO YYYY-MM-DD
function formatDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    try {
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}

// Static public pages
const staticPages = [
    { url: '/', priority: '1.0000', changefreq: 'daily' },
    { url: '/pricing', priority: '0.8000', changefreq: 'weekly' },
    { url: '/blog/all', priority: '0.8000', changefreq: 'daily' },
    { url: '/contact', priority: '0.6400', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.6400', changefreq: 'yearly' },
    { url: '/terms-of-use', priority: '0.6400', changefreq: 'yearly' },
    { url: '/cookie-policy', priority: '0.6400', changefreq: 'yearly' }
];

async function generateSitemap() {
    console.log('🔄 Generating sitemap...');
    const today = new Date().toISOString().split('T')[0];

    let blogs = [];
    try {
        const res = await fetch(BLOGS_API, { signal: AbortSignal.timeout(10000) });
        if (res.ok) {
            const data = await res.json();
            blogs = Array.isArray(data) ? data : (data.data || []);
            console.log(`✅ Successfully fetched ${blogs.length} published blogs from API.`);
        } else {
            console.warn(`⚠️ API responded with status ${res.status}. Using existing static pages.`);
        }
    } catch (err) {
        console.warn(`⚠️ Could not reach blogs API (${err.message}). Using existing static pages.`);
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    // Static pages
    for (const page of staticPages) {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    }

    // Dynamic blogs
    for (const blog of blogs) {
        const slug = createSlug(blog.slug || blog.title);
        if (!slug) continue;

        const lastmod = formatDate(blog.updated_at || blog.created_at);
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}/blog/${slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <priority>0.7000</priority>\n';
        xml += '  </url>\n';
    }

    xml += '</urlset>\n';

    fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
    console.log(`🎉 Sitemap successfully generated at: ${SITEMAP_PATH} (Total URLs: ${staticPages.length + blogs.length})`);
}

generateSitemap();


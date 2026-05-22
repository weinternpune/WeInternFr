import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.REACT_APP_SANITY_PROJECT_ID;
const isConfigured = projectId && /^[a-z0-9-]+$/.test(projectId);

export const client = isConfigured ? createClient({
  projectId,
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
}) : null;

const builder = isConfigured ? imageUrlBuilder(client) : null;
export const urlFor = (source) => builder ? builder.image(source) : null;

// Queries
export const QUERIES = {
  hero: `*[_type == "hero"][0]{
    badge, heading, highlightText, subheading,
    stat1Label, stat1Value, stat2Label, stat2Value, stat3Label, stat3Value,
    fearHeading, fearQuote, fearResolve,
    centerCardTitle,
    primaryBtnText, secondaryBtnText
  }`,

  courses: `*[_type == "course" && active == true] | order(order asc) {
    _id, title, emoji, description, price, duration,
    level, tools, colorH1, colorH2, language, tagline, about
  }`,

  testimonials: `*[_type == "testimonial"] | order(_createdAt desc) {
    _id, name, role, college, rating, review, avatar
  }`,

  seo: `*[_type == "seo"][0]{
    siteTitle, siteDescription, keywords,
    ogTitle, ogDescription
  }`,
};

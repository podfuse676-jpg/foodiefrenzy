import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  ogUrl, 
  ogType = "website",
  twitterTitle, 
  twitterDescription, 
  twitterImage,
  canonicalUrl,
  children 
}) => {
  // Default values using environment variables or fallbacks
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || "https://lakeshoreconvenience.com";
  const defaultTitle = "Lakeshore Convenience - Nationwide Grocery Delivery Across Canada";
  const defaultDescription = "Shop fresh groceries and convenience items online from Lakeshore Convenience. Fast delivery to your door across Canada. Fresh produce, quality groceries, and unique items available nationwide.";
  const defaultKeywords = "grocery delivery, convenience store, Canada, fresh produce, quality groceries, online shopping, food delivery, nationwide delivery";
  const defaultOgImage = `${baseUrl}/logo.png`;
  const defaultUrl = baseUrl;

  // Use provided values or defaults
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalOgTitle = ogTitle || title || defaultTitle;
  const finalOgDescription = ogDescription || description || defaultDescription;
  const finalOgImage = ogImage || defaultOgImage;
  const finalOgUrl = ogUrl || canonicalUrl || defaultUrl;
  const finalTwitterTitle = twitterTitle || title || defaultTitle;
  const finalTwitterDescription = twitterDescription || description || defaultDescription;
  const finalTwitterImage = twitterImage || ogImage || defaultOgImage;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Lakeshore Convenience" />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalOgUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:site_name" content="Lakeshore Convenience" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
      <meta name="twitter:site" content="@lakeshoreconv" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Viewport and mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language */}
      <meta httpEquiv="Content-Language" content="en" />
      
      {children}
    </Helmet>
  );
};

export default SEO;
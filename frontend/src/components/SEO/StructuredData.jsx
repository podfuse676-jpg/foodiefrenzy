import React from 'react';
import { Helmet } from 'react-helmet-async';

// Organization structured data
export const OrganizationStructuredData = () => {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || "https://lakeshoreconvenience.com";
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Lakeshore Convenience",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Nationwide grocery delivery service across Canada. Fresh produce, quality groceries, and convenience items delivered fast to your door.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "130-5003 Lakeshore Drive",
      "addressLocality": "Sylvan Lake",
      "addressRegion": "Alberta",
      "postalCode": "T4S 1R3",
      "addressCountry": "CA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-825-205-5115",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://www.facebook.com/lakeshoreconvenience",
      "https://www.instagram.com/lakeshoreconvenience"
    ],
    "areaServed": "CA" // Serves all of Canada
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
    </Helmet>
  );
};

// Product structured data
export const ProductStructuredData = ({ product }) => {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || "https://lakeshoreconvenience.com";
  
  const productData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl,
    "description": product.description,
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/item/${product._id}`,
      "priceCurrency": "CAD",
      "price": product.price,
      "availability": product.quantity > 0 ? "InStock" : "OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Lakeshore Convenience",
        "areaServed": "CA"
      }
    }
  };

  // Add rating information if available
  if (product.averageRating && product.totalReviews) {
    productData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.averageRating,
      "reviewCount": product.totalReviews
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productData)}
      </script>
    </Helmet>
  );
};

// WebSite structured data
export const WebsiteStructuredData = () => {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || "https://lakeshoreconvenience.com";
  
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Lakeshore Convenience",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/menu?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lakeshore Convenience",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
    </Helmet>
  );
};

//Breadcrumb structured data
export const BreadcrumbStructuredData = ({ breadcrumbs }) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </Helmet>
  );
};

export default {
  OrganizationStructuredData,
  ProductStructuredData,
  WebsiteStructuredData,
  BreadcrumbStructuredData
};
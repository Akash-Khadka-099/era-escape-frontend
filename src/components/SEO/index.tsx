import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  schema?: object | object[];
  openGraphType?: "website" | "article" | "product" | "place";
  twitterCard?: "summary" | "summary_large_image";
}

export function SEO({
  title,
  description,
  keywords,
  canonical,
  noindex = false,
  ogImage,
  schema,
  openGraphType = "website",
  twitterCard = "summary_large_image",
}: SEOProps) {
  return (
    <Helmet>
      <title>{title} | Era Escape</title>
      {description && <meta name="description" content={description} />}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {canonical && <link rel="canonical" href={canonical} />}

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}

      {/* Open Graph */}
      <meta property="og:title" content={`${title} | Era Escape`} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={openGraphType} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={`${title} | Era Escape`} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}

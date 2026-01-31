import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  schema?: object;
}

export function SEO({
  title,
  description,
  canonical,
  noindex = false,
  ogImage,
  schema,
}: SEOProps) {
  return (
    <Helmet>
      <title>{title} | Era Escape</title>
      {description && <meta name="description" content={description} />}

      {canonical && <link rel="canonical" href={canonical} />}

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}

      {/* Open Graph */}
      {title && <meta property="og:title" content={`${title} | Era Escape`} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}

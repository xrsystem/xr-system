import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords }) {
  return (
    <Helmet>
      <title>{title} | XR System</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} /> }
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}

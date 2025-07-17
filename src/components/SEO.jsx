import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
    if (keywords) {
      let tag = document.querySelector('meta[name="keywords"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'keywords');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', keywords);
    }
  }, [title, description, keywords]);

  return null;
};

export default SEO;

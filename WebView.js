import React from 'react';

const WebView = ({ urlString }) => {
  return (
    <iframe
      src={urlString}
      style={{ width: '100%', height: '100%', border: 'none' }}
      allow="autoplay; encrypted-media"
      allowFullScreen
      title="WebView"
    />
  );
};

export default WebView;

// src/components/common/HTMLViewer.tsx
import parse from 'html-react-parser';
import React from 'react';

interface HTMLViewerProps {
  htmlContent: string;
}

const HTMLViewer = ({ htmlContent }: HTMLViewerProps) => {
  return (
    <div
      style={{
        fontSize: '16px',
        color: '#2d2d2d',
        lineHeight: '24px',
        padding: '16px',
      }}
      className="overflow-x-auto bg-white rounded border"
    >
      {parse(htmlContent)}
    </div>
  );
};

export default HTMLViewer;

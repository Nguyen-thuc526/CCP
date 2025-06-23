'use client';

import React from 'react';

interface ReportSectionProps {
  title: string;
  summary?: string;
  notes?: string;
  children: React.ReactNode;
}

export default function ReportSection({ title, summary, notes, children }: ReportSectionProps) {
  return (
    <div className="bg-white border border-primary/20 p-6 rounded-xl shadow-sm space-y-4 mb-4">
      <h2 className="text-2xl font-semibold text-primary">{title}</h2>

      {summary && (
        <p className="text-gray-800 text-base">
          <span className="font-medium">Tóm tắt:</span> {summary}
        </p>
      )}

      {notes && (
        <div className="bg-primary/5 border border-primary/10 p-4 rounded text-gray-700">
          <span className="font-medium text-primary">Ghi chú:</span> {notes}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}

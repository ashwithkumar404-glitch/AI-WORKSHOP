import React from 'react';
import { ExamAttempt } from '@/lib/dbTypes';
import { formatInIST } from '@/features/newsletter/dateUtils';

interface PerformanceChartsProps {
  attempts: ExamAttempt[];
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ attempts }) => {
  const submitted = attempts
    .filter(a => a.status === 'submitted')
    .sort((a, b) => new Date(a.submitted_at || a.created_at).getTime() - new Date(b.submitted_at || b.created_at).getTime());

  if (submitted.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-semibold text-slate-700">No chart data available</p>
        <p className="text-xs text-slate-500 mt-1">Submit assessments to visualize longitudinal academic progression.</p>
      </div>
    );
  }

  // Pure SVG Timeline Chart
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 40;

  const maxVal = 100;
  const minVal = 0;

  const points = submitted.map((att, idx) => {
    const x = padding + (idx / Math.max(submitted.length - 1, 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - (att.percentage / maxVal) * (svgHeight - padding * 2);
    return { x, y, percentage: att.percentage, title: att.exam?.title || `Exam #${idx + 1}`, date: att.submitted_at };
  });

  const pathD = points.length === 1
    ? `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y}`
    : points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="font-semibold text-slate-800">Score Percentage History</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-campus-teal-500"></span>
            Attempt Score (%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-400"></span>
            Passing Threshold (50%)
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[450px]"
          aria-label="Performance progression trend line"
        >
          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = svgHeight - padding - (val / maxVal) * (svgHeight - padding * 2);
            return (
              <g key={val}>
                <line
                  x1={padding}
                  y1={y}
                  x2={svgWidth - padding}
                  y2={y}
                  stroke={val === 50 ? '#f43f5e' : '#e2e8f0'}
                  strokeDasharray={val === 50 ? '4 3' : '2 2'}
                  strokeWidth={val === 50 ? 1.5 : 1}
                />
                <text x={padding - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#64748b">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Connect line */}
          <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="#ffffff"
                stroke="#0d9488"
                strokeWidth="2.5"
                className="transition-all hover:r-7 hover:fill-campus-teal-500"
              />
              <text
                x={pt.x}
                y={pt.y - 10}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fill="#0f2038"
              >
                {pt.percentage}%
              </text>
              <text
                x={pt.x}
                y={svgHeight - 15}
                fontSize="9"
                textAnchor="middle"
                fill="#64748b"
              >
                {formatInIST(pt.date, false)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};


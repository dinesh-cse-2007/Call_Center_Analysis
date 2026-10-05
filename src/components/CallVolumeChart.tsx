import { useMemo } from 'react';

type Bucket = {
  label: string;
  date: string;
  count: number;
  avgSatisfaction: number;
};

export function CallVolumeChart({ buckets }: { buckets: Bucket[] }) {
  const maxCount = useMemo(
    () => Math.max(...buckets.map((b) => b.count), 1),
    [buckets]
  );

  const width = 800;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const barWidth = chartWidth / buckets.length;
  const gap = barWidth * 0.3;
  const actualBarWidth = barWidth - gap;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Call Volume
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Daily call count over the last 30 days
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
          Calls
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="min-w-[600px]"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + chartHeight * (1 - pct);
            return (
              <g key={pct}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth={1}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-gray-400"
                >
                  {Math.round(maxCount * pct)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {buckets.map((b, i) => {
            const barHeight =
              b.count > 0 ? (b.count / maxCount) * chartHeight : 0;
            const x = padding.left + i * barWidth + gap / 2;
            const y = padding.top + chartHeight - barHeight;
            return (
              <g key={b.date}>
                <rect
                  x={x}
                  y={y}
                  width={actualBarWidth}
                  height={barHeight}
                  rx={3}
                  fill="#3b82f6"
                  className="transition-all duration-300 hover:fill-blue-600"
                >
                  <title>{`${b.label}: ${b.count} calls`}</title>
                </rect>
              </g>
            );
          })}

          {/* X-axis labels (every 5th day) */}
          {buckets.map((b, i) => {
            if (i % 5 !== 0 && i !== buckets.length - 1) return null;
            const x = padding.left + i * barWidth + barWidth / 2;
            return (
              <text
                key={b.date + '-label'}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-gray-400"
              >
                {b.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

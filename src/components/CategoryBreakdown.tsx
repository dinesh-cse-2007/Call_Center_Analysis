import { CategoryStats } from '@/lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  Billing: '#2563eb',
  Technical: '#06b6d4',
  'Product Inquiry': '#10b981',
  Complaint: '#ef4444',
  'Account Update': '#f59e0b',
  Cancellation: '#8b5cf6',
  General: '#6b7280',
};

export function CategoryBreakdown({
  categories,
}: {
  categories: CategoryStats[];
}) {
  const total = categories.reduce((s, c) => s + c.count, 0);
  const radius = 70;
  const stroke = 30;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = categories.map((c) => {
    const fraction = c.count / total;
    const length = fraction * circumference;
    const seg = {
      color: CATEGORY_COLORS[c.category] || '#6b7280',
      dashArray: `${length} ${circumference - length}`,
      dashOffset: -offset,
      ...c,
      fraction,
    };
    offset += length;
    return seg;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        Call Categories
      </h3>
      <p className="text-sm text-gray-400 mb-5">Distribution by reason</p>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width={180} height={180} viewBox="0 0 180 180">
            <g transform="translate(90, 90) rotate(-90)">
              <circle
                r={radius}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth={stroke}
              />
              {segments.map((s, i) => (
                <circle
                  key={i}
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={s.dashArray}
                  strokeDashoffset={s.dashOffset}
                  className="transition-all duration-300"
                  style={{ cursor: 'pointer' }}
                >
                  <title>{`${s.category}: ${s.count} calls (${Math.round(
                    s.fraction * 100
                  )}%)`}</title>
                </circle>
              ))}
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {total}
            </span>
            <span className="text-xs text-gray-400">Total</span>
          </div>
        </div>
        <div className="flex-1 w-full space-y-2.5">
          {segments.map((s) => (
            <div
              key={s.category}
              className="flex items-center justify-between text-sm group hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-gray-700 font-medium truncate">
                  {s.category}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-gray-400 text-xs w-16 text-right">
                  {Math.round(s.fraction * 100)}%
                </span>
                <span className="text-gray-900 font-semibold w-10 text-right tabular-nums">
                  {s.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

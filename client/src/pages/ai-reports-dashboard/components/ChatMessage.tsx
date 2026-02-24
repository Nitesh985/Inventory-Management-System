import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

interface Message {
  id: string;
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

type ChartView = 'table' | 'line' | 'bar' | 'pie';

const CHART_COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

// ── Parse markdown tables from content ──────────────────────────────
function extractTables(content: string): TableData[] {
  const tables: TableData[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const headerCells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());

      // Next line should be separator
      if (i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
        const rows: string[][] = [];
        let j = i + 2;
        while (j < lines.length) {
          const rowLine = lines[j].trim();
          if (rowLine.startsWith('|') && rowLine.endsWith('|')) {
            rows.push(rowLine.split('|').filter(c => c.trim() !== '').map(c => c.trim()));
            j++;
          } else {
            break;
          }
        }
        if (rows.length > 0) {
          tables.push({ headers: headerCells, rows });
        }
        i = j;
        continue;
      }
    }
    i++;
  }
  return tables;
}

// ── Parse numeric value from string (handles commas, Rs., etc) ──────
function parseNumeric(val: string): number | null {
  const cleaned = val.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// ── Convert table data to chart-friendly format ─────────────────────
function toChartData(table: TableData) {
  const { headers, rows } = table;
  // Find numeric columns
  const numericCols: number[] = [];
  const labelCol = 0; // First column is always the label

  for (let c = 1; c < headers.length; c++) {
    const allNumeric = rows.every(row => row[c] !== undefined && parseNumeric(row[c]) !== null);
    if (allNumeric) numericCols.push(c);
  }

  if (numericCols.length === 0) return null;

  const data = rows.map(row => {
    const entry: Record<string, string | number> = { label: row[labelCol] || '' };
    numericCols.forEach(c => {
      entry[headers[c]] = parseNumeric(row[c]) ?? 0;
    });
    return entry;
  });

  return { data, numericCols: numericCols.map(c => headers[c]), labelKey: 'label' };
}

// ── Format large numbers with K/M suffix ────────────────────────────
function formatValue(val: number): string {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toLocaleString();
}

// ── Chart + Table component ─────────────────────────────────────────
function DataVisualization({ table }: { table: TableData }) {
  const [view, setView] = useState<ChartView>('table');
  const chartInfo = useMemo(() => toChartData(table), [table]);
  const hasChartData = chartInfo !== null;

  const views: { key: ChartView; icon: string; label: string }[] = [
    { key: 'table', icon: '📋', label: 'Table' },
    ...(hasChartData ? [
      { key: 'line' as ChartView, icon: '📈', label: 'Line' },
      { key: 'bar' as ChartView, icon: '📊', label: 'Bar' },
      ...(chartInfo!.data.length <= 15 ? [{ key: 'pie' as ChartView, icon: '🥧', label: 'Pie' }] : []),
    ] : []),
  ];

  return (
    <div className="my-3 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* View switcher */}
      {views.length > 1 && (
        <div className="flex items-center gap-1 px-3 pt-3 pb-1">
          {views.map(v => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === v.key
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div className="overflow-x-auto p-3">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {table.headers.map((h, i) => (
                  <th
                    key={i}
                    className={`px-4 py-2.5 text-left font-semibold text-white whitespace-nowrap ${
                      i === 0 ? 'rounded-tl-lg' : ''
                    } ${i === table.headers.length - 1 ? 'rounded-tr-lg' : ''}`}
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={`transition-colors hover:bg-purple-50 ${
                    ri % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                  } ${ri === table.rows.length - 1 ? 'border-b-0' : 'border-b border-gray-100'}`}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-2.5 whitespace-nowrap ${
                        ci === 0 ? 'font-medium text-gray-800' : 'text-gray-600'
                      } ${parseNumeric(cell) !== null && ci > 0 ? 'text-right tabular-nums' : ''}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-[10px] text-gray-400 text-right">
            {table.rows.length} rows
          </div>
        </div>
      )}

      {/* Line chart */}
      {view === 'line' && chartInfo && (
        <div className="p-4">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartInfo.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                {chartInfo.numericCols.map((col, i) => (
                  <linearGradient key={col} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                interval={Math.max(0, Math.floor(chartInfo.data.length / 8) - 1)}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatValue}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value: number) => [value.toLocaleString(), undefined]}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              {chartInfo.numericCols.map((col, i) => (
                <Area
                  key={col}
                  type="monotone"
                  dataKey={col}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={2}
                  fill={`url(#grad-${i})`}
                  dot={{ r: 2, strokeWidth: 1 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar chart */}
      {view === 'bar' && chartInfo && (
        <div className="p-4">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartInfo.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                interval={Math.max(0, Math.floor(chartInfo.data.length / 8) - 1)}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatValue}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value: number) => [value.toLocaleString(), undefined]}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              {chartInfo.numericCols.map((col, i) => (
                <Bar
                  key={col}
                  dataKey={col}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie chart (first numeric column only) */}
      {view === 'pie' && chartInfo && (
        <div className="p-4 flex justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartInfo.data.map((d, i) => ({
                  name: d.label as string,
                  value: d[chartInfo.numericCols[0]] as number,
                  fill: CHART_COLORS[i % CHART_COLORS.length],
                }))}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={95}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ strokeWidth: 1 }}
                style={{ fontSize: 10 }}
              >
                {chartInfo.data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value: number) => [value.toLocaleString(), undefined]}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ── Split content around tables to render charts alongside markdown ──
function renderContentWithCharts(content: string) {
  const tables = extractTables(content);
  if (tables.length === 0) {
    return <MarkdownRenderer content={content} />;
  }

  // Split content on table boundaries and interleave with DataVisualization
  const parts: React.ReactNode[] = [];
  const lines = content.split('\n');
  let partStart = 0;
  let tableIdx = 0;
  let i = 0;

  while (i < lines.length && tableIdx < tables.length) {
    const line = lines[i].trim();
    if (
      line.startsWith('|') && line.endsWith('|') &&
      i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())
    ) {
      // Found a table start — emit text before it
      if (partStart < i) {
        const textBefore = lines.slice(partStart, i).join('\n').trim();
        if (textBefore) {
          parts.push(<MarkdownRenderer key={`text-${i}`} content={textBefore} />);
        }
      }

      // Skip past the table lines
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith('|') && lines[j].trim().endsWith('|')) {
        j++;
      }

      parts.push(<DataVisualization key={`chart-${i}`} table={tables[tableIdx]} />);
      tableIdx++;
      partStart = j;
      i = j;
    } else {
      i++;
    }
  }

  // Remaining text after last table
  if (partStart < lines.length) {
    const remaining = lines.slice(partStart).join('\n').trim();
    if (remaining) {
      parts.push(<MarkdownRenderer key="text-end" content={remaining} />);
    }
  }

  return <>{parts}</>;
}

// ── Markdown Renderer ───────────────────────────────────────────────
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-2 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-1.5 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1 first:mt-0">{children}</h3>,
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-');
          return isBlock ? (
            <pre className="bg-gray-800 text-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-xs">
              <code>{children}</code>
            </pre>
          ) : (
            <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
          );
        },
        // Tables inside MarkdownRenderer are hidden since we render them via DataVisualization
        table: () => null,
        hr: () => <hr className="my-3 border-gray-300" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l-3 border-purple-400 pl-3 my-2 text-gray-600 italic">{children}</blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ── Main ChatMessage Component ──────────────────────────────────────
export function ChatMessage({ message }: ChatMessageProps) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.type === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] md:max-w-[70%]">
          <div className="px-4 py-3 bg-blue-600 text-white rounded-2xl rounded-tr-sm">
            <p className="text-sm">{message.content}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  }

  if (message.type === 'ai') {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[95%] md:max-w-[85%]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              AI
            </div>
            <div className="flex-1 min-w-0">
              <div className="px-4 py-3 bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm">
                <div className="text-sm leading-relaxed ai-markdown">
                  {renderContentWithCharts(message.content)}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

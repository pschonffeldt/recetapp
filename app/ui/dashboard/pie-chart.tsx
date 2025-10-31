"use client";

import React from "react";

type Slice = {
  label: string;
  value: number;
  /** Optional hex/rgb/hsl. Fallbacks provided. */
  color?: string;
};

export default function PieChart({
  data,
  size = 160, // pixel size of the chart
  thickness = 28, // donut ring thickness
  showPercent = true,
  title = "Breakdown",
}: {
  data: Slice[];
  size?: number;
  thickness?: number;
  showPercent?: boolean;
  title?: string;
}) {
  const total = Math.max(
    0,
    data.reduce((acc, d) => acc + (isFinite(d.value) ? d.value : 0), 0)
  );

  // default palette if a slice doesn't provide color
  const palette = [
    "#a522eb",
    "#89c522",
    "#eab308",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#65a30d",
    "#ea580c",
  ];

  // build the conic-gradient segments
  let currentAngle = 0;
  const segments = data.map((d, i) => {
    const pct = total === 0 ? 0 : d.value / total;
    const angle = pct * 360;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;

    const color = palette[i % palette.length];

    return { ...d, pct, start, end, color };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
    .join(", ");

  return (
    <div className="w-full md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">{title}</h2>

      <div className="rounded-xl bg-gray-50 p-4">
        {/* <div className="grid grid-cols-1 items-center gap-6 rounded-md bg-white p-4 md:grid-cols-3"> */}
        <div className="grid grid-cols-1 items-center gap-6 rounded-md bg-white p-4 ">
          {/* Chart */}
          <div className="flex items-center justify-center">
            <div
              role="img"
              aria-label={`${title} pie chart`}
              className="relative shrink-0"
              style={{
                width: size,
                height: size,
                borderRadius: "9999px",
                backgroundImage: `conic-gradient(${gradient})`,
              }}
            >
              {/* Donut hole */}
              <div
                className="absolute inset-0 m-auto rounded-full bg-white"
                style={{
                  width: size - thickness * 2,
                  height: size - thickness * 2,
                }}
              />
              {/* Center total */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-semibold">{total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="md:col-span-2">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {segments.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: s.color }}
                      aria-hidden
                    />
                    <span className="text-sm text-gray-700">{s.label}</span>
                  </div>
                  <div className="text-sm tabular-nums text-gray-600">
                    {s.value}
                    {showPercent && total > 0 && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({Math.round(s.pct * 100)}%)
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center pb-2 pt-6">
          {/* optional footer icon/label to match your bar chart */}
          <h3 className="ml-0 text-sm text-gray-500">Current snapshot</h3>
        </div>
      </div>
    </div>
  );
}

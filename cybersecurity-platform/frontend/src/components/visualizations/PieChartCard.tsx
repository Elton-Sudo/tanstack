/**
 * PieChartCard Component
 * Card wrapper for Recharts PieChart with custom legend
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { chartColors, getColorByIndex, responsiveConfig, tooltipConfig } from '@/lib/chart-config';
import { cn } from '@/lib/utils';
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface PieChartCardProps {
  /**
   * Chart title
   */
  title: string;
  /**
   * Optional description
   */
  description?: string;
  /**
   * Chart data
   */
  data: Array<{ name: string; value: number; color?: string }>;
  /**
   * Chart height in pixels
   */
  height?: number;
  /**
   * Show legend
   */
  showLegend?: boolean;
  /**
   * Additional actions in header
   */
  actions?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Custom legend renderer
 */
const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-muted-foreground">
            {entry.value}: {entry.payload.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * PieChartCard
 * Professional pie chart wrapped in a card
 * Features:
 * - Custom colors per segment
 * - Custom legend
 * - Responsive design
 * - Hover effects
 */
export default function PieChartCard({
  title,
  description,
  data,
  height = 300,
  showLegend = true,
  actions,
  className,
}: PieChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || getColorByIndex(index)} />
              ))}
            </Pie>
            <Tooltip {...tooltipConfig} />
            {showLegend && <Legend content={renderCustomLegend} />}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

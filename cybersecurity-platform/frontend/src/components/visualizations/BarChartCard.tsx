/**
 * BarChartCard Component
 * Card wrapper for Recharts BarChart with consistent styling
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  axisConfig,
  cartesianGridConfig,
  chartColors,
  getColorByIndex,
  responsiveConfig,
  tooltipConfig,
} from '@/lib/chart-config';
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface BarChartCardProps {
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
  data: Array<Record<string, any>>;
  /**
   * X-axis data key
   */
  xAxisKey: string;
  /**
   * Y-axis data keys (supports multiple bars)
   */
  dataKeys: Array<{ key: string; name: string; color?: string }>;
  /**
   * Chart height in pixels
   */
  height?: number;
  /**
   * Show grid lines
   */
  showGrid?: boolean;
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
 * BarChartCard
 * Professional bar chart wrapped in a card
 * Features:
 * - Multi-series support
 * - Consistent brand colors
 * - Responsive design
 * - Custom tooltips
 * - Optional export functionality
 */
export default function BarChartCard({
  title,
  description,
  data,
  xAxisKey,
  dataKeys,
  height = 300,
  showGrid = true,
  actions,
  className,
}: BarChartCardProps) {
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
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            {showGrid && <CartesianGrid {...cartesianGridConfig} />}
            <XAxis dataKey={xAxisKey} {...axisConfig} />
            <YAxis {...axisConfig} />
            <Tooltip {...tooltipConfig} contentStyle={tooltipConfig.contentStyle} />
            {dataKeys.map((item, index) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                name={item.name}
                fill={item.color || getColorByIndex(index)}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

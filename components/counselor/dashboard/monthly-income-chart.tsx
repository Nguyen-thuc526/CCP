"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { MonthlyIncomeItem } from "@/types/user";

type Props = {
  data: MonthlyIncomeItem[]; // [{ month: 1..12, income: number }]
};

const MONTH_LABELS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

// Chuẩn hóa: đảm bảo đủ 12 tháng theo thứ tự và gắn nhãn hiển thị
function buildMonthlySeries(src: MonthlyIncomeItem[]) {
  const byMonth = new Map(src.map((m) => [m.month, m.income]));
  return Array.from({ length: 12 }, (_, i) => {
    const monthIndex = i + 1 as MonthlyIncomeItem["month"];
    return {
      month: MONTH_LABELS[i],
      income: byMonth.get(monthIndex) ?? 0,
    };
  });
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", notation: "compact" }).format(value);

export function MonthlyIncomeChart({ data }: Props) {
  const series = buildMonthlySeries(data ?? []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thu nhập theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: {
              label: "Thu nhập",
              color: "#F43F5E",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [formatCurrency(value as number), "Thu nhập"]}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={{ fill: "var(--color-income)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { WeeklyAppointmentItem } from "@/types/user";

type Props = {
  data: WeeklyAppointmentItem[]; // [{ dayOfWeek: 1..7, count: number }]
};

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Chuẩn hóa: dayOfWeek 1..7 (Mon..Sun) -> T2..CN, đủ 7 ngày, đúng thứ tự
function buildWeeklySeries(src: WeeklyAppointmentItem[]) {
  const byDOW = new Map(src.map(d => [d.dayOfWeek, d.count]));
  return Array.from({ length: 7 }, (_, i) => {
    const dow = (i + 1) as WeeklyAppointmentItem["dayOfWeek"];
    return {
      day: DAY_LABELS[i],
      bookings: byDOW.get(dow) ?? 0,
    };
  });
}

export function BookingStatsChart({ data }: Props) {
  const series = buildWeeklySeries(data ?? []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch hẹn theo ngày trong tuần</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            bookings: { label: "Số lịch hẹn", color: "#F43F5E" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [String(value), "Lịch hẹn"]}
              />
              <Bar dataKey="bookings" fill="#F43F5E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

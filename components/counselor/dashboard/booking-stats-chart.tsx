    "use client"

    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
    import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

    const weeklyBookingData = [
    { day: "T2", bookings: 3 },
    { day: "T3", bookings: 5 },
    { day: "T4", bookings: 4 },
    { day: "T5", bookings: 6 },
    { day: "T6", bookings: 7 },
    { day: "T7", bookings: 4 },
    { day: "CN", bookings: 2 },
    ]

    export function BookingStatsChart() {
    return (
        <Card>
        <CardHeader>
            <CardTitle>Lịch hẹn theo ngày trong tuần</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer
            config={{
                bookings: {
                label: "Số lịch hẹn",
                color: "hsl(var(--chart-2))",
                },
            }}
            className="h-[300px]"
            >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyBookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [value, "Lịch hẹn"]} />
                <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
        </Card>
    )
    }

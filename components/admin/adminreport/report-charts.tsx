"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"

export function ReportCharts() {
  // Data for Members Growth
  const memberGrowthData = [
    { month: "T1", newMembers: 45, totalMembers: 245, premiumUpgrades: 12 },
    { month: "T2", newMembers: 52, totalMembers: 297, premiumUpgrades: 18 },
    { month: "T3", newMembers: 38, totalMembers: 335, premiumUpgrades: 15 },
    { month: "T4", newMembers: 67, totalMembers: 402, premiumUpgrades: 22 },
    { month: "T5", newMembers: 71, totalMembers: 473, premiumUpgrades: 28 },
    { month: "T6", newMembers: 58, totalMembers: 531, premiumUpgrades: 19 },
    { month: "T7", newMembers: 63, totalMembers: 594, premiumUpgrades: 25 },
    { month: "T8", newMembers: 49, totalMembers: 643, premiumUpgrades: 16 },
    { month: "T9", newMembers: 76, totalMembers: 719, premiumUpgrades: 31 },
    { month: "T10", newMembers: 82, totalMembers: 801, premiumUpgrades: 35 },
    { month: "T11", newMembers: 69, totalMembers: 870, premiumUpgrades: 24 },
    { month: "T12", newMembers: 88, totalMembers: 958, premiumUpgrades: 42 },
  ]

  // Data for Counselor Performance
  const counselorPerformanceData = [
    { name: "Dr. Nguyễn A", appointments: 45, rating: 4.8, completionRate: 95 },
    { name: "Dr. Trần B", appointments: 38, rating: 4.6, completionRate: 92 },
    { name: "Dr. Lê C", appointments: 52, rating: 4.9, completionRate: 98 },
    { name: "Dr. Phạm D", appointments: 29, rating: 4.4, completionRate: 88 },
    { name: "Dr. Hoàng E", appointments: 41, rating: 4.7, completionRate: 94 },
    { name: "Dr. Võ F", appointments: 35, rating: 4.5, completionRate: 90 },
  ]

  // Data for Appointments Analysis
  const appointmentData = [
    { month: "T1", scheduled: 120, completed: 108, cancelled: 8, noShow: 4 },
    { month: "T2", scheduled: 135, completed: 122, cancelled: 9, noShow: 4 },
    { month: "T3", scheduled: 98, completed: 89, cancelled: 6, noShow: 3 },
    { month: "T4", scheduled: 156, completed: 142, cancelled: 10, noShow: 4 },
    { month: "T5", scheduled: 178, completed: 165, cancelled: 8, noShow: 5 },
    { month: "T6", scheduled: 142, completed: 131, cancelled: 7, noShow: 4 },
    { month: "T7", scheduled: 189, completed: 175, cancelled: 9, noShow: 5 },
    { month: "T8", scheduled: 167, completed: 154, cancelled: 8, noShow: 5 },
    { month: "T9", scheduled: 203, completed: 188, cancelled: 11, noShow: 4 },
    { month: "T10", scheduled: 225, completed: 209, cancelled: 12, noShow: 4 },
    { month: "T11", scheduled: 198, completed: 183, cancelled: 10, noShow: 5 },
    { month: "T12", scheduled: 234, completed: 218, cancelled: 11, noShow: 5 },
  ]

  // Data for Survey Completion
  const surveyData = [
    { type: "Khảo sát trước tư vấn", completed: 856, started: 1024, completionRate: 84 },
    { type: "Đánh giá sau tư vấn", completed: 742, started: 856, completionRate: 87 },
    { type: "Khảo sát hài lòng", completed: 623, started: 742, completionRate: 84 },
    { type: "Khảo sát theo dõi", completed: 445, started: 623, completionRate: 71 },
  ]

  // Data for Course Enrollment
  const courseData = [
    { month: "T1", enrollments: 45, completions: 38, dropouts: 7 },
    { month: "T2", enrollments: 52, completions: 44, dropouts: 8 },
    { month: "T3", enrollments: 38, completions: 32, dropouts: 6 },
    { month: "T4", enrollments: 67, completions: 58, dropouts: 9 },
    { month: "T5", enrollments: 71, completions: 62, dropouts: 9 },
    { month: "T6", enrollments: 58, completions: 51, dropouts: 7 },
    { month: "T7", enrollments: 63, completions: 55, dropouts: 8 },
    { month: "T8", enrollments: 49, completions: 43, dropouts: 6 },
    { month: "T9", enrollments: 76, completions: 68, dropouts: 8 },
    { month: "T10", enrollments: 82, completions: 74, dropouts: 8 },
    { month: "T11", enrollments: 69, completions: 62, dropouts: 7 },
    { month: "T12", enrollments: 88, completions: 79, dropouts: 9 },
  ]

  // Pie chart data for membership distribution
  const membershipDistribution = [
    { name: "Basic", value: 45, color: "#8884d8" },
    { name: "Premium", value: 35, color: "#82ca9d" },
    { name: "VIP", value: 15, color: "#ffc658" },
    { name: "Diamond", value: 5, color: "#ff7300" },
  ]

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan phân tích</CardTitle>
        <CardDescription>Hiệu suất nền tảng cho giai đoạn đã chọn</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="members">
          <TabsList className="mb-4">
            <TabsTrigger value="members">Thành viên</TabsTrigger>
            <TabsTrigger value="counselors">Chuyên viên tư vấn</TabsTrigger>
            <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
            <TabsTrigger value="surveys">Khảo sát</TabsTrigger>
            <TabsTrigger value="courses">Khóa học</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Member Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tăng trưởng thành viên</CardTitle>
                  <CardDescription>Số lượng thành viên mới và tổng thành viên theo tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={memberGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="newMembers" fill="#8884d8" name="Thành viên mới" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalMembers"
                        stroke="#82ca9d"
                        strokeWidth={3}
                        name="Tổng thành viên"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Membership Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Phân bố gói membership</CardTitle>
                  <CardDescription>Tỷ lệ các gói membership hiện tại</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={membershipDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {membershipDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Premium Upgrades */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Nâng cấp Premium</CardTitle>
                  <CardDescription>Số lượng nâng cấp lên gói Premium theo tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={memberGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="premiumUpgrades"
                        stroke="#ffc658"
                        fill="#ffc658"
                        fillOpacity={0.6}
                        name="Nâng cấp Premium"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="counselors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Counselor Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hiệu suất tư vấn viên</CardTitle>
                  <CardDescription>Số lượng lịch hẹn và tỷ lệ hoàn thành</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={counselorPerformanceData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="appointments" fill="#8884d8" name="Lịch hẹn" />
                      <Bar dataKey="completionRate" fill="#82ca9d" name="Tỷ lệ hoàn thành (%)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Đánh giá tư vấn viên</CardTitle>
                  <CardDescription>Điểm đánh giá trung bình của từng tư vấn viên</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={counselorPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[4, 5]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="rating" fill="#ffc658" name="Đánh giá" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Appointment Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Xu hướng lịch hẹn</CardTitle>
                  <CardDescription>Thống kê lịch hẹn theo tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={appointmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="scheduled" stroke="#8884d8" strokeWidth={2} name="Đã lên lịch" />
                      <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={2} name="Hoàn thành" />
                      <Line type="monotone" dataKey="cancelled" stroke="#ffc658" strokeWidth={2} name="Đã hủy" />
                      <Line type="monotone" dataKey="noShow" stroke="#ff7300" strokeWidth={2} name="Không đến" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Completion Rate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tỷ lệ hoàn thành</CardTitle>
                  <CardDescription>Tỷ lệ hoàn thành lịch hẹn theo tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart
                      data={appointmentData.map((item) => ({
                        ...item,
                        completionRate: ((item.completed / item.scheduled) * 100).toFixed(1),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="completionRate"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                        name="Tỷ lệ hoàn thành (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tổng kết tháng gần nhất</CardTitle>
                  <CardDescription>Phân tích chi tiết tháng 12</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Hoàn thành", value: 218, color: "#82ca9d" },
                          { name: "Đã hủy", value: 11, color: "#ffc658" },
                          { name: "Không đến", value: 5, color: "#ff7300" },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: "Hoàn thành", value: 218, color: "#82ca9d" },
                          { name: "Đã hủy", value: 11, color: "#ffc658" },
                          { name: "Không đến", value: 5, color: "#ff7300" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="surveys" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Survey Completion Rates */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Tỷ lệ hoàn thành khảo sát</CardTitle>
                  <CardDescription>So sánh số lượng bắt đầu và hoàn thành theo loại khảo sát</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={surveyData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="type" type="category" width={150} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="started" fill="#8884d8" name="Đã bắt đầu" />
                      <Bar dataKey="completed" fill="#82ca9d" name="Hoàn thành" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Completion Rate Percentage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tỷ lệ hoàn thành (%)</CardTitle>
                  <CardDescription>Phần trăm hoàn thành theo loại khảo sát</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={surveyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                      <YAxis domain={[60, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="completionRate" fill="#ffc658" name="Tỷ lệ hoàn thành (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Survey Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Phân bố khảo sát</CardTitle>
                  <CardDescription>Tỷ lệ các loại khảo sát được hoàn thành</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={surveyData.map((item, index) => ({
                          name: item.type.replace("Khảo sát ", ""),
                          value: item.completed,
                          color: COLORS[index],
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {surveyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Enrollment Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Xu hướng đăng ký khóa học</CardTitle>
                  <CardDescription>Đăng ký, hoàn thành và bỏ học theo tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={courseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="enrollments" fill="#8884d8" name="Đăng ký" />
                      <Line type="monotone" dataKey="completions" stroke="#82ca9d" strokeWidth={3} name="Hoàn thành" />
                      <Line type="monotone" dataKey="dropouts" stroke="#ff7300" strokeWidth={2} name="Bỏ học" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Completion Rate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tỷ lệ hoàn thành khóa học</CardTitle>
                  <CardDescription>Phần trăm học viên hoàn thành khóa học</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart
                      data={courseData.map((item) => ({
                        ...item,
                        completionRate: ((item.completions / item.enrollments) * 100).toFixed(1),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="completionRate"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                        name="Tỷ lệ hoàn thành (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tổng kết năm</CardTitle>
                  <CardDescription>Tổng quan hiệu suất khóa học</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Hoàn thành",
                            value: courseData.reduce((sum, item) => sum + item.completions, 0),
                            color: "#82ca9d",
                          },
                          {
                            name: "Đang học",
                            value:
                              courseData.reduce((sum, item) => sum + item.enrollments, 0) -
                              courseData.reduce((sum, item) => sum + item.completions, 0) -
                              courseData.reduce((sum, item) => sum + item.dropouts, 0),
                            color: "#8884d8",
                          },
                          {
                            name: "Bỏ học",
                            value: courseData.reduce((sum, item) => sum + item.dropouts, 0),
                            color: "#ff7300",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[{ color: "#82ca9d" }, { color: "#8884d8" }, { color: "#ff7300" }].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

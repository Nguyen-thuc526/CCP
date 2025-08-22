import { BrainIcon, Heart, Target, BarChart3 } from "lucide-react"

export const surveyConfig = {
  SV001: {
    name: "MBTI",
    icon: BrainIcon,
    color: "blue",
    description: "Chỉ số tính cách Myers-Briggs",
  },
  SV002: {
    name: "DISC",
    icon: Target,
    color: "green",
    description: "Phong cách hành vi và giao tiếp",
  },
  SV003: {
    name: "Love Languages",
    icon: Heart,
    color: "pink",
    description: "Ngôn ngữ tình yêu",
  },
  SV004: {
    name: "Big Five",
    icon: BarChart3,
    color: "purple",
    description: "Năm yếu tố tính cách lớn",
  },
}

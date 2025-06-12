import { redirect } from "next/navigation"

export default function Home() {
  // Chuyển hướng đến trang đăng nhập
  redirect("/login")
}

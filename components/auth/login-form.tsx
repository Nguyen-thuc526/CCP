// components/LoginForm.tsx
"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from "@/lib/validationSchemas";
import { useAuth } from "@/hooks/useAuth";
import { FormType, Role } from "@/types/auth";

export function LoginForm() {
  const [formType, setFormType] = useState<FormType>(FormType.AdminLogin);
  const [isRegistering, setIsRegistering] = useState(false);
  const { signIn, signUp } = useAuth();

  const loginInitialValues: LoginFormData = { email: "", password: "" };
  const registerInitialValues: RegisterFormData = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <Card className="w-full max-w-md shadow-xl rounded-2xl border">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center">
          <Heart className="h-12 w-12 text-rose-500" />
        </div>
        <CardTitle className="text-2xl">CCP Platform</CardTitle>
        <CardDescription>Nền tảng dịch vụ tư vấn hôn nhân</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={formType} onValueChange={(value) => setFormType(value as FormType)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value={FormType.AdminLogin}>Quản trị viên</TabsTrigger>
            <TabsTrigger value={FormType.CounselorLogin}>Tư vấn viên</TabsTrigger>
          </TabsList>

          {/* Admin Login */}
          <TabsContent value={FormType.AdminLogin}>
            <Formik
              initialValues={loginInitialValues}
              validationSchema={loginSchema}
              onSubmit={(values, { setSubmitting }) => signIn(values, Role.Admin, setSubmitting)}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Field as={Input} id="admin-email" name="email" type="email" placeholder="admin@example.com" />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Mật khẩu</Label>
                    <Field
                      as={Input}
                      id="admin-password"
                      name="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                    />
                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>

          {/* Counselor Login/Register */}
          <TabsContent value={FormType.CounselorLogin}>
            {isRegistering ? (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Button variant="ghost" size="icon" onClick={() => setIsRegistering(false)}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-lg font-semibold">Đăng ký tư vấn viên</h2>
                </div>
                <Formik
                  initialValues={registerInitialValues}
                  validationSchema={registerSchema}
                  onSubmit={(values, { setSubmitting }) =>
                    signUp(values, setSubmitting, () => {
                      setIsRegistering(false);
                    })
                  }
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Field as={Input} id="fullName" name="fullName" placeholder="Nguyễn Văn A" />
                        <ErrorMessage name="fullName" component="p" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Field as={Input} id="register-email" name="email" type="email" />
                        <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Mật khẩu</Label>
                        <Field as={Input} id="register-password" name="password" type="password" />
                        <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                        <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" />
                        <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm" />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            ) : (
              <div>
                <Formik
                  initialValues={loginInitialValues}
                  validationSchema={loginSchema}
                  onSubmit={(values, { setSubmitting }) => signIn(values, Role.Counselor, setSubmitting)}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="counselor-email">Email</Label>
                        <Field
                          as={Input}
                          id="counselor-email"
                          name="email"
                          type="email"
                          placeholder="counselor@example.com"
                        />
                        <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="counselor-password">Mật khẩu</Label>
                        <Field
                          as={Input}
                          id="counselor-password"
                          name="password"
                          type="password"
                          placeholder="Nhập mật khẩu"
                        />
                        <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                      </Button>
                    </Form>
                  )}
                </Formik>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Chưa có tài khoản?{" "}
                    <button
                      className="text-indigo-500 hover:underline font-medium"
                      onClick={() => setIsRegistering(true)}
                    >
                      Đăng ký
                    </button>
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <a href="/forgot-password" className="hover:underline">
          Quên mật khẩu?
        </a>
      </CardFooter>
    </Card>
  );
}

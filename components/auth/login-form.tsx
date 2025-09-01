'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
   loginSchema,
   registerSchema,
   RegisterFormData,
   LoginFormData,
} from '@/lib/validationSchemas';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Role } from '@/utils/enum';
import { authService } from '@/services/authService';
import { useToast, ToastType } from '@/hooks/useToast';
import { storage } from '@/utils/storage';
import { login, logout } from '@/store/slices/authReducer';
import { setCookie } from '@/utils/cookies';
import { getRoleFromToken } from '@/utils/tokenUtils';
import { RootState } from '@/store/store';
import { userService } from '@/services/userService';

export function LoginForm() {
   const [selectedRole, setFormType] = useState<Role>(Role.Counselor);
   const [isRegistering, setIsRegistering] = useState(false);
   const dispatch = useDispatch();
   const router = useRouter();
   const { showToast } = useToast();

   const { isAuthenticated, role: roleInStore } = useSelector(
      (s: RootState) => s.auth
   );

   // Auto redirect khi đã đăng nhập
   useEffect(() => {
      const go = async () => {
         if (isAuthenticated && roleInStore) {
            if (roleInStore === Role.Admin) {
               router.replace('/admin/dashboard');
               return;
            }
            try {
               const prof = await userService.getCounselorProfile();
               const raw = (prof as any)?.data?.status ?? (prof as any)?.status;
               const status = Number(raw);
               if (status === 2) {
                  showToast('Tài khoản của bạn đã bị khóa.', ToastType.Error);
                  storage.removeToken();
                  setCookie('role', '');
                  setCookie('counselor_status', '');
                  dispatch(logout());
                  router.replace('/login');
               } else {
                  const dest = status === 1 ? '/counselor/dashboard' : '/counselor/certificates';
                  router.replace(dest);
               }
            } catch {
               router.replace('/counselor/certificates');
            }
            return;
         }

         const token = storage.getToken();
         const parsedRole = token ? getRoleFromToken(token) : null;
         if (token && parsedRole) {
            if (parsedRole === Role.Admin) {
               router.replace('/admin/dashboard');
               return;
            }
            try {
               const prof = await userService.getCounselorProfile();
               const raw = (prof as any)?.data?.status ?? (prof as any)?.status;
               const status = Number(raw);
               if (status === 2) {
                  showToast('Tài khoản của bạn đã bị khóa.', ToastType.Error);
                  storage.removeToken();
                  setCookie('role', '');
                  setCookie('counselor_status', '');
                  dispatch(logout());
                  router.replace('/login');
               } else {
                  const dest = status === 1 ? '/counselor/dashboard' : '/counselor/certificates';
                  router.replace(dest);
               }
            } catch {
               router.replace('/counselor/certificates');
            }
         }
      };

      void go();
   }, [isAuthenticated, roleInStore, dispatch, router, showToast]);

   const loginInitialValues: LoginFormData = { email: '', password: '' };
   const registerInitialValues: RegisterFormData = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
   };

   const handleLogin = async (
      values: LoginFormData,
      setSubmitting: (isSubmitting: boolean) => void
   ) => {
      try {
         let response;

         if (selectedRole === Role.Admin) {
            response = await authService.loginAdmin(values);
         } else {
            response = await authService.login(values);
         }

         const { token, role: userRole } = response;

         if (token && userRole) {
            storage.setToken(token);
            dispatch(login({ token, role: userRole }));
            setCookie('role', String(userRole));

            if (userRole === Role.Counselor) {
               try {
                  const prof = await userService.getCounselorProfile();
                  const raw = (prof as any)?.data?.status ?? (prof as any)?.status;
                  const status = Number(raw);
                  setCookie(
                     'counselor_status',
                     Number.isFinite(status) ? String(status) : '0'
                  );

                  if (status === 2) {
                     showToast('Tài khoản của bạn đã bị khóa.', ToastType.Error);
                     storage.removeToken();
                     setCookie('role', '');
                     setCookie('counselor_status', '');
                     dispatch(logout());
                     router.replace('/login');
                  } else {
                     showToast('Đăng nhập thành công!', ToastType.Success);
                     const dest = status === 1 ? '/counselor/dashboard' : '/counselor/certificates';
                     router.replace(dest);
                  }
               } catch {
                  setCookie('counselor_status', '0');
                  showToast('Đăng nhập thành công!', ToastType.Success);
                  router.replace('/counselor/certificates');
               }
            } else {
               showToast('Đăng nhập thành công!', ToastType.Success);
               router.replace('/admin/dashboard');
            }
         } else {
            throw new Error('Invalid response data');
         }
      } catch (error: any) {
         if (error?.response?.status === 401) {
            showToast('Sai tài khoản hoặc mật khẩu.', ToastType.Error);
         } else {
            let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.';
            if (error?.message === 'Invalid role in token') {
               errorMessage = 'Vai trò không hợp lệ.';
            } else if (
               error?.message === 'Invalid token format in response' ||
               error?.message === 'Invalid token format'
            ) {
               errorMessage = 'Không nhận được token hợp lệ từ server.';
            }
            showToast(errorMessage, ToastType.Error);
         }
      } finally {
         setSubmitting(false);
      }
   };

   const handleRegister = async (
      values: RegisterFormData,
      setSubmitting: (isSubmitting: boolean) => void
   ) => {
      try {
         const response = await authService.register(values);
         if (response?.success) {
            showToast(
               'Đăng ký thành công! Vui lòng đăng nhập.',
               ToastType.Success
            );
            setIsRegistering(false);
         } else {
            const msg =
               response?.error || 'Đăng ký thất bại. Vui lòng thử lại.';
            showToast(msg, ToastType.Error);
         }
      } catch (error: any) {
         if (error?.response?.status === 400) {
            showToast('Email đã tồn tại.', ToastType.Error);
         } else {
            const msg =
               error?.response?.data?.message ||
               error?.message ||
               'Đăng ký thất bại. Vui lòng kiểm tra thông tin.';
            showToast(msg, ToastType.Error);
         }
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <Card className="w-full max-w-md shadow-xl rounded-2xl border">
         <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
               <Heart className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl">CCP Platform</CardTitle>
            <CardDescription>Nền tảng dịch vụ tư vấn hôn nhân</CardDescription>
         </CardHeader>

         <CardContent>
            <Tabs
               value={selectedRole.toString()}
               onValueChange={(value) => setFormType(parseInt(value) as Role)}
               className="space-y-4"
            >
               <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value={Role.Admin.toString()}>
                     Quản trị viên
                  </TabsTrigger>
                  <TabsTrigger value={Role.Counselor.toString()}>
                     Tư vấn viên
                  </TabsTrigger>
               </TabsList>

               <TabsContent value={Role.Admin.toString()}>
                  <Formik
                     initialValues={loginInitialValues}
                     validationSchema={loginSchema}
                     onSubmit={(values, { setSubmitting }) =>
                        handleLogin(values, setSubmitting)
                     }
                  >
                     {({ isSubmitting }) => (
                        <Form className="space-y-4 pt-4">
                           <div className="space-y-2">
                              <Label htmlFor="admin-email">Email</Label>
                              <Field
                                 as={Input}
                                 id="admin-email"
                                 name="email"
                                 type="email"
                                 placeholder="admin@example.com"
                              />
                              <ErrorMessage
                                 name="email"
                                 component="p"
                                 className="text-red-500 text-sm"
                              />
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
                              <ErrorMessage
                                 name="password"
                                 component="p"
                                 className="text-red-500 text-sm"
                              />
                           </div>
                           <Button
                              type="submit"
                              className="w-full"
                              disabled={isSubmitting}
                           >
                              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                           </Button>
                        </Form>
                     )}
                  </Formik>
               </TabsContent>

               <TabsContent value={Role.Counselor.toString()}>
                  {isRegistering ? (
                     <Formik
                        initialValues={registerInitialValues}
                        validationSchema={registerSchema}
                        onSubmit={(values, { setSubmitting }) =>
                           handleRegister(values, setSubmitting)
                        }
                     >
                        {({ isSubmitting }) => (
                           <Form className="space-y-4 pt-4">
                              <div className="space-y-2">
                                 <Label htmlFor="counselor-fullName">
                                    Họ tên
                                 </Label>
                                 <Field
                                    as={Input}
                                    id="counselor-fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Nhập họ tên"
                                 />
                                 <ErrorMessage
                                    name="fullName"
                                    component="p"
                                    className="text-red-500 text-sm"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label htmlFor="counselor-email">Email</Label>
                                 <Field
                                    as={Input}
                                    id="counselor-email"
                                    name="email"
                                    type="email"
                                    placeholder="counselor@example.com"
                                 />
                                 <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-red-500 text-sm"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label htmlFor="counselor-password">
                                    Mật khẩu
                                 </Label>
                                 <Field
                                    as={Input}
                                    id="counselor-password"
                                    name="password"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                 />
                                 <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="text-red-500 text-sm"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label htmlFor="counselor-confirmPassword">
                                    Xác nhận mật khẩu
                                 </Label>
                                 <Field
                                    as={Input}
                                    id="counselor-confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                 />
                                 <ErrorMessage
                                    name="confirmPassword"
                                    component="p"
                                    className="text-red-500 text-sm"
                                 />
                              </div>
                              <Button
                                 type="submit"
                                 className="w-full"
                                 disabled={isSubmitting}
                              >
                                 {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                              </Button>
                              <Button
                                 variant="link"
                                 className="w-full text-sm"
                                 onClick={() => setIsRegistering(false)}
                              >
                                 Quay lại đăng nhập
                              </Button>
                           </Form>
                        )}
                     </Formik>
                  ) : (
                     <Formik
                        initialValues={loginInitialValues}
                        validationSchema={loginSchema}
                        onSubmit={(values, { setSubmitting }) =>
                           handleLogin(values, setSubmitting)
                        }
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
                                 <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-red-500 text-sm"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label htmlFor="counselor-password">
                                    Mật khẩu
                                 </Label>
                                 <Field
                                    as={Input}
                                    id="counselor-password"
                                    name="password"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                 />
                                 <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="text-red-500 text-sm"
                                 />
                              </div>
                              <Button
                                 type="submit"
                                 className="w-full"
                                 disabled={isSubmitting}
                              >
                                 {isSubmitting
                                    ? 'Đang đăng nhập...'
                                    : 'Đăng nhập'}
                              </Button>
                              <Button
                                 variant="link"
                                 className="w-full text-sm"
                                 onClick={() => setIsRegistering(true)}
                              >
                                 Chưa có tài khoản? Đăng ký
                              </Button>
                           </Form>
                        )}
                     </Formik>
                  )}
               </TabsContent>
            </Tabs>
         </CardContent>
      </Card>
   );
}
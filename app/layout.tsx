// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Providers from './provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: 'CCP - Nền tảng dịch vụ tư vấn hôn nhân',
   description: 'Nền tảng dịch vụ tư vấn hôn nhân chuyên nghiệp',
   generator: 'v0.dev',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="vi" suppressHydrationWarning>
         <body className={inter.className}>
            <Providers>
               {children}
               <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
               />
            </Providers>
         </body>
      </html>
   );
}

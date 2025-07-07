import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import 'react-datepicker/dist/react-datepicker.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SensAI - Scheduler",
  description: "A video conferencng app",
  icons:{
    icon: "/icons/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
      afterSignOutUrl="/sign-in"
      appearance={{

        layout:{
          logoImageUrl: '/icons/logo.svg',
          socialButtonsVariant: 'iconButton'
        },
        variables:{
          colorText: '#fff',
          colorPrimary: '#0E78F9',
          colorBackground: '#1c1f2e',
          colorInputBackground: '#252a41',
          colorInputText: '#fff'
        },

        elements:{
          userButtonAvatarBox:{
             width: '45px',
            height: '45px'
          }
        }
        
      }}
      >
          <body
          className={`${inter.className} bg-dark-2`}>
            
          {children}
          <Toaster />
        </body>

      </ClerkProvider>
    </html>
  );
}

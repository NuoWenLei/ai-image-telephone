import Sidebar from '@/components/Sidebar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/utilities/firebase/firebaseAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Midjourney AI Telephone'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={"flex flex-row bg-black " + inter.className}>
          <div className="flex flex-col">
            <Navbar />
            <div className="flex flex-row w-full h-full">
              {children}
            </div>
          </div>
          <Sidebar />
          <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          />
          </body>
        </AuthProvider>
    </html>
  )
}

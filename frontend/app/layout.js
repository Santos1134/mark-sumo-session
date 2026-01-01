import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata = {
  title: 'Mark Sumo Bot - Session Generator',
  description: 'Generate WhatsApp session ID for Mark Sumo Bot',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

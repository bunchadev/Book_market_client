import StyledComponentsRegistry from '@/lib/antd.registry'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "../styles/app.scss"
import NextAuthWrapper from '@/lib/next.auth.wrapper'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
         <StyledComponentsRegistry>
          <NextAuthWrapper>
            {children}
          </NextAuthWrapper>
         </StyledComponentsRegistry>
      </body>
    </html>
  )
}

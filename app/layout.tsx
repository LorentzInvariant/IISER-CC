import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IISER Mohali — Computer Centre Portal & Staff Directory',
  description: 'Official internal portal for IISER Mohali community: Computer Centre staff directory, duty management schedules, and technical responsibilities.',
  openGraph: {
    title: 'IISER Mohali Computer Centre Directory & Duty Portal',
    description: 'Internal administrative and staff duty portal for the IISER Mohali community.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IISER Mohali Computer Centre Portal',
    description: 'Internal administrative and staff duty portal for IISER Mohali.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#F7F6F2]">
      <body className="min-h-full font-sans antialiased text-[#182026] bg-[#F7F6F2] selection:bg-[#0D1B2A] selection:text-white">
        {children}
      </body>
    </html>
  );
}

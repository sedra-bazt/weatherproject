export const metadata = {
  title: 'Weather App',
  description: 'Next.js Weather Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
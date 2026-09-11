import './globals.css';

export const metadata = {
  title: 'apna store01',
  description: 'Fresh groceries delivered in 10 minutes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
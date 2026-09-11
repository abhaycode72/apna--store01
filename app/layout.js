import './globals.css';

export const metadata = {
  title: 'apna store01',
  description: 'Fresh groceries delivered in 10 minutes.',
  verification: {
    google: 'ZZgX3Szh2N7uUJXFBXTKOPJe3q2Hmun5roX5GjWXAR8',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
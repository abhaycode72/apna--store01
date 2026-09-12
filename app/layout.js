import './globals.css';
import BottomNav from '../src/store/src/components/BottomNav';

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
      <body className="bg-gray-100">
        <div className="mx-auto max-w-md min-h-screen bg-white relative shadow-2xl overflow-x-hidden">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
import './globals.css';
import BottomNav from '../src/store/src/components/BottomNav';
import DesktopHeader from '../src/store/src/components/DesktopHeader';

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
      <body className="bg-gray-100 min-h-screen">
        <DesktopHeader />
        <div className="mx-auto min-h-screen bg-gray-50 relative pb-16 md:pb-0">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
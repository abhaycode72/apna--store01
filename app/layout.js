import './globals.css';

export const metadata = {
  title: 'apna store01',
  description: 'Fresh groceries delivered in 10 minutes.',
  verification: {
    google: 'ZZgX3Szh2N7uUJXFBXTKOPJe3q2Hmun5roX5GjWXAR8',
  },
};

import GlobalSidebar from '../src/store/src/components/GlobalSidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gray-50">
          <GlobalSidebar />
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
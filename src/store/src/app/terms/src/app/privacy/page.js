import Header from '../../../../../components/Header';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: September 2026</p>
          
          <div className="prose prose-purple max-w-none">
            <h2 className="text-xl font-bold mt-6 mb-3">1. Collection of Location Data</h2>
            <p className="text-gray-600 mb-6">
              To deliver your order in under 15 minutes, we require precise GPS access. We collect your device's location data to route your order to the nearest dark store and calculate accurate ETAs.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">2. Data Sharing with Riders</h2>
            <p className="text-gray-600 mb-6">
              Your delivery address and name are shared with our third-party delivery riders. To protect your privacy, phone calls between you and the rider are routed through a masked VOIP system—the rider never sees your actual phone number.
            </p>

            {/* Add remaining clauses here */}
          </div>
        </div>
      </main>
    </div>
  );
}
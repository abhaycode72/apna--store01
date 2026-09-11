import Header from '../../components/Header';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-6">Terms & Conditions</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: September 2026</p>
          
          <div className="prose prose-purple max-w-none">
            <h2 className="text-xl font-bold mt-6 mb-3">1. Delivery Time & 10-Minute Estimate</h2>
            <p className="text-gray-600 mb-6">
              The 10-minute delivery timeframes displayed on the Platform are estimated times of arrival (ETAs) based on current dark store proximity and rider availability. We prioritize rider safety, and ETAs may be extended due to weather, traffic, or force majeure events.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">2. Order Cancellations</h2>
            <p className="text-gray-600 mb-6">
              Orders are packed within minutes of placement. You may only cancel an order before the status changes to 'Packing'. Once packing begins, cancellations are not permitted due to the operational costs of rapid fulfillment.
            </p>

            {/* Add remaining clauses here */}
          </div>
        </div>
      </main>
    </div>
  );
}
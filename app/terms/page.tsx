import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions - Kings Bakery",
  description: "Terms and conditions for Kings Bakery website usage and services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By accessing and using the Kings Bakery website and services, you accept and agree to be bound by these terms and conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Website Usage
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This website is provided for your personal, non-commercial use. You may browse our menu, place orders, and access information about our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Online Ordering
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4">
                <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  📋 Order Terms:
                </p>
                <ul className="list-disc pl-6 text-blue-700 dark:text-blue-300 space-y-2">
                  <li>All orders are subject to availability</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Orders must be placed during business hours</li>
                  <li>Payment is required at the time of ordering</li>
                  <li>Delivery times are estimates and may vary</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We respect your privacy. Any personal information collected will be used solely for order processing and customer service purposes. We do not share your information with third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Food Safety & Allergies
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                  ⚠️ Important Notice:
                </p>
                <ul className="list-disc pl-6 text-yellow-700 dark:text-yellow-300 space-y-2">
                  <li>Please inform us of any food allergies or dietary restrictions</li>
                  <li>We prepare food in a kitchen that handles various ingredients</li>
                  <li>Cross-contamination may occur</li>
                  <li>We cannot guarantee allergen-free preparation</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Delivery & Pickup
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Delivery is available within our service area. Pickup orders must be collected within 30 minutes of the specified ready time. We are not responsible for orders not collected within this timeframe.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Cancellation Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Orders can be cancelled up to 30 minutes before the scheduled pickup/delivery time. Cancellations made after this time may incur charges.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Refunds & Complaints
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you are not satisfied with your order, please contact us immediately. We will address your concerns and may offer a replacement or refund at our discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Website Availability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We strive to keep our website available 24/7, but we cannot guarantee uninterrupted access. The website may be temporarily unavailable for maintenance or technical issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Intellectual Property
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                All content on this website, including images, text, and design, is the property of Kings Bakery and is protected by copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Kings Bakery shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on the website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                13. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For questions about these terms and conditions, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> info@thekingsbakerysl.com<br />
                  <strong>Phone:</strong> 076 533655<br />
                  <strong>Address:</strong> 117 MAIN REGENT ROAD, HILL STATION, OPPOSITE CITY SUPERMARKET
                </p>
              </div>
            </section>

            {/* Developer Attribution */}
            <section className="mt-12 p-6 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                🛠️ Technical Development
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                This website was developed by <strong>Ahmad (074762243)</strong>. The system architecture, 
                design, and implementation are proprietary and protected under these terms and conditions.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
} 
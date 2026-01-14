export const metadata = {
  title: "Terms & Conditions | Revive Eco Tech",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">
        Terms and Conditions for Revive Eco Tech
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        Last Updated: 08/09/2025
      </p>

      {/* 1 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By downloading, accessing, or using the Revive Eco Tech mobile
          application and any associated services (collectively, the “App”),
          you agree to be bound by these Terms and Conditions (“Terms”). If you
          do not agree to these Terms, please do not access or use the App.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Definitions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>“We,” “us,” “our,” and “Company”</strong> refer to Revive Eco
            Tech.
          </li>
          <li>
            <strong>“You” and “your”</strong> refer to the individual user
            accessing the App.
          </li>
          <li>
            <strong>“Content”</strong> refers to all information, data, text,
            software, graphics, messages, and other materials, whether publicly
            posted or privately transmitted.
          </li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
        <p className="mb-2">
          <strong>Account Creation:</strong> You may be required to register for
          an account to access certain features. You agree to provide accurate,
          current, and complete information during registration.
        </p>
        <p className="mb-2">
          <strong>Account Security:</strong> You are responsible for maintaining
          the confidentiality of your account credentials and for all activities
          that occur under your account. You agree to notify us immediately of
          any unauthorized use of your account.
        </p>
        <p>
          <strong>Eligibility:</strong> You must be at least 13, 16, or 18 years
          old (depending on your jurisdiction) or the age of majority in your
          jurisdiction to use the App. By using the App, you represent and
          warrant that you meet this requirement.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. User Conduct and Responsibilities
        </h2>
        <p className="mb-2">You agree not to use the App to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Violate any applicable law or regulation.</li>
          <li>Infringe upon the intellectual property rights of others.</li>
          <li>Harass, abuse, or harm another person.</li>
          <li>Transmit spam, chain letters, or unsolicited communications.</li>
          <li>Upload or transmit viruses or malicious code.</li>
          <li>
            Use automated systems such as robots or spiders to access the App.
          </li>
          <li>Interfere with or disrupt the integrity or performance of the App.</li>
        </ul>
      </section>

      {/* 5 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
        <p className="mb-2">
          <strong>Our Rights:</strong> The App, including its content, features,
          functionality, logos, and design, is the exclusive property of Revive
          Eco Tech and its licensors and is protected by intellectual property
          laws.
        </p>
        <p className="mb-2">
          <strong>Your Content:</strong> By submitting content through the App,
          you grant us a worldwide, non-exclusive, royalty-free, sublicensable,
          and transferable license to use, reproduce, distribute, and display
          such content in connection with the App.
        </p>
        <p>
          You represent and warrant that you own or have the necessary rights to
          any content you submit.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Payments and Subscriptions (If Applicable)
        </h2>
        <p className="mb-2">
          <strong>Fees:</strong> Certain features may require payment. You agree
          to pay all applicable fees as described in the App.
        </p>
        <p className="mb-2">
          <strong>Subscriptions:</strong> Subscriptions automatically renew
          unless cancelled through your app store (Apple App Store or Google
          Play Store).
        </p>
        <p>
          <strong>Refunds:</strong> Payments are non-refundable except as
          required by law or stated otherwise by the app store.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Privacy</h2>
        <p>
          Your privacy is important to us. Our Privacy Policy explains how we
          collect, use, and share your information and is incorporated into
          these Terms by reference.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          8. Third-Party Links and Services
        </h2>
        <p>
          The App may contain links to third-party services not owned or
          controlled by us. We assume no responsibility for their content,
          privacy policies, or practices. Access them at your own risk.
        </p>
      </section>

      {/* 9 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          9. Disclaimer of Warranties
        </h2>
        <p className="uppercase text-sm">
          The App is provided on an “as is” and “as available” basis without
          warranties of any kind, either express or implied, including implied
          warranties of merchantability, fitness for a particular purpose, or
          non-infringement.
        </p>
      </section>

      {/* 10 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          10. Limitation of Liability
        </h2>
        <p className="uppercase text-sm">
          To the fullest extent permitted by law, Revive Eco Tech shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of the App.
        </p>
      </section>
    </main>
  );
}

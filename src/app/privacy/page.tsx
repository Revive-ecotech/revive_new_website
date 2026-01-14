export const metadata = {
  title: "Privacy Policy | Revive Eco Tech",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">
        Privacy Policy for Revive Eco Tech
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        Last Updated: 08/09/2025
      </p>

      {/* 1 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Revive Eco Tech (“we”, “us”, “our”) respects your privacy and is
          committed to protecting your personal information. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you use our mobile application and related services
          (collectively, the “App”).
        </p>
      </section>

      {/* 2 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. Information We Collect
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, email address, phone
            number, and other information you provide during registration or
            use of the App.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you access and
            use the App, including device type, IP address, browser type, and
            pages visited.
          </li>
          <li>
            <strong>Location Data:</strong> Approximate location information if
            enabled on your device.
          </li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide, operate, and maintain the App</li>
          <li>To improve user experience and App functionality</li>
          <li>To communicate updates, offers, and support messages</li>
          <li>To monitor and prevent fraud, abuse, or security issues</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      {/* 4 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Sharing of Information
        </h2>
        <p>
          We do not sell your personal information. We may share information
          with trusted third-party service providers who assist us in operating
          the App, subject to confidentiality obligations, or when required by
          law.
        </p>
      </section>

      {/* 5 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p>
          We implement reasonable administrative, technical, and physical
          security measures to protect your information. However, no method of
          transmission over the internet is 100% secure, and we cannot
          guarantee absolute security.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct,
          or delete your personal data. You may also object to or restrict
          certain processing of your data.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Third-Party Services</h2>
        <p>
          The App may contain links to third-party websites or services. We are
          not responsible for the privacy practices or content of those
          services.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          8. Children’s Privacy
        </h2>
        <p>
          The App is not intended for children under the age of 13. We do not
          knowingly collect personal information from children. If we become
          aware that we have collected such data, we will take steps to delete
          it.
        </p>
      </section>

      {/* 9 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          9. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated “Last Updated” date.
        </p>
      </section>

      {/* 10 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at{" "}
          <a
            href="mailto:support@reviveecotech.com"
            className="text-[#386641] underline"
          >
            support@reviveecotech.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}

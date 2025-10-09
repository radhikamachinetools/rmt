// app/privacy-policy/page.tsx
import InfoPageLayout from "../components/InfoPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout title="Privacy Policy">
      <p>
        <strong>Effective Date:</strong> September 18, 2025
      </p>

      <h2>1. Introduction</h2>
      <p>
        Radhika Machineries (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
        is committed to protecting your privacy. This Privacy Policy explains
        how we collect, use, disclose, and safeguard your information when you
        visit our website.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We may collect personal information that you voluntarily provide to us
        when you fill out a contact form, request a quote, or otherwise contact
        us. This information may include your name, email address, phone number,
        and company name.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Respond to your inquiries and service requests.</li>
        <li>
          Send you marketing and promotional communications, with an option to
          opt-out.
        </li>
        <li>Improve our website and product offerings.</li>
        <li>Maintain the security and integrity of our website.</li>
      </ul>

      <h2>4. Disclosure of Your Information</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personally
        identifiable information to outside parties. This does not include
        trusted third parties who assist us in operating our website or
        servicing you, so long as those parties agree to keep this information
        confidential.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement a variety of security measures to maintain the safety of
        your personal information. However, no method of transmission over the
        Internet is 100% secure.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        If you have any questions regarding this privacy policy, you may contact
        us using the information on our Contact page.
      </p>
    </InfoPageLayout>
  );
}

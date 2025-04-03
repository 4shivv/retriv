<template>
  <div class="privacy-page">
    <div class="container">
      <div class="privacy-header">
        <h1 class="privacy-title">Privacy Policy</h1>
        <p class="privacy-date">Last Updated: April 3, 2025</p>
      </div>

      <div class="privacy-content">
        <section class="privacy-section">
          <h2>1. Introduction</h2>
          <p>At Retriv, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application, website, and related services.</p>
        </section>

        <section class="privacy-section">
          <h2>2. Information We Collect</h2>
          <p><strong>Personal Information:</strong> When you register for an account, we collect your name, email address, and password.</p>
          <p><strong>Usage Data:</strong> We collect information on how you interact with our service, including study patterns, performance metrics, and feature usage.</p>
          <p><strong>Device Information:</strong> We collect information about your device, including device type, operating system, and browser type.</p>
        </section>

        <section class="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Personalize your learning experience</li>
            <li>Analyze usage patterns to enhance our platform</li>
            <li>Communicate with you about updates and new features</li>
            <li>Respond to your inquiries and support requests</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>4. Data Storage and Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
          <p>Your data is stored on secure servers and we regularly review our security practices to ensure the highest level of protection.</p>
        </section>

        <section class="privacy-section">
          <h2>5. Sharing Your Information</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
          <ul>
            <li>Service providers who help us deliver our services</li>
            <li>Legal authorities when required by law</li>
            <li>Business partners with your explicit consent</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have rights regarding your personal information, including:</p>
          <ul>
            <li>Access to your data</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your data</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
          </ul>
          <p>To exercise these rights, please contact us at privacy@retriv.com.</p>
        </section>

        <section class="privacy-section">
          <h2>7. Children's Privacy</h2>
          <p>Our service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will promptly delete it.</p>
        </section>

        <section class="privacy-section">
          <h2>8. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
        </section>

        <section class="privacy-section">
          <h2>9. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@retriv.com</p>
          <p>Address: 123 Learning Lane, San Francisco, CA 94105</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPage'
}
</script>

<style scoped>
.privacy-page {
  padding: 5rem 0;
  background-color: var(--neutral-50);
}

.privacy-header {
  margin-bottom: 3rem;
  text-align: center;
}

.privacy-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.privacy-date {
  color: var(--neutral-500);
  font-size: 0.9rem;
}

.privacy-content {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 3rem;
}

.privacy-section {
  margin-bottom: 2rem;
}

.privacy-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.privacy-section p, .privacy-section li {
  color: var(--neutral-700);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.privacy-section ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .privacy-content {
    padding: 2rem;
  }
  
  .privacy-title {
    font-size: 2rem;
  }
}
</style>
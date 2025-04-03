<template>
  <div class="terms-page">
    <div class="container">
      <div class="terms-header">
        <h1 class="terms-title">Terms of Service</h1>
        <p class="terms-date">Last Updated: April 3, 2025</p>
      </div>

      <div class="terms-content">
        <section class="terms-section">
          <h2>1. Introduction</h2>
          <p>Welcome to Retriv. By accessing or using our website, mobile applications, or any of our services, you agree to be bound by these Terms of Service. Please read these terms carefully before using our platform.</p>
        </section>

        <section class="terms-section">
          <h2>2. Definitions</h2>
          <p>"Service" refers to the Retriv application, website, and any related services provided by us.</p>
          <p>"User" refers to individuals who register for and use our Service.</p>
          <p>"Content" refers to all materials uploaded, created, or shared through our Service, including but not limited to text, images, audio, and video.</p>
        </section>

        <section class="terms-section">
          <h2>3. Account Registration</h2>
          <p>To use certain features of our Service, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          <p>You agree to provide accurate and complete information when creating your account and to update such information as necessary.</p>
        </section>

        <section class="terms-section">
          <h2>4. User Content</h2>
          <p>By submitting content to our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and distribute such content in connection with providing and promoting our Service.</p>
          <p>You represent and warrant that you own or have the necessary rights to the content you submit, and that such content does not violate the rights of any third party.</p>
        </section>

        <section class="terms-section">
          <h2>5. Acceptable Use</h2>
          <p>You agree not to use our Service for any unlawful purpose or in any way that could damage, disable, or impair our Service.</p>
          <p>You will not attempt to gain unauthorized access to any part of our Service, other accounts, or computer systems.</p>
        </section>

        <section class="terms-section">
          <h2>6. Intellectual Property</h2>
          <p>Our Service and its original content, features, and functionality are owned by Retriv and are protected by international copyright, trademark, and other intellectual property laws.</p>
        </section>

        <section class="terms-section">
          <h2>7. Termination</h2>
          <p>We may terminate or suspend your account and access to our Service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.</p>
        </section>

        <section class="terms-section">
          <h2>8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Retriv shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.</p>
        </section>

        <section class="terms-section">
          <h2>9. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes by posting the new Terms on our website or through our Service. Your continued use of our Service after such changes constitutes your acceptance of the new Terms.</p>
        </section>

        <section class="terms-section">
          <h2>10. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at info@retriv.com.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsPage'
}
</script>

<style scoped>
.terms-page {
  padding: 5rem 0;
  background-color: var(--neutral-50);
}

.terms-header {
  margin-bottom: 3rem;
  text-align: center;
}

.terms-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.terms-date {
  color: var(--neutral-500);
  font-size: 0.9rem;
}

.terms-content {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 3rem;
}

.terms-section {
  margin-bottom: 2rem;
}

.terms-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.terms-section p {
  color: var(--neutral-700);
  line-height: 1.6;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .terms-content {
    padding: 2rem;
  }
  
  .terms-title {
    font-size: 2rem;
  }
}
</style>
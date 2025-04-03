<template>
  <div class="pricing-page">
    <div class="container">
      <div class="pricing-header">
        <h1 class="pricing-title">Choose Your Plan</h1>
        <p class="pricing-subtitle">Select the perfect plan for your learning journey</p>
      </div>

      <div class="pricing-toggle">
        <span :class="{ 'active': !isAnnual }">Monthly</span>
        <label class="toggle">
          <input type="checkbox" v-model="isAnnual">
          <span class="slider"></span>
        </label>
        <span :class="{ 'active': isAnnual }">Annual <span class="save-badge">Save 20%</span></span>
      </div>
      
      <div class="pricing-plans">
        <div class="pricing-plan">
          <div class="plan-header">
            <h3 class="plan-name">Free</h3>
            <div class="plan-price">
              <span class="price">$0</span>
              <span class="period">forever</span>
            </div>
            <p class="plan-description">Perfect for trying out Retriv and casual learners</p>
          </div>
          
          <ul class="plan-features">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Up to 3 active study materials</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Basic recall practice</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Progress tracking</span>
            </li>
            <li class="unavailable">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Advanced learning modes</span>
            </li>
            <li class="unavailable">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>AI-enhanced learning</span>
            </li>
          </ul>
          
          <div class="plan-action">
            <router-link to="/register" class="btn btn-outline">Get Started</router-link>
          </div>
        </div>
        
        <div class="pricing-plan popular">
          <div class="popular-badge">Most Popular</div>
          <div class="plan-header">
            <h3 class="plan-name">Pro</h3>
            <div class="plan-price">
              <span class="price">{{ isAnnual ? '$8' : '$10' }}</span>
              <span class="period">/ {{ isAnnual ? 'month, billed annually' : 'month' }}</span>
            </div>
            <p class="plan-description">For serious students and lifelong learners</p>
          </div>
          
          <ul class="plan-features">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Unlimited study materials</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>All learning modes (Blurting, Feynman)</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Advanced analytics and insights</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>AI-powered learning recommendations</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Priority support</span>
            </li>
          </ul>
          
          <div class="plan-action">
            <router-link to="/register?plan=pro" class="btn btn-primary">Choose Pro</router-link>
          </div>
        </div>
        
        <div class="pricing-plan">
          <div class="plan-header">
            <h3 class="plan-name">Teams</h3>
            <div class="plan-price">
              <span class="price">{{ isAnnual ? '$6' : '$8' }}</span>
              <span class="period">/ user / {{ isAnnual ? 'month, billed annually' : 'month' }}</span>
            </div>
            <p class="plan-description">For schools, companies, and study groups</p>
          </div>
          
          <ul class="plan-features">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Everything in Pro plan</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Minimum 5 users</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Team management dashboard</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Shared study materials library</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Dedicated account manager</span>
            </li>
          </ul>
          
          <div class="plan-action">
            <router-link to="/contact?subject=teams" class="btn btn-outline">Contact Sales</router-link>
          </div>
        </div>
      </div>
      
      <div class="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        
        <div class="faq-items">
          <div class="faq-item">
            <h3>Can I change plans later?</h3>
            <p>Yes, you can upgrade, downgrade, or cancel your plan at any time. If you downgrade or cancel an annual plan, you'll continue to have access until the end of your billing period.</p>
          </div>
          
          <div class="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, including Visa, Mastercard, and American Express. For Team plans, we also offer invoicing.</p>
          </div>
          
          <div class="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial—you'll only be charged when you decide to continue.</p>
          </div>
          
          <div class="faq-item">
            <h3>What's your refund policy?</h3>
            <p>If you're not satisfied with your purchase, contact us within 30 days and we'll give you a full refund. No questions asked.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'PricingPage',
  setup() {
    const isAnnual = ref(true);
    
    return {
      isAnnual
    };
  }
}
</script>

<style scoped>
.pricing-page {
  padding: 5rem 0;
  background-color: var(--neutral-50);
}

.pricing-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pricing-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.pricing-subtitle {
  font-size: 1.25rem;
  color: var(--neutral-600);
  max-width: 700px;
  margin: 0 auto;
}

.pricing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.pricing-toggle span {
  color: var(--neutral-600);
  font-weight: 500;
}

.pricing-toggle span.active {
  color: var(--neutral-900);
  font-weight: 600;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--neutral-200);
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(28px);
}

.save-badge {
  display: inline-block;
  background-color: #e6f4ea;
  color: #0d652d;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  margin-left: 0.5rem;
  font-weight: 500;
}

.pricing-plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 5rem;
}

.pricing-plan {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  position: relative;
  transition: transform 0.3s ease;
}

.pricing-plan:hover {
  transform: translateY(-5px);
}

.pricing-plan.popular {
  border: 2px solid var(--primary-color);
  transform: scale(1.05);
}

.pricing-plan.popular:hover {
  transform: scale(1.05) translateY(-5px);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-gradient);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  white-space: nowrap;
}

.plan-header {
  text-align: center;
  margin-bottom: 2rem;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.plan-price {
  margin-bottom: 1rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-900);
}

.period {
  font-size: 1rem;
  color: var(--neutral-600);
}

.plan-description {
  color: var(--neutral-600);
  font-size: 0.875rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--neutral-700);
}

.plan-features li.unavailable {
  color: var(--neutral-400);
}

.plan-features li svg {
  flex-shrink: 0;
  color: var(--primary-color);
}

.plan-features li.unavailable svg {
  color: var(--neutral-400);
}

.plan-action {
  text-align: center;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--neutral-300);
  color: var(--neutral-900);
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.pricing-faq {
  max-width: 800px;
  margin: 0 auto;
}

.pricing-faq h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--neutral-900);
  text-align: center;
  margin-bottom: 2rem;
}

.faq-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.faq-item h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 0.75rem;
}

.faq-item p {
  color: var(--neutral-600);
  line-height: 1.6;
}

@media (max-width: 992px) {
  .pricing-plans {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .pricing-plan.popular {
    transform: scale(1);
  }
  
  .pricing-plan.popular:hover {
    transform: translateY(-5px);
  }
  
  .faq-items {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .pricing-title {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .pricing-page {
    padding: 3rem 0;
  }
}
</style>
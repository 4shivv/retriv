<template>
  <div class="about-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <img src="/dog.png" alt="Retriv Dog Logo" class="dog-logo"/>
          <h1>About Retriv</h1>
          <p>Making learning more effective, anywhere and anytime</p>
        </div>
      </div>
    </div>
    
    <div class="container">
      <!-- Mission Section -->
      <div class="mission-section">
        <div class="mission-card">
          <h2>Our Mission</h2>
          <div class="mission-content">
            <p>
              At Retriv, our mission is simple: help people learn more effectively in the moments between moments.
              Whether you're driving, cooking, cleaning, or just taking a walk, we believe these times can become
              valuable learning opportunities.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Story Section -->
      <div class="story-section">
        <h2>Our Story</h2>
        <div class="story-content">
          <div class="story-text">
            <p>
              Retriv began when our small team realized people were becoming increasingly dependent on AI tools,
              but weren't using them effectively for learning. Students and professionals alike struggle to retain
              information long-term, even with powerful resources at their disposal.
            </p>
            <p>
              We knew we could do better. By applying proven cognitive science techniques, we built a platform that
              doesn't just help you memorize facts—it builds deeper understanding and long-term retention. Retriv
              makes powerful learning methods accessible to everyone, anywhere, anytime.
            </p>
          </div>
          <div class="story-image">
            <img src="/dog.png" alt="Retriv Dog Logo" class="side-logo"/>
          </div>
        </div>
      </div>
      
      <!-- Approach Section -->
      <div class="approach-section">
        <h2>Our Learning Methods</h2>
        <div class="approach-cards">
          <div class="approach-card">
            <div class="card-header">
              <span class="card-number">01</span>
              <h3>Active Recall</h3>
            </div>
            <p>
              Instead of passive reading, active recall forces your brain to retrieve information without looking at the source material.
              This strengthens neural pathways and improves long-term retention far more effectively than simply re-reading content.
            </p>
          </div>
          
          <div class="approach-card">
            <div class="card-header">
              <span class="card-number">02</span>
              <h3>Blurting Method</h3>
            </div>
            <p>
              The blurting technique encourages you to "blurt out" everything you know about a topic before reviewing,
              which helps identify knowledge gaps and builds confidence by showing what you already understand.
            </p>
          </div>
          
          <div class="approach-card">
            <div class="card-header">
              <span class="card-number">03</span>
              <h3>Feynman Technique</h3>
            </div>
            <p>
              Named after Nobel Prize-winning physicist Richard Feynman, this method involves explaining concepts in simple,
              conversational language as if teaching someone else. This ensures deep understanding rather than superficial memorization.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Stats Section -->
      <div class="stats-section">
        <div class="stats-card">
          <div class="stat">
            <div class="stat-number">2x</div>
            <div class="stat-label">Faster Learning</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <div class="stat-number">80%</div>
            <div class="stat-label">Better Retention</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Accessible Learning</div>
          </div>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div class="cta-section">
        <h2>Ready to transform how you learn?</h2>
        <div class="cta-buttons">
          <router-link to="/register" class="btn btn-primary">Get Started Free</router-link>
          <router-link to="/pricing" class="btn btn-outline">View Plans</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped>
/* Base Styles */
.about-page {
  color: var(--neutral-800);
  background-color: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--neutral-900);
}

/* Hero Section */
.hero-section {
  background-color: white;
  padding: 6rem 0;
  text-align: center;
  margin-bottom: 4rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.dog-logo {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--neutral-900);
  line-height: 1.2;
}

.hero-content p {
  font-size: 1.5rem;
  color: var(--neutral-600);
}

/* Mission Section */
.mission-section {
  margin-bottom: 5rem;
}

.mission-card {
  background-color: var(--primary-color);
  color: white;
  border-radius: 16px;
  padding: 3rem;
  position: relative;
}

.mission-card h2 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.mission-content {
  font-size: 1.4rem;
  line-height: 1.6;
  max-width: 800px;
}

/* Story Section */
.story-section {
  margin-bottom: 5rem;
}

.story-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 3rem;
  align-items: center;
}

.story-text {
  font-size: 1.125rem;
  line-height: 1.8;
}

.story-text p {
  margin-bottom: 1.5rem;
}

.story-text p:last-child {
  margin-bottom: 0;
}

.story-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.side-logo {
  width: 150px;
  height: 150px;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Approach Section */
.approach-section {
  margin-bottom: 5rem;
}

.approach-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.approach-card {
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.approach-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 1.5rem;
}

.card-number {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-right: 0.75rem;
}

.approach-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--neutral-900);
}

.approach-card p {
  color: var(--neutral-600);
  line-height: 1.6;
}

/* Stats Section */
.stats-section {
  margin-bottom: 5rem;
}

.stats-card {
  background-color: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--neutral-600);
}

.stat-divider {
  width: 1px;
  height: 60px;
  background-color: var(--neutral-200);
}

/* CTA Section */
.cta-section {
  background-color: var(--neutral-100);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 5rem;
}

.cta-section h2 {
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #c07e1d;
  transform: translateY(-2px);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background-color: rgba(213, 141, 32, 0.1);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 992px) {
  .approach-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-card {
    flex-direction: column;
    gap: 2rem;
  }
  
  .stat-divider {
    width: 60px;
    height: 1px;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.2rem;
  }
  
  .mission-content {
    font-size: 1.2rem;
  }
  
  .story-content {
    grid-template-columns: 1fr;
  }
  
  .story-image {
    display: none;
  }
  
  .approach-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 1.5rem;
  }
  
  .hero-section {
    padding: 4rem 0;
  }
  
  .mission-card,
  .stats-card,
  .cta-section {
    padding: 2rem 1.5rem;
  }
  
  .dog-logo {
    width: 100px;
    height: 100px;
  }
  
  .mission-card h2 {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
}
</style>
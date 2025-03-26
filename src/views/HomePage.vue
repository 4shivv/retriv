<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Master Any Subject with <span class="text-gradient">Active Recall</span>
            </h1>
            <p class="hero-description">
              Retriv uses cognitive neuroscience and AI to help you learn faster and remember longer. Our research-backed "blurting" technique and spaced repetition system optimize your learning for maximum retention.
            </p>
            <div class="hero-actions">
              <router-link to="/register" class="btn btn-primary btn-lg">Get Started Free</router-link>
              <a href="#how-it-works" class="btn btn-ghost btn-lg">See How It Works</a>
            </div>
            <div class="hero-stats">
              <div class="stat">
                <div class="stat-value">3x</div>
                <div class="stat-label">Faster Learning</div>
              </div>
              <div class="stat">
                <div class="stat-value">80%</div>
                <div class="stat-label">Better Retention</div>
              </div>
              <div class="stat">
                <div class="stat-value">10k+</div>
                <div class="stat-label">Active Users</div>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="mockup-window">
              <div class="mockup-header">
                <div class="mockup-action">
                  <span class="circle red"></span>
                  <span class="circle yellow"></span>
                  <span class="circle green"></span>
                </div>
                <div class="mockup-title">Retriv Active Recall</div>
              </div>
              <div class="mockup-body">
                <div class="mockup-section">
                  <div class="mockup-label">Source Material</div>
                  <div class="mockup-source-text">
                    <div class="mockup-text-line w-100"></div>
                    <div class="mockup-text-line w-90"></div>
                    <div class="mockup-text-line w-95"></div>
                    <div class="mockup-text-line w-80"></div>
                    <div class="mockup-text-line w-100"></div>
                  </div>
                </div>
                <div class="mockup-section">
                  <div class="mockup-label">Your Recall</div>
                  <div class="mockup-recall-text">
                    <div class="mockup-text-line w-90 match"></div>
                    <div class="mockup-text-line w-80 match"></div>
                    <div class="mockup-text-line w-85 partial"></div>
                    <div class="mockup-text-line w-70 miss"></div>
                    <div class="mockup-text-line w-90 match"></div>
                  </div>
                </div>
                <div class="mockup-footer">
                  <div class="mockup-score">
                    <div class="score-label">Recall Score</div>
                    <div class="score-value">85%</div>
                  </div>
                  <div class="mockup-btn">Next Review: 3 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Background Elements -->
      <div class="hero-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
        <div class="circles">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
        <div class="grid-lines"></div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section id="how-it-works" class="section features-section">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">How Retriv Works</h2>
          <p class="section-description">
            Our evidence-based learning workflow is designed to maximize retention and minimize study time
          </p>
        </div>
        
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">
                <span>01</span>
              </div>
            </div>
            <h3 class="feature-title">Input Your Material</h3>
            <p class="feature-description">
              Just paste or upload any text you want to learn. Retriv works with any subject matter - from law and medicine to languages and history.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">
                <span>02</span>
              </div>
            </div>
            <h3 class="feature-title">Active Recall Training</h3>
            <p class="feature-description">
              Test your knowledge by "blurting" - recalling as much as you can without looking at the original material. This active process strengthens memory pathways.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">
                <span>03</span>
              </div>
            </div>
            <h3 class="feature-title">AI-Powered Feedback</h3>
            <p class="feature-description">
              Our AI instantly compares your recall with the original text, highlighting what you remembered and what you missed with a visual heatmap.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">
                <span>04</span>
              </div>
            </div>
            <h3 class="feature-title">Smart Spaced Repetition</h3>
            <p class="feature-description">
              Based on your performance, Retriv creates a personalized review schedule to ensure you review material right before you would naturally forget it.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Science Section -->
    <section id="science" class="section science-section">
      <div class="container">
        <div class="science-content">
          <div class="science-text">
            <h2 class="section-title">The Science of Better Learning</h2>
            <p class="section-description mb-8">
              Retriv is built on two powerful learning principles backed by decades of cognitive science research:
            </p>
            
            <div class="science-cards">
              <div class="science-card">
                <div class="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.9 2.6A2 2 0 0 1 22 5.4"></path>
                    <path d="M2 12.5A2 2 0 0 1 5.4 10"></path>
                    <path d="M14 21.4A2 2 0 0 0 16 19"></path>
                    <path d="M19 16a7.5 7.5 0 1 0-15 1.1"></path>
                    <path d="m12 10-2 4h4l-2 4"></path>
                  </svg>
                </div>
                <h3>Active Recall</h3>
                <p>
                  The act of retrieving information from memory strengthens neural connections far more effectively than passive re-reading or highlighting. This process, known as "blurting," forces your brain to actively reconstruct knowledge.
                </p>
              </div>
              
              <div class="science-card">
                <div class="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M9 14V8h2a2 2 0 1 1 0 4H9"></path>
                    <path d="M16 14V8"></path>
                  </svg>
                </div>
                <h3>Spaced Repetition</h3>
                <p>
                  Reviewing material at optimal intervals dramatically improves long-term retention. Our AI-driven algorithm determines the perfect schedule based on your performance, ensuring you review material right before you would naturally forget it.
                </p>
              </div>
            </div>
            
            <div class="research-highlight">
              <div class="highlight-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
                <span>Research</span>
              </div>
              <p>
                Studies show these techniques can improve retention by up to <strong>200%</strong> compared to traditional study methods.
              </p>
            </div>
          </div>
          
          <div class="science-visual">
            <div class="graph-container">
              <div class="graph-header">
                <h3>Memory Retention Over Time</h3>
              </div>
              <div class="graph">
                <div class="graph-labels">
                  <div class="y-axis">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                  <div class="x-axis">
                    <span>Day 1</span>
                    <span>Day 7</span>
                    <span>Day 30</span>
                    <span>Day 90</span>
                  </div>
                </div>
                <div class="graph-content">
                  <div class="curve traditional"></div>
                  <div class="curve retriv"></div>
                </div>
              </div>
              <div class="graph-legend">
                <div class="legend-item">
                  <span class="legend-color traditional"></span>
                  <span>Traditional Study</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color retriv"></span>
                  <span>With Retriv</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="section testimonials-section">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">What Our Users Say</h2>
          <p class="section-description">
            Join thousands of students who have transformed their learning with Retriv
          </p>
        </div>
        
        <div class="testimonials">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <svg class="quote-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11C10 6.5 13 5 13 5H7.5C6.5 5 6 5.5 6 6.5V13.5C6 14.5 6.5 15 7.5 15H10.5C11.5 15 12 14.5 12 13.5V11H10ZM19 11C19 6.5 22 5 22 5H16.5C15.5 5 15 5.5 15 6.5V13.5C15 14.5 15.5 15 16.5 15H19.5C20.5 15 21 14.5 21 13.5V11H19Z" fill="currentColor" fill-opacity="0.2"/>
              </svg>
              <p class="testimonial-text">
                "Retriv helped me prepare for my medical board exams more efficiently than any other method I've tried. The spaced repetition reminders kept me on track, and I saw dramatic improvements in my retention."
              </p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">MS</div>
              <div class="author-info">
                <p class="author-name">Maria S.</p>
                <p class="author-title">Medical Student</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <svg class="quote-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11C10 6.5 13 5 13 5H7.5C6.5 5 6 5.5 6 6.5V13.5C6 14.5 6.5 15 7.5 15H10.5C11.5 15 12 14.5 12 13.5V11H10ZM19 11C19 6.5 22 5 22 5H16.5C15.5 5 15 5.5 15 6.5V13.5C15 14.5 15.5 15 16.5 15H19.5C20.5 15 21 14.5 21 13.5V11H19Z" fill="currentColor" fill-opacity="0.2"/>
              </svg>
              <p class="testimonial-text">
                "I use Retriv for language learning. The immediate feedback on what I can recall versus what I still need to practice has accelerated my vocabulary acquisition and grammar mastery."
              </p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">DL</div>
              <div class="author-info">
                <p class="author-name">David L.</p>
                <p class="author-title">Language Enthusiast</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <svg class="quote-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11C10 6.5 13 5 13 5H7.5C6.5 5 6 5.5 6 6.5V13.5C6 14.5 6.5 15 7.5 15H10.5C11.5 15 12 14.5 12 13.5V11H10ZM19 11C19 6.5 22 5 22 5H16.5C15.5 5 15 5.5 15 6.5V13.5C15 14.5 15.5 15 16.5 15H19.5C20.5 15 21 14.5 21 13.5V11H19Z" fill="currentColor" fill-opacity="0.2"/>
              </svg>
              <p class="testimonial-text">
                "As a teacher, I recommend Retriv to all my students. It's transformed their study habits and improved test scores across the board. The spaced repetition system is especially effective."
              </p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">JK</div>
              <div class="author-info">
                <p class="author-name">Jennifer K.</p>
                <p class="author-title">High School Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to transform the way you learn?</h2>
          <p>Join thousands of students who have improved their retention with Retriv's evidence-based learning system.</p>
          <router-link to="/register" class="btn btn-primary btn-lg">Get Started Free</router-link>
        </div>
      </div>
      <div class="cta-bg">
        <div class="cta-shape-1"></div>
        <div class="cta-shape-2"></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  padding: 10rem 0 6rem;
  overflow: hidden;
  background-color: var(--neutral-50);
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: var(--font-weight-bold);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.hero-description {
  font-size: var(--font-size-lg);
  color: var(--neutral-600);
  margin-bottom: 2rem;
  max-width: 540px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.hero-stats {
  display: flex;
  gap: 3rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* App Mockup Styling */
.mockup-window {
  width: 450px;
  background-color: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.mockup-header {
  background-color: var(--neutral-100);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--neutral-200);
}

.mockup-action {
  display: flex;
  gap: 0.5rem;
  margin-right: 1rem;
}

.circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.red { background-color: #ff5f57; }
.yellow { background-color: #ffbd2e; }
.green { background-color: #28ca41; }

.mockup-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.mockup-body {
  padding: 1.5rem;
}

.mockup-section {
  margin-bottom: 1.5rem;
}

.mockup-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
  margin-bottom: 0.75rem;
}

.mockup-source-text,
.mockup-recall-text {
  padding: 1rem;
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mockup-text-line {
  height: 12px;
  border-radius: 6px;
  background-color: var(--neutral-300);
}

.w-100 { width: 100%; }
.w-95 { width: 95%; }
.w-90 { width: 90%; }
.w-85 { width: 85%; }
.w-80 { width: 80%; }
.w-70 { width: 70%; }

.match { background-color: rgba(16, 185, 129, 0.6); }
.partial { background-color: rgba(245, 158, 11, 0.6); }
.miss { background-color: rgba(239, 68, 68, 0.6); }

.mockup-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mockup-score {
  display: flex;
  flex-direction: column;
}

.score-label {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.score-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.mockup-btn {
  padding: 0.5rem 1rem;
  background: var(--primary-gradient);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

/* Background Elements */
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.4;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: rgba(99, 102, 241, 0.2);
  top: -100px;
  right: 10%;
  animation: blobAnimation 20s infinite alternate;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: rgba(236, 72, 153, 0.15);
  bottom: 10%;
  left: 5%;
  animation: blobAnimation 15s infinite alternate-reverse;
}

.blob-3 {
  width: 200px;
  height: 200px;
  background: rgba(139, 92, 246, 0.1);
  top: 40%;
  left: 30%;
  animation: blobAnimation 18s infinite alternate;
}

@keyframes blobAnimation {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, 20px) scale(1.1);
  }
}

.circles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  animation: rotate 30s linear infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 5%;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: 10%;
  left: 10%;
  animation-direction: reverse;
  animation-duration: 40s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  left: 30%;
  animation-duration: 25s;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
}

/* Section Styles */
.section {
  padding: 6rem 0;
}

.section-header {
  max-width: 700px;
  margin: 0 auto 4rem;
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-description {
  font-size: var(--font-size-lg);
  color: var(--neutral-600);
}

/* Features Section */
.features-section {
  background-color: white;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  background-color: var(--neutral-50);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  background-color: white;
}

.feature-icon {
  margin-bottom: 1.5rem;
}

.icon-bg {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-lg);
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-weight-bold);
  position: relative;
  overflow: hidden;
}

.icon-bg::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  transform: rotate(30deg);
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0.75rem;
}

.feature-description {
  color: var(--neutral-600);
  margin-bottom: 0;
}

/* Science Section */
.science-section {
  background-color: var(--neutral-50);
}

.science-content {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.science-text {
  flex: 1;
}

.science-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.science-card {
  padding: 2rem;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border-top: 4px solid var(--primary-color);
}

.science-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.research-highlight {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--secondary-color);
}

.highlight-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(236, 72, 153, 0.1);
  color: var(--secondary-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.research-highlight p {
  margin-bottom: 0;
  font-size: var(--font-size-md);
}

.science-visual {
  flex: 1;
}

.graph-container {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.graph-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.graph-header h3 {
  font-size: var(--font-size-lg);
  margin-bottom: 0;
}

.graph {
  height: 250px;
  position: relative;
  margin-bottom: 1.5rem;
}

.graph-labels {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.y-axis {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 20px;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.y-axis span {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.x-axis {
  position: absolute;
  left: 40px;
  right: 0;
  bottom: 0;
  height: 20px;
  display: flex;
  justify-content: space-between;
}

.x-axis span {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.graph-content {
  position: absolute;
  top: 0;
  left: 40px;
  right: 0;
  bottom: 20px;
  border-left: 1px solid var(--neutral-300);
  border-bottom: 1px solid var(--neutral-300);
  overflow: hidden;
}

.curve {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.curve.traditional {
  background: linear-gradient(to bottom, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0) 100%);
  clip-path: polygon(0% 0%, 35% 70%, 65% 85%, 100% 95%);
  border-bottom: 2px dashed #ef4444;
}

.curve.retriv {
  background: linear-gradient(to bottom, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 100%);
  clip-path: polygon(0% 0%, 35% 20%, 65% 35%, 100% 50%);
  border-bottom: 2px solid var(--primary-color);
}

.graph-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 3px;
}

.legend-color.traditional {
  background-color: #ef4444;
  border-bottom: 1px dashed #ef4444;
}

.legend-color.retriv {
  background-color: var(--primary-color);
}

/* Testimonials Section */
.testimonials-section {
  background-color: white;
}

.testimonials {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background-color: var(--neutral-50);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: all var(--transition-normal);
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  background-color: white;
}

.testimonial-content {
  position: relative;
  margin-bottom: 1.5rem;
}

.quote-icon {
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  color: var(--primary-color);
  opacity: 0.2;
}

.testimonial-text {
  position: relative;
  z-index: 1;
  margin-bottom: 0;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
}

.author-name {
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0.25rem;
}

.author-title {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: 0;
}

/* CTA Section */
.cta-section {
  position: relative;
  background: var(--primary-gradient);
  color: white;
  padding: 6rem 0;
  overflow: hidden;
}

.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: 1rem;
  color: white;
}

.cta-content p {
  opacity: 0.9;
  margin-bottom: 2rem;
  font-size: var(--font-size-lg);
}

.cta-content .btn-primary {
  background: white;
  color: var(--primary-color);
}

.cta-content .btn-primary:hover {
  background: var(--neutral-100);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.cta-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cta-shape-1,
.cta-shape-2 {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.cta-shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -50px;
}

.cta-shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -50px;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .hero-title {
    font-size: 2.75rem;
  }
  
  .hero-content {
    flex-direction: column;
  }
  
  .science-content {
    flex-direction: column;
  }
  
  .mockup-window {
    width: 100%;
    max-width: 450px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 8rem 0 4rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .section {
    padding: 4rem 0;
  }
  
  .section-title {
    font-size: var(--font-size-2xl);
  }
  
  .cta-content h2 {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .hero-stats .stat {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  
  .stat-value {
    font-size: var(--font-size-2xl);
  }
  
  .science-cards {
    grid-template-columns: 1fr;
  }
}
</style>

<script>
// Add onMounted at import
import { onMounted } from 'vue';

export default {
  setup() {
    // Handle smooth scrolling for anchor links within the home page
    const handleSmoothScroll = () => {
      // Get all anchor links that point to sections on this page
      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      
      anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Get the target element
          const targetId = link.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Get the navbar height for offset (approx 80px, but can be adjusted)
            const navbarOffset = 80;
            
            // Calculate the element's position
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
            
            // Scroll to the element
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    };
    
    onMounted(() => {
      // Set up smooth scrolling for anchor links
      handleSmoothScroll();
    });
    
    return {};
  }
}
</script>
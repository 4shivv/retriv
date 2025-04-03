<template>
  <div class="home-page">
    <!-- Redirect Message (only shown briefly before router redirects) -->
    <div v-if="isAuthenticated" class="redirect-message">
      <div class="spinner"></div>
      <p>Redirecting to your dashboard...</p>
    </div>
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
                <div class="stat-value">1k+</div>
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
            <div class="mockup-tabs">
            <div class="mockup-tab active">Study</div>
            <div class="mockup-tab">Analytics</div>
            <div class="mockup-tab">History</div>
            </div>
            <div class="mockup-section">
            <div class="mockup-label">Original Note</div>
            <div class="mockup-source-text">
              <div class="mockup-text-line w-100"></div>
                <div class="mockup-text-line w-90"></div>
                <div class="mockup-text-line w-95"></div>
              <div class="mockup-text-line w-80"></div>
              <div class="mockup-text-line w-100"></div>
            </div>
            </div>
            <div class="mockup-section">
            <div class="mockup-recall-header">
            <div class="mockup-label">Your Recall Attempt</div>
              <div class="mockup-timer">01:42</div>
              </div>
              <div class="mockup-recall-text">
              <div class="mockup-text-line w-90 match"></div>
            <div class="mockup-text-line w-80 match"></div>
            <div class="mockup-text-line w-85 partial"></div>
              <div class="mockup-text-line w-70 miss"></div>
              <div class="mockup-text-line w-90 match"></div>
              </div>
              </div>
                <div class="mockup-ai-feedback">
                    <div class="ai-feedback-header">
                      <div class="ai-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 12a9 9 0 1 0-9 9"></path>
                          <path d="M9 9h.01"></path>
                          <path d="M15 9h.01"></path>
                          <path d="M12 13a3 3 0 0 0 2.24-1"></path>
                        </svg>
                      </div>
                      <span>AI Feedback</span>
                    </div>
                    <div class="ai-suggestion">
                      <div class="mockup-text-line w-100"></div>
                      <div class="mockup-text-line w-70"></div>
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
            <h3 class="feature-title">Input Your Notes</h3>
            <p class="feature-description">
              Input your notes and Retriv's AI will transform them into optimized study material designed specifically for active recall learning techniques.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">
                <span>02</span>
              </div>
            </div>
            <h3 class="feature-title">Blurting / Feynman Method</h3>
            <p class="feature-description">
              Practice recalling information from memory using the blurting technique or Feynman method - explaining concepts in your own words strengthens neural pathways and identifies knowledge gaps.
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
              Receive intelligent feedback from our AI that analyzes your recall attempts, highlights knowledge gaps, and provides personalized suggestions to improve your understanding.
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
              Our adaptive spaced repetition system schedules reviews based precisely on when you need to master the material, optimizing your study time and ensuring long-term retention.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Science Section -->
    <section id="science" class="section science-section">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">Backed by Cognitive Science</h2>
          <p class="section-description">
            Our learning platform is built on proven neuroscience principles that optimize how your brain stores and retrieves information
          </p>
        </div>
        
        <div class="science-content">
          <div class="science-cards">
            <div class="science-card">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12h5"></path>
                  <path d="M5 15.5C5 13.01 7.01 11 9.5 11H17c2.76 0 5 2.24 5 5s-2.24 5-5 5H14"></path>
                  <path d="M20 11c0-2.76-2.24-5-5-5H9.5C7.01 6 5 3.99 5 1.5"></path>
                  <path d="M18 7l-2 -2l2 -2"></path>
                  <path d="M14 17l-2 2l-2 -2"></path>
                </svg>
              </div>
              <h3>The Retrieval Effect</h3>
              <p>
                Actively recalling information strengthens memory far more effectively than passive reading. Research shows that the effort of retrieval creates stronger neural pathways for long-term retention.
              </p>
            </div>
            
            <div class="science-card">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  <circle cx="12" cy="12" r="2.5"></circle>
                  <path d="M12 9.5V6"></path>
                  <path d="M15.847 10.44l2.521-2.52"></path>
                </svg>
              </div>
              <h3>Ebbinghaus Forgetting Curve</h3>
              <p>
                Our spaced repetition system is designed to combat the natural decay of memory over time, scheduling reviews at the optimal moment to reinforce knowledge before it fades.
              </p>
            </div>
            
            <div class="science-card">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
                  <circle cx="18" cy="6" r="3"></circle>
                </svg>
              </div>
              <h3>The Feynman Technique</h3>
              <p>
                Named after physicist Richard Feynman, this method of explaining concepts in simple terms forces deeper understanding and reveals knowledge gaps that need further study.
              </p>
            </div>
            
            <div class="science-card">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 13V7"></path>
                  <path d="M9 10h6"></path>
                  <path d="M3 17h18"></path>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"></path>
                </svg>
              </div>
              <h3>Elaborative Processing</h3>
              <p>
                Our AI feedback encourages you to connect new information with existing knowledge, creating richer memory networks that improve both recall and understanding.
              </p>
            </div>
          </div>
          
          <div class="research-stats">
            <div class="stat-card">
              <div class="stat-value">300%</div>
              <div class="stat-label">Improvement in long-term retention compared to passive reading</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">85%</div>
              <div class="stat-label">Students reported better understanding of complex topics</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">40%</div>
              <div class="stat-label">Reduction in study time while improving test scores</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section id="testimonials" class="section testimonials-section">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">Success Stories</h2>
          <p class="section-description">
            See how students and professionals are revolutionizing their learning with Retriv
          </p>
        </div>
        
        <div class="testimonials-carousel">
          <div class="testimonials-wrapper">
            <div class="testimonial-card featured">
              <div class="testimonial-header">
                <div class="rating">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div class="testimonial-meta">
                  <p class="date">March 2025</p>
                </div>
              </div>
              <div class="testimonial-content">
                <p class="testimonial-text">
                  "I used to struggle with retaining information for my medical licensing exams, despite spending countless hours reviewing material. With Retriv's active recall approach, I've cut my study time in half while improving my recall accuracy by over 40%. The AI feedback pinpoints exactly where I need to focus, and the spaced repetition timing is uncanny - it's like the app knows when I'm about to forget something!"
                </p>
              </div>
              <div class="testimonial-results">
                <div class="result-item">
                  <div class="result-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p>Passed USMLE Step 1 in top 10%</p>
                </div>
                <div class="result-item">
                  <div class="result-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p>Reduced study time by 50%</p>
                </div>
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">
                  <span>AS</span>
                </div>
                <div class="author-info">
                  <p class="author-name">Alex S.</p>
                  <p class="author-title">Medical Resident, Boston</p>
                </div>
              </div>
            </div>
            
            <div class="testimonial-grid">
              <div class="testimonial-card">
                <div class="testimonial-content">
                  <p class="testimonial-text">
                    "The Feynman method implementation in Retriv has completely changed how I approach learning programming concepts. Being forced to explain complex ideas in my own words reveals what I truly understand."
                  </p>
                </div>
                <div class="testimonial-author">
                  <div class="author-avatar">JR</div>
                  <div class="author-info">
                    <p class="author-name">Jamie R.</p>
                    <p class="author-title">Computer Science Student</p>
                  </div>
                </div>
              </div>
              
              <div class="testimonial-card">
                <div class="testimonial-content">
                  <p class="testimonial-text">
                    "As someone learning multiple languages simultaneously, Retriv's spaced repetition is perfectly timed to help me maintain vocabulary across Spanish, Japanese, and German without mixing them up."
                  </p>
                </div>
                <div class="testimonial-author">
                  <div class="author-avatar">LT</div>
                  <div class="author-info">
                    <p class="author-name">Lena T.</p>
                    <p class="author-title">Translator & Polyglot</p>
                  </div>
                </div>
              </div>
              
              <div class="testimonial-card">
                <div class="testimonial-content">
                  <p class="testimonial-text">
                    "I recommend Retriv to all my law students. Bar exam preparation is not just about knowing the material but being able to recall it instantly under pressure. This tool trains exactly that skill."
                  </p>
                </div>
                <div class="testimonial-author">
                  <div class="author-avatar">MP</div>
                  <div class="author-info">
                    <p class="author-name">Michael P.</p>
                    <p class="author-title">Law Professor</p>
                  </div>
                </div>
              </div>
              
              <div class="testimonial-card">
                <div class="testimonial-content">
                  <p class="testimonial-text">
                    "My entire study group uses Retriv now for our nursing certification exams. The ability to share custom study materials with the group while maintaining personalized review schedules is invaluable."
                  </p>
                </div>
                <div class="testimonial-author">
                  <div class="author-avatar">KD</div>
                  <div class="author-info">
                    <p class="author-name">Kelly D.</p>
                    <p class="author-title">Nursing Student</p>
                  </div>
                </div>
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
/* Redirect Message */
.redirect-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-4);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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

.mockup-tabs {
  display: flex;
  border-bottom: 1px solid var(--neutral-200);
  margin-bottom: 1.5rem;
}

.mockup-tab {
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  cursor: pointer;
  position: relative;
}

.mockup-tab.active {
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}

.mockup-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
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

.mockup-recall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.mockup-timer {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
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

.mockup-ai-feedback {
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-left: 3px solid var(--primary-color);
}

.ai-feedback-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.ai-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-suggestion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

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
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.science-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.science-card {
  padding: 2rem;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border-top: 4px solid var(--primary-color);
  height: 100%;
}

.science-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.science-card:nth-child(2) {
  border-top-color: #8b5cf6;
}

.science-card:nth-child(3) {
  border-top-color: #ec4899;
}

.science-card:nth-child(4) {
  border-top-color: #10b981;
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

.science-card:nth-child(2) .card-icon {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.science-card:nth-child(3) .card-icon {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.science-card:nth-child(4) .card-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.research-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: all var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-value {
  font-size: 3rem;
  font-weight: var(--font-weight-bold);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.stat-card:nth-child(2) .stat-value {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-card:nth-child(3) .stat-value {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: var(--font-size-md);
  color: var(--neutral-700);
  line-height: 1.4;
}

/* Testimonials Section */
.testimonials-section {
  background-color: white;
}

.testimonials-carousel {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.testimonials-wrapper {
  display: flex;
  flex-direction: column;
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

.testimonial-card.featured {
  background-color: white;
  box-shadow: var(--shadow-lg);
  border-top: 4px solid var(--primary-color);
  margin-bottom: 1rem;
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rating {
  display: flex;
  gap: 0.25rem;
}

.testimonial-meta {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.testimonial-content {
  position: relative;
  margin-bottom: 1.5rem;
}

.testimonial-text {
  position: relative;
  z-index: 1;
  margin-bottom: 0;
  font-style: italic;
  line-height: 1.6;
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

.testimonial-results {
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-icon {
  color: var(--primary-color);
}

.result-item p {
  margin-bottom: 0;
  font-weight: var(--font-weight-medium);
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
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
// Add imports
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    
    // Check if user is authenticated
    const isAuthenticated = computed(() => {
      return store.getters['auth/isAuthenticated'];
    });
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
    
    return {
      isAuthenticated
    };
  }
}
</script>
<template>
  <div class="careers-page">
    <div class="container">
      <div class="careers-header">
        <h1 class="careers-title">Join Our Team</h1>
        <p class="careers-subtitle">Help us revolutionize learning with cognitive science and technology</p>
      </div>

      <div class="no-positions-card">
        <div class="dog-icon">
          <img src="/dog.png" alt="Retriv Dog Logo" class="dog-logo"/>
        </div>
        
        <h2>No Open Positions at This Time</h2>
        <p>We're not currently hiring for any positions, but we're always interested in meeting talented people who are passionate about learning and education.</p>
        
        <div class="future-positions">
          <h3>Keep in Touch</h3>
          <p>Share your details with us and we'll notify you when new opportunities become available.</p>
          
          <form class="job-alert-form" @submit.prevent="submitJobAlertForm">
            <div class="form-group">
              <input type="text" v-model="jobAlertData.name" placeholder="Your name" class="form-control" required>
            </div>
            <div class="form-group">
              <input type="email" v-model="jobAlertData.email" placeholder="Your email" class="form-control" required>
            </div>
            <div class="form-group">
              <select v-model="jobAlertData.interest" class="form-control" required>
                <option value="" disabled selected>Area of interest</option>
                <option value="engineering">Engineering</option>
                <option value="product">Product</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Subscribe to Job Alerts</button>
          </form>
        </div>
        
        <div class="spontaneous-application">
          <h3>Spontaneous Application</h3>
          <p>Don't see a role that fits? We're always interested in exceptional talent. Send your resume to <a href="mailto:careers@retriv.com">careers@retriv.com</a> with information about what you're looking for.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'CareersPage',
  setup() {
    const jobAlertData = reactive({
      name: '',
      email: '',
      interest: ''
    });
    
    const submitJobAlertForm = () => {
      alert('Thank you for your interest! We\'ll notify you when new positions become available.');
      jobAlertData.name = '';
      jobAlertData.email = '';
      jobAlertData.interest = '';
    };
    
    return {
      jobAlertData,
      submitJobAlertForm
    };
  }
}
</script>

<style scoped>
.careers-page {
  padding: 5rem 0;
  background-color: var(--neutral-50);
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.careers-header {
  text-align: center;
  margin-bottom: 3rem;
}

.careers-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.careers-subtitle {
  font-size: 1.25rem;
  color: var(--neutral-600);
  max-width: 700px;
  margin: 0 auto;
}

.no-positions-card {
  background-color: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.dog-icon {
  margin-bottom: 2rem;
}

.dog-logo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-positions-card h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.no-positions-card > p {
  color: var(--neutral-600);
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.future-positions,
.spontaneous-application {
  background-color: var(--neutral-50);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: left;
}

.future-positions h3,
.spontaneous-application h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 0.75rem;
}

.future-positions p,
.spontaneous-application p {
  color: var(--neutral-600);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.spontaneous-application p {
  margin-bottom: 0;
}

.job-alert-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.job-alert-form .form-group:last-of-type {
  grid-column: span 2;
}

.job-alert-form .btn {
  grid-column: span 2;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-300);
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
}

.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(213, 141, 32, 0.1);
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

a {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .job-alert-form {
    grid-template-columns: 1fr;
  }
  
  .job-alert-form .form-group:last-of-type,
  .job-alert-form .btn {
    grid-column: span 1;
  }
  
  .careers-title {
    font-size: 2rem;
  }
  
  .no-positions-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .careers-page {
    padding: 3rem 0;
  }
  
  .future-positions,
  .spontaneous-application {
    padding: 1.5rem;
  }
  
  .dog-logo {
    width: 80px;
    height: 80px;
  }
}
</style>
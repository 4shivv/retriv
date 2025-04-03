<template>
  <div class="logo-container">
    <div class="logo-mark">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="dog-logo">
        <!-- Dog head shape -->
        <path d="M50,20c-16.5,0-30,13.5-30,30c0,10.5,5.5,19.7,13.7,25c2.7,1.7,5.6,3,8.8,3.7c2.4,0.5,4.9,0.8,7.5,0.8s5.1-0.3,7.5-0.8 c3.1-0.7,6.1-2,8.8-3.7C74.5,69.7,80,60.5,80,50C80,33.5,66.5,20,50,20z" fill="url(#dogGradient)"/>
        
        <!-- Ears -->
        <path d="M25,38c-3,3-5,7-5,12c0,2,0.5,4,1.5,6c1,2,2.5,4,4.5,5c0-6,1-13,4-18C28,42,26,40,25,38z" fill="url(#earGradient)"/>
        <path d="M75,38c-1,2-3,4-5,5c3,5,4,12,4,18c2-1,3.5-3,4.5-5c1-2,1.5-4,1.5-6C80,45,78,41,75,38z" fill="url(#earGradient)"/>
        
        <!-- Eyes -->
        <circle cx="37" cy="45" r="4" fill="#333"/>
        <circle cx="63" cy="45" r="4" fill="#333"/>
        
        <!-- Nose -->
        <ellipse cx="50" cy="55" rx="8" ry="6" fill="#333"/>
        
        <!-- Mouth -->
        <path d="M50,62 Q50,70 40,68 M50,62 Q50,70 60,68" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
        
        <!-- Gradients -->
        <defs>
          <linearGradient id="dogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d58d20" />
            <stop offset="100%" stop-color="#e8a43b" />
          </linearGradient>
          <linearGradient id="earGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#bf7e1c" />
            <stop offset="100%" stop-color="#d58d20" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="logo-text">Retriv</div>
  </div>
</template>

<script>
export default {
  name: 'DogLogo'
}
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-mark {
  width: 2.5rem;
  height: 2.5rem;
  position: relative;
}

.dog-logo {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: inherit;
}
</style>
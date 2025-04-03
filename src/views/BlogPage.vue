<template>
  <div class="blog-page">
    <div class="container">
      <div class="blog-header">
        <h1 class="blog-title">Retriv Blog</h1>
        <p class="blog-subtitle">Insights and tips on learning and memory techniques</p>
      </div>

      <div class="blog-content">
        <div class="blog-grid">
          <div class="blog-post" v-for="(post, index) in blogPosts" :key="index">
            <div class="post-image" :style="{ backgroundColor: post.imageBg }">
              <div class="post-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="post-date">{{ post.date }}</span>
                <span class="post-category">{{ post.category }}</span>
              </div>
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <a href="#" class="post-link">Read more</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPage',
  data() {
    return {
      blogPosts: [
        {
          title: "The Science Behind Active Recall: Why Retriv Works",
          date: "April 3, 2025",
          category: "Learning Science",
          excerpt: "Active recall is one of the most effective learning techniques, supported by decades of cognitive science research. In this article, we dive into the neuroscience behind what makes active recall so powerful for long-term memory retention.",
          imageBg: "rgba(213, 141, 32, 0.1)"
        },
        {
          title: "5 Ways to Integrate Spaced Repetition into Your Daily Routine",
          date: "March 28, 2025",
          category: "Learning Tips",
          excerpt: "Spaced repetition is a powerful technique to combat the forgetting curve, but it can be challenging to implement consistently. Here are five practical ways to make spaced repetition a natural part of your daily learning habits.",
          imageBg: "rgba(213, 141, 32, 0.15)"
        }
      ]
    };
  }
}
</script>

<style scoped>
.blog-page {
  padding: 6rem 0;
  background-color: var(--neutral-50);
}

.blog-header {
  text-align: center;
  margin-bottom: 4rem;
}

.blog-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.blog-subtitle {
  font-size: var(--font-size-lg);
  color: var(--neutral-600);
  max-width: 600px;
  margin: 0 auto;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.blog-post {
  background-color: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.blog-post:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.post-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.post-content {
  padding: 2rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.post-date, .post-category {
  font-size: var(--font-size-sm);
  color: var(--neutral-500);
}

.post-category {
  padding: 0.25rem 0.75rem;
  background-color: var(--neutral-100);
  border-radius: var(--radius-full);
}

.post-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.post-excerpt {
  color: var(--neutral-600);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.post-link {
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  position: relative;
}

.post-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--transition-normal);
}

.post-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

@media (max-width: 768px) {
  .blog-page {
    padding: 4rem 0;
  }
  
  .blog-title {
    font-size: var(--font-size-3xl);
  }
  
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
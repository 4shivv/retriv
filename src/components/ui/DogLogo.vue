<template>
  <div class="logo-container">
    <div class="logo-mark">
      <img src="/dog.png" alt="Retriv Dog Logo" class="dog-logo"/>
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
  object-fit: contain;
  border-radius: var(--radius-lg);
}

.logo-text {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: inherit;
}
</style>
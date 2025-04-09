<template>
  <div class="folder-grid">
    <div v-for="folder in folders" :key="folder.id" class="folder-card" @click="$emit('select-folder', folder)">
      <div class="folder-header">
        <div class="folder-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="folder-actions">
          <button class="action-button" @click.stop="$emit('edit-folder', folder)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
          <button class="action-button" @click.stop="handleDeleteClick(folder.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <h3 class="folder-title">{{ folder.name }}</h3>
      
      <div class="folder-meta">
        <div class="folder-stats">
          <div class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            <span>{{ folder.cardCount || 0 }} cards</span>
          </div>
          <div class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            <span>{{ folder.testCount || 0 }} tests</span>
          </div>
        </div>
        <div class="folder-date">{{ formattedDate(folder.updatedAt) }}</div>
      </div>
    </div>
    
    <!-- Create Folder Card -->
    <div class="folder-card create-folder-card" @click="$emit('create-folder')">
      <div class="create-folder-content">
        <div class="create-folder-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="11" x2="12" y2="17"></line>
            <line x1="9" y1="14" x2="15" y2="14"></line>
          </svg>
        </div>
        <h3>Create New Folder</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FolderGrid',
  props: {
    folders: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select-folder', 'create-folder', 'edit-folder', 'delete-folder'],
  setup(props, { emit }) {
    // Format the date
    const formattedDate = (dateValue) => {
      if (!dateValue) return 'No date';
      
      const date = dateValue instanceof Date 
        ? dateValue 
        : new Date(dateValue);
      
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // Format the date
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        return 'Today';
      } else if (diffDays <= 2) {
        return 'Yesterday';
      } else if (diffDays <= 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    };
    
    // Handle delete button click
    const handleDeleteClick = (folderId) => {
      if (confirm('Are you sure you want to delete this folder? This action cannot be undone.')) {
        emit('delete-folder', folderId);
      }
    };
    
    return {
      formattedDate,
      handleDeleteClick
    };
  }
};
</script>

<style scoped>
.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-5);
}

.folder-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border: 1px solid var(--neutral-200);
  cursor: pointer;
}

.folder-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.folder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.folder-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: var(--radius-md);
}

.folder-actions {
  display: flex;
  gap: var(--spacing-1);
}

.action-button {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-100);
  color: var(--neutral-600);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-button:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-900);
  transform: scale(1.1);
}

.folder-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-4);
  color: var(--neutral-900);
}

.folder-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.folder-stats {
  display: flex;
  gap: var(--spacing-4);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
}

.folder-date {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

/* Create Folder Card */
.create-folder-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 2px dashed var(--neutral-300);
}

.create-folder-card:hover {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
  transform: translateY(-5px);
}

.create-folder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.create-folder-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  margin-bottom: var(--spacing-3);
}

.create-folder-card h3 {
  color: var(--primary-color);
  font-size: var(--font-size-md);
  margin: 0;
}
</style>

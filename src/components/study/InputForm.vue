<template>
  <div class="study-input-form card">
    <div class="card-header">
      <h3>Create Study Material</h3>
      <div class="input-options">
        <button
          @click="switchMode('manual')"
          class="input-option-btn"
          :class="{ active: inputMode === 'manual' }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Manual Entry</span>
        </button>
        <button
          @click="switchMode('ai')"
          class="input-option-btn"
          :class="{ active: inputMode === 'ai' }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>Create with AI</span>
        </button>
      </div>
    </div>
    
    <div class="card-body">
      <div v-if="error" class="alert alert-danger">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <!-- Manual Input Mode -->
      <div v-if="inputMode === 'manual'">
        <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            id="title"
            v-model="title"
            class="form-control"
            placeholder="Enter a title for this material"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="category" class="form-label">Category</label>
          <div class="category-dropdown-container">
            <!-- Custom Dropdown Trigger -->
            <div class="category-dropdown-trigger" @click="toggleCategoryDropdown" :class="{ 'active': showCategoryDropdown }">
              <div class="selected-category">
                <div v-if="selectedCategoryOption" class="category-tag" :class="getCategoryColorClass(selectedCategoryOption)">
                  <span>{{ selectedCategoryOption === 'custom' ? customCategory : selectedCategoryOption }}</span>
                </div>
                <span v-else class="placeholder-text">Select a category</span>
              </div>
              <div class="dropdown-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <!-- Dropdown Content -->
            <div v-if="showCategoryDropdown" class="category-dropdown-content">
              <div class="category-search">
                <input 
                  type="text" 
                  v-model="categorySearchTerm" 
                  class="form-control" 
                  placeholder="Search or add new category"
                  @input="handleCategorySearch"
                  @keydown.enter="handleCategorySearchEnter"
                  ref="categorySearchInput"
                />
              </div>
              
              <div class="category-groups">
                <!-- Frequently Used Categories -->
                <div class="category-group" v-if="filteredFrequentCategories.length > 0">
                  <div class="category-group-label">Frequently Used</div>
                  <div class="category-options">
                    <div 
                      v-for="cat in filteredFrequentCategories" 
                      :key="cat" 
                      class="category-option" 
                      @click="selectCategory(cat)"
                      :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                    >
                      <span class="category-name">{{ cat }}</span>
                      <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Default Categories -->
                <div class="category-group" v-if="filteredDefaultCategories.length > 0">
                  <div class="category-group-label">Default Categories</div>
                  <div class="category-options">
                    <div 
                      v-for="cat in filteredDefaultCategories" 
                      :key="cat" 
                      class="category-option" 
                      @click="selectCategory(cat)"
                      :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                    >
                      <span class="category-name">{{ cat }}</span>
                      <div class="category-option-actions">
                        <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <button 
                          class="category-delete-button" 
                          @click.stop="deleteCategoryPrompt(cat)"
                          title="Delete category"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Custom Categories -->
                <div class="category-group" v-if="filteredCustomCategories.length > 0">
                  <div class="category-group-label">Your Categories</div>
                  <div class="category-options">
                    <div 
                      v-for="cat in filteredCustomCategories" 
                      :key="cat" 
                      class="category-option" 
                      @click="selectCategory(cat)"
                      :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                    >
                      <span class="category-name">{{ cat }}</span>
                      <div class="category-option-actions">
                        <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <button 
                          class="category-delete-button" 
                          @click.stop="deleteCategoryPrompt(cat)"
                          title="Delete category"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Create New Category Option -->
                <div class="category-group" v-if="showCreateNewCategory">
                  <div class="category-group-label">Create New</div>
                  <div class="category-options">
                    <div 
                      class="category-option category-option-new" 
                      @click="createNewCategory"
                    >
                      <span class="category-name">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="category-new-icon">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create "{{ categorySearchTerm }}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Custom Category Input -->
            <div v-if="showCustomCategoryInput" class="custom-category-input-container">
              <input
                type="text"
                v-model="customCategory"
                class="form-control custom-category-input"
                placeholder="Enter custom category name"
                @blur="handleCustomCategoryBlur"
                @keydown.enter="handleCustomCategoryConfirm"
                ref="customCategoryInput"
              />
              <div class="custom-category-actions">
                <button type="button" class="btn-icon btn-sm btn-ghost" @click="cancelCustomCategory">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <button type="button" class="btn-icon btn-sm btn-primary" @click="handleCustomCategoryConfirm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="content" class="form-label">Content</label>
          <textarea
            id="content"
            v-model="content"
            class="form-control"
            rows="10"
            placeholder="Paste or type the content you want to study"
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="deadline" class="form-label">Learning Deadline <span class="optional-label">(optional)</span></label>
          <div class="deadline-selection">
            <div class="deadline-presets">
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '1' }" @click="selectDeadline('1')">1 Day</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '3' }" @click="selectDeadline('3')">3 Days</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '7' }" @click="selectDeadline('7')">1 Week</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '14' }" @click="selectDeadline('14')">2 Weeks</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '30' }" @click="selectDeadline('30')">1 Month</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === 'custom' }" @click="selectDeadline('custom')">Custom</button>
            </div>
            <div v-if="deadline === 'custom'" class="custom-deadline-input">
              <input type="date" v-model="customDeadlineDate" class="form-control" :min="minDate">
            </div>
          </div>
          <p class="form-text deadline-helper">Setting a deadline will optimize your review schedule based on when you need to learn this material.</p>
        </div>
        
        <div class="form-group">
          <label class="form-label">Or upload a file</label>
          <div class="file-upload-container">
            <input
              type="file"
              id="file-upload"
              @change="handleFileUpload"
              class="file-input"
              accept=".txt,.md,.doc,.docx"
              :disabled="loading"
            />
            <label for="file-upload" class="file-upload-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Choose file</span>
            </label>
            <span v-if="fileName" class="file-name">{{ fileName }}</span>
          </div>
          <p class="form-text">
            Supported file types: .txt, .md, .doc, .docx
          </p>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            <span v-else>Save Material</span>
          </button>
        </div>
      </form>
      </div>
      
      <!-- AI-Assisted Material Creation Mode -->
      <div v-else-if="inputMode === 'ai'">
        <div v-if="aiStep === 'input'">
          <div class="form-group">
            <label class="form-label">Create Study Materials with AI</label>
            <p class="ai-description">Select your input type and provide content to generate study materials. The AI will analyze your content and create focused, concise material cards optimized for memorization.</p>
            
            <div class="ai-source-options">
              <button 
                type="button" 
                @click="aiSourceType = 'text'" 
                class="ai-source-btn" 
                :class="{ active: aiSourceType === 'text' }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="17" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
                <span>Paste Text</span>
              </button>
              
              <button 
                type="button" 
                @click="aiSourceType = 'question'" 
                class="ai-source-btn" 
                :class="{ active: aiSourceType === 'question' }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Ask Question</span>
              </button>
              
              <button 
                type="button" 
                @click="aiSourceType = 'file'" 
                class="ai-source-btn" 
                :class="{ active: aiSourceType === 'file' }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Upload File</span>
              </button>
            </div>
          </div>
          
          <!-- Source Type Specific Form -->
          <div class="form-group">
            <!-- Text Input Source -->
            <div v-if="aiSourceType === 'text'">
              <label for="aiSourceText" class="form-label">Source Text</label>
              <textarea
                id="aiSourceText"
                v-model="aiSourceText"
                class="form-control"
                rows="10"
                placeholder="Paste or type your text content here. The AI will analyze this content and generate study materials."
                required
              ></textarea>
            </div>
            
            <!-- Question Input Source -->
            <div v-if="aiSourceType === 'question'">
              <label for="aiSourceQuestion" class="form-label">Your Question</label>
              <textarea
                id="aiSourceQuestion"
                v-model="aiSourceQuestion"
                class="form-control"
                rows="4"
                placeholder="Enter your question here. The AI will generate comprehensive study materials that answer this question."
                required
              ></textarea>
            </div>
            
            <!-- File Input Source -->
            <div v-if="aiSourceType === 'file'">
              <label class="form-label">Upload Source File</label>
              <div class="file-upload-container">
                <input
                  type="file"
                  id="ai-file-upload"
                  @change="handleAiFileUpload"
                  class="file-input"
                  accept=".txt,.md,.doc,.docx"
                  :disabled="loading"
                />
                <label for="ai-file-upload" class="file-upload-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>Choose file</span>
                </label>
                <span v-if="aiFileName" class="file-name">{{ aiFileName }}</span>
              </div>
              <p class="form-text">
                Supported file types: .txt, .md, .doc, .docx
              </p>
            </div>
          </div>
          
          <!-- Common Category Selection -->
          <div class="form-group">
            <label for="category" class="form-label">Category</label>
            <div class="category-dropdown-container">
              <!-- Using the same category dropdown as in manual mode -->
              <div class="category-dropdown-trigger" @click="toggleCategoryDropdown" :class="{ 'active': showCategoryDropdown }">
                <div class="selected-category">
                  <div v-if="selectedCategoryOption" class="category-tag" :class="getCategoryColorClass(selectedCategoryOption)">
                    <span>{{ selectedCategoryOption === 'custom' ? customCategory : selectedCategoryOption }}</span>
                  </div>
                  <span v-else class="placeholder-text">Select a category</span>
                </div>
                <div class="dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              
              <!-- Same dropdown content as in manual mode -->
              <div v-if="showCategoryDropdown" class="category-dropdown-content">
                <div class="category-search">
                  <input 
                    type="text" 
                    v-model="categorySearchTerm" 
                    class="form-control" 
                    placeholder="Search or add new category"
                    @input="handleCategorySearch"
                    @keydown.enter="handleCategorySearchEnter"
                    ref="categorySearchInput"
                  />
                </div>
                
                <div class="category-groups">
                  <!-- Frequently Used Categories -->
                  <div class="category-group" v-if="filteredFrequentCategories.length > 0">
                    <div class="category-group-label">Frequently Used</div>
                    <div class="category-options">
                      <div 
                        v-for="cat in filteredFrequentCategories" 
                        :key="cat" 
                        class="category-option" 
                        @click="selectCategory(cat)"
                        :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                      >
                        <span class="category-name">{{ cat }}</span>
                        <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Default Categories -->
                  <div class="category-group" v-if="filteredDefaultCategories.length > 0">
                    <div class="category-group-label">Default Categories</div>
                    <div class="category-options">
                      <div 
                        v-for="cat in filteredDefaultCategories" 
                        :key="cat" 
                        class="category-option" 
                        @click="selectCategory(cat)"
                        :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                      >
                        <span class="category-name">{{ cat }}</span>
                        <div class="category-option-actions">
                          <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <button 
                            class="category-delete-button" 
                            @click.stop="deleteCategoryPrompt(cat)"
                            title="Delete category"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Custom Categories -->
                  <div class="category-group" v-if="filteredCustomCategories.length > 0">
                    <div class="category-group-label">Your Categories</div>
                    <div class="category-options">
                      <div 
                        v-for="cat in filteredCustomCategories" 
                        :key="cat" 
                        class="category-option" 
                        @click="selectCategory(cat)"
                        :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                      >
                        <span class="category-name">{{ cat }}</span>
                        <div class="category-option-actions">
                          <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <button 
                            class="category-delete-button" 
                            @click.stop="deleteCategoryPrompt(cat)"
                            title="Delete category"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Create New Category Option -->
                  <div class="category-group" v-if="showCreateNewCategory">
                    <div class="category-group-label">Create New</div>
                    <div class="category-options">
                      <div 
                        class="category-option category-option-new" 
                        @click="createNewCategory"
                      >
                        <span class="category-name">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="category-new-icon">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          Create "{{ categorySearchTerm }}"
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="generateWithAi" class="btn btn-primary btn-lg" :disabled="loading || !canGenerateWithAi">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>Generate with AI</span>
            </button>
          </div>
        </div>
        
        <!-- AI Result Preview Step -->
        <div v-if="aiStep === 'preview'" class="ai-preview-container">
          <h4 class="preview-title">AI-Generated Study Materials</h4>
          <p class="preview-description">Review the generated materials below. You can edit, remove, or save them as is.</p>
          
          <!-- Show error if generation failed -->
          <div v-if="error" class="alert alert-danger">
            <div class="alert-content">
              <div class="alert-text">{{ error }}</div>
            </div>
          </div>
          
          <!-- Loading state while generating -->
          <div v-if="loading" class="ai-loading-state">
            <div class="ai-loading-spinner"></div>
            <p>Generating your study materials...</p>
            <p class="loading-description">The AI is analyzing your content and creating optimized study cards.</p>
          </div>
          
          <!-- Result Cards -->
          <div v-else class="ai-generated-cards">
            <div v-for="(card, index) in aiGeneratedMaterials" :key="index" class="ai-material-card">
              <div class="card-header-actions">
                <span class="card-index">Card {{ index + 1 }}</span>
                <button @click="removeGeneratedCard(index)" class="remove-card-btn" title="Remove card">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div class="card-content-editable">
                <div class="form-group mb-2">
                  <label class="form-label">Title</label>
                  <input 
                    type="text" 
                    v-model="card.title" 
                    class="form-control" 
                    placeholder="Card title"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Content</label>
                  <textarea 
                    v-model="card.content" 
                    class="form-control" 
                    rows="6" 
                    placeholder="Card content"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- No cards message -->
            <div v-if="aiGeneratedMaterials.length === 0" class="no-cards-message">
              <p>No cards were generated. Try providing different content or adjusting your input.</p>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="preview-actions">
            <button type="button" @click="aiStep = 'input'" class="btn btn-outline btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back</span>
            </button>
            
            <button type="button" @click="saveGeneratedMaterials" class="btn btn-primary btn-lg" :disabled="loading || aiGeneratedMaterials.length === 0">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>Save All Cards</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import StudyService from '@/services/study.service';
import { auth } from '@/services/firebase';

export default {
  name: 'InputForm',
  emits: ['material-saved'],
  
  setup(props, { emit }) {
    // Input mode switcher (manual or AI)
    const inputMode = ref('manual');
    
    // AI generation state
    const aiStep = ref('input');
    const aiSourceType = ref('text'); // 'text', 'question', or 'file'
    const aiSourceText = ref('');
    const aiSourceQuestion = ref('');
    const aiFileName = ref('');
    const aiFileContent = ref('');
    const aiGeneratedMaterials = ref([]);
    const title = ref('');
    const content = ref('');
    const selectedCategoryOption = ref('');
    const customCategory = ref('');
    const showCustomCategoryInput = ref(false);
    const userCustomCategories = ref([]);
    const error = ref('');
    const loading = ref(false);
    const fileName = ref('');
    const showCategoryDropdown = ref(false);
    const categorySearchTerm = ref('');
    const categorySearchInput = ref(null);
    const customCategoryInput = ref(null);
    
    // Deadline related variables
    const deadline = ref('');
    const customDeadlineDate = ref('');
    
    // Compute minimum date for custom deadline (today)
    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    
    // Function to handle deadline selection
    const selectDeadline = (value) => {
      deadline.value = value;
      if (value !== 'custom') {
        customDeadlineDate.value = '';
      } else {
        // Set default custom date to 2 weeks from now if none selected yet
        if (!customDeadlineDate.value) {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 14);
          customDeadlineDate.value = defaultDate.toISOString().split('T')[0];
        }
      }
    };
    
    // Convert deadline selection to days for the API
    const getDeadlineInDays = () => {
      if (!deadline.value) return null;
      
      if (deadline.value === 'custom' && customDeadlineDate.value) {
        const selectedDate = new Date(customDeadlineDate.value);
        const today = new Date();
        const diffTime = Math.abs(selectedDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      
      return deadline.value === 'custom' ? null : parseInt(deadline.value);
    };
    
    // Predefined categories
    // Original system categories (used as reference for deletions)
    const systemCategories = [
      'Programming',
      'Languages',
      'Science',
      'Math',
      'History',
      'Art'
    ];
    
    // Track deleted categories
    const deletedCategories = ref([]);
    
    // Computed property for defaultCategories (system categories minus deleted ones)
    const defaultCategories = computed(() => {
      return systemCategories.filter(cat => !deletedCategories.value.includes(cat));
    });
    
    // Track frequently used categories
    const frequentCategories = ref([]);
    
    const router = useRouter();
    
    const category = computed(() => {
      if (selectedCategoryOption.value === 'custom') {
        return customCategory.value;
      }
      return selectedCategoryOption.value;
    });
    
    // Filtered categories based on search term
    const filteredDefaultCategories = computed(() => {
      if (!categorySearchTerm.value) return defaultCategories.value;
      return defaultCategories.value.filter(cat => 
        cat.toLowerCase().includes(categorySearchTerm.value.toLowerCase())
      );
    });
    
    const filteredCustomCategories = computed(() => {
      if (!categorySearchTerm.value) return userCustomCategories.value;
      return userCustomCategories.value.filter(cat => 
        cat.toLowerCase().includes(categorySearchTerm.value.toLowerCase())
      );
    });
    
    const filteredFrequentCategories = computed(() => {
      if (!categorySearchTerm.value) return frequentCategories.value;
      return frequentCategories.value.filter(cat => 
        cat.toLowerCase().includes(categorySearchTerm.value.toLowerCase())
      );
    });
    
    const showCreateNewCategory = computed(() => {
      // Show create option if search term is not empty and doesn't exist in any category lists
      if (!categorySearchTerm.value) return false;
      
      const searchTermExists = 
        defaultCategories.value.some(cat => cat.toLowerCase() === categorySearchTerm.value.toLowerCase()) ||
        userCustomCategories.value.some(cat => cat.toLowerCase() === categorySearchTerm.value.toLowerCase()) ||
        frequentCategories.value.some(cat => cat.toLowerCase() === categorySearchTerm.value.toLowerCase());
      
      return !searchTermExists && categorySearchTerm.value.trim().length > 0;
    });
    
    // Toggle dropdown visibility
    const toggleCategoryDropdown = () => {
      if (showCustomCategoryInput.value) return;
      
      showCategoryDropdown.value = !showCategoryDropdown.value;
      
      if (showCategoryDropdown.value) {
        categorySearchTerm.value = '';
        nextTick(() => {
          categorySearchInput.value?.focus();
        });
      }
    };
    
    // Handle category selection
    const selectCategory = (category) => {
      selectedCategoryOption.value = category;
      showCategoryDropdown.value = false;
      
      // Add to frequent categories if not already there
      if (!frequentCategories.value.includes(category) && 
          category !== 'custom') {
        // Keep only top 5 frequent categories
        if (frequentCategories.value.length >= 5) {
          frequentCategories.value.pop();
        }
        frequentCategories.value.unshift(category);
        // Save to localStorage
        localStorage.setItem('frequentCategories', JSON.stringify(frequentCategories.value));
      }
    };
    
    // Create a new category from search term
    const createNewCategory = () => {
      if (!categorySearchTerm.value.trim()) return;
      
      customCategory.value = categorySearchTerm.value.trim();
      if (!userCustomCategories.value.includes(customCategory.value)) {
        userCustomCategories.value.push(customCategory.value);
      }
      
      selectedCategoryOption.value = customCategory.value;
      showCategoryDropdown.value = false;
      categorySearchTerm.value = '';
      
      // Add to frequent categories
      if (!frequentCategories.value.includes(customCategory.value)) {
        if (frequentCategories.value.length >= 5) {
          frequentCategories.value.pop();
        }
        frequentCategories.value.unshift(customCategory.value);
        localStorage.setItem('frequentCategories', JSON.stringify(frequentCategories.value));
      }
    };
    
    // Handle category search input
    const handleCategorySearch = () => {
      // Reset options visibility when search changes
    };
    
    // Handle enter key in search
    const handleCategorySearchEnter = () => {
      if (showCreateNewCategory.value) {
        createNewCategory();
      } else {
        // If there's only one match in the filtered lists, select it
        const allFilteredCategories = [
          ...filteredDefaultCategories.value,
          ...filteredCustomCategories.value,
          ...filteredFrequentCategories.value
        ];
        
        if (allFilteredCategories.length === 1) {
          selectCategory(allFilteredCategories[0]);
        }
      }
    };
    
    // Get color class based on category name
    const getCategoryColorClass = (categoryName) => {
      if (!categoryName) return '';
      
      // Simple hash function to determine color
      let hash = 0;
      for (let i = 0; i < categoryName.length; i++) {
        hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Map hash to one of the predefined color classes
      const colorClasses = [
        'category-blue',
        'category-green',
        'category-purple',
        'category-orange',
        'category-pink',
        'category-teal'
      ];
      
      const index = Math.abs(hash) % colorClasses.length;
      return colorClasses[index];
    };
    
    const handleCategorySelect = () => {
      if (selectedCategoryOption.value === 'custom') {
        showCustomCategoryInput.value = true;
        showCategoryDropdown.value = false;
        nextTick(() => {
          customCategoryInput.value?.focus();
        });
      } else {
        showCustomCategoryInput.value = false;
      }
    };
    
    const cancelCustomCategory = () => {
      showCustomCategoryInput.value = false;
      customCategory.value = '';
      selectedCategoryOption.value = '';
    };
    
    const handleCustomCategoryConfirm = () => {
      if (customCategory.value.trim()) {
        if (!userCustomCategories.value.includes(customCategory.value.trim())) {
          userCustomCategories.value.push(customCategory.value.trim());
        }
        selectedCategoryOption.value = customCategory.value.trim();
        showCustomCategoryInput.value = false;
        
        // Add to frequent categories
        if (!frequentCategories.value.includes(customCategory.value.trim())) {
          if (frequentCategories.value.length >= 5) {
            frequentCategories.value.pop();
          }
          frequentCategories.value.unshift(customCategory.value.trim());
          localStorage.setItem('frequentCategories', JSON.stringify(frequentCategories.value));
        }
      }
    };

    const handleCustomCategoryBlur = () => {
      // Only close if clicked outside the custom category input container
      if (!customCategory.value.trim()) {
        cancelCustomCategory();
      }
    };

    const loadUserCustomCategories = async () => {
      try {
        const materials = await StudyService.getStudyMaterials();
        const customCats = new Set();
        
        materials.forEach(material => {
          if (material.category && !systemCategories.includes(material.category)) {
            customCats.add(material.category);
          }
        });
        
        userCustomCategories.value = Array.from(customCats);
      } catch (err) {
        console.error('Failed to load custom categories:', err);
      }
    };
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      const dropdownContainer = document.querySelector('.category-dropdown-container');
      if (dropdownContainer && !dropdownContainer.contains(event.target)) {
        showCategoryDropdown.value = false;
      }
    };
    
    // Load frequent categories from localStorage
    const loadFrequentCategories = () => {
      const saved = localStorage.getItem('frequentCategories');
      if (saved) {
        try {
          frequentCategories.value = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse frequent categories:', e);
          frequentCategories.value = [];
        }
      }
    };
    
    // Load deleted categories from localStorage
    const loadDeletedCategories = () => {
      const saved = localStorage.getItem('deletedCategories');
      if (saved) {
        try {
          deletedCategories.value = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse deleted categories:', e);
          deletedCategories.value = [];
        }
      }
    };
    
    // Delete a category (show confirmation first)
    const deleteCategoryPrompt = (category) => {
      if (confirm(`Are you sure you want to delete the "${category}" category? This cannot be undone.`)) {
        deleteCategory(category);
      }
    };
    
    // Actually delete the category
    const deleteCategory = (category) => {
      // If it's a default category, add to deleted list
      if (systemCategories.includes(category)) {
        if (!deletedCategories.value.includes(category)) {
          deletedCategories.value.push(category);
          localStorage.setItem('deletedCategories', JSON.stringify(deletedCategories.value));
        }
      } 
      // If it's a custom category, remove from custom list
      else if (userCustomCategories.value.includes(category)) {
        userCustomCategories.value = userCustomCategories.value.filter(cat => cat !== category);
      }
      
      // Remove from frequent categories if present
      if (frequentCategories.value.includes(category)) {
        frequentCategories.value = frequentCategories.value.filter(cat => cat !== category);
        localStorage.setItem('frequentCategories', JSON.stringify(frequentCategories.value));
      }
      
      // If the deleted category is currently selected, reset selection
      if (selectedCategoryOption.value === category) {
        selectedCategoryOption.value = '';
      }
    };

    onMounted(() => {
      loadUserCustomCategories();
      loadFrequentCategories();
      loadDeletedCategories();
      document.addEventListener('click', handleClickOutside);
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    // Switch between manual and AI input modes
    const switchMode = (mode) => {
      inputMode.value = mode;
      // Reset error when switching modes
      error.value = '';
    };
    
    // Handle AI file upload
    const handleAiFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      aiFileName.value = file.name;
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        aiFileContent.value = e.target.result;
      };
      
      reader.onerror = () => {
        error.value = 'Failed to read the file. Please try again.';
      };
      
      reader.readAsText(file);
    };
    
    // Check if can generate with AI based on input
    const canGenerateWithAi = computed(() => {
      if (aiSourceType.value === 'text') {
        return aiSourceText.value.trim().length > 0;
      } else if (aiSourceType.value === 'question') {
        return aiSourceQuestion.value.trim().length > 0;
      } else if (aiSourceType.value === 'file') {
        return aiFileContent.value.trim().length > 0;
      }
      return false;
    });
    
    // Generate materials with AI
    const generateWithAi = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        // Check authentication
        if (!auth.currentUser) {
          error.value = "You must be logged in to generate materials with AI";
          router.push('/login');
          return;
        }
        
        // Prepare source content based on type
        let sourceContent = '';
        if (aiSourceType.value === 'text') {
          sourceContent = aiSourceText.value;
        } else if (aiSourceType.value === 'question') {
          sourceContent = aiSourceQuestion.value;
        } else if (aiSourceType.value === 'file') {
          sourceContent = aiFileContent.value;
        }
        
        if (!sourceContent.trim()) {
          error.value = 'Please provide content to generate materials';
          return;
        }
        
        // Call the DeepseekService to generate materials
        // Import the DeepseekService
        import('@/services/deepseek.service').then(async (module) => {
          const DeepseekService = module.default;
          // Call service to generate study materials
          const generatedMaterials = await DeepseekService.generateStudyMaterials(
            sourceContent,
            aiSourceType.value
          );
          
          if (!generatedMaterials || generatedMaterials.length === 0) {
            error.value = 'No materials could be generated. Try providing different content.';
            return;
          }
          
          // Store the generated materials
          aiGeneratedMaterials.value = generatedMaterials;
          
          // Move to preview step
          aiStep.value = 'preview';
        }).catch(err => {
          console.error('Error importing DeepseekService:', err);
          error.value = 'Failed to load AI service. Please try again later.';
        });
      } catch (err) {
        console.error('Error generating materials with AI:', err);
        error.value = err.message || 'Failed to generate materials with AI';
      } finally {
        loading.value = false;
      }
    };
    
    // Remove a card from generated materials
    const removeGeneratedCard = (index) => {
      aiGeneratedMaterials.value.splice(index, 1);
    };
    
    // Save all generated materials
    const saveGeneratedMaterials = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        // Check if user is authenticated
        if (!auth.currentUser) {
          console.error("No authenticated user");
          error.value = "You must be logged in to save materials";
          router.push('/login');
          return;
        }
        
        // Check if we have materials to save
        if (aiGeneratedMaterials.value.length === 0) {
          error.value = 'No materials to save';
          return;
        }
        
        // Determine deadline in days if any was selected
        const deadlineDays = getDeadlineInDays();
        
        // Save each material card
        const savePromises = aiGeneratedMaterials.value.map(material => {
          return StudyService.saveStudyMaterial(
            auth.currentUser.uid,
            material.title || 'Untitled Material',
            material.content,
            category.value,
            deadlineDays
          );
        });
        
        // Wait for all saves to complete
        const savedMaterialIds = await Promise.all(savePromises);
        
        // Emit the first saved material to trigger study view
        if (savedMaterialIds.length > 0) {
          // Create material object for the first saved item
          const firstMaterial = {
            id: savedMaterialIds[0],
            title: aiGeneratedMaterials.value[0].title || 'Untitled Material',
            content: aiGeneratedMaterials.value[0].content,
            category: category.value,
            createdAt: new Date(),
            userId: auth.currentUser.uid,
            deadline: deadlineDays
          };
          
          emit('material-saved', firstMaterial);
          
          // Reset form
          resetForm();
        } else {
          error.value = 'Failed to save materials. Please try again.';
        }
      } catch (err) {
        console.error('Error saving generated materials:', err);
        error.value = err.message || 'Failed to save study materials';
      } finally {
        loading.value = false;
      }
    };
    
    // Reset the form (both manual and AI)
    const resetForm = () => {
      // Reset manual form
      title.value = '';
      content.value = '';
      selectedCategoryOption.value = '';
      customCategory.value = '';
      showCustomCategoryInput.value = false;
      fileName.value = '';
      deadline.value = '';
      customDeadlineDate.value = '';
      
      // Reset AI form
      aiStep.value = 'input';
      aiSourceText.value = '';
      aiSourceQuestion.value = '';
      aiFileName.value = '';
      aiFileContent.value = '';
      aiGeneratedMaterials.value = [];
      
      // Reset to manual mode
      inputMode.value = 'manual';
    };
    
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      fileName.value = file.name;
      
      // For MVP, we'll just read text files
      // In a real app, you'd need more sophisticated file handling
      const reader = new FileReader();
      
      reader.onload = (e) => {
        content.value = e.target.result;
        
        // Set title from filename if title is empty
        if (!title.value) {
          title.value = file.name.split('.')[0];
        }
      };
      
      reader.onerror = () => {
        error.value = 'Failed to read the file. Please try again.';
      };
      
      reader.readAsText(file);
    };
    
    // Original handleSubmit with minor modifications
    const handleSubmit = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        // Check if user is authenticated
        if (!auth.currentUser) {
          console.error("No authenticated user");
          error.value = "You must be logged in to save materials";
          router.push('/login');
          return;
        }
        
        console.log("Current user:", auth.currentUser.uid);
        
        // Ensure we have content before saving
        if (!content.value.trim()) {
          error.value = 'Please enter or upload content to study';
          return;
        }
        
        // The userId parameter isn't actually used, as StudyService uses auth.currentUser.uid
        const materialId = await StudyService.saveStudyMaterial(
          auth.currentUser.uid,
          title.value,
          content.value,
          category.value, // Add category parameter
          getDeadlineInDays() // Add deadline parameter
        );
        
        console.log("Material saved with ID:", materialId);
        
        // Ensure we have materialId before emitting
        if (materialId) {
          // Emit with more complete material object
          const materialObj = { 
            id: materialId,
            title: title.value,
            content: content.value,
            category: category.value, // Add category to the material object
            createdAt: new Date(),
            userId: auth.currentUser.uid,
            deadline: getDeadlineInDays()
          };
          
          console.log("Emitting material:", materialObj);
          emit('material-saved', materialObj);
          
          // Clear form
          resetForm();
        } else {
          error.value = 'Failed to save material. Please try again.';
        }
        
      } catch (err) {
        console.error('Error in handleSubmit:', err);
        error.value = err.message || 'Failed to save study material';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      title,
      content,
      category,
      selectedCategoryOption,
      customCategory,
      showCustomCategoryInput,
      userCustomCategories,
      error,
      loading,
      fileName,
      // New refs
      showCategoryDropdown,
      categorySearchTerm,
      categorySearchInput,
      customCategoryInput,
      filteredDefaultCategories,
      filteredCustomCategories,
      filteredFrequentCategories,
      showCreateNewCategory,
      // Deadline refs and methods
      deadline,
      customDeadlineDate,
      minDate,
      selectDeadline,
      getDeadlineInDays,
      // Methods
      handleFileUpload,
      handleSubmit,
      handleCategorySelect,
      handleCustomCategoryBlur,
      toggleCategoryDropdown,
      selectCategory,
      createNewCategory,
      handleCategorySearch,
      handleCategorySearchEnter,
      getCategoryColorClass,
      cancelCustomCategory,
      handleCustomCategoryConfirm,
      deleteCategoryPrompt,
      deleteCategory,
      // AI-related properties and methods
      inputMode,
      switchMode,
      aiStep,
      aiSourceType,
      aiSourceText,
      aiSourceQuestion,
      aiFileName,
      aiFileContent,
      aiGeneratedMaterials,
      handleAiFileUpload,
      canGenerateWithAi,
      generateWithAi,
      removeGeneratedCard,
      saveGeneratedMaterials,
      resetForm
    };
  }
}
</script>

<style>
/* Global style to prevent option text truncation */
#category option {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
  min-width: 350px !important;
  padding: 8px !important;
  width: auto !important;
}
</style>

<style scoped>
.study-input-form {
  margin-bottom: var(--spacing-8);
}

.card-header {
  display: flex;
  align-items: center;
}

.card-header h3 {
  margin-bottom: 0;
  font-weight: var(--font-weight-semibold);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-8);
}

/* Deadline Selection Styling */
.optional-label {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  font-weight: normal;
  margin-left: var(--spacing-1);
}

.deadline-selection {
  margin-bottom: var(--spacing-2);
}

.deadline-presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.deadline-preset-button {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--neutral-300);
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--neutral-700);
}

.deadline-preset-button:hover {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
}

.deadline-preset-button.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.custom-deadline-input {
  max-width: 300px;
  margin-top: var(--spacing-2);
  animation: fadeIn 0.3s;
}

.deadline-helper {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  margin-top: var(--spacing-2);
}

/* File Upload Styling */
.file-upload-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-2);
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-upload-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.5rem 1rem;
  background-color: var(--neutral-100);
  border: 1px dashed var(--neutral-400);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.file-upload-label:hover {
  background-color: var(--neutral-200);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.file-name {
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.loading-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modern Category Dropdown Styling */
.category-dropdown-container {
  position: relative;
  width: 100%;
}

.category-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 2px solid var(--neutral-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.category-dropdown-trigger:hover {
  border-color: var(--neutral-400);
}

.category-dropdown-trigger.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.selected-category {
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.placeholder-text {
  color: var(--neutral-500);
}

.dropdown-icon {
  margin-left: auto;
  color: var(--neutral-600);
  transition: transform var(--transition-normal);
}

.category-dropdown-trigger.active .dropdown-icon {
  transform: rotate(180deg);
}

/* Category Tag Styling */
.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: white;
  background-color: var(--primary-color);
}

/* Category color variants */
.category-blue {
  background-color: #3b82f6;
}

.category-green {
  background-color: #10b981;
}

.category-purple {
  background-color: #8b5cf6;
}

.category-orange {
  background-color: #f59e0b;
}

.category-pink {
  background-color: #ec4899;
}

.category-teal {
  background-color: #14b8a6;
}

/* Dropdown Content Styling */
.category-dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  border: 1px solid var(--neutral-200);
  max-height: 350px;
  overflow-y: auto;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.category-search {
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.category-groups {
  padding: var(--spacing-2);
}

.category-group {
  margin-bottom: var(--spacing-3);
}

.category-group:last-child {
  margin-bottom: 0;
}

.category-group-label {
  padding: 0 var(--spacing-3);
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.category-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--neutral-800);
}

.category-option:hover {
  background-color: var(--neutral-100);
}

.category-option.active {
  background-color: var(--primary-color);
  color: white;
}

/* Make category color classes more subtle when not active */
.category-option.category-blue:not(.active) {
  border-left: 3px solid #3b82f6;
  background-color: rgba(59, 130, 246, 0.08);
}

.category-option.category-green:not(.active) {
  border-left: 3px solid #10b981;
  background-color: rgba(16, 185, 129, 0.08);
}

.category-option.category-purple:not(.active) {
  border-left: 3px solid #8b5cf6;
  background-color: rgba(139, 92, 246, 0.08);
}

.category-option.category-orange:not(.active) {
  border-left: 3px solid #f59e0b;
  background-color: rgba(245, 158, 11, 0.08);
}

.category-option.category-pink:not(.active) {
  border-left: 3px solid #ec4899;
  background-color: rgba(236, 72, 153, 0.08);
}

.category-option.category-teal:not(.active) {
  border-left: 3px solid #14b8a6;
  background-color: rgba(20, 184, 166, 0.08);
}

.category-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.category-option-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.category-select-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  color: var(--neutral-500);
  opacity: 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: var(--radius-full);
}

.category-option:hover .category-delete-button {
  opacity: 1;
}

.category-delete-button:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.category-option-new {
  color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.08);
}

.category-option-new:hover {
  background-color: rgba(99, 102, 241, 0.15);
}

.category-new-icon {
  margin-right: var(--spacing-2);
}

/* Custom Category Input Container */
.custom-category-input-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
  animation: fadeIn 0.3s;
}

.custom-category-input {
  flex: 1;
}

.custom-category-actions {
  display: flex;
  gap: var(--spacing-2);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
  
  .file-upload-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .file-name {
    max-width: 100%;
  }
  
  .category-dropdown-content {
    max-height: 280px;
  }
}

/* Input Mode Tabs Styling */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.input-options {
  display: flex;
  gap: var(--spacing-2);
}

.input-option-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.5rem 1rem;
  background-color: var(--neutral-100);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--neutral-700);
}

.input-option-btn:hover {
  background-color: var(--neutral-200);
  border-color: var(--primary-color);
}

.input-option-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* AI Style Overrides */
.ai-description {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-4);
  line-height: 1.5;
}

.ai-source-options {
  display: flex;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
  flex-wrap: wrap;
}

.ai-source-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-lg);
  background-color: white;
  cursor: pointer;
  transition: all var(--transition-normal);
  min-width: 120px;
  flex: 1;
}

.ai-source-btn:hover {
  border-color: var(--primary-color);
  background-color: var(--neutral-50);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.ai-source-btn.active {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
  box-shadow: var(--shadow-md);
}

.ai-source-btn svg {
  color: var(--primary-color);
}

.ai-source-btn span {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

/* AI Preview Styles */
.ai-preview-container {
  animation: fadeIn 0.3s ease;
}

.preview-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-2);
}

.preview-description {
  color: var(--neutral-600);
  margin-bottom: var(--spacing-6);
}

.ai-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-12) 0;
  text-align: center;
}

.ai-loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1.5s linear infinite;
  margin-bottom: var(--spacing-4);
}

.loading-description {
  color: var(--neutral-500);
  font-size: var(--font-size-sm);
  max-width: 400px;
  margin-top: var(--spacing-2);
}

/* Generated Card Styles */
.ai-generated-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.ai-material-card {
  background-color: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.ai-material-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-3px);
}

.card-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.card-index {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
}

.remove-card-btn {
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.remove-card-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.card-content-editable {
  animation: fadeIn 0.3s ease;
}

.mb-2 {
  margin-bottom: var(--spacing-2);
}

.no-cards-message {
  text-align: center;
  padding: var(--spacing-8);
  background-color: var(--neutral-100);
  border-radius: var(--radius-lg);
  color: var(--neutral-600);
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-6);
}

/* Media Queries */
@media (max-width: 768px) {
  .input-options {
    width: 100%;
    justify-content: space-between;
    margin-top: var(--spacing-2);
  }
  
  .ai-source-options {
    flex-direction: column;
  }
  
  .preview-actions {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .preview-actions .btn {
    width: 100%;
  }
}
</style>
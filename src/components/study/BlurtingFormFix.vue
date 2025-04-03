<!-- This is a fixed version of the chat component -->
<script>
function formatMarkdown(text) {
  if (!text) return '';
  
  // Format headers
  let formatted = text.replace(/#{1,6}\s+([^\n]+)/g, (match, title) => {
    const level = match.indexOf(' ');
    return `<h${level} class="md-heading">${title}</h${level}>`;
  });
  
  // Format bold text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Format italic text
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Format inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  // Format code blocks
  formatted = formatted.replace(/```([^\n]*)[\n]([\s\S]*?)```/g, 
    (match, language, code) => {
      return `<pre class="code-block"><code class="${language}">${code}</code></pre>`;
    }
  );
  
  // Format lists
  // First, identify all list blocks
  formatted = formatted.replace(/((?:^\s*[-*+]\s+.+\n?)+)/gm, (match) => {
    // Process each list item
    const listItems = match.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('+')) {
          return `<li>${trimmed.substring(1).trim()}</li>`;
        }
        return line;
      })
      .join('');
    
    return `<ul class="md-list">${listItems}</ul>`;
  });
  
  // Convert newlines to <br> tags
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}
</script>

<style>
/* Markdown Content Styling */
.markdown-content {
  line-height: 1.6;
}

.markdown-content .md-heading {
  margin: 0.8em 0 0.5em;
  font-weight: 600;
  line-height: 1.3;
}

.markdown-content h1 {
  font-size: 1.5rem;
}

.markdown-content h2 {
  font-size: 1.3rem;
}

.markdown-content h3 {
  font-size: 1.2rem;
}

.markdown-content h4, .markdown-content h5, .markdown-content h6 {
  font-size: 1.1rem;
}

.markdown-content strong {
  font-weight: 600;
}

.markdown-content .md-list {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.markdown-content .md-list li {
  margin: 0.25em 0;
}

.markdown-content .inline-code {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-content .code-block {
  margin: 0.8em 0;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.8em;
  border-radius: 4px;
  white-space: pre-wrap;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.9em;
  line-height: 1.4;
}

.assistant-message .markdown-content {
  color: var(--neutral-800);
}

.user-message .markdown-content {
  color: white;
}

/* Loading Dots Animation */
.loading-dots span {
  animation: loadingDots 1.4s infinite;
  animation-fill-mode: both;
  font-size: 1.5rem;
  opacity: 0;
  display: inline-block;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDots {
  0% { opacity: 0; transform: translateY(0); }
  25% { opacity: 1; transform: translateY(-3px); }
  50% { opacity: 1; transform: translateY(0); }
  75% { opacity: 1; transform: translateY(3px); }
  100% { opacity: 0; transform: translateY(0); }
}

.loading-message p {
  min-height: 24px;
}
</style>

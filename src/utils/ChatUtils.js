/**
 * Formats markdown text into HTML for rendering in the chat
 * @param {string} text - The markdown text to format
 * @returns {string} HTML formatted text
 */
export function formatMarkdown(text) {
  if (!text) return '';
  
  // Process tables first (before other formatting)
  let formatted = processMarkdownTables(text);
  
  // Format headers
  formatted = formatted.replace(/#{1,6}\s+([^\n]+)/g, (match, title) => {
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
  formatted = formatted.replace(/```([^\n]*)\n([\s\S]*?)```/g, 
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
  
  // Convert newlines to <br> tags (except within already processed elements)
  formatted = formatted.replace(/\n(?![^<]*>)/g, '<br>');
  
  return formatted;
}

/**
 * Process markdown tables into HTML tables
 * @param {string} text - The markdown text containing tables
 * @returns {string} Text with markdown tables converted to HTML tables
 */
function processMarkdownTables(text) {
  // Split the text into blocks to identify table blocks
  const blocks = text.split('\n\n');
  
  // Process each block
  const processedBlocks = blocks.map(block => {
    // Check if block appears to be a table (contains | characters)
    if (block.includes('|') && block.split('\n').length >= 2) {
      // Split the block into lines
      const lines = block.trim().split('\n');
      
      // Check if we have a proper table with a header separator row
      const hasSeparatorRow = lines.length > 1 && lines[1].includes('-') && lines[1].includes('|');
      
      if (hasSeparatorRow) {
        // This looks like a markdown table, let's convert it
        return convertMarkdownTable(lines);
      }
    }
    
    // Not a table, return the block unchanged
    return block;
  });
  
  // Join the blocks back together
  return processedBlocks.join('\n\n');
}

/**
 * Convert markdown table lines to HTML table
 * @param {string[]} lines - Array of markdown table lines
 * @returns {string} HTML table
 */
function convertMarkdownTable(lines) {
  // Extract and clean up the header row
  const headerRow = lines[0];
  const headers = headerRow
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell !== '');
  
  // Skip the separator row (index 1)
  
  // Extract and clean up the data rows
  const dataRows = lines.slice(2).map(row => {
    return row
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');
  });
  
  // Build the HTML table
  let htmlTable = '<div class="markdown-table-container"><table class="markdown-table">\n';
  
  // Add the header row
  htmlTable += '  <thead>\n    <tr>\n';
  headers.forEach(header => {
    htmlTable += `      <th>${header}</th>\n`;
  });
  htmlTable += '    </tr>\n  </thead>\n';
  
  // Add the data rows
  htmlTable += '  <tbody>\n';
  dataRows.forEach(row => {
    htmlTable += '    <tr>\n';
    row.forEach(cell => {
      htmlTable += `      <td>${cell}</td>\n`;
    });
    htmlTable += '    </tr>\n';
  });
  htmlTable += '  </tbody>\n';
  
  // Close the table
  htmlTable += '</table></div>';
  
  return htmlTable;
}

/**
 * Automatically scrolls a container to the bottom
 * @param {Element} container - The container element to scroll
 * @param {number} delay - Optional delay in ms before scrolling
 */
export function scrollToBottom(container, delay = 50) {
  if (!container) return;
  
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, delay);
}

/**
 * Network Security & Infrastructure Ultimate Guide
 * Main JavaScript - Interactivity & UI Components
 */

// =============================================================================
// DOM Content Loaded - Initialize All Components
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
  initMobileNav();
  initSidebar();
  initCopyButtons();
  initTabs();
  initAccordions();
  initSmoothScroll();
  initActiveNavHighlight();
  initSearchFilter();
  initCodeHighlight();
});

// =============================================================================
// Mobile Navigation Toggle
// =============================================================================
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.createElement('div');
  
  overlay.className = 'sidebar-overlay';
  overlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 899;
  `;
  document.body.appendChild(overlay);
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
      document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });
    
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
}

// =============================================================================
// Sidebar Navigation
// =============================================================================
function initSidebar() {
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      
      // Expand parent section if nested
      const parentSubmenu = link.closest('.nav-submenu');
      if (parentSubmenu) {
        parentSubmenu.style.display = 'block';
        const parentToggle = parentSubmenu.previousElementSibling;
        if (parentToggle) {
          parentToggle.classList.add('expanded');
        }
      }
    }
  });
  
  // Collapsible sidebar sections
  const sectionToggles = document.querySelectorAll('.sidebar-section-toggle');
  sectionToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const submenu = this.nextElementSibling;
      if (submenu && submenu.classList.contains('nav-submenu')) {
        submenu.classList.toggle('collapsed');
        this.classList.toggle('expanded');
      }
    });
  });
}

// =============================================================================
// Copy to Clipboard Functionality
// =============================================================================
function initCopyButtons() {
  // Add copy buttons to all code blocks
  const codeBlocks = document.querySelectorAll('.code-block');
  
  codeBlocks.forEach(block => {
    const copyBtn = block.querySelector('.copy-btn');
    const codeElement = block.querySelector('pre code') || block.querySelector('pre');
    
    if (copyBtn && codeElement) {
      copyBtn.addEventListener('click', async function() {
        const code = codeElement.textContent;
        
        try {
          await navigator.clipboard.writeText(code);
          
          // Visual feedback
          const originalHTML = this.innerHTML;
          this.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
          `;
          this.classList.add('copied');
          
          setTimeout(() => {
            this.innerHTML = originalHTML;
            this.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = code;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          
          try {
            document.execCommand('copy');
            this.textContent = 'Copied!';
            this.classList.add('copied');
            
            setTimeout(() => {
              this.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              `;
              this.classList.remove('copied');
            }, 2000);
          } catch (e) {
            console.error('Fallback copy failed:', e);
          }
          
          document.body.removeChild(textarea);
        }
      });
    }
  });
  
  // Auto-add copy buttons to pre elements without them
  const preElements = document.querySelectorAll('pre:not(.code-block pre)');
  preElements.forEach(pre => {
    if (!pre.closest('.code-block') && !pre.closest('.ascii-diagram')) {
      wrapCodeBlock(pre);
    }
  });
}

function wrapCodeBlock(pre) {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block';
  
  const header = document.createElement('div');
  header.className = 'code-header';
  
  const langSpan = document.createElement('span');
  langSpan.className = 'code-lang';
  langSpan.textContent = detectLanguage(pre.textContent);
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    Copy
  `;
  
  header.appendChild(langSpan);
  header.appendChild(copyBtn);
  
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(header);
  wrapper.appendChild(pre);
  
  // Re-init copy button
  copyBtn.addEventListener('click', async function() {
    const code = pre.textContent;
    try {
      await navigator.clipboard.writeText(code);
      this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;
      this.classList.add('copied');
      setTimeout(() => {
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        `;
        this.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  });
}

function detectLanguage(code) {
  const patterns = {
    'bash': /^(\$|#|sudo|apt|yum|dnf|systemctl|service|chmod|chown|grep|awk|sed|cat|echo|export|source)/m,
    'nginx': /(server\s*\{|location\s*[\/~]|upstream\s+|proxy_pass)/,
    'apache': /(<VirtualHost|<Directory|RewriteRule|ProxyPass)/,
    'python': /(import\s+|from\s+\w+\s+import|def\s+|class\s+|print\()/,
    'javascript': /(const\s+|let\s+|var\s+|function\s+|=>|console\.|document\.|window\.)/,
    'json': /^\s*[\{\[]/,
    'yaml': /^(\s*-\s+|\w+:\s*$|\w+:\s+\w)/m,
    'sql': /(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|JOIN)/i,
    'iptables': /(iptables|ip6tables|-A\s+(INPUT|OUTPUT|FORWARD)|-j\s+(ACCEPT|DROP|REJECT))/,
    'powershell': /(Get-|Set-|New-|Remove-|\$_|\$PSVersionTable|Write-Host)/,
    'cisco': /(interface\s+|ip\s+address|router\s+|access-list|crypto\s+)/,
    'config': /(acl\s+|http_access|cache_dir|visible_hostname)/
  };
  
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(code)) {
      return lang.toUpperCase();
    }
  }
  
  return 'CODE';
}

// =============================================================================
// Tabbed Content
// =============================================================================
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs');
  
  tabContainers.forEach(container => {
    const tabBtns = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const targetId = this.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        const targetContent = container.querySelector(`#${targetId}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
    
    // Activate first tab by default if none is active
    if (!container.querySelector('.tab-btn.active')) {
      const firstBtn = container.querySelector('.tab-btn');
      const firstContent = container.querySelector('.tab-content');
      if (firstBtn) firstBtn.classList.add('active');
      if (firstContent) firstContent.classList.add('active');
    }
  });
}

// =============================================================================
// Accordion Functionality
// =============================================================================
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const body = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      // Optional: Close other accordion items in same group
      const accordion = this.closest('.accordion');
      if (accordion && accordion.classList.contains('accordion-single')) {
        accordion.querySelectorAll('.accordion-header').forEach(h => {
          h.classList.remove('active');
          h.nextElementSibling.classList.remove('active');
        });
      }
      
      // Toggle current item
      if (!isActive) {
        this.classList.add('active');
        body.classList.add('active');
      } else {
        this.classList.remove('active');
        body.classList.remove('active');
      }
    });
  });
}

// =============================================================================
// Smooth Scrolling for Anchor Links
// =============================================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

// =============================================================================
// Active Navigation Highlight (scroll spy)
// =============================================================================
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('h2[id], h3[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  const observerOptions = {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
}

// =============================================================================
// Search/Filter Functionality
// =============================================================================
function initSearchFilter() {
  const searchInput = document.querySelector('.search-box input');
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      const query = this.value.toLowerCase().trim();
      const searchableItems = document.querySelectorAll('[data-searchable]');
      
      if (query === '') {
        searchableItems.forEach(item => {
          item.style.display = '';
          item.classList.remove('search-highlight');
        });
        return;
      }
      
      searchableItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = '';
          item.classList.add('search-highlight');
        } else {
          item.style.display = 'none';
          item.classList.remove('search-highlight');
        }
      });
    }, 300));
  }
}

// =============================================================================
// Code Syntax Highlighting (Basic)
// =============================================================================
function initCodeHighlight() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    let html = block.innerHTML;
    
    // Comments
    html = html.replace(/(#.*$|\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="token comment">$1</span>');
    
    // Strings
    html = html.replace(/(".*?"|'.*?')/g, '<span class="token string">$1</span>');
    
    // Numbers
    html = html.replace(/\b(\d+)\b/g, '<span class="token number">$1</span>');
    
    // Keywords (common across languages)
    const keywords = ['function', 'return', 'if', 'else', 'for', 'while', 'const', 'let', 'var', 
                      'import', 'export', 'class', 'def', 'async', 'await', 'try', 'catch',
                      'server', 'location', 'upstream', 'listen', 'proxy_pass', 'root',
                      'acl', 'http_access', 'allow', 'deny', 'permit', 'accept', 'drop', 'reject'];
    const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    html = html.replace(keywordPattern, '<span class="token keyword">$1</span>');
    
    block.innerHTML = html;
  });
}

// =============================================================================
// Utility Functions
// =============================================================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// =============================================================================
// Table of Contents Generator
// =============================================================================
function generateTOC(containerSelector, headingSelectors = 'h2, h3') {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const headings = document.querySelectorAll(headingSelectors);
  if (headings.length === 0) return;
  
  const toc = document.createElement('nav');
  toc.className = 'toc';
  toc.innerHTML = '<h4>On This Page</h4>';
  
  const list = document.createElement('ul');
  list.className = 'toc-list';
  
  headings.forEach((heading, index) => {
    // Ensure heading has an ID
    if (!heading.id) {
      heading.id = `section-${index}`;
    }
    
    const item = document.createElement('li');
    item.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
    
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    
    item.appendChild(link);
    list.appendChild(item);
  });
  
  toc.appendChild(list);
  container.appendChild(toc);
}

// =============================================================================
// Back to Top Button
// =============================================================================
function initBackToTop() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  button.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-primary);
    border: none;
    border-radius: 50%;
    color: var(--bg-primary);
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  `;
  
  document.body.appendChild(button);
  
  window.addEventListener('scroll', throttle(() => {
    if (window.pageYOffset > 500) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  }, 100));
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize back to top on load
document.addEventListener('DOMContentLoaded', initBackToTop);

// =============================================================================
// Print Functionality
// =============================================================================
function printPage() {
  window.print();
}

// =============================================================================
// Dark/Light Mode Toggle (if needed)
// =============================================================================
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  toggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// =============================================================================
// Export Functions for External Use
// =============================================================================
window.NetworkSecGuide = {
  generateTOC,
  initCopyButtons,
  initTabs,
  initAccordions,
  printPage
};

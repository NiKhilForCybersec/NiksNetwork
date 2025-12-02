// Network Security Ultimate Guide - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initSearch();
    initCopyButtons();
    initNavigation();
    initKeyboardShortcuts();
});

// Sidebar Toggle
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            e.target !== sidebarToggle) {
            sidebar.classList.remove('open');
        }
    });
    
    // Collapse all sections by default
    const sections = document.querySelectorAll('.nav-section');
    sections.forEach((section, index) => {
        // Check localStorage for saved state
        const savedState = localStorage.getItem(`nav-section-${index}`);
        if (savedState === 'open') {
            section.classList.remove('collapsed');
        } else if (savedState === 'collapsed') {
            section.classList.add('collapsed');
        } else {
            // Default: collapse all sections
            section.classList.add('collapsed');
        }
    });
    
    // Highlight current page in navigation and expand its section
    highlightCurrentPage();
}

// Toggle Navigation Section
function toggleSection(header) {
    const section = header.parentElement;
    section.classList.toggle('collapsed');
    
    // Save state to localStorage
    const sections = document.querySelectorAll('.nav-section');
    sections.forEach((s, index) => {
        if (s === section) {
            localStorage.setItem(`nav-section-${index}`, 
                s.classList.contains('collapsed') ? 'collapsed' : 'open');
        }
    });
}

// Highlight Current Page
function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
            // Expand parent section and mark as active
            const section = link.closest('.nav-section');
            if (section) {
                section.classList.remove('collapsed');
                section.classList.add('active');
            }
        }
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // Build search index
    const searchIndex = buildSearchIndex();
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        filterNavigation(query, searchIndex);
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            filterNavigation('', searchIndex);
            this.blur();
        }
        if (e.key === 'Enter') {
            // Navigate to first visible link
            const firstVisible = document.querySelector('.nav-link:not([style*="display: none"])');
            if (firstVisible) {
                window.location.href = firstVisible.href;
            }
        }
    });
}

function buildSearchIndex() {
    const index = [];
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        index.push({
            element: link,
            text: link.textContent.toLowerCase(),
            section: link.closest('.nav-section')
        });
    });
    
    return index;
}

function filterNavigation(query, index) {
    const sections = document.querySelectorAll('.nav-section');
    
    if (!query) {
        // Show all
        index.forEach(item => {
            item.element.style.display = '';
        });
        sections.forEach(section => {
            section.style.display = '';
        });
        return;
    }
    
    // Filter links
    const sectionVisibility = new Map();
    
    index.forEach(item => {
        const matches = item.text.includes(query);
        item.element.style.display = matches ? '' : 'none';
        
        if (matches) {
            sectionVisibility.set(item.section, true);
            item.section.classList.remove('collapsed');
        }
    });
    
    // Hide sections with no matches
    sections.forEach(section => {
        section.style.display = sectionVisibility.has(section) ? '' : 'none';
    });
}

// Copy to Clipboard
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.code-copy-btn');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                const originalText = this.textContent;
                this.textContent = '✓ Copied!';
                this.style.color = 'var(--accent-green)';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                this.textContent = '✗ Failed';
                setTimeout(() => {
                    this.textContent = '📋 Copy';
                }, 2000);
            });
        });
    });
}

// Navigation Enhancement
function initNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll progress indicator
    addScrollProgress();
}

function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
        width: 0%;
        z-index: 1000;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+K or Cmd+K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape to close search/sidebar
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
        
        // Arrow keys for navigation when search is focused
        if (document.activeElement.id === 'searchInput') {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstLink = document.querySelector('.nav-link:not([style*="display: none"])');
                if (firstLink) firstLink.focus();
            }
        }
    });
}

// Table of Contents Generator (for long pages)
function generateTOC() {
    const contentBody = document.querySelector('.content-body');
    const headings = contentBody.querySelectorAll('h2, h3');
    
    if (headings.length < 3) return;
    
    const toc = document.createElement('nav');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h4>On This Page</h4>';
    
    const list = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        li.className = heading.tagName.toLowerCase();
        
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        
        li.appendChild(a);
        list.appendChild(li);
    });
    
    toc.appendChild(list);
    
    // Insert after first h1
    const h1 = contentBody.querySelector('h1');
    if (h1 && h1.nextSibling) {
        h1.parentNode.insertBefore(toc, h1.nextSibling);
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Theme Toggle (if needed in future)
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Export functions for global use
window.toggleSection = toggleSection;
window.toggleTheme = toggleTheme;

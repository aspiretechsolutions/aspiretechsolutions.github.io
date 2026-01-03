/**
 * Configuration Loader
 * Loads config.json and populates the website dynamically
 */

let siteConfig = {};

// Initialize configuration
async function initializeConfig() {
    try {
        const response = await fetch('config.json');
        siteConfig = await response.json();
        
        console.log('Configuration loaded:', siteConfig);
        
        // Populate all dynamic content
        updatePageTitle();
        updateLogo();
        updateHero();
        updateContactInfo();
        updateFooter();
        updateCopyright();
        
        return siteConfig;
    } catch (error) {
        console.error('Failed to load configuration:', error);
        return null;
    }
}

// Update page title and meta tags
function updatePageTitle() {
    if (siteConfig.seo) {
        document.title = siteConfig.seo.title;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && siteConfig.seo.description) {
            metaDesc.content = siteConfig.seo.description;
        }
        
        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && siteConfig.seo.keywords) {
            metaKeywords.content = siteConfig.seo.keywords;
        }
    }
}

// Update logo
function updateLogo() {
    if (siteConfig.company) {
        const logoText = document.querySelector('.logo-text');
        const logoSubtitle = document.querySelector('.logo-subtitle');
        
        if (logoText) logoText.textContent = siteConfig.company.name;
        if (logoSubtitle) logoSubtitle.textContent = siteConfig.company.tagline;
    }
}

// Update hero section
function updateHero() {
    if (siteConfig.hero) {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        
        if (heroTitle) heroTitle.textContent = siteConfig.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = siteConfig.hero.subtitle;
        if (heroDescription) heroDescription.textContent = siteConfig.hero.description;
    }
}

// Update contact information
function updateContactInfo() {
    if (siteConfig.contact) {
        // Email links
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.href = `mailto:${siteConfig.contact.email}`;
            if (link.textContent.includes('@') || link.textContent.includes('contact') || link.textContent.includes('aspiretech')) {
                link.textContent = siteConfig.contact.email;
            }
        });
        
        // Phone links
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.href = `tel:${siteConfig.contact.phoneRaw}`;
            if (link.textContent.includes('+91') || link.textContent.includes('98765') || link.textContent.includes('9420')) {
                link.textContent = siteConfig.contact.phoneFormatted;
            }
        });
        
        // WhatsApp links
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            const currentUrl = new URL(link.href);
            const text = currentUrl.searchParams.get('text') || 'Hi, I want to discuss my project';
            link.href = `https://wa.me/${siteConfig.contact.phoneRaw}?text=${encodeURIComponent(text)}`;
        });
        
        // Working hours
        const workingHoursElements = document.querySelectorAll('.contact-method p');
        workingHoursElements.forEach(el => {
            if (el.textContent.includes('Monday') || el.textContent.includes('10:00') || el.textContent.includes('8:00')) {
                el.textContent = siteConfig.contact.workingHours;
            }
        });
        
        // Availability badge
        const availabilityBadge = document.querySelector('.availability-badge');
        if (availabilityBadge && siteConfig.contact.availability) {
            // Find the text node after the status dot
            const textNode = Array.from(availabilityBadge.childNodes).find(
                node => node.nodeType === Node.TEXT_NODE
            );
            if (textNode) {
                textNode.textContent = siteConfig.contact.availability;
            }
        }
        
        // Update footer contact info in all pages
        const footerSections = document.querySelectorAll('.footer-section');
        footerSections.forEach(section => {
            const heading = section.querySelector('h4');
            if (heading && heading.textContent === 'Connect') {
                const paragraphs = section.querySelectorAll('p');
                if (paragraphs[0] && paragraphs[0].textContent.includes('Email')) {
                    paragraphs[0].textContent = `Email: ${siteConfig.contact.email}`;
                }
                if (paragraphs[1] && paragraphs[1].textContent.includes('Phone')) {
                    paragraphs[1].textContent = `Phone: ${siteConfig.contact.phoneFormatted}`;
                }
            }
        });
    }
}

// Update footer
function updateFooter() {
    if (siteConfig.company) {
        // Footer company name
        const footerTitle = document.querySelector('.footer-section h3');
        if (footerTitle) {
            footerTitle.textContent = siteConfig.company.fullName;
        }
        
        // Footer description
        const footerDesc = document.querySelector('.footer-section p');
        if (footerDesc && siteConfig.company.description) {
            footerDesc.textContent = siteConfig.company.description;
        }
    }
    
    // Update footer contact
    if (siteConfig.contact) {
        const footerContactSection = document.querySelector('.footer-section:last-child');
        if (footerContactSection) {
            const emailP = footerContactSection.querySelector('p:nth-of-type(1)');
            const phoneP = footerContactSection.querySelector('p:nth-of-type(2)');
            
            if (emailP) emailP.textContent = `Email: ${siteConfig.contact.email}`;
            if (phoneP) phoneP.textContent = `Phone: ${siteConfig.contact.phoneFormatted}`;
        }
    }
}

// Update copyright year
function updateCopyright() {
    const copyrightText = document.querySelector('.footer-bottom p');
    if (copyrightText && siteConfig.copyrightYear && siteConfig.company) {
        copyrightText.textContent = `© ${siteConfig.copyrightYear} ${siteConfig.company.fullName}. All rights reserved.`;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeConfig, siteConfig };
}

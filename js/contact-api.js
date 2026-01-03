// Contact Form API Handler
// This file handles sending contact form data to the backend API

const API_CONFIG = {
    // Change this to your deployed backend URL in production
    baseURL: 'http://localhost:3000',
    endpoints: {
        contact: '/api/contact',
        health: '/api/health'
    }
};

// Send contact form data to backend
async function submitContactForm(formData) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.contact}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send message');
        }

        return {
            success: true,
            message: result.message
        };
    } catch (error) {
        console.error('Contact form submission error:', error);
        
        // Check if backend is not running
        if (error.message.includes('Failed to fetch')) {
            return {
                success: false,
                message: 'Unable to connect to server. Please make sure the backend is running or try again later.'
            };
        }

        return {
            success: false,
            message: error.message || 'An error occurred. Please try again.'
        };
    }
}

// Check if backend API is available
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.health}`);
        const result = await response.json();
        console.log('✅ Backend API is available:', result);
        return true;
    } catch (error) {
        console.warn('⚠️ Backend API is not available. Form will not send emails.');
        return false;
    }
}

// Initialize API check on page load
if (document.getElementById('contactForm')) {
    checkAPIHealth();
}

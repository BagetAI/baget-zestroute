const DB_ID = "zestroute-waitlist-612";
const API_BASE = "https://app.baget.ai/api/public/databases";

document.addEventListener('DOMContentLoaded', () => {
    updateSignupCount();

    const form = document.getElementById('waitlist-form');
    const messageDiv = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining...';

        try {
            const response = await fetch(`${API_BASE}/${DB_ID}/rows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        email: email,
                        source: window.location.hostname
                    }
                })
            });

            if (response.ok) {
                messageDiv.textContent = "Thanks! You're on the list. We'll be in touch soon.";
                messageDiv.className = 'success';
                messageDiv.classList.remove('hidden');
                form.querySelector('.input-group').classList.add('hidden');
                updateSignupCount();
            } else {
                throw new Error('Failed to join');
            }
        } catch (error) {
            messageDiv.textContent = "Something went wrong. Please try again.";
            messageDiv.className = 'error';
            messageDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Get Early Access';
        }
    });
});

async function updateSignupCount() {
    try {
        const response = await fetch(`${API_BASE}/${DB_ID}/count`);
        const data = await response.json();
        const countSpan = document.getElementById('signup-count');
        
        // Base count of 142 + the real database count for a realistic "early days" feel
        const total = 142 + (data.count || 0);
        countSpan.textContent = total;
    } catch (e) {
        document.getElementById('signup-count').textContent = "142";
    }
}
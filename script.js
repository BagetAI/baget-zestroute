async function handleWaitlistSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const feedback = document.getElementById('form-feedback');
    const submitBtn = form.querySelector('button');

    submitBtn.disabled = true;
    submitBtn.innerText = 'Joining...';

    try {
        const response = await fetch('https://app.baget.ai/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyId: '257d0b7a-469e-462f-9a6c-d822f57e5b66',
                email: email
            })
        });

        if (response.ok) {
            form.reset();
            feedback.innerText = 'Thanks. We will reach out when the first kits ship.';
            feedback.style.color = '#1B4332';
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        feedback.innerText = 'Something went wrong. Please try again.';
        feedback.style.color = '#B3543D';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Join the Waitlist';
    }
}

// Simple social proof counter increment
document.addEventListener('DOMContentLoaded', () => {
    const countElement = document.getElementById('signup-count');
    if (countElement) {
        let count = 142;
        countElement.innerText = count;
    }
});
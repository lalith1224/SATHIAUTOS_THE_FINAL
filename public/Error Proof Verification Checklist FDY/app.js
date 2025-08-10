// Error Proof Verification Checklist FDY form logic

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('epvcfdy-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        try {
            const response = await fetch('http://localhost:3000/api/error-proof-verification-checklist-fdy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message || 'Form submitted successfully!');
                form.reset();
            } else {
                alert(result.error || 'Submission failed.');
            }
        } catch (err) {
            alert('Network error.');
        }
    });
});
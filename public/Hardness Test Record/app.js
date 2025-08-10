// ...existing code from other forms...
// Hardness Test Record form logic

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('hardness-test-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        try {
            const response = await fetch('http://localhost:3000/api/hardness-test-record', {
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
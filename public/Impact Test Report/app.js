

// Impact Test Report form logic
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('impact-test-form');

    if (!form) {
        console.error('Impact Test Report form not found!');
        return;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        try {
            const response = await fetch('http://localhost:3000/api/impact-test-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || 'Impact Test Report submitted successfully!');
                form.reset();
            } else {
                alert(result.error || 'Submission failed.');
            }
        } catch (err) {
            console.error('Error submitting Impact Test Report:', err);
            alert('Network error. Please try again later.');
        }
    });
});

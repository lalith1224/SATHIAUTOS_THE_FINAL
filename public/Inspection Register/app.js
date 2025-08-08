document.addEventListener('DOMContentLoaded', () => {
// Dynamic backend port config
const BACKEND_PORT = window.BACKEND_PORT || 3000;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

  const form = document.getElementById('inspectionForm');
  const alert = document.getElementById('alert');
  const recordsTableBody = document.getElementById('records-tbody');

  // Fetch and display records
  async function loadRecords() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/inspection-register`);
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      displayRecords(data);
    } catch (error) {
      recordsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#dc3545;padding:2rem;">Error loading records: ${error.message}</td></tr>`;
    }
  }

  function displayRecords(records) {
    if (!records || records.length === 0) {
      recordsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#6c757d;">No inspection records found</td></tr>`;
      return;
    }
    recordsTableBody.innerHTML = records.map(row => `
      <tr>
        <td>${row.id}</td>
        <td>${row.inspection_date}</td>
        <td>${row.shift || ''}</td>
        <td>${row.item_description}</td>
        <td>${row.inspection_time || ''}</td>
        <td>${row.defects_and_quantity || ''}</td>
        <td>${row.created_at}</td>
      </tr>
    `).join('');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm()) {
      showAlert('Please fill all required fields.', 'error');
      return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      const response = await fetch(`${BACKEND_URL}/api/inspection-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit data');
      showAlert('Inspection data submitted successfully!', 'success');
      form.reset();
      loadRecords();
    } catch (error) {
      showAlert('Failed to submit inspection data: ' + error.message, 'error');
    } finally {
      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.textContent = 'Submit Inspection Data';
      submitBtn.disabled = false;
    }
  });

  function validateForm() {
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#dc3545';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    return isValid;
  }

  function showAlert(message, type) {
    alert.textContent = message;
    alert.className = `alert ${type}`;
    alert.style.display = 'block';
    setTimeout(() => { alert.style.display = 'none'; }, 5000);
  }

  window.loadRecords = loadRecords;
  loadRecords();
  setInterval(loadRecords, 30000);
});
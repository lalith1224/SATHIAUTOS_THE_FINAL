document.addEventListener('DOMContentLoaded', () => {
  const BACKEND_PORT = window.BACKEND_PORT || 3000;
  const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
  const form = document.getElementById('microstructureForm');
  const alert = document.getElementById('alert');
  const recordsTableBody = document.getElementById('records-tbody');

  async function loadRecords() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/microstructure-analysis`);
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      displayRecords(data);
    } catch (error) {
      recordsTableBody.innerHTML = `<tr><td colspan="14" style="text-align:center;color:#dc3545;padding:2rem;">Error loading records: ${error.message}</td></tr>`;
    }
  }

  function displayRecords(records) {
    if (!records || records.length === 0) {
      recordsTableBody.innerHTML = `<tr><td colspan="14" style="text-align:center;padding:2rem;color:#6c757d;">No records found</td></tr>`;
      return;
    }
    recordsTableBody.innerHTML = records.map(row => `
      <tr>
        <td>${row.id}</td>
        <td>${row.analysis_date}</td>
        <td>${row.part_name}</td>
        <td>${row.date_code || ''}</td>
        <td>${row.heat_code || ''}</td>
        <td>${row.nodularity_percentage || ''}</td>
        <td>${row.graphite_type || ''}</td>
        <td>${row.count_per_mm2 || ''}</td>
        <td>${row.size || ''}</td>
        <td>${row.ferrite_percentage || ''}</td>
        <td>${row.pearlite_percentage || ''}</td>
        <td>${row.carbide || ''}</td>
        <td>${row.remarks || ''}</td>
        <td>${row.disa_line_id}</td>
      </tr>
    `).join('');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      const response = await fetch(`${BACKEND_URL}/api/microstructure-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      submitBtn.textContent = 'Submit';
      submitBtn.disabled = false;
      if (!response.ok) throw new Error(result.error || 'Failed to submit data');
      showAlert('Data submitted successfully!', 'success');
      form.reset();
      loadRecords();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });

  function showAlert(message, type) {
    alert.textContent = message;
    alert.className = type === 'success' ? 'alert-success' : 'alert-error';
    alert.style.display = 'block';
    setTimeout(() => { alert.style.display = 'none'; }, 3000);
  }

  loadRecords();
});
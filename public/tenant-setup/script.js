window.onload = async () => {
    try {
        const res = await fetch('http://localhost:3000/company');
        if (res.ok) {
            const data = await res.json();
            document.getElementById('companyName').value = data.companyName || '';
            document.getElementById('title').value = data.title || '';
            document.getElementById('siteUrl').value = data.siteUrl || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('taxOffice').value = data.taxOffice || '';
            document.getElementById('taxNo').value = data.taxNo || '';
        }
    } catch (err) {
        console.error('API not running or company not found.');
    }
};

const setupForm = document.getElementById('setupForm');
setupForm.onsubmit = async (e) => {
    e.preventDefault();

    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = 'Saving...';
    statusDiv.className = 'message';

    const formData = new FormData(setupForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/company/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            statusDiv.textContent = result.message || 'Successfully saved!';
            statusDiv.className = 'message success';
        } else {
            statusDiv.textContent = result.message || 'An error occurred.';
            statusDiv.className = 'message error';
        }
    } catch (err) {
        statusDiv.textContent = 'Failed to connect to server.';
        statusDiv.className = 'message error';
    }

    return false;
};
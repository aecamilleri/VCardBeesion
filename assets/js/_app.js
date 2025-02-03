// Función para manejar el login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener datos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Guardar en localStorage si "Recordar sesión" está activado
    if (remember) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    }

    // Redirigir al dashboard
    window.location.href = 'dashboard.html';
});
// Generar QR al enviar el formulario
document.getElementById('generate-qr-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const job = document.getElementById('job').value;
    const company = document.getElementById('company').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    const vCard = `
BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
ORG:${company}
TITLE:${job}
END:VCARD
    `;

    // Usar la librería QRCode para generar el QR
    QRCode.toCanvas(document.getElementById('qr-container'), vCard, function(error) {
        if (error) console.error(error);
    });

    // Guardar el QR generado en el localStorage
    let qrs = JSON.parse(localStorage.getItem('qrs')) || [];
    qrs.push(vCard);
    localStorage.setItem('qrs', JSON.stringify(qrs));
});
// Mostrar QRs guardados en localStorage
window.onload = function() {
    const qrList = document.getElementById('qr-list');
    const qrs = JSON.parse(localStorage.getItem('qrs')) || [];

    qrs.forEach((qr, index) => {
        const qrItem = document.createElement('div');
        qrItem.classList.add('list-group-item');
        qrItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>QR ${index + 1}</span>
                <button class="btn btn-danger btn-sm" onclick="deleteQR(${index})">Eliminar</button>
            </div>
        `;
        qrList.appendChild(qrItem);
    });
}

// Eliminar QR
function deleteQR(index) {
    let qrs = JSON.parse(localStorage.getItem('qrs')) || [];
    qrs.splice(index, 1);
    localStorage.setItem('qrs', JSON.stringify(qrs));
    location.reload(); // Recargar la página para actualizar la lista
}

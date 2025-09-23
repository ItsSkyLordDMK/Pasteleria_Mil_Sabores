// Valida y gestiona el formulario de contacto
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    form.addEventListener('submit', function (e) {
        let valid = true;

        // Elimina mensajes previos
        ['name-error', 'email-error', 'message-error', 'success-msg'].forEach(id => {
            const msg = document.getElementById(id);
            if (msg) msg.remove();
        });

        // Validación nombre
        if (nameInput.value.trim() === '') {
            valid = false;
            const error = document.createElement('div');
            error.id = 'name-error';
            error.textContent = 'El nombre es obligatorio.';
            error.style.color = '#d32f2f';
            error.style.marginBottom = '1rem';
            nameInput.parentNode.appendChild(error);
            nameInput.focus();
        }

        // Validación email
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            valid = false;
            const error = document.createElement('div');
            error.id = 'email-error';
            error.textContent = 'Por favor ingresa un correo electrónico válido.';
            error.style.color = '#d32f2f';
            error.style.marginBottom = '1rem';
            emailInput.parentNode.appendChild(error);
            if (valid) emailInput.focus();
        }

        // Validación mensaje
        if (messageInput.value.trim().length < 15) {
            valid = false;
            const error = document.createElement('div');
            error.id = 'message-error';
            error.textContent = 'El mensaje debe contener al menos 15 caracteres.';
            error.style.color = '#d32f2f';
            error.style.marginBottom = '1rem';
            messageInput.parentNode.appendChild(error);
            if (valid) messageInput.focus();
        }

        if (!valid) {
            e.preventDefault();
        } else {
            e.preventDefault(); // Quita esto si tienes backend, aquí solo muestra la notificación
            const success = document.createElement('div');
            success.id = 'success-msg';
            success.textContent = '¡Tu mensaje fue enviado exitosamente!';
            success.style.background = '#C8E6C9';
            success.style.color = '#256029';
            success.style.padding = '1rem';
            success.style.borderRadius = '8px';
            success.style.marginBottom = '1rem';
            form.parentNode.insertBefore(success, form);

            // Limpia el formulario
            form.reset();

            // Oculta la notificación después de 3 segundos
            setTimeout(() => {
                if (success) success.remove();
            }, 3000);
        }
    });
});
let randomNumber;
let attempts = 0;
const maxAttempts = 9;
const guessInput = document.getElementById('guessInput');
const submitGuess = document.getElementById('submitGuess');
const feedback = document.getElementById('feedback');
const attemptsDiv = document.getElementById('attempts');
const restartButton = document.getElementById('restartButton');

function startGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    console.log(randomNumber)
    attempts = 0;
    guessInput.value = '000';
    feedback.textContent = '';
    attemptsDiv.textContent = '';
    restartButton.style.display = 'none';
    guessInput.disabled = false;
    submitGuess.disabled = true;
    updateHearts();
}

function updateHearts() {
    const heartsContainer = document.getElementById('hearts');
    heartsContainer.innerHTML = '';

    for (let i = 0; i < maxAttempts - attempts; i++) {
        const heartHTML = `
            <img src="resources/coracaozinho-para-o-luiz-otavio.svg" alt="Corazón" class="heart" width="20" height="20">
        `;
        heartsContainer.innerHTML += heartHTML;
    }
}

function checkGuess() {
    const userGuess = Number(guessInput.value);
    attempts++;
    updateHearts();

    if (userGuess === randomNumber) {
        submitGuess.textContent = '¡Felicidades! Adivinaste el número.';
        guessInput.disabled = true;
        submitGuess.disabled = true;
        restartButton.style.display = 'block';

        // Agregar el efecto de confeti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else if (attempts < maxAttempts) {
        // Cambiar el texto del botón y su color
        const message = userGuess < randomNumber ? 'El número es mayor.' : 'El número es menor.';
        submitGuess.textContent = message;
        submitGuess.classList.add('input-error'); // Cambiar el color a rojo
        guessInput.classList.add('input-error');
        submitGuess.disabled = true; // Deshabilitar el botón

        // Agregar la animación de sacudida
        const container = document.querySelector('.container');
        container.classList.add('shake');

        // Remover la clase después de la animación para que se pueda volver a aplicar
        setTimeout(() => {
            container.classList.remove('shake');
            submitGuess.classList.remove('input-error'); // Volver al color original
            guessInput.classList.remove('input-error');
            submitGuess.textContent = 'Enviar'; // Restablecer el texto del botón
            submitGuess.disabled = false; // Habilitar el botón nuevamente
        }, 1000); // Duración de la animación + 1 segundo adicional
    } else {
        submitGuess.textContent = `Juego terminado. El número era ${randomNumber}.`;
        guessInput.disabled = true;
        submitGuess.disabled = true;
        restartButton.style.display = 'block';
    }
}

function toggleSubmitButton() {
    let value = guessInput.value.trim();

    // Limitar a 3 dígitos
    if (value.length > 3) {
        if (parseInt(value) > 100) {
            value = value.slice(0, 3); // Cortar a 3 dígitos
        }
    }

    // Convertir el valor a un número y luego a una cadena con ceros a la izquierda
    if (value === '') {
        guessInput.value = '000'; // Si está vacío, mostrar 000
    } else {
        const numericValue = parseInt(value);
        if (!isNaN(numericValue)) {
            guessInput.value = numericValue.toString().padStart(3, '0'); // Añadir ceros a la izquierda
        } else {
            guessInput.value = '000'; // Si no es un número, mostrar 000
        }
    }

    // Deshabilitar el botón si el input es 000 o fuera del rango 0-100
    const finalValue = parseInt(guessInput.value);
    submitGuess.disabled =finalValue < 0 || finalValue > 100;
}

// Escuchar el evento input para que se actualice automáticamente
guessInput.addEventListener('input', toggleSubmitButton);

// Escuchar el evento keydown para activar el botón al presionar Enter
guessInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !submitGuess.disabled) {
        checkGuess(); // Llama a la función de verificación si el botón está habilitado
    }
});

submitGuess.addEventListener('click', checkGuess);
restartButton.addEventListener('click', startGame);

// Iniciar el juego al cargar la página
startGame(); 
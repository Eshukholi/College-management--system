document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailphone = document.getElementById('emailphone');
  const password = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const submitBtn = document.querySelector('.submit-btn');

  const emailPhoneError = document.getElementById('emailPhoneError');
  const passwordError = document.getElementById('passwordError');

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzpj5fdAfKCHhxIENLz9P-TrfvwkSdubbx5qSYhlON0655JWN0vzTgfdtjF_E-A85ZEXg/exec';

  if (!form || !emailphone || !password || !togglePassword || !submitBtn) {
    console.error('Login form elements not found.');
    return;
  }

  togglePassword.addEventListener('click', () => {
    const isHidden = password.type === 'password';
    password.type = isHidden ? 'text' : 'password';
    togglePassword.className = isHidden
      ? 'bi bi-eye toggle-icon'
      : 'bi bi-eye-slash toggle-icon';
  });

  function clearErrors() {
    emailPhoneError.textContent = '';
    passwordError.textContent = '';
  }

  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function isValidPhone(value) {
    return /^\d{10}$/.test(value);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    let loginValue = emailphone.value.trim();
    const passValue = password.value.trim();
    let valid = true;

    if (loginValue === '') {
      emailPhoneError.textContent = 'Enter email or phone';
      valid = false;
    } else {
      if (loginValue.includes('@')) {
        if (!isValidEmail(loginValue)) {
          emailPhoneError.textContent = 'Enter a valid email address';
          valid = false;
        } else {
          loginValue = loginValue.toLowerCase();
        }
      } else {
        if (!isValidPhone(loginValue)) {
          emailPhoneError.textContent = 'Phone number must be 10 digits';
          valid = false;
        }
      }
    }

    if (passValue === '') {
      passwordError.textContent = 'Enter password';
      valid = false;
    } else if (passValue.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Checking...';

    try {
      const payload = {
        action: 'login',
        emailphone: loginValue,
        password: passValue
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      console.log('Login response:', text);

      const result = JSON.parse(text);

      if (result.result === 'success') {
        submitBtn.textContent = 'Login Successful';
        alert(result.message || 'Login successful!');
        window.location.href = 'College.html';
      } else {
        const msg = result.message || 'Invalid login details';

        if (msg.toLowerCase().includes('password')) {
          passwordError.textContent = msg;
        } else {
          emailPhoneError.textContent = msg;
        }

        resetButton();
      }

    } catch (error) {
      console.error('Fetch Error:', error);
      passwordError.textContent = 'Failed to fetch. Check deployment URL and permissions.';
      resetButton();
    }
  });
});
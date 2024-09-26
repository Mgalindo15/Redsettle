//Sign Up
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementsById('confirm-password');

    const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, confirmPassword })
    });

    const data = await response.json();
    alert(data.message);
});

//Login
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'applicaiton/json' },
        body: JSON.stringify({ username, password})
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        localStorage.setItem('token', data.token);
    } else {
        alert(data.message);
    }
});
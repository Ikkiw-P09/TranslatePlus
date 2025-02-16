document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'ikkiwp09_z' && password === 'pass1234') {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('systemContainer').style.display = 'block';
    } else {
        alert('Invalid username or password');
    }
});
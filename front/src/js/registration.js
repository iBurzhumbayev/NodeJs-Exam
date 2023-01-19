const password = document.querySelector('#password'),
      form = document.querySelector('form');

password.addEventListener('input', () => {
    password.value = password.value.replace(/\D/, '').slice(0, 10);;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.querySelector('#fullName').value,
          fullSurname = document.querySelector('#fullSurname').value,
          login = document.querySelector('#login').value,
          password = document.querySelector('#password').value

    const payload = {fullName, fullSurname, login, password};

    fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message == 'Пользователь с таким логином уже существует') {
            alert(data.message)
        } 
        if (data.message == 'Ошибка при регистрации') {
            alert('Пароль должен быть больше 4 и меньше 10 символов')
        }
        if (data.message == 'Пользователь успешно зарегистрирован') {
            alert(data.message)
            window.location.href = "index.html"
        }
    })
    .catch(() => console.log('Ошибка'))
});


let userAuthorized = JSON.parse(localStorage.getItem('user'));

if (userAuthorized) {
    window.location.href = "main.html"
}

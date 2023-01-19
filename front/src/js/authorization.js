const password = document.querySelector('#password'),
      form = document.querySelector('form');

password.addEventListener('input', () => {
    password.value = password.value.replace(/\D/, '').slice(0, 10);;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.querySelector('#login').value,
          password = document.querySelector('#password').value

    const payload = {login, password};

    fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.message == `Пользователь ${login} не найден`) {
            alert(data.message)
        } 
        if (data.message == 'Введен неверный пароль') {
            alert(data.message)
        }
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = "main.html"
        } 
    })
    .catch(() => console.log('Ошибка'))
});

let userAuthorized = JSON.parse(localStorage.getItem('user'));

if (userAuthorized) {
    window.location.href = "main.html"
}

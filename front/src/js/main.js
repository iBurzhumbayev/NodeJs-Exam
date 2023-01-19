function profileData() {
    const profile = document.querySelector('.content__profile');

    let userAuthorized = JSON.parse(localStorage.getItem('user')); 

    profile.innerHTML += `
        <p class='user__profilTitle' style="margin-bottom: 10px">Профиль</p>
        <img style="width: 135px; border-radius: 12px" src="img/avatar.jpg" alt="avatar">
        <p class='user__profil' style="margin-top: 10px">${userAuthorized.fullName}</p>
        <p class='user__profil' style="margin-bottom: 5px">${userAuthorized.fullSurname}</p>

        <input class='user__input user__input-name' value='${userAuthorized.fullName}'></input>
        <input class='user__input user__input-surname' value='${userAuthorized.fullSurname}'></input>
        <button class="button__logout button__save" onclick="saveEditUser('${userAuthorized._id}')">Сохранить</button>

        <button class="button__logout button__edit" onclick="editUser()">Редактировать</button>
        <button class="button__logout" onclick="logOut()">Выйти</button>
        <button class="button__logout button__delete" onclick='deleteUser("${userAuthorized._id}")'>Удалить</button>
    `;

    if (userAuthorized == '') {
        window.location.href = "index.html"
    }
}
profileData()

function logOut() {
    localStorage.clear();
    window.location.href = "index.html"
}

const subscribers = async () => {
    const responseUsers = await fetch('http://localhost:8080/users');
    const users = await responseUsers.json();
    const userId = JSON.parse(localStorage.getItem('user'))._id; 

    document.querySelector('.content__profile-subscribers').innerHTML += `
    <p class='user__profilTitle' style="margin-bottom: 10px">Подписчики</p>
    `
    const usersFilter = users.filter((user) => user._id == userId)
    usersFilter[0].subscribers.forEach(e => {
        if (users.map(item => item._id).includes(e)) {
            const user = users.find(item => item._id === e);
            document.querySelector('.content__profile-subscribers').innerHTML += `
        <p>${user.fullName} ${user.fullSurname}</p>
        `
        }
    });
};
subscribers()


const loaddata = async () => {
    const responsceUsers = await fetch('http://localhost:8080/users');
    const users = await responsceUsers.json();
    const userId = JSON.parse(localStorage.getItem('user'))._id; 
    document.querySelector('.content__users').innerHTML += `
    <p class='user__profilTitle' style="margin-bottom: 10px">Пользователи</p>
    `
    const usersFilter = users.filter((user) => user._id !== userId)
    usersFilter.forEach(user => {
        document.querySelector('.content__users').innerHTML += `
        <div style='display: flex; align-items: center; justify-content: space-between; width: 100%' class='wrapper'>
            <p>${user.fullName} ${user.fullSurname}</p>
            <button class='button__follow ${user.subscribers.includes(userId) ? "button__follow-unfollow" : "button__follow-follow"}' ${user.subscribers.includes(userId) ? "style='background: red'" : ""} onclick="follow('${user._id}')">${user.subscribers.includes(userId) ? "&times;" : "&#128504;"}</button>
        </div>
        `
    });
};
loaddata()


const deleteUser = async (id) => {
    await fetch('http://localhost:8080/users/' + id, {method: 'delete'})
    .then(() => alert('Профиль удален'), setTimeout(logOut, 1000))
    .catch(() => alert('User delete error'));
}


const editUser = async () => {
    const editButton = document.querySelector('.button__edit');
    const saveEditButton = document.querySelector('.button__save');
    const userInput = document.querySelectorAll('.user__input');
    const userProfill = document.querySelectorAll('.user__profil');

    editButton.style.cssText = 'display: none';
    saveEditButton.style.cssText = 'display: block';
    userProfill.forEach(e => e.style.cssText = 'display: none');
    userInput.forEach(e => e.style.cssText = 'display: block');
}


const saveEditUser = async (id)=> {
    const fullName = document.querySelector('.user__input-name').value
    const fullSurname = document.querySelector('.user__input-surname').value

    await fetch('http://localhost:8080/users/' + id, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({fullName, fullSurname, id})
    }).then(() => alert('Данные сохраненны'))
      .then(() => {
        document.querySelector('.content__users').innerHTML = ''
        loaddata()
        let user = JSON.parse(localStorage.getItem('user'));
        user.fullName = `${fullName}`;
        user.fullSurname = `${fullSurname}`;
        localStorage.setItem('user', JSON.stringify(user));
        document.querySelector('.content__profile').innerHTML = ''
        profileData()

        
    })
      .catch(() => alert('error'));
}


document.querySelector('textarea').addEventListener('keyup', function(){
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight + 2) + 'px';
});

const checkTextLength = () => {
    let textLength = document.querySelector('textarea').value.length;
    if (textLength > 0) {
        document.querySelector('.button__create-post').style.display = 'block';
        document.querySelector('.hr__create').style.display = 'block';
    } else {
        document.querySelector('.button__create-post').style.display = 'none'; 
        document.querySelector('.hr__create').style.display = 'none';
    }
};


const createPost = () => {
    const postData = document.querySelector('.textarea_create-post').value;
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    

    const payload = {postData, userId};

    fetch('http://localhost:8080/posts', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message == 'Пост успешно создан') {
            alert(data.message);
            document.querySelector('.textarea_create-post').value = '';
            checkTextLength();
            document.querySelector('.content__posts').innerHTML = ''
            loadPost()
        } 
    })
    .catch(() => console.log('Ошибка'))
}


const loadPost = async () => {
    const responscePosts = await fetch('http://localhost:8080/posts');
    const posts= await responscePosts.json();
    const userId = JSON.parse(localStorage.getItem('user'))._id;

    for (const post of posts) {
        document.querySelector('.content__posts').innerHTML += `
        <div class='content__posts-wrapper'>
            <div class='content__posts-box'>
                <img style="width: 40px; border-radius: 100%" src="img/avatar.jpg" alt="avatar">
                <div class='content__posts-inner'>
                    <p style='color: #2a5885; font-weight: 500'>${post.author.fullName} ${post.author.fullSurname}</p>
                    <p>${convertTime(post.date)}</p>
                </div>
            </div>
            <p class='post__text' style='margin-top: 10px'>${post.postData}</p>
            <textarea style='display: none' class='post__textarea'>${post.postData}</textarea>
            <div style='display: flex; justify-content: space-between; align-items: center; margin-top: 15px'>
                <div class='content__posts-likes' onclick="likes('${post._id}', event)">
                    <p class='content__posts-heart' ${post.postLikes.map(item => item._id).includes(userId) ? "style='color:red'" : ""}>&#9829;</p>
                    <p class='content__posts-amount'>${post.postLikes.length}</p>
                </div>
                <div style='display: flex; justify-content: space-between; align-items: center; width: 110px'>
                    ${post.author._id == userId ? `<button class="button__deletePost" onclick='deletePost("${post._id}")'>&#128465;</button>` : ""}
                    ${post.author._id == userId ? `<button class="button__editPost" onclick="editPost(event)">&#9998;</button>` : ""}
                    <button class="button__savePost" onclick="saveEditPost('${post._id}', event)">&#10003;</button>
                </div>
            </div>
        </div>
        `
    }
};
loadPost()

const saveEditPost = async (id, event)=> {
    const cardPost = event.composedPath()[3]
    const postData = cardPost.querySelector('.post__textarea').value
    console.log(postData)
    await fetch('http://localhost:8080/posts/' + id, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({postData})
    })
    .then(() => document.querySelector('.content__posts').innerHTML = '', setTimeout(loadPost, 500))
    
      .catch(() => alert('error'));
}


const editPost = async (event) => {
    const cardPost = event.composedPath()[3]
    const editButton = cardPost.querySelector('.button__editPost');
    const saveButton = cardPost.querySelector('.button__savePost');
    const postTextarea = cardPost.querySelector('.post__textarea');
    const postText = cardPost.querySelector('.post__text');


    editButton.style.cssText = 'display: none';
    saveButton.style.cssText = 'display: block';
    postText.style.cssText = 'display: none';
    postTextarea.style.cssText = 'display: block';
}


const deletePost = async (postId) => {
    await fetch(`http://localhost:8080/posts/${postId}` , {method: 'delete'})
    .then(() => {
        document.querySelector('.content__posts').innerHTML = ''
        loadPost()  
    })
    .catch(() => alert('User delete error'));
}


const likes = async (postId, event) => {
    const likesNum = event.target.querySelector(".content__posts-amount");
    const likes = event.target.querySelector(".content__posts-heart");
    if (likes.style.color == 'red') {
        likes.style.color = '#818c99'
        likesNum.textContent = Number(likesNum.textContent) - 1;
    } else {
        likes.style.color = 'red'
        likesNum.textContent = Number(likesNum.textContent) + 1;
    }
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    const payload = {userId};

    await fetch(`http://localhost:8080/posts/likes/${postId}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(() => console.log('Ошибка'))
}


const follow = async (followedUserId) => {
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    const payload = {userId, followedUserId};

    await fetch(`http://localhost:8080/users/follow/${followedUserId}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        document.querySelector('.content__users').innerHTML = ''
        loaddata()
    })
    .catch(() => console.log('Ошибка'))
}



function checkTimePost(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}


function convertTime(dateTime) {
    let date = new Date(dateTime);
    let day = date.getDate();
    let month = date.getMonth();
    let months = ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    minutes = checkTimePost(minutes);

    return `${day} ${months[month]} ${year} в ${hours}:${minutes}`;
}









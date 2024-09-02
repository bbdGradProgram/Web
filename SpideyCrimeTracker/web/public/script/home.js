const githubLoginUrl = 'https://github.com/login/oauth/authorize?client_id=Ov23liPtGige3CY61lBV&scope=user';

const githubButton = document.getElementById('login-button');
githubButton.addEventListener('click', () => window.location.replace(githubLoginUrl));

function toggleAbout() {
    let about = document.querySelector('.about');
    about.classList.toggle('active');
}

window.toggleAbout = toggleAbout;

import {postAuth} from './login.js';

const routes = [
    {
        path: '/',
        filename: 'home.html',
        scripts: ['home.js'],
        styles: ['home.css']
    },
    {
        path: '/error',
        filename: 'error.html',
        styles: ['error.css']
    },
    {
        path: '/report',
        filename: 'report.html',
        scripts: ['report.js', 'sidebar.js'],
        styles: ['report.css', 'sidebar.css'],
        includeSidebar: true
    },
    {
        path: '/recent',
        filename: 'recent.html',
        scripts: ['recent.js', 'sidebar.js'],
        styles: ['recent.css', 'sidebar.css'],
        includeSidebar: true
    },
    {
        path: '/admin',
        filename: 'admin.html',
        includeSidebar: true,
        scripts: ['admin.js', 'sidebar.js'],
        styles: ['admin.css', 'sidebar.css'],
        adminOnly: true
    },
    {
        path: '/statistics',
        filename: 'statistics.html',
        includeSidebar: true,
        scripts: ['statistics.js', 'sidebar.js'],
        styles: ['statistics.css', 'sidebar.css'],
    }
];

const loggedInPath = '/recent';
const content = document.getElementById('content');
let loadedScripts = [];
let loadedStyles = [];

export function router(path, saveHistory = true) {
    if (path === '/auth') {
        postAuth().then(() => router(loggedInPath));
        return;
    }

    if (path !== '/' && !localStorage.getItem('access_token')) {
        console.log('no access token');
        path = '/';
    }

    if (path === '/' && localStorage.getItem('access_token')) {
        path = loggedInPath;
    }

    let route = routes.find(route => route.path === path) ?? routes.find(route => route.path === '/error');

    if (route.adminOnly && localStorage.getItem('role') !== 'admin') {
        route = routes.find(route => route.path === '/error');
    }

    loadPage(route.filename).then(page => {
        const urlPath = `${path}`;
        content.innerHTML = page;
        if (saveHistory) {
            history.pushState({}, '', urlPath);
        }
    }).then(() => {
        if (route.includeSidebar) {
            loadSidebar()
                .then(() => loadScripts(route.scripts));
        } else if (route.scripts) {
            loadScripts(route.scripts);
        }

        if (route.styles) {
            loadStyles(route.styles);
        }
    });
}

async function loadPage(filename) {
    const page = await fetch(`./html/${filename}`);
    return await page.text();
}

function loadScripts(scripts) {
    clearScripts();
    scripts.map((path) => {
        const scriptElement = document.createElement('script');
        loadedScripts.push(path);
        scriptElement.setAttribute('src', `./script/${path}`);
        scriptElement.setAttribute('type', 'module');
        document.body.appendChild(scriptElement);

        scriptElement.addEventListener('load', () => {
            const loadEvent = new Event(path);
            document.dispatchEvent(loadEvent);
            console.log('File loaded');
        });

        scriptElement.addEventListener('error', (err) => {
            console.log('Error on loading file: ', err);
        });
    });
}

function clearStyles() {
    loadedStyles.forEach(stylePath => {
        const existingStyleElement = document.querySelector(`link[href="./css/${stylePath}"]`);
        if (existingStyleElement) {
            document.head.removeChild(existingStyleElement);
        }
    });
    loadedStyles = [];
}

function loadStyles(styles) {
    clearStyles();
    styles
        .filter((path) => !loadedStyles.includes(path))
        .map((path) => {
            const styleElement = document.createElement('link');
            loadedStyles.push(path);
            styleElement.setAttribute('href', `./css/${path}`);
            styleElement.setAttribute('rel', 'stylesheet');

            document.head.appendChild(styleElement);

            styleElement.addEventListener('load', () => {
                console.log('Style loaded');
            });

            styleElement.addEventListener('error', (err) => {
                console.log('Error on loading style: ', err);
            });
        });
}

window.addEventListener('popstate', () => {
    router(location.pathname, false);
});

window.addEventListener('DOMContentLoaded', () => {
    const path = location.pathname || '/';
    router(path);
});

async function loadSidebar() {
    const sidebar = await loadPage('sidebar.html');
    content.innerHTML =
        `${sidebar}
        <section style="height: 100%; margin-left: 5em">
            ${content.innerHTML}
        </section>`;
}

function clearScripts() {
    loadedScripts.map(scriptPath => {
        const existingScriptElement = document.querySelector(`script[src="./script/${scriptPath}"]`);
        if (existingScriptElement) {
            document.body.removeChild(existingScriptElement);
        }
    });
    loadedScripts = [];
}

window.router = router;

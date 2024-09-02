function load() {
    function toggleSidebar() {
        let sidebar = document.querySelector('.sidebar');
        let btn = document.querySelector('.btn');

        sidebar.classList.toggle('active');
        btn.classList.toggle('change');
    }

    const logoutButton = document.getElementById('logout-btn');
    logoutButton.addEventListener('click', () => {
        localStorage.clear();
        window.router('/');
    });

    const adminBtn = '<a onclick="router(\'/admin\')">\
    <img class="user-icon" src="../images/administrator.png">\
    <span class="nav-item">Admin</span>\
</a>\
<span class="tooltip">Admin</span>';

    const sidebarList = document.getElementById('sidebar-list');

    if (localStorage.getItem('role') === 'admin') {
        const listElement = document.createElement('li');
        listElement.innerHTML = adminBtn;
        sidebarList.append(listElement);
    }

    window.toggleSidebar = toggleSidebar;
}

document.addEventListener('sidebar.js', () => {
    load();
});

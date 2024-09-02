import {createArea, createTypeOfCrime, getAllProvinces, getRoles, getUsers, updateUserRole} from './apiClient.js';


function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    const welcomeMessage = document.getElementById('welcomeMessage');

    sections.forEach(section => {
        section.style.display = 'none';
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'flex';
        welcomeMessage.style.display = 'none';
    }
}

function load() {
    let responseMsg = document.querySelector('.response-message');

    function toggleMessage() {
        responseMsg.classList.toggle('active');
    }

    function showMessage() {
        toggleMessage();
        setTimeout(() => toggleMessage(), 2000);
    }

    const areaForm = document.getElementById('areaForm');
    const crimeForm = document.getElementById('crimeForm');
    const userTypeForm = document.getElementById('userTypeForm');

    let allUsers = [];

    const provinceSelect = document.getElementById('province');
    const userNameSelect = document.getElementById('user-name');
    const userTypeSelect = document.getElementById('user-type');

    provinceSelect.disabled = true;
    userNameSelect.disabled = true;
    userTypeSelect.disabled = true;

    getAllProvinces().then((provinces) => {
        provinces.map(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
        provinceSelect.disabled = false;
    });

    areaForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const areaInput = document.getElementById('area');
        const provinceDropdown = document.getElementById('province');
        const area = areaInput.value.trim();
        const province = provinceDropdown.value;

        clearErrors();

        if (area === '') showError(areaInput, 'Please add a suburb');
        if (province === '') showError(provinceDropdown, 'Please select a province');

        if (document.querySelectorAll('.error').length > 0) return;

        const formData = {
            suburb: area,
            province: province,
        };

        areaForm.reset();
        createArea(formData).then((status) => {
            if (status === 201) {
                responseMsg.innerText = 'Successfully Submitted!';
            } else {
                responseMsg.innerText = 'An error occurred';
            }
            showMessage();
        });
    });

    crimeForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const crimeInput = document.getElementById('crime-type');
        const crime = crimeInput.value.trim();

        clearErrors();

        if (crime === '') showError(crimeInput, 'Please enter your type of crime');

        if (document.querySelectorAll('.error').length > 0) return;

        if (document.querySelectorAll('.error').length > 0) return;
        const formData = {hotspotType: crime};
        crimeForm.reset();
        createTypeOfCrime(formData).then((status) => {
            if (status === 201) {
                responseMsg.innerText = 'Successfully Submitted!';
            } else {
                responseMsg.innerText = 'An error occurred';
            }
            showMessage();
        });
    });

    getUsers().then((users) => {
        allUsers = users;
        getRoles().then((roles) => {
            users.map(user => {
                const option = document.createElement('option');
                option.value = user.userId;
                option.textContent = user.username;
                userNameSelect.appendChild(option);
            });

            userNameSelect.disabled = false;

            roles.map(role => {
                const option = document.createElement('option');
                option.value = role.roleId;
                option.textContent = role.roleType;
                userTypeSelect.appendChild(option);
            });
        });
    });

    userNameSelect.addEventListener('change', () => {
        const userId = Number(userNameSelect.value);
        const user = allUsers.find((user) => {
            return user.userId === userId;
        });
        userTypeSelect.value = user.roleId;
        userTypeSelect.disabled = false;
    });

    userTypeForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const userNameDropdown = document.getElementById('user-name');
        const userTypeDropdown = document.getElementById('user-type');
        const userId = userNameDropdown.value;
        const roleId = userTypeDropdown.value;

        clearErrors();

        if (userId === '') showError(userNameDropdown, 'Please select a user');
        if (roleId === '') showError(userTypeDropdown, 'Please Select a role');

        if (document.querySelectorAll('.error').length > 0) return;

        const userFormData = {userId: Number(userId), roleId: Number(roleId)};
        userTypeForm.reset();

        userNameSelect.disabled = true;
        userTypeSelect.disabled = true;

        updateUserRole(userFormData).then((status) => {
            if (status === 204) {
                responseMsg.innerText = 'Successfully Submitted!';
            } else {
                responseMsg.innerText = 'An error occurred';
            }
            showMessage();
        });
        
        allUsers = await getUsers();

        userNameSelect.disabled = false;
        userTypeSelect.disabled = false;
    });

    function clearErrors() {
        document.querySelectorAll('.form-group .error').forEach((el) => el.classList.remove('error'));
        document.querySelectorAll('.error-text').forEach(el => el.remove());
    }

    function showError(element, message) {
        element.classList.add('error');
        const errorText = document.createElement('medium');
        errorText.className = 'error-text';
        errorText.textContent = message;
        element.closest('.form-group').appendChild(errorText);
    }
}

window.showSection = showSection;
document.addEventListener('admin.js', () => {
    load();
});

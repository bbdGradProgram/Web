import {createIncident, getAllCrimeTypes, getAllProvinces, getSuburbsForProvince} from './apiClient.js';

function load() {
    let successMsg = document.querySelector('.response-message');

    function toggleMessage() {
        successMsg.classList.toggle('active');
    }

    function showMessage() {
        toggleMessage();
        setTimeout(() => toggleMessage(), 2000);
    }

    const areaSelect = document.getElementById('area');
    const provinceSelect = document.getElementById('province');
    const crimeSelect = document.getElementById('crime-type');
    let formDataArray = [];

    provinceSelect.disabled = true;
    areaSelect.disabled = true;
    crimeSelect.disabled = true;

    getAllProvinces().then((provinces) => {
        provinces.map(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
    }).then(() => provinceSelect.disabled = false);

    getAllCrimeTypes().then((crimes) => {
        crimes.map(crime => {
            const option = document.createElement('option');
            option.value = crime.hotspotTypeId;
            option.textContent = crime.hotspotType;
            crimeSelect.appendChild(option);
        });
    }).then(() => crimeSelect.disabled = false);

    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', today);

    const form = document.getElementById('myForm');

    const showError = (field, errorText) => {
        field.classList.add('error');
        const errorElement = document.createElement('medium');
        errorElement.classList.add('error-text');
        errorElement.innerText = errorText;
        field.closest('.form-group').appendChild(errorElement);
    };

    function handleFormData(e) {
        e.preventDefault();

        const areaDropdown = document.getElementById('area');
        const provinceDropdown = document.getElementById('province');
        const dateInput = document.getElementById('date');
        const crimeDropdown = document.getElementById('crime-type');
        const descriptionInput = document.getElementById('description');

        const description = descriptionInput.value.trim();
        const date = dateInput.value;
        const area = areaDropdown.value;
        const province = provinceDropdown.value;
        const crime = crimeDropdown.value;


        document.querySelectorAll('.form-group .error').forEach(field => field.classList.remove('error'));
        document.querySelectorAll('.error-text').forEach(errorText => errorText.remove());

        if (crime === '') {
            showError(crimeDropdown, 'Select a type of crime');
        }
        if (description === '') {
            showError(descriptionInput, 'Enter a Description');
        }
        if (date === '') {
            showError(dateInput, 'Select a Date');
        }
        if (!area) {
            showError(areaDropdown, 'Select a Suburb');
        }
        if (province === '') {
            showError(provinceDropdown, 'Select a Province');
        }

        const errorInputs = document.querySelectorAll('.form-group .error');
        if (errorInputs.length > 0) return;

        const formData = {
            hotspotTypeId: Number(crime),
            description: description,
            areaId: Number(area),
            date: date
        };

        form.reset();

        createIncident(formData).then((status) => {
            if (status === 201) {
                successMsg.innerText = 'Successfully Submitted!';
            } else {
                successMsg.innerText = 'An error occurred';
            }
            showMessage();
        });
    }

    form.addEventListener('submit', handleFormData);

    provinceSelect.addEventListener('change', () => {
        areaSelect.disabled = true;
        getSuburbsForProvince(provinceSelect.value).then((areas) => {
            areaSelect.innerHTML = '<option value="" selected disabled>Select a Suburb</option>';
            areas.map(area => {
                const option = document.createElement('option');
                option.value = area.areaId;
                option.textContent = area.suburb;
                areaSelect.appendChild(option);
            });
        }).then(() => areaSelect.disabled = false);
    });
}

document.addEventListener('report.js', () => {
    load();
});

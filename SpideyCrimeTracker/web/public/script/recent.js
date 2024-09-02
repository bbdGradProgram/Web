import {getAreas, getHotSpots, getHotSpotTypes, getIncidents} from './apiClient.js';

function load() {
    async function displayCrimeReports() {
        const container = document.querySelector('.cards-container');
        const template = container.querySelector('#crimeReportTemplate').content;

        let crimeReports = [];

        await Promise.all([
            getAreas(),
            getIncidents(),
            getHotSpotTypes(),
            getHotSpots()
        ]).then(([areas, incidents, hotSpotTypes, hotSpots]) => {
            incidents.map((incident) => {
                const hotSpot = hotSpots.find((e) => e.hotspotId === incident.hotspotId);
                const hotSpotType = hotSpotTypes.find((e) => e.hotspotTypeId === hotSpot.hotspotTypeId);
                const area = areas.find((e) => e.areaId === hotSpot.areaId);
                crimeReports.push(
                    {
                        date: incident.date.split('T')[0],
                        description: incident.description,
                        typeOfCrime: hotSpotType.hotspotType,
                        area: area.suburb,
                        province: area.province
                    },
                );
            });
        });
        crimeReports.reverse();
        crimeReports.forEach(report => {
            const card = document.importNode(template, true);
            card.querySelector('.crime-area').textContent = `${report.area}`;
            card.querySelector('.crime-province').textContent = `${report.province}`;
            card.querySelector('.crime-date').textContent = `Date: ${report.date}`;
            card.querySelector('.crime-type').textContent = `Type of Crime: ${report.typeOfCrime}`;
            card.querySelector('.crime-description').textContent = `Description: ${report.description}`;

            container.appendChild(card);
        });
    }

    displayCrimeReports();

    function filterCards() {
        const area = document.getElementById('filterArea').value.toLowerCase();
        const province = document.getElementById('filterProvince').value.toLowerCase();
        const date = document.getElementById('filterDate').value;
        const type = document.getElementById('filterType').value.toLowerCase();

        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const cardArea = card.querySelector('.crime-area').textContent.toLowerCase();
            const cardProvince = card.querySelector('.crime-province').textContent.toLowerCase();
            const cardDate = card.querySelector('.crime-date').textContent.replace('Date: ', '');
            const cardType = card.querySelector('.crime-type').textContent.toLowerCase();

            const areaMatch = area ? cardArea.includes(area) : true;
            const ProvinceMatch = province ? cardProvince.includes(province) : true;
            const dateMatch = date ? cardDate === date : true;
            const typeMatch = type ? cardType.includes(type) : true;

            if (areaMatch && ProvinceMatch && dateMatch && typeMatch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    document.getElementById('filterArea').addEventListener('input', filterCards);
    document.getElementById('filterProvince').addEventListener('input', filterCards);
    document.getElementById('filterDate').addEventListener('change', filterCards);
    document.getElementById('filterType').addEventListener('input', filterCards);
}

document.addEventListener('recent.js', () => {
    load();
});

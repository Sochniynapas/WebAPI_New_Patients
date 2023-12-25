import {fillParamsOfPatient, handleSortInspections, initializePage} from "./medicalFunctions.js";

const currentUrl = window.location.href;
const urlParts = currentUrl.split('/patient/');
$(document).ready(function() {
    $('#MKB').select2();
});

if (urlParts.length > 1) {

    const btn = document.getElementById('getFilters');
    btn.addEventListener('click', async () => {
        const size = parseInt(document.getElementById('size').value);
        await handleSortInspections(1, size);
    });
    const guidOrWhateverComesNext = urlParts[1];
    await fillParamsOfPatient(guidOrWhateverComesNext);
    localStorage.setItem('patientId', guidOrWhateverComesNext);
    await initializePage();
} else {
    console.log('URL не содержит /patient/');
}
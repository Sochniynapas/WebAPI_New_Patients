import {fillParamsOfPatient, handleSortInspections, initializePage} from "./medicalFunctions.js";

const currentUrl = window.location.href;
const url = new URL(currentUrl);

const pathParts = url.pathname.split('/');
const guidIndex = pathParts.indexOf('patient') + 1;

if (guidIndex > 0 && guidIndex < pathParts.length) {
    const guidOrWhateverComesNext = pathParts[guidIndex];
    const btn = document.getElementById('getFilters');
    const addInspection = document.getElementById('addInspection');
    btn.addEventListener('click', async () => {
        const size = parseInt(document.getElementById('size').value);
        await handleSortInspections(1, size);
    });
    addInspection.addEventListener('click', async ()=>{
        window.location.href = '/inspection/create';
    })
    await fillParamsOfPatient(guidOrWhateverComesNext);
    localStorage.setItem('patientId', guidOrWhateverComesNext);
    await initializePage();
} else {
    console.log('URL не содержит /patient/');
}
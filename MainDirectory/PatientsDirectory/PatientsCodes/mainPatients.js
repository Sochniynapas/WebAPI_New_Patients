import {handleSortPatients, initializePage, patientRegistration} from "./patientsFunctions.js";

const sortPatients = document.getElementById('getFilters');
const regPatient = document.getElementById('regPatient');

await initializePage();

sortPatients.addEventListener('click', async () => {
    const size = parseInt(document.getElementById('size').value);
    await handleSortPatients(1, size);
});
regPatient.addEventListener('click', async () => {

    debugger
    await patientRegistration();

})

import {getSpecialtiesList, userRegistration} from "./registrationFunctions.js";
const btn = document.getElementById('registrationButton');

$(document).ready(function() {
    $('#speciality').select2();
});

await getSpecialtiesList();

btn.addEventListener('click', async function() {
    await userRegistration();
});

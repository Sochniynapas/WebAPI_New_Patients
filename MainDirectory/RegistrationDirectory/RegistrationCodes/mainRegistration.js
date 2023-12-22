import {getSpecialtiesList} from "./registrationFunctions.js";
$(document).ready(function() {
    $('#speciality').select2();
});

await getSpecialtiesList();
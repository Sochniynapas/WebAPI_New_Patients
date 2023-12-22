import {getSpecialtiesList} from "./registrationFunctions.js";
$(document).ready(function() {
    $('#speciality').select2({
        theme: 'bootstrap-5'
    });
});
await getSpecialtiesList();
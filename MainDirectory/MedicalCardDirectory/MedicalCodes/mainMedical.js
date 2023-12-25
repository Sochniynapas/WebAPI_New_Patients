import {fillParamsOfPatient, initializePage} from "./medicalFunctions.js";

const currentUrl = window.location.href;
const urlParts = currentUrl.split('/patient/');
if (urlParts.length > 1) {
    const guidOrWhateverComesNext = urlParts[1];
    await fillParamsOfPatient(guidOrWhateverComesNext);
    localStorage.setItem('patientId', guidOrWhateverComesNext);
    await initializePage();
} else {
    console.log('URL не содержит /patient/');
}
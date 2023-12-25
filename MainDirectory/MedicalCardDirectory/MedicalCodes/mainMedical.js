import {getPatient} from "./medicalFunctions.js";

const currentUrl = window.location.href;
const urlParts = currentUrl.split('/post/');
if (urlParts.length > 1) {
    const guidOrWhateverComesNext = urlParts[1];
    await getPatient(guidOrWhateverComesNext);
} else {
    console.log('URL не содержит /post/');
}
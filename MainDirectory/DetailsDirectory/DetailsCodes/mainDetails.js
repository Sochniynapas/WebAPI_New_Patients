import {FillTheDetailsParams} from "./inspectDetailsFunctions.js";


const currentUrl = window.location.href;
const url = new URL(currentUrl);

const pathParts = url.pathname.split('/');
const guidIndex = pathParts.indexOf('inspection') + 1;

if (guidIndex > 0 && guidIndex < pathParts.length) {
    const guidOrWhateverComesNext = pathParts[guidIndex];
    await FillTheDetailsParams(guidOrWhateverComesNext);
} else {
    console.log('URL не содержит /patient/');
}
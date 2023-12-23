import {handleSortPatients, initializePage} from "./patientsFunctions.js";

const sortPatients = document.getElementById('getFilters');
// const createPost = document.getElementById('writePost');

await initializePage();

// createPost.addEventListener('click', function (){
//     window.location.href='/post/create';
// })
sortPatients.addEventListener('click', async () => {
    const size = parseInt(document.getElementById('size').value);
    await handleSortPatients(1, size);
});
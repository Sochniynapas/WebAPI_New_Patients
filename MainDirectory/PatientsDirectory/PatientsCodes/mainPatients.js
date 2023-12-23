import {handleSortPosts, initializePage} from "./functionsForOwnPage.js";
const sortPatients = document.getElementById('getFilters');
// const createPost = document.getElementById('writePost');

await initializePage();

// createPost.addEventListener('click', function (){
//     window.location.href='/post/create';
// })
sortPatients.addEventListener('click', async () => {
    const size = parseInt(document.getElementById('size').value);
    await handleSortPosts(1, size);
});
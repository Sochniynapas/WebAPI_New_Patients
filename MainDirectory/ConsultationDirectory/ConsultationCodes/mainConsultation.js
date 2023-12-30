import {fillMKB, handleSortInspections, initializePage} from "./consultationFunctions.js";


await fillMKB();
await initializePage();
const btn = document.getElementById('getFilters');
btn.addEventListener('click', async () => {
    const size = parseInt(document.getElementById('size').value);
    await handleSortInspections(1, size);
});
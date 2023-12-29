import {createInspection, fillTheParams} from "./createInspectionsFunctions.js";

await fillTheParams();
document.getElementById('createInspection').addEventListener('click', async()=>{
    await createInspection();
})
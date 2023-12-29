import {createConsult, createDiagnoses, createInspection, fillTheParams} from "./createInspectionsFunctions.js";

await fillTheParams();
document.getElementById('createInspection').addEventListener('click', async()=>{
    await createInspection();
})
document.getElementById('addConsultation').addEventListener('click', async()=>{
    await createConsult();
})
document.getElementById('addDiagnosis').addEventListener('click', async()=>{
    await createDiagnoses();
})
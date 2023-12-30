import {
    createConsult,
    createDiagnoses,
    createInspection,
    fillTheParams,
    ifNotFirst
} from "./createInspectionsFunctions.js";
import {clearTextIll, clearTextSpec} from "../../MainCodes/mainFunctions.js";

await fillTheParams();
document.getElementById('createInspection').addEventListener('click', async()=>{
    await createInspection();
})
document.getElementById('switchInspection').addEventListener('click', async()=>{
    await ifNotFirst();
})
document.getElementById('select2-speciality-container').addEventListener('click', async()=>{
    await clearTextSpec();
})
document.getElementById('select2-ill-container').addEventListener('click', async()=>{
    await clearTextIll();
})
document.getElementById('addConsultation').addEventListener('click', async()=>{
    await createConsult();
})
document.getElementById('addDiagnosis').addEventListener('click', async()=>{
    await createDiagnoses();
})
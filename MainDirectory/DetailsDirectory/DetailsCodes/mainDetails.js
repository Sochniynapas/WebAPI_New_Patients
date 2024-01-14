import {LoadPatientDetails} from "./inspectDetailsFunctions.js";
import {fillTheParamsOfRedact, redactInspection, select2Making} from "./redactInspectionFunctions.js";
import {
    changeDate,
    createDiagnoses
} from "../../CreateInspectionDirectory/CreateInspectionsCodes/createInspectionsFunctions.js";


const currentUrl = window.location.href;
const url = new URL(currentUrl);

const pathParts = url.pathname.split('/');
const guidIndex = pathParts.indexOf('inspection') + 1;

if (guidIndex > 0 && guidIndex < pathParts.length) {
    const guidOrWhateverComesNext = pathParts[guidIndex];
    await LoadPatientDetails(guidOrWhateverComesNext);
    document.getElementById('redactBtn').addEventListener('click', async()=>{

        await fillTheParamsOfRedact();
    })
    document.getElementById('final').addEventListener('change', async () => {
        await changeDate();
    })
    await select2Making();
    document.getElementById('saveChanges').addEventListener('click', async()=>{
        await redactInspection(guidOrWhateverComesNext);
    })
    document.getElementById('addDiagnosis').addEventListener('click', async()=>{
        await createDiagnoses();
    })
} else {
    console.log('URL не содержит /patient/');
}
import {getConcreteInspection, getDiagnosisAll, getPatients} from "../../curls.js";
import {
    changeDate,
    checkConclusion
} from "../../CreateInspectionDirectory/CreateInspectionsCodes/createInspectionsFunctions.js";
import {redactInspectionValidation} from "../../Validation/validators.js";

export async function fillTheParamsOfRedact(){
    document.getElementById('complaint').textContent = document.getElementById('complaintInCard').textContent;
    document.getElementById('anam').textContent = document.getElementById('anamnez').textContent;
    document.getElementById('recommendations').textContent = document.getElementById('recomend').textContent;
    const conclusionText = document.getElementById('conclus').textContent;
    const diagsContainer = document.getElementById('Diags');
    const allDiagnosis = diagsContainer.children;
    const finalSelect = document.getElementById('final');

    for (let i = 0; i < finalSelect.options.length; i++) {
        if (finalSelect.options[i].text === conclusionText) {
            if (finalSelect.options[i].text !== 'Выздоровление'){
                document.getElementById('labelDate').classList.replace('d-none', 'd-block');
                document.getElementById('finalD').classList.replace('d-none', 'd-block');
            }
            finalSelect.selectedIndex = i;
            break;

        }
    }
    if(document.getElementById('deathTime')){
        await changeDate();
    }
    document.getElementById('diagnosisContainer').innerHTML = "";

    for (let i = 0; i < allDiagnosis.length; i++){
        const clonedDiagnosis = allDiagnosis[i].cloneNode(true);
        document.getElementById('diagnosisContainer').appendChild(clonedDiagnosis);
    }
}

export async function select2Making(){


    let ill = document.getElementById('ill');
    $(ill).select2({
        ajax: {
            url: `${getDiagnosisAll}`,
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                return {
                    request: params.term,
                    page: 1,
                    size: 5,
                };
            },
            processResults: function (data) {
                data.records.unshift({text: 'Не выбрано', id: ""});
                return {
                    results: data.records.map(item => ({
                        text: item.name,
                        id: item.id,
                    }))
                };
            },
            cache: true,
            search: true
        },

        placeholder: 'Выберите объект'
    });
    $(ill).on('change', function () {
        const selectedData = $(this).select2('data')[0];
        console.log(selectedData);
        console.log(document.getElementById('ill').value);
    });
    $('.select2-search__field').on('keydown', function (e) {
        console.log('Key pressed:', e.keyCode);
    });
}

export async function redactInspection(id) {

    const diagnoses = [];
    const diagnosesObjects = document.querySelectorAll('#diagnosisContainer');


    diagnosesObjects.forEach((element, index) => {
        if(element.querySelector('#headDiagnosis') !== null) {

            const icdDiagnosisId = element.querySelector('#headDiagnosis').value;

            const description = element.querySelector('#desc').value;

            const type = element.querySelector('#type').value;


            if (icdDiagnosisId || description || type) {
                const d = {
                    icdDiagnosisId: icdDiagnosisId,
                    description: description,
                    type: type
                }
                diagnoses.push(d);
            }
        }

    });
    const deathDate = (document.querySelector('.deathDate') && document.getElementById('finalD').value !== "") ? document.getElementById('finalD').value : undefined;
    const nextDate = (document.querySelector('.nextDate') && document.getElementById('finalD').value !== "") ? document.getElementById('finalD').value : undefined;
    const formData = {
        anamnesis: document.getElementById('anam').value || undefined,
        complaints: document.getElementById('complaint').value || undefined,
        treatment: document.getElementById('recommendations').value || undefined,
        conclusion: await checkConclusion(document.getElementById('final').value),
        nextVisitDate: nextDate,
        deathDate: deathDate,
        diagnoses: diagnoses,

    };
    console.log(formData);
    if(await redactInspectionValidation()) {
        const response = await fetch(`${getConcreteInspection}${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData),
        })
        if (response.ok) {
            window.location.reload();
        }
    }
    else{
        throw new Error("Произошла ошибка валидации");
    }
}

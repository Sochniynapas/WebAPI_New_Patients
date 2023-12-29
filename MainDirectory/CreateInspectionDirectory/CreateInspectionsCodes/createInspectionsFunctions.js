import {getDiagnosisDict, getPatients, getSpecialities} from "../../curls.js";
import {formatDateForServer} from "../../MainCodes/mainFunctions.js";

export async function changeDate(){
    debugger
    const conclusion = document.querySelector('#final').value;
    document.getElementById('labelDate').classList.replace('d-none','d-block');
    document.getElementById('finalD').classList.replace('d-none', 'd-block');
    if(conclusion === 'Болезнь'){
        document.getElementById('labelDate').classList.remove('deathDate');
        document.getElementById('labelDate').classList.add('nextDate');
        document.getElementById('labelDate').textContent = 'Дата следующего визита';
    }
    else if(conclusion === 'Смерть'){
        document.getElementById('labelDate').classList.remove('nextDate');
        document.getElementById('labelDate').classList.add('deathDate');
        document.getElementById('labelDate').textContent = 'Дата смерти';
    }
    else{
        document.getElementById('labelDate').classList.remove('nextDate');
        document.getElementById('labelDate').classList.remove('deathDate');
        document.getElementById('labelDate').classList.add('d-none');
        document.getElementById('finalD').classList.add('d-none');
    }
}
export async function fillTheParams(){
    const response = await fetch(`${getPatients}/${localStorage.getItem('patientId')}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });
    let speciality = document.getElementById('speciality');
    let ill = document.getElementById('ill');
    const data = await response.json();
    const gender = data.gender === 'Male' ? '♂' : '♀';
    document.getElementById('bDate').textContent = await formatDateForServer(data.birthday);
    document.getElementById('name').textContent = data.name + " " + gender;
    document.getElementById('final').addEventListener('change', async ()=>{
        await changeDate();
    })
    $(speciality).select2({
        ajax: {
            url: `${getSpecialities}`,
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                return {
                    name: params.term,
                    page: 1,
                    size: 5
                };
            },
            processResults: function (data) {
                data.specialties.unshift({text: 'Не выбрано', id: ""});
                return {
                    results: data.specialties.map(item => ({
                        text: item.name,
                        id: item.id,
                    }))
                };
            },
            cache: true
        },
        placeholder: 'Выберите объект'
    });
    $(speciality).on('change', function () {
        debugger
        const selectedData = $(this).select2('data')[0];
        console.log(selectedData);
        console.log(document.getElementById('speciality').value);
    });

    $(ill).select2({
        ajax: {
            url: `${getDiagnosisDict}`,
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                return {
                    request: params.term,
                    page: 1,
                    size: 5
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
            cache: true
        },
        placeholder: 'Выберите объект'
    });
    $(ill).on('change', function () {
        debugger
        const selectedData = $(this).select2('data')[0];
        console.log(selectedData);
        console.log(document.getElementById('ill').value);
    });
}
export async function createInspection(){

    const diagnoses = [];
    const diagnosesObjects = document.querySelectorAll('#diagnosisContainer');
    const consultObjects = document.querySelectorAll('#consContainer');
    const consult = [];


    diagnosesObjects.forEach((element, index) => {

        const icdDiagnosisId = {
            icdDiagnosisId: element.querySelector('#headDiagnosis').value
        }
        const description = {
            description: element.querySelector('#desc').value
        }
        const type = {
            type: element.querySelector('#type').value
        }

        if (icdDiagnosisId || description || type) {
            diagnoses.push({ icdDiagnosisId, description, type });
        }

    });
    consultObjects.forEach((element, index) => {

        const specialityId = {
            specialityId: element.querySelector('#spec').value
        }
        const content ={
            content: element.querySelector('#com').value
        }
        const comment ={
            comment: content
        }
        if (specialityId || comment) {
            consult.push({ specialityId, comment});
        }

    });
    const deathDate = document.querySelector('.deathDate')? document.getElementById('finalD').value : '';
    const nextDate = document.querySelector('.nextDate')? document.getElementById('finalD').value : '';

    const formData = {
        date: document.getElementById('date').value,
        anamnesis: document.getElementById('anam').value,
        complaints: document.getElementById('complaint').value,
        treatment: document.getElementById('recommendations').value,
        conclusion: document.getElementById('final').value,
        nextVisitDate: nextDate,
        deathDate: deathDate,
        previousInspectionId: document.getElementById('speciality').value || '',
        diagnoses: diagnoses,
        consultations: consult

    };
    console.log(formData);

    const response = await fetch(`${getPatients}/${localStorage.getItem('patientId')}/inspections`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
    })
    const data = await response.json();
    console.log(data);
}
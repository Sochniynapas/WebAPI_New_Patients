import {getDiagnosisDict, getPatients, getSpecialities} from "../../curls.js";
import {formatDateForServer} from "../../MainCodes/mainFunctions.js";

export async function changeDate() {
    debugger
    const conclusion = document.querySelector('#final').value;
    document.getElementById('labelDate').classList.replace('d-none', 'd-block');
    document.getElementById('finalD').classList.replace('d-none', 'd-block');
    if (conclusion === 'Болезнь') {
        document.getElementById('labelDate').classList.remove('deathDate');
        document.getElementById('finalD').classList.add('nextDate');
        document.getElementById('labelDate').textContent = 'Дата следующего визита';
    } else if (conclusion === 'Смерть') {
        document.getElementById('labelDate').classList.remove('nextDate');
        document.getElementById('finalD').classList.add('deathDate');
        document.getElementById('labelDate').textContent = 'Дата смерти';
    } else {
        document.getElementById('finalD').classList.remove('nextDate');
        document.getElementById('finalD').classList.remove('deathDate');
        document.getElementById('labelDate').classList.add('d-none');
        document.getElementById('finalD').classList.add('d-none');
    }
}

export async function fillTheParams() {
    const response = await fetch(`${getPatients}/${localStorage.getItem('patientId')}`, {
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
    document.getElementById('final').addEventListener('change', async () => {
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

export async function createInspection() {

    const diagnoses = [];
    const diagnosesObjects = document.querySelectorAll('#diagnosisContainer');
    const consultObjects = document.querySelectorAll('#consContainer');
    const consult = [];


    diagnosesObjects.forEach((element, index) => {
        const icdDiagnosisId = element.querySelector('#headDiagnosis').value;

        const description = element.querySelector('#desc').value;

        const type = element.querySelector('#type').value;


        if (icdDiagnosisId || description || type) {
            const d = {
                icdDiagnosisId : icdDiagnosisId,
                description : description,
                type : type
            }
            diagnoses.push(d);
        }

    });
    consultObjects.forEach((element, index) => {

        const specialityId = element.querySelector('#spec').value

        const content = element.querySelector('#com').value


        if (specialityId || content) {
            const d = {
                specialityId : specialityId,
                comment : {
                    content: content
                },
            }
            consult.push(d);
        }

    });
    debugger
    const deathDate = document.querySelector('.deathDate') ? document.getElementById('finalD').value : '';
    const nextDate = document.querySelector('.nextDate') ? document.getElementById('finalD').value : '';
    debugger
    const formData = {
        date: document.getElementById('date').value,
        anamnesis: document.getElementById('anam').value,
        complaints: document.getElementById('complaint').value,
        treatment: document.getElementById('recommendations').value,
        conclusion: await checkConclusion(document.getElementById('final').value),
        nextVisitDate: nextDate,
        // deathDate: deathDate,
        // previousInspectionId: document.getElementById('speciality').value || '',
        diagnoses: diagnoses,
        consultations: consult

    };
    console.log(formData);

    const response = await fetch(`${getPatients}/${localStorage.getItem('patientId')}/inspections`, {
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

async function checkLevel(level) {
    switch (level) {
        case "Основной": {
            return 'Main';
        }
        case "Сопутствующий": {
            return 'Concomitant';
        }
        case "Осложнение": {
            return 'Complication';
        }
    }

}
async function checkConclusion(conclusion){
    switch (conclusion){
        case "Болезнь":{
            return 'Disease';
        }
        case "Выздоровление":{
            return 'Recovery';
        }
        case "Смерть":{
            return 'Death';
        }
    }

}
export async function createDiagnoses() {
    const diagnosisContainer = document.getElementById('diagnosisContainer');
    const response = await fetch('/CreateInspectionDirectory/diagnosesCard.html');
    const postString = await response.text();
    const postHTML = document.createElement('div');
    const selectedRadio = document.querySelector('input[name="inlineRadioOptions"]:checked');
    const labelText = document.querySelector('label[for="' + selectedRadio.id + '"]').textContent;
    console.log(labelText);

    postHTML.innerHTML = postString;

    postHTML.querySelector('#type').innerHTML += " " + labelText;
    postHTML.querySelector('#type').value = await checkLevel(labelText);
    postHTML.querySelector('#headDiagnosis').innerHTML = document.getElementById('ill').textContent;
    postHTML.querySelector('#headDiagnosis').value = document.getElementById('ill').value;
    postHTML.querySelector('#desc').innerHTML += " " + document.getElementById('description').value;
    postHTML.querySelector('#desc').value = document.getElementById('description').value;
    diagnosisContainer.appendChild(postHTML);
}

export async function createConsult() {
    const consulContainer = document.getElementById('consContainer');
    const response = await fetch('/CreateInspectionDirectory/consultCard.html');
    const postString = await response.text();
    const postHTML = document.createElement('div');
    postHTML.innerHTML = postString;

    postHTML.querySelector('#spec').innerHTML += " " + document.getElementById('speciality').textContent;
    postHTML.querySelector('#spec').value = document.getElementById('speciality').value;
    postHTML.querySelector('#com').innerHTML += " " + document.getElementById('comment').value;
    postHTML.querySelector('#com').value = document.getElementById('comment').value;
    consulContainer.appendChild(postHTML);
}
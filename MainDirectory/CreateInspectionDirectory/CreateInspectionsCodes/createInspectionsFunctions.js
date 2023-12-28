import {getDiagnosisDict, getPatients, getSpecialities} from "../../curls.js";
import {formatDateForServer} from "../../MainCodes/mainFunctions.js";


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
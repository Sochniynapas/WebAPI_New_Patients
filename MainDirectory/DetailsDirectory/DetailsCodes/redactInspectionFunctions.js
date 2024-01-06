import {getDiagnosisDict} from "../../curls.js";

export async function fillTheParamsOfRedact(){
    // document.getElementById('complaint').textContent = document.getElementById('complaintInCard').textContent;
    // document.getElementById('anam').textContent = document.getElementById('anamnez').textContent;
    // document.getElementById('recommendations').textContent = document.getElementById('recomend').textContent;
    const conclusionText = document.getElementById('conclus').textContent;
    const diagsContainer = document.getElementById('Diags');
    const allDiagnosis = diagsContainer.children;
    const finalSelect = document.getElementById('final');

    for (let i = 0; i < finalSelect.options.length; i++) {
        if (finalSelect.options[i].text === conclusionText) {
            if (finalSelect.options[i].text === 'Выздоровление'){
                document.getElementById('labelOfConc').style.display = 'none';
            }
            finalSelect.selectedIndex = i;
            break;
        }
    }

    if(document.getElementById('deathTime').value !== undefined){
        document.getElementById('deathTimeRedact').style.display = 'block'
        document.getElementById('nextVisitRedact').style.display = 'none'
    }
    for (let i = 0; i < allDiagnosis.length; i++){
        document.getElementById('diagnosisContainer').appendChild(allDiagnosis[i]);
    }
}

export async function select2Making(){

    const response = await fetch(`${getDiagnosisDict}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });
    const data = await response.json();
    console.log(data);

    let ill = document.getElementById('illRedact');

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
        const selectedData = $(this).select2('data')[0];
        console.log(selectedData);
        console.log(document.getElementById('illRedact').value);
    });
}

import {getSpecialities} from "../../curls.js";

export async function getSpecialtiesList(){

    let speciality = document.getElementById('speciality');
    $(speciality).select2({
        ajax: {
            url: `${getSpecialities}`,
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                return {
                    query: params.term,
                };
            },
            processResults: function (data) {
                data.unshift({text: 'Не выбрано', objectGuid: ""});
                return {
                    results: data.map(item => ({
                        text: item.name,
                        guid: item.id,
                    }))
                };
            },
            cache: true
        },
        placeholder: 'Выберите объект'
    });

}
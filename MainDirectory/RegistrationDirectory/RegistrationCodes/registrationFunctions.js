import {getSpecialities} from "../../curls.js";

export async function getSpecialtiesList(){

    debugger
    let speciality = document.getElementById('speciality');

    const response = await fetch(`${getSpecialities}`,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    console.log(data);

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
    });

}
import {getSpecialities, registration} from "../../curls.js";
import {registerValidation} from "../../Validation/validators.js";

export async function getSpecialtiesList(){

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
        console.log(document.getElementById('speciality').value);
    });

}
export async function userRegistration(){
    try {
        if(await registerValidation()) {
            const formData = {
                name: document.getElementById('fullName').value,
                password: document.getElementById('password').value,
                email: document.getElementById('email').value,
                birthday: document.getElementById('birthDate').value,
                gender: document.getElementById('gender').value,
                phone: document.getElementById('phoneNumber').value,
                speciality: document.getElementById('speciality').value
            };

            debugger
            const response = await fetch(`${registration}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                throw new Error(`${response}`);
            }
        }
        else{
            throw new Error("Произошла ошибка валидации");
        }

    }
    catch (error){
        console.error('Ошибка регистрации')
    }

}
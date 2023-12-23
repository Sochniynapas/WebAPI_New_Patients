import {profile} from "../../curls.js";
import {formatDateForServer} from "../../MainCodes/mainFunctions.js";



export async function getProfileData() {
    try {
        const token = localStorage.getItem('token');
        const headers = new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${profile}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            window.location.href = '/login'
        }

        const data = await response.json();
        console.log('Данные пользователя:', data);

        const bDate = formatDateForServer(data.birthday);
        document.getElementById("email").value = data.email;
        document.getElementById("fullname").value = data.name;
        document.getElementById("phoneNumber").value = data.phone;
        document.getElementById("gender").value = data.gender;
        document.getElementById("birthdate").value = bDate;
    } catch (error) {
        console.error('Ошибка при получении данных профиля:', error);
    }
}

export async function updateProfile(event) {
    try {
        debugger
        event.preventDefault();
        const token = localStorage.getItem('token');
        const formData = {
            email: document.getElementById("email").value,
            name: document.getElementById("fullname").value,
            phone: document.getElementById("phoneNumber").value,
            gender: document.getElementById("gender").value,
            birthday: document.getElementById("birthdate").value
        };

        const response = await fetch(`${profile}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Ошибка при обновлении профиля');
        }

        console.log(response.status);
        window.location.href = "/"
    } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
    }
}
import {login} from "../../curls.js";

export async function userLogin() {
    try {
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        }
        const response = await fetch(`${login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data.token);
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Ошибка входа')
    }

}
import {login} from "../../curls.js";
import {loginValidation, wrongLoginOrPassword} from "../../Validation/validators.js";

export async function userLogin() {
    if (await loginValidation()) {
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
        else if (response.status === 400){
            await wrongLoginOrPassword();
        }
    } else {
        throw new Error("Ошибка Email или Пароля");
    }


}
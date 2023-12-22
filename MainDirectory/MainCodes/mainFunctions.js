import {getProfile} from "../curls.js";

const token = localStorage.getItem('token')

export async function removeTokenFromLocalStorage() {
    localStorage.removeItem('token');
}

export async function checkUserToken() {
    const drop = document.getElementById('loginController');
    const loginBtn = document.getElementById('loginTop');
    const headers = new Headers({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    });

    const response = await fetch(`${getProfile}`, {
        method: 'GET',
        headers: headers,
    });
    if (response.ok) {
        const data = await response.json();
        document.getElementById('dropButton').textContent = data.name;
        loginBtn.style.display = 'none';
        return true;
    } else {
        drop.style.display = 'none';
        return false;
    }
}
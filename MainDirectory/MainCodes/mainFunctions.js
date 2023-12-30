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
export function formatDateForServer(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
export async function refactorDate(inputDate){
    const [year, month, day] = inputDate.split('-')
    const Date=`${day}.${month}.${year}`

    return Date
}
export async function clearTextIll(){
    document.querySelector('#ill').textContent = '';
}
export async function clearTextSpec(){
    document.querySelector('#speciality').textContent = '';
}
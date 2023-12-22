import {checkUserToken} from "../../MainCodes/mainFunctions.js";
import {userLogin} from "./loginFunctions.js";

const loginButton = document.getElementById('login');
const regButton = document.getElementById("register");

if(await checkUserToken() !== false){
    window.location.href ="/";
}
else{
    loginButton.addEventListener('click', async function () {
        await userLogin();
    });
    regButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = '/registration';
    });
}
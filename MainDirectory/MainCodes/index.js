import {checkUserToken, removeTokenFromLocalStorage} from "./mainFunctions.js";

let dataForResponse;
let contentOfACard;
let response;
const logoutItem = document.getElementById('logoutItem');
const pathName = window.location.pathname;
export const regularForConcretePatient = /^\/patient\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
export const regularForPatients = /^\/patients(?:\?name=[a-zA-Z]+)?(?:&conclusions=(?:Disease|Recovery|Death(?:,Disease|,Recovery|,Death)*)+)?(?:&sorting=(?:NameAsc|NameDesc|CreateAsc|CreateDesc|InspectionAsc|InspectionDesc)?)?(?:&scheduledVisits=(?:true|false)?)?(?:&onlyMine=(?:true|false)?)?(?:&page=\d+)?(?:&size=\d+)?$/;

switch (pathName){
    case '/':{
        response = await fetch('/index.html');
        dataForResponse = await response.text();
        contentOfACard = document.getElementById('concreteCard');
        await checkUserToken();

        contentOfACard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        });
        break;
    }
    case '/registration':{
        response = await fetch('RegistrationDirectory/registrationCard.html');
        dataForResponse = await response.text();
        contentOfACard = document.getElementById('concreteCard');
        contentOfACard.innerHTML = dataForResponse;
        if(await checkUserToken()!==false){
            window.location.href = "/";
            break;
        }
        contentOfACard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        });
        break;
    }
    case '/login':{
        response = await fetch('LoginDirectory/loginCard.html');
        dataForResponse = await response.text();
        contentOfACard = document.getElementById('concreteCard');
        contentOfACard.innerHTML = dataForResponse;
        await checkUserToken();
        contentOfACard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        });
        break;
    }
    case '/profile':{
        response = await fetch('ProfileDirectory/profileCard.html');
        dataForResponse = await response.text();
        contentOfACard = document.getElementById('concreteCard');
        contentOfACard.innerHTML = dataForResponse;
        if(await checkUserToken()===false){
            window.location.href = "/login";
            break;
        }
        contentOfACard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        });
        break;
    }

    default:
        if (regularForConcretePatient.test(pathName)) {
            response = await fetch('/MedicalCardDirectory/medicalCard.html');
            dataForResponse = await response.text();
            contentOfACard = document.getElementById('concreteCard');
            contentOfACard.innerHTML = dataForResponse;
            await checkUserToken();
            contentOfACard.querySelectorAll('script').forEach(script => {
                const newScript = document.createElement("script")
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value)
                })
                newScript.appendChild(document.createTextNode(script.innerHTML))
                script.parentNode.replaceChild(newScript, script)
            });
            break;
        }
        else if(regularForPatients.test(pathName)){
            response = await fetch('PatientsDirectory/patientsCard.html');
            dataForResponse = await response.text();
            contentOfACard = document.getElementById('concreteCard');
            contentOfACard.innerHTML = dataForResponse;
            if(await checkUserToken()===false){
                window.location.href = "/login";
                break;
            }
            contentOfACard.querySelectorAll('script').forEach(script => {
                const newScript = document.createElement("script")
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value)
                })
                newScript.appendChild(document.createTextNode(script.innerHTML))
                script.parentNode.replaceChild(newScript, script)
            });
            break;
        }
        else {
            window.location.href = 'https://ru.hostings.info/upload/images/2021/12/e11044b915dc39afc3004430606bd6d1.jpg';
        }
        break;
}
logoutItem.addEventListener('click', removeTokenFromLocalStorage);
export async function registerValidation(){
    let fullName = document.getElementById('fullName');
    let gender = document.getElementById('gender');
    let birthDate = document.getElementById('birthDate');
    let phoneNumber = document.getElementById('phoneNumber');
    let speciality = document.getElementById('speciality');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let allRight = true;
    clearErrorMessages();

    if (!isValidFullName(fullName.value)) {
        displayError(fullName, 'Пожалуйста, введите корректное имя.');
        allRight = false;
    }

    if (!isValidGender(gender.value)) {
        displayError(gender, 'Пожалуйста, выберите пол.');
        allRight = false;
    }

    if (!isValidBirthDate(birthDate.value)) {
        displayError(birthDate, 'Дата рождения должна быть не меньше 1900 года и не больше 2008 года.');
        allRight = false;
    }

    if (!isValidPhoneNumber(phoneNumber.value)) {
        displayError(phoneNumber, 'Пожалуйста, введите телефон в формате +7 (xxx) xxx-xx-xx.');
        allRight = false;
    }

    if (!isValidSpeciality(speciality.value)) {
        displayError(speciality, 'Пожалуйста, выберите специальность.');
        allRight = false;
    }

    if (!isValidEmail(email.value)) {
        displayError(email, 'Пожалуйста, введите корректный email.');
        allRight = false;
    }

    if (!isValidPassword(password.value)) {
        displayError(password, 'Пароль должен содержать заглавную букву, цифры и быть длиннее 5 символов.');
        allRight = false;
    }
    return allRight;
}
export async function addDiagnosisValidation(){
    let radioButtons = document.getElementsByName("inlineRadioOptions");
    let ill = document.getElementById("select2-ill-container");
    let description = document.getElementById("description");
    let allRight = true;

    clearErrorMessages();
    if(!isValidDiagnosisType(radioButtons)){
        displayError(document.getElementById('Types'), "Выберите тип диагноза");
        allRight = false;
    }
    if(isValidSpeciality(ill)){
        displayError(ill, "Выберите диагоноз");
        allRight = false;
    }
    if(!isValidForDescription(description.value)){
        displayError(description, "Напишите описание");
        allRight = false;
    }
    return allRight;

}

export async function redactInspectionValidation(){
    let complaint = document.getElementById('complaint');
    let anames = document.getElementById('anam');
    let recommendation = document.getElementById('recommendations');
    let finalD = document.getElementById('finalD');
    let allRight = true;
    clearErrorMessages();
    if(isValidCompAnamRecomend(complaint.value)){
        displayError(complaint, "Напишите жалобы");
        allRight = false;
    }
    if(isValidCompAnamRecomend(anames.value)){
        displayError(anames, "Напишите анамез заболевания");
        allRight = false;
    }
    if(isValidCompAnamRecomend(recommendation.value)){
        displayError(recommendation, "Напишите рекомендации");
        allRight = false;
    }
    debugger
    if(!finalD.classList.contains('d-none')){
        if(!isValidFinalDate(finalD.value)) {
            displayError(finalD, "Дата заключения не может быть больше сегодняшней");
            allRight = false;
        }
    }

    return allRight;
}

export async function loginValidation(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let allRight = true;
    clearErrorMessages();


    if (!isValidEmail(email.value)) {
        displayError(email, 'Пожалуйста, введите корректный email.');
        allRight = false;
    }

    if (!isValidPassword(password.value)) {
        displayError(password, 'Пароль должен содержать заглавную букву, цифры и быть длиннее 5 символов.');
        allRight = false;
    }
    return allRight;
}

export async function wrongLoginOrPassword(){

    let password = document.getElementById('password');
    clearErrorMessages();
    displayError(password, 'Ошибка в Email или пароля');

}
function isValidFinalDate(date){
    return date < new Date();
}
function isValidDiagnosisType(radioButtons){

    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            return true;

        }
    }
    return false;
}
function isValidFullName(fullName) {
    return fullName.trim() !== '';
}
function isValidCompAnamRecomend(compAnamRecomend) {
    return compAnamRecomend.trim() !== '';
}
function isValidForDescription(desc){
    return desc.trim() !== '';
}
function isValidGender(gender) {
    return gender !== '';
}

function isValidBirthDate(birthDate) {
    let minYear = 1900;
    let maxYear = 2008;
    let year = new Date(birthDate).getFullYear();
    return !isNaN(year) && year >= minYear && year <= maxYear;
}

function isValidPhoneNumber(phoneNumber) {
    let pattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return pattern.test(phoneNumber);
}

function isValidSpeciality(speciality) {
    if(speciality.textContent === '' || speciality.textContent === "Выберите объект"){
        return true;
    }
    else{
        return false;
    }
}

function isValidEmail(email) {
    return email.indexOf('@') !== -1;
}

function isValidPassword(password) {
    return password.length > 5 && /[A-Z]/.test(password) && /\d/.test(password);
}

function clearErrorMessages() {
    let errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function (element) {
        element.remove();
    });
}

function displayError(element, message) {
    let errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.textContent = message;
    element.parentNode.appendChild(errorMessage);
}
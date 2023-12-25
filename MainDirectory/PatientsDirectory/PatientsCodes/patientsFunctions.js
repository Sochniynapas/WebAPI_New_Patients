import {getPatients, patientRegister} from "../../curls.js";
import {formatDateForServer} from "../../MainCodes/mainFunctions.js";

export async function handleSortPatients(page, size) {
    try {
        const conclusions = document.getElementById('conclusions');
        const selectedConclusion = Array.from(conclusions.selectedOptions).map(option => option.value);
        const authorInput = document.getElementById('authorName').value;
        const scheduledVisits = document.getElementById('scheduledVisits').checked;
        const onlyMine = document.getElementById('onlyMine').checked;
        const sortingSelect = document.getElementById('sortBy').value;




        const queryParams = new URLSearchParams();
        page !== undefined ? queryParams.append('page', page) : null;
        size !== undefined ? queryParams.append('size', size) : null;
        if (selectedConclusion.length > 0) {
            for (const tag of selectedConclusion) {
                queryParams.append('tags', tag);
            }
        }
        authorInput.trim() !== "" ? queryParams.append('authorInput', authorInput) : null;
        sortingSelect.trim() !== "" ? queryParams.append('sorting', sortingSelect) : null;
        scheduledVisits !== undefined ? queryParams.append('scheduledVisits', scheduledVisits) : null;
        onlyMine !== undefined ? queryParams.append('onlyMine', onlyMine) : null;


        const fullUrl = `${getPatients}?${queryParams.toString()}`;

        history.pushState("","",`?${queryParams.toString()}`);

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            const postContainer = document.getElementById('own-patients');
            document.getElementById('patients-container').remove();
            const forPostsFiltered = document.createElement('div');
            forPostsFiltered.id = 'patients-container';
            postContainer.prepend(forPostsFiltered);

            await displayPatients(data.patients);

            await displayPageControllers(data, page);
        } else {
            throw new Error("Ошибка в запросе");
        }
    } catch (error) {
        console.error(`Ошибка фильтрации: ${error}`);
    }
}

export async function createPatient(data) {
    const patientContainer = document.getElementById('patients-container');

    const response = await fetch('/PatientsDirectory/patientCardInList.html');
    const postString = await response.text();
    const postHTML = document.createElement('div');
    const gender = (data.gender === "Male")? "Мужской" : "Женский";
    const birthday = formatDateForServer(data.birthday)
    postHTML.innerHTML = postString;
    console.log(data);
    postHTML.querySelector('#name').textContent += " " + data.name;
    postHTML.querySelector('#gender').textContent += " " + gender;
    postHTML.querySelector('#birthday').innerHTML += " " + birthday;
    postHTML.querySelector('#patient').addEventListener('click', async function () {
        window.location.href = `/patient/${data.id}`;
    });

    patientContainer.appendChild(postHTML);

}

async function displayPatients(patients) {
    console.log(patients);
    for (const patient of patients) {
        try {
            await createPatient(patient);
        } catch (error) {
            console.error(`Ошибка загрузки картинки: ${error}`);
        }
    }
}

export function createPageButton(num, cur) {
    const listItem = document.createElement('li');
    listItem.classList.add('page-item');
    const linkItem = document.createElement('a');
    linkItem.classList.add('page-link', 'text-dark', 'text-decoration-none');
    linkItem.href = '#';
    linkItem.textContent = `${num}`;
    if (cur) {
        linkItem.style.backgroundColor = '#8181ff';
    }
    listItem.appendChild(linkItem);
    return listItem;
}

export async function displayPageControllers(data, pageStr) {
    const page = parseInt(pageStr);
    const pages = document.getElementById('pageForm');
    const size = parseInt(document.getElementById('size').value);
    while (pages.firstChild) {
        pages.removeChild(pages.firstChild);
    }
    const totalPages = data.pagination.count;
    const maxButtons = 7;

    const startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    let prev = createPageButton('<');
    prev.addEventListener('click', function () {
        if (page > 1) {
            handleSortPatients(page - 1, size);
        }
    });
    pages.appendChild(prev);

    for (let i = startPage; i <= endPage; i++) {
        let current = false;
        if (page === i) {
            current = true;
        }
        let btn = createPageButton(i, current);
        pages.appendChild(btn);
        btn.addEventListener('click', function () {
            const numberValue = parseInt(btn.textContent, 10);
            handleSortPatients(numberValue, size);
        })
    }
    let next = createPageButton('>');
    next.addEventListener('click', function () {
        if (page < totalPages) {
            handleSortPatients(page + 1, size);
        }
    });
    pages.appendChild(next);

}

export async function patientRegistration(){
    try {
        const formData = {
            name: document.getElementById('name').value,
            birthday: document.getElementById('birthday').value,
            gender: document.getElementById('mf').value,
        };

        debugger
        const response = await fetch(`${patientRegister}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData),
        });
        window.location.reload();

    }
    catch (error){
        console.error('Ошибка регистрации')
    }
}

async function updatePageFromUrl() {
    debugger
    const currentParams = new URLSearchParams(window.location.search);

    const conclusions = document.getElementById('conclusions');
    const authorInput = document.getElementById('authorName');
    const scheduledVisits = document.getElementById('scheduledVisits');
    const onlyMine = document.getElementById('onlyMine');
    const sortingSelect = document.getElementById('sortBy');
    const size = document.getElementById('size');

    const conclusionsFromUrl = currentParams.getAll('conclusions');
    const page = currentParams.get('page') || '1';
    size.value = currentParams.get('size') || '5';
    conclusions.value = currentParams.getAll('conclusions');
    authorInput.value = currentParams.get('name') || '';
    scheduledVisits.value = currentParams.get('scheduledVisits') === 'true';
    onlyMine.value = currentParams.get('onlyMine') === 'true';
    sortingSelect.value = currentParams.get('sorting') || '';

    const queryParams = new URLSearchParams();

    if (conclusionsFromUrl.length > 0) {
        conclusionsFromUrl.forEach(conclusionsId => {
            queryParams.append('conclusions', conclusionsId);
        });
    }
    authorInput.value.trim() !== "" ? queryParams.append('author', authorInput.value) : null;
    sortingSelect.value ? queryParams.append('sorting', sortingSelect.value) : null;
    scheduledVisits.checked !== undefined ? queryParams.append('scheduledVisits', scheduledVisits.checked) : null;
    onlyMine.checked !== undefined ? queryParams.append('onlyMine', onlyMine.checked) : null;
    page !== undefined ? queryParams.append('page', page) : null;
    size.value.trim() !== "" ? queryParams.append('size', size.value) : null;
    console.log(queryParams.toString());

    const fullUrl = `${getPatients}?${queryParams.toString()}`;

    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });

    if (response.ok) {
        const data = await response.json();
        const patientContainer = document.getElementById('own-patients');
        document.getElementById('patients-container').remove();
        const forPostsFiltered = document.createElement('div');
        forPostsFiltered.id = 'patients-container';
        patientContainer.prepend(forPostsFiltered);

        await displayPatients(data.patients);
        await displayPageControllers(data, page);
    } else {
        throw new Error("Ошибка в запросе");
    }
}





export async function initializePage(){
    await updatePageFromUrl();
}
import {getPatient, getPatients} from "../../curls.js";
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
    // postHTML.querySelector('#email').textContent = data.title;
    postHTML.querySelector('#gender').textContent += " " + gender;
    postHTML.querySelector('#birthday').innerHTML += " " + birthday;

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




export async function fillParamsOfPatient(id){
    try {
        const response = await fetch(`${getPatient}`)
    }
    catch (error){
        console.error("Ошибка в id пациента")
    }


}




export async function initializePage(){
    await handleSortPatients(1,5);
}
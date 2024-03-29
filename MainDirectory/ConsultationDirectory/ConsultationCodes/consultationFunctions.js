import {getDiagnosis, getInspWithCons} from "../../curls.js";
import {formatDateForServer} from "../../MainCodes/mainFunctions.js";

export async function handleSortInspections(page, size) {
    try {
        const MKB = document.getElementById('MKB');
        const selectedMKB = Array.from(MKB.selectedOptions).map(option => option.value);
        const showAll = document.getElementById('showAll').checked;


        const queryParams = new URLSearchParams();

        if(showAll === false){
            queryParams.append('grouped', true);
        }
        else{
            queryParams.append('grouped', false)
        }

        if (selectedMKB.length > 0) {
            for (const MKB of selectedMKB) {
                if(MKB !== 'undefined') {
                    queryParams.append('icdRoots', MKB);
                }
            }
        }

        page !== undefined ? queryParams.append('page', page) : null;
        size !== undefined ? queryParams.append('size', size) : null;


        const fullUrl = `${getInspWithCons}?${queryParams.toString()}`;

        history.pushState("","",`/consultation?${queryParams.toString()}`);

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            const postContainer = document.getElementById('own-inspections');
            document.getElementById('inspections-container').remove();
            const forPostsFiltered = document.createElement('div');
            forPostsFiltered.id = 'inspections-container';
            postContainer.prepend(forPostsFiltered);

            await displayInspections(data.inspections);

            await displayPageControllers(data, page);
        } else {
            throw new Error("Ошибка в запросе");
        }
    } catch (error) {
        console.error(`Ошибка фильтрации: ${error}`);
    }
}

async function checkConclusion(conclusion){
    switch (conclusion){
        case "Disease":{
            return 'Болезнь';
        }
        case "Recovery":{
            return 'Выздоровление';
        }
        case "Death":{
            return 'Смерть';
        }
    }

}

export async function createInspection(data) {
    const inspectionContainer = document.getElementById('inspections-container');

    const response = await fetch('/ConsultationDirectory/consultationInListCard.html');
    const postString = await response.text();
    const postHTML = document.createElement('div');
    const date = formatDateForServer(data.date);
    const final = await checkConclusion(data.conclusion);
    const mainDiagnosis = data.diagnosis.name;
    const doctor = data.doctor;

    postHTML.innerHTML = postString;
    console.log(data);
    if(final === 'Смерть'){
        postHTML.querySelector('#inspection').classList.replace('bg-light', 'bg-danger');
    }
    postHTML.querySelector('#inspectionDetails').addEventListener('click', async()=>{
        window.location.href=`/inspection/${data.id}`;
    });
    postHTML.querySelector('#date').textContent = date;
    postHTML.querySelector('#final').textContent += " " + final;
    postHTML.querySelector('#diagnose').innerHTML += " " + mainDiagnosis;
    postHTML.querySelector('#doctor').innerHTML += " " + doctor;
    inspectionContainer.appendChild(postHTML);

}

async function displayInspections(inspections) {
    console.log(inspections);
    for (const inspection of inspections) {
        try {
            await createInspection(inspection);
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
            handleSortInspections(page - 1, size);
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
            handleSortInspections(numberValue, size);
        })
    }
    let next = createPageButton('>');
    next.addEventListener('click', function () {
        if (page < totalPages) {
            handleSortInspections(page + 1, size);
        }
    });
    pages.appendChild(next);

}

async function updatePageFromUrl() {
    const currentParams = new URLSearchParams(window.location.search);
    debugger
    const MKB = document.getElementById('MKB');
    const groupBy = document.getElementById('groupBy');
    const showAll = document.getElementById('showAll');
    const size = document.getElementById('size');

    const page = currentParams.get('page') || '1';
    size.value = currentParams.get('size') || '5';
    MKB.value = currentParams.get('icdRoots')||'';
    showAll.value = currentParams.get('grouped') === 'true';
    groupBy.value = currentParams.get('grouped') === 'true';

    const queryParams = new URLSearchParams();

    MKB.value ? queryParams.append('icdRoots', MKB.value) : null;
    if(showAll === false){
        queryParams.append('grouped', true);
    }
    else{
        queryParams.append('grouped', false)
    }
    page !== undefined ? queryParams.append('page', page) : null;
    size.value.trim() !== "" ? queryParams.append('size', size.value) : null;
    console.log(queryParams.toString());

    const fullUrl = `${getInspWithCons}?${queryParams.toString()}`;
    debugger
    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });

    if (response.ok) {
        const data = await response.json();
        const patientContainer = document.getElementById('own-inspections');
        document.getElementById('inspections-container').remove();
        const forPostsFiltered = document.createElement('div');
        forPostsFiltered.id = 'inspections-container';
        patientContainer.prepend(forPostsFiltered);

        await displayInspections(data.inspections);
        await displayPageControllers(data, page);
    } else {
        throw new Error("Ошибка в запросе");
    }
}

async function getMKB(){

    const response = await fetch (`${getDiagnosis}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();

    return data;

}
export async function fillMKB(){
    try {

        const mkbSelect = document.getElementById("MKB");
        mkbSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = undefined;
        defaultOption.text = '--';
        mkbSelect.appendChild(defaultOption);
        const mkbList = await getMKB();
        mkbList.forEach(MKB => {
            const option = document.createElement('option');
            option.value = MKB.id;
            option.text = MKB.name;
            mkbSelect.appendChild(option);
        });
    }
    catch (error){
        console.error("Ошибка при получении пациента")
    }
}
export async function initializePage(){
    await updatePageFromUrl();
}
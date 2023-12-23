import {getPatients} from "../../curls.js";

async function updatePageFromUrl() {
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
        const postContainer = document.getElementById('own-posts');
        document.getElementById('posts-container').remove();
        const forPostsFiltred = document.createElement('div');
        forPostsFiltred.id = 'posts-container';
        postContainer.prepend(forPostsFiltred);

        await displayPosts(data.posts);
        await displayPageControllers(data, page);
    } else {
        throw new Error("Ошибка в запросе");
    }
}


export async function initializePage(){
    await updatePageFromUrl();
}
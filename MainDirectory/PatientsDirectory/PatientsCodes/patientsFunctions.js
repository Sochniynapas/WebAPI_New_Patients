import {getPatients} from "../../curls.js";


export async function createPost(data) {
    const token = localStorage.getItem('token');
    const postContainer = document.getElementById('posts-container');
    const likeIcon = data.hasLike ? '💜' : '🖤';
    const community = data.communityName ? ` в сообществе "${data.communityName}"` : "";
    const response = await fetch('../postView/postView.html');
    const postString = await response.text();
    const postHTML = document.createElement('div');
    const addressText = await getChain(data.addressId);
    postHTML.innerHTML = postString;

    postHTML.querySelector('#info').textContent = data.author + " - " + dateInNormalView(data.createTime)  + community;
    postHTML.querySelector('.title-text').textContent = data.title;
    postHTML.querySelector('#postText').textContent = data.description;
    postHTML.querySelector('#tagForm').innerHTML = `${data.tags.map(tag => `<span class="badge badge-secondary text-secondary" id="tag">#${tag.name}</span>`).join('')}`;
    postHTML.querySelector('.reading-time').textContent = "Время чтения: "+ data.readingTime + " мин.";
    if(addressText!=='') {
        postHTML.querySelector('.address').textContent = addressText;
        postHTML.querySelector('.address').classList.add('d-none');
    }
    postHTML.querySelector('#commentsCount').textContent = data.commentsCount;
    postHTML.querySelector('#likeCount').textContent = data.likes;
    postHTML.querySelector('#likeIcon').textContent = likeIcon;

    loadImage(data.image, (isValid) => {
        if (isValid) {
            postHTML.querySelector('#img').src = data.image;
            postHTML.querySelector('#img').classList.add('border', 'border-secondary')
        }
    })
    postContainer.appendChild(postHTML);
    const postText = postHTML.querySelector('#postText')
    const isTextOverflowing = postText.scrollHeight > postText.clientHeight;
    const readMoreBtn = postHTML.querySelector('.read-more-btn');
    const like = postHTML.querySelector('#likeIcon');
    const likeCounter = postHTML.querySelector('#likeCount');

    if (isTextOverflowing) {
        readMoreBtn.style.display = "block";
    }

    postHTML.querySelector('.title-text').addEventListener('click', async function () {
        console.log(localStorage.getItem('token'));
        window.location.href = `/post/${data.id}`;

    });
    like.addEventListener('click', async function () {
        if (like.textContent === '💜') {
            try {
                const response = await fetch(`https://blog.kreosoft.space/api/post/${data.id}/like`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    like.textContent = '🖤';
                    likeCounter.textContent = `${parseInt(likeCounter.textContent) - 1}`;
                }
            } catch (error) {
                console.error('Ошибка запроса')
            }

        } else {
            try {
                const response = await fetch(`https://blog.kreosoft.space/api/post/${data.id}/like`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    like.textContent = '💜';
                    likeCounter.textContent = `${parseInt(likeCounter.textContent) + 1}`;
                }
            } catch (error) {
                console.error('Ошибка запроса')
            }
        }
    });
    postContainer.addEventListener('click', async function (event) {
        let readMoreBtn = event.target.closest('.read-more-btn');
        if (readMoreBtn) {
            let postText = readMoreBtn.previousElementSibling;
            postText.classList.remove('clamp-6');
            readMoreBtn.style.display = "none";
        }
    });
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
}





export async function initializePage(){
    await updatePageFromUrl();
}
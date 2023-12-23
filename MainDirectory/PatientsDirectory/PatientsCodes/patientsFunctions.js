async function updatePageFromUrl() {
    const currentParams = new URLSearchParams(window.location.search);

    const tagsSelect = document.getElementById('tags');
    const authorInput = document.getElementById('authorName');
    const minInput = document.getElementById('readingTimeFrom');
    const maxInput = document.getElementById('readingTimeTo');
    const sortingSelect = document.getElementById('sortBy');
    const onlyMyCommunitiesCheckbox = document.getElementById('onlyMyGroups');
    const size = document.getElementById('size');

    const tagsFromUrl = currentParams.getAll('tags');
    const page = currentParams.get('page') || '1';
    size.value = currentParams.get('size') || '5';
    tagsSelect.value = currentParams.getAll('tags');
    authorInput.value = currentParams.get('author') || '';
    minInput.value = currentParams.get('min') || '';
    maxInput.value = currentParams.get('max') || '';
    sortingSelect.value = currentParams.get('sorting') || '';
    onlyMyCommunitiesCheckbox.checked = currentParams.get('onlyMyCommunities') === 'true';

    const queryParams = new URLSearchParams();
    if (tagsFromUrl.length > 0) {
        tagsFromUrl.forEach(tagId => {
            queryParams.append('tags', tagId);
        });
    }
    authorInput.value.trim() !== "" ? queryParams.append('author', authorInput.value) : null;
    console.log(currentParams.getAll('tags'));
    minInput.value.trim() !== "" ? queryParams.append('min', minInput.value) : null;
    maxInput.value.trim() !== "" ? queryParams.append('max', maxInput.value) : null;
    sortingSelect.value ? queryParams.append('sorting', sortingSelect.value) : null;
    onlyMyCommunitiesCheckbox.checked !== undefined ? queryParams.append('onlyMyCommunities', onlyMyCommunitiesCheckbox.checked) : null;
    page !== undefined ? queryParams.append('page', page) : null;
    size.value.trim() !== "" ? queryParams.append('size', size.value) : null;
    console.log(queryParams.toString());

    const fullUrl = `${getData}?${queryParams.toString()}`;

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
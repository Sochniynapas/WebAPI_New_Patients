export async function initializePage() {
    await updatePageFromUrl();
    await fetchTags();
}
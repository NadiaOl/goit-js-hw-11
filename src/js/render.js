
// функция для разметки 

function photoCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    return `
    <div class="photo-card">
        <div class="photo-item">
            <a href=${largeImageURL}>
                <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
            </a>
        </div>
        <div class="info">
            <p class="info-item"> ${likes}
                <b>Likes</b>
            </p>
            <p class="info-item"> ${views}
                <b>Views</b>
            </p>
            <p class="info-item"> ${comments}
                <b>Comments</b>
            </p>
            <p class="info-item"> ${downloads}
                <b>Downloads</b>
            </p>
        </div>
    </div>
        `
}

export {photoCard};

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import axios from 'axios';


// переменные
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34756592-add6791e980caa28afb1f7410';

let seekedPhoto = "";
let page = 1;
let photo = [];

const refs = {
    inputEl: document.querySelector('input'),
    buttonSubmitEl: document.querySelector('.search-form'),
    buttonShowMore: document.querySelector ('.load-more'),
    photoContainer: document.querySelector('.gallery')
}

// слушатели
refs.buttonSubmitEl.addEventListener('submit', hendlerSearch);
refs.buttonShowMore.addEventListener('click', hendlerShowMore);

// получаем ответ от бекэнда
function fetchPhoto() {
    return axios.get(`${BASE_URL}/?key=${KEY}&q=${seekedPhoto}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
}

// при нажатии на кнопку поиска
// -отменяем перезагрузку
// -выводим сообщение сколько нашли картинок
// -прячем кнопку Load more
// -рендерим разметку
// -отчищаем инпут

function hendlerSearch(event) {
    refs.photoContainer.innerHTML = "";
    page = 1;
    refs.buttonShowMore.classList.add('is-hidden');
    event.preventDefault();
    seekedPhoto = event.target.elements.searchQuery.value;
    fetchPhoto(seekedPhoto)
        .then( resp => {
            if (resp.data.totalHits !== 0) {
                Notify.success(`Hooray! We found ${resp.data.totalHits} images`)
                refs.buttonShowMore.classList.remove('is-hidden');
                return resp
            }
            else {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }
        })
        .then(renderPhotoCard)
        .catch((err) => {
            Notify.failure('Something went wrong :( Please, try again later');
            console.log(err)
        }
        )
    event.currentTarget.reset();
}

// при нажати на кнопку Load more
// -увеличиваем страницу
// -получаем след.страницу от бек-енда
// -если больше картинок нет либо их изначально меньше 40 выдодим сообщение и прячем кнопку
// -рендерим разметку

function hendlerShowMore(event) {
    page += 1;
    
    fetchPhoto(seekedPhoto)
        .then(resp => {
            if (Math.ceil(resp.data.totalHits / 40) === page || resp.data.totalHits < 40) {
                Notify.failure("We're sorry, but you've reached the end of search results.");
                refs.buttonShowMore.classList.add('is-hidden');
                return resp
            }
            return resp
        })
        .then(renderPhotoCard)
        .catch((err) => {
            Notify.failure('Something went wrong :( Please, try again later');
            console.log(err)
        })

}

// библиотека для больших картинок
var lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: "250"
});

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
// функция для рендера
// дополнительно вызываем функцию для библиотеки SimpleLightbox и плавного скрола
function renderPhotoCard(photo) {
    const photoArray = photo.data.hits.map(photoCard).join("");
    refs.photoContainer.insertAdjacentHTML("beforeend", photoArray)
    lightbox.refresh();
    smoothScroll();
}

// функция для плавного скрола
function smoothScroll() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 0.2,
        behavior: "smooth",
    });
};
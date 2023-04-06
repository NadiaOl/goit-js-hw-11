import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchPhoto } from './js/API';
import { photoCard } from './js/render.js';
import { refs } from './js/refs';
import { smoothScroll } from './js/smothScroll';

// переменные
let seekedPhoto = "";
let page = 1;

// слушатели
refs.buttonSubmitEl.addEventListener('submit', hendlerSearch);
refs.buttonShowMore.addEventListener('click', hendlerShowMore);

// при нажатии на кнопку поиска:
// отменяем перезагрузку, прячем кнопку Load more, проверяем инпут на "пустое поле"
// вызываем функцию рендера разметки, отчищаем инпут
async function hendlerSearch(event) {
    refs.photoContainer.innerHTML = "";
    refs.buttonShowMore.classList.add('is-hidden');
    event.preventDefault();
    seekedPhoto = event.target.elements.searchQuery.value.trim();
    if (seekedPhoto === "" || seekedPhoto === " ") {
            Notify.info('Enter a search value, please');
            event.target.reset();
            return
    };
    infoAndRenderOnSeach()
    event.target.reset();
    
}

// функция инфо-сообщения и рендер при поиске:
// получаем данные от бек-енда, выводим сообщение сколько нашли картинок, показываем кнопку Load more,
// рендерим разметку, библиотека SimpleLightbox с методом refresh, ловим ошибку 
async function infoAndRenderOnSeach() {
    try {
        page = 1;
        const arrayFetchPhoto = await fetchPhoto(seekedPhoto, page);
        if (arrayFetchPhoto.data.totalHits !== 0) {
            Notify.success(`Hooray! We found ${arrayFetchPhoto.data.totalHits} images`)
            refs.buttonShowMore.classList.remove('is-hidden');
        };

        if (arrayFetchPhoto.data.totalHits < 40) {
            refs.buttonShowMore.classList.add('is-hidden');
        };
        if (arrayFetchPhoto.data.totalHits === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        };
        const photoArray = await arrayFetchPhoto.data.hits.map(photoCard).join("");
        refs.photoContainer.insertAdjacentHTML("beforeend", await photoArray)
        lightbox.refresh();
    } catch (err)  {
            Notify.failure('Something went wrong :( Please, try again later');
            console.log(err)
        }
}

// при нажати на кнопку Load more:
// увеличиваем страницу, получаем след.страницу от бек-енда, если больше картинок нет либо их изначально меньше 40 
// выдодим сообщение и прячем кнопку, рендерим разметку

async function hendlerShowMore(event) {
    page = page + 1;
    try {
        const arrayAdditionalPhoto = await fetchPhoto(seekedPhoto, page);
        if (Math.ceil(arrayAdditionalPhoto.data.totalHits / 40) === page || arrayAdditionalPhoto.data.totalHits < 40) {
                Notify.failure("We're sorry, but you've reached the end of search results.");
                refs.buttonShowMore.classList.add('is-hidden');
            }
    const photoArray = await arrayAdditionalPhoto.data.hits.map(photoCard).join("");
    refs.photoContainer.insertAdjacentHTML("beforeend", await photoArray)
    lightbox.refresh();
        smoothScroll()
    } catch (err)  {
            Notify.failure('Something went wrong :( Please, try again later');
            console.log(err)
        }
}

// библиотека для больших картинок
var lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: "250"
});


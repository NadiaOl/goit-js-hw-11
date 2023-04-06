// функция для плавного скрола
function smoothScroll() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 3,
        behavior: "smooth",
    });
};

export { smoothScroll };
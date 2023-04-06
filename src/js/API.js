
import axios from 'axios';

// переменные
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34756592-add6791e980caa28afb1f7410';



//  получаем ответ от бекэнда
async function fetchPhoto(seekedPhoto, page) {
    const arraySearchPhoto = await axios.get(`${BASE_URL}/?key=${KEY}&q=${seekedPhoto}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
    return arraySearchPhoto
}

export { fetchPhoto };
    


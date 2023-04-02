import axios from 'axios';

const KEY = '34917594-54f63cc7e31052419aaab69d2';
const URL = 'https://pixabay.com/api/';

async function fetchPicture (name, page) {
    const response = await axios.get(`${URL}?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20&page=${page}`)
    return response.data.hits;
}

export default { fetchPicture };
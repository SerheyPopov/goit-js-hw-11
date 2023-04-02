import API from './api';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const searchPicture = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const markupCard = document.querySelector('.gallery');

searchPicture.addEventListener('submit', SearchForm);
loadMoreBtn.addEventListener('click', moreBtnSearch);

let inputQuery = '';
let page = 1;
let hits = '';

btnDisabled()

//------------------------fn search form-------------------
async function SearchForm(evt) {
    evt.preventDefault();
  inputQuery = evt.currentTarget.elements.searchQuery.value;
  formReset()
  btnDisabled()
  if (!inputQuery) { 
    return
  }

  try {
    hits = await API.fetchPicture(inputQuery, 1)
    if (hits.length === 0) {
      Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
      return
    }
    
    createImagesMarkup() 
    btnEnabled()
   
   } catch (error) {
    console.log(error)
  }
}

//------------------------fn button more--------------------------
async function moreBtnSearch() {
  try {
    hits = await API.fetchPicture(inputQuery, (page += 1))
    createImagesMarkup() 
    if (hits.length === 0) {
      btnDisabled() 
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }

  } catch (error) {
    console.log(error)
  }
}

//---------------------fn markup building---------------------
function markup() {
  const markup = hits.reduce((markup, hit) => createMarkup(hit) + markup, "");
  return markup
}

//--------------------fn markup create-------------------------
function createMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `
<div class="photo-card">
<a class="thumb" href ="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="420" height="320"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div> 
`;
}

//--------------------fn install markup--------------------
function createImagesMarkup() {
  markupCard.insertAdjacentHTML("beforeend", markup());
  refreshGallery()
}

//------------------fn refresh lightbox--------------------
function refreshGallery() {
  lightbox.refresh();
}

//-------------------fn disabled button----------------------
function btnDisabled() {
  loadMoreBtn.disabled = true;
  loadMoreBtn.classList.add("in-hidden");
}

//-------------------fn enabled button----------------------
function btnEnabled() {
  loadMoreBtn.disabled = false;
  loadMoreBtn.classList.remove("in-hidden");
}

//-------------------fn reset-----------------------------
function formReset() {
    markupCard.innerHTML = '';
}






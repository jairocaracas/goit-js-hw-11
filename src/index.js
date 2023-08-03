import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputButton = document.querySelector('.search-form > input');
const searchButton = document.querySelector('.search-form > button');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.loadBtn');

const API_KEY = '12207692-143a0718f8f30eb8f1139c254';

let page;
let totalPages;

loadMoreButton.style.display = 'none';

searchButton.addEventListener('click', async e => {
  e.preventDefault();
  gallery.innerHTML = ' ';
  page = 1;

  if (inputButton.value !== '') {
    let images = await fetchImages(inputButton.value, page);
    totalPages = Math.ceil(images.totalHits / 40);

    if (page <= totalPages) {
      renderImages(images);
      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
      loadMoreButton.style.display = 'inline-block';
    } else {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.style.display = 'none';
    }
  } else {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
});

loadMoreButton.addEventListener('click', async e => {
  e.preventDefault();
  page++;
  if (page <= totalPages) {
    let images = await fetchImages(inputButton.value, page);
    renderImages(images);
  } else {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreButton.style.display = 'none';
  }
});

async function renderImages(images) {
  let renderImages = await [...images.hits].map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card">
      <a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
<div class="info">
  <p class="info-item">
    <b>Likes:</b> <br/> ${likes}
  </p>
  <p class="info-item">
    <b>Views: </b> <br/> ${views}
  </p>
  <p class="info-item">
    <b>Comments: </b> <br/> ${comments}
  </p>
  <p class="info-item">
    <b>Downloads: </b> <br/> ${downloads}
  </p>
</div>
</div>`;
    }
  );
  gallery.innerHTML += renderImages.join(' ');
  new SimpleLightbox('.gallery a');
}

async function fetchImages(name, page) {
  try {
    const response = await axios.get(
      'https://pixabay.com/api/?key=' +
        API_KEY +
        '&q=' +
        encodeURIComponent(name) +
        '&image_type=photo&orientation=horizontal&safesearch=true&page=' +
        page +
        '&per_page=40'
    );
    return response.data;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(error);
  }
}

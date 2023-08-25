import axios from 'axios';
import Notiflix from 'notiflix';
import { createImageCard } from './card';

const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39035675-aa57939432b499989b05c1345';
let currentPage = 1;
let currentQuery = '';

export async function fetchImages(query, page, lightbox) {
    try {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`);
        const data = response.data;

        if (data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }

        if (page === 1) {
            const totalHits = data.totalHits;
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            gallery.innerHTML = '';
        }

        data.hits.forEach(image => {
            const card = createImageCard(image);
            gallery.appendChild(card);
        });

        if (data.totalHits > gallery.children.length) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.dataset.page = page;
        } else {
            loadMoreBtn.style.display = 'none';
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }

        currentPage += 1;

        const lightbox = new SimpleLightbox('.gallery a', {});
      lightbox.refresh();

        const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });

        lightbox.refresh();

    } catch (error) {
        console.error('An error occurred:', error);
        Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
    }
}

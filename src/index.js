import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './gallery';

const form = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
let currentQuery = '';

// Форма пошуку
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  currentPage = 1;
  currentQuery = event.target.searchQuery.value.trim();

    // перевірка на пробіли в пошуку
    if (currentQuery.length === 0) {
        Notiflix.Notify.failure('Please enter a valid search term.');
        return;
    }
  
  gallery.innerHTML = ''; 

    await fetchImages(currentQuery, 1);
});

// "load more" button 
// async function fetchMoreImages() {
//     await fetchImages();
//     window.scrollTo({
//         top: document.body.scrollHeight,
//         behavior: 'smooth'
//     });
// }



loadMoreBtn.addEventListener('click', fetchImages);

const observerOptions = {
    // root: null, // Область, яка використовується для відслідковування, за замовчуванням вся сторінка
    rootMargin: '0px',
    threshold: 0.5 // Порогове значення від 0 до 1
};

const observer = new IntersectionObserver(handleIntersect, observerOptions);

function handleIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
          currentPage +=1
            fetchImages(currentQuery, currentPage);
        }
    });
}

observer.observe(loadMoreBtn);

const lightbox = new SimpleLightbox('.gallery a', {});
lightbox.refresh();
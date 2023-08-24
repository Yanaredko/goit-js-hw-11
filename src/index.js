import axios from 'axios'; 
import Notiflix from 'notiflix'; 
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '39035675-aa57939432b499989b05c1345';
const BASE_URL = 'https://pixabay.com/api/';
let currentPage = 1;
let currentQuery = '';

const observer = new IntersectionObserver(handleIntersect, { threshold: 0.5 });

// Форма пошуку
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    currentPage = 1; // скидання сторінки при новому пошуку
    currentQuery = event.target.searchQuery.value.trim();
    
    // перевірка на пробіли в пошуку
    if (currentQuery.length === 0) {
        Notiflix.Notify.failure('Please enter a valid search term.');
        return;
    }

  gallery.innerHTML = ''; // очищення галереї перед нов пошуком
  
  await fetchImages();
});

// "load more" button 
loadMoreBtn.addEventListener('click', fetchImages);

observer.observe(loadMoreBtn);

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchImages();
    }
  });
}

// отримання і відображ зображ
async function fetchImages() {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${currentQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}`);
    const data = response.data;

    if (data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
      
    if (currentPage === 1) {
      const totalHits = data.totalHits;
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    data.hits.forEach(image => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });

    if (data.totalHits > gallery.children.length) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }

      currentPage += 1; // поточна сторінка +1
      
      const lightbox = new SimpleLightbox('.gallery a', {});
      lightbox.refresh();

      // плавна прокрутка
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

  } catch (error) {
    console.error('An error occurred:', error);
    Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
  }
}

// async function fetchMoreImages() {
//     await fetchImages();
//     window.scrollTo({
//         top: document.body.scrollHeight,
//         behavior: 'smooth'
//     });
// }

// розмітка картки зображення 
function createImageCard(image) {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const link = document.createElement('a');
    link.href = image.largeImageURL;
    link.setAttribute('data-lightbox', 'gallery');
    link.setAttribute('data-title', image.tags);

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const infoItems = ['Likes', 'Views', 'Comments', 'Downloads'];
    infoItems.forEach(item => {
        const p = document.createElement('p');
        p.classList.add('info-item');
        p.innerHTML = `<b>${item}:</b> ${image[item.toLowerCase()]}`;
        info.appendChild(p);
  });

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(info);

  return card;
}
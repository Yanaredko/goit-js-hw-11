export function createImageCard(image) {
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
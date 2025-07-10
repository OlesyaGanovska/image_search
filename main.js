const API_KEY = '51230625-b5d3acd506da8d3a8e799dfc5'; 
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const showFavoritesBtn = document.getElementById('show-favorites');
const backToSearchBtn = document.getElementById('back-to-search');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

let favorites = [];
let query = '';
let page = 1;

searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  query = searchInput.value.trim();
  if (query) {
    page = 1;
    fetchImages(query, page);
  }
});

function fetchImages(query, page) {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=12&page=${page}`;

  gallery.innerHTML = '';
  pageInfo.textContent = `Page ${page}`;

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      data.hits.forEach(image => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('image-wrapper');

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;

        img.addEventListener('click', () => openModal(image));

        const favBtn = document.createElement('button');
        favBtn.classList.add('favorite-btn');
        favBtn.textContent = '⭐';
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          addToFavorites(image);
        });

        wrapper.appendChild(img);
        wrapper.appendChild(favBtn);
        gallery.appendChild(wrapper);
      });

      prevPageBtn.style.display = 'inline';
      nextPageBtn.style.display = 'inline';
      pageInfo.style.display = 'inline';
    });
}

function addToFavorites(image) {
  if (!favorites.some(fav => fav.id === image.id)) {
    favorites.push(image);
    alert('Added to favorites!');
  } else {
    alert('Already in favorites!');
  }
}

showFavoritesBtn.addEventListener('click', function () {
  renderFavorites();
});

function renderFavorites() {
  gallery.innerHTML = '';

  if (favorites.length === 0) {
    gallery.innerHTML = '<p>No favorites yet.</p>';
  } else {
    favorites.forEach(image => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('image-wrapper');

      const img = document.createElement('img');
      img.src = image.webformatURL;
      img.alt = image.tags;

      img.addEventListener('click', () => openModal(image));

      wrapper.appendChild(img);
      gallery.appendChild(wrapper);
    });
  }

  backToSearchBtn.style.display = 'inline';

  prevPageBtn.style.display = 'none';
  nextPageBtn.style.display = 'none';
  pageInfo.style.display = 'none';
}

backToSearchBtn.addEventListener('click', function () {
  gallery.innerHTML = '';
  backToSearchBtn.style.display = 'none';
  if (query) {
    fetchImages(query, page);
  }
});

prevPageBtn.addEventListener('click', function () {
  if (page > 1) {
    page--;
    fetchImages(query, page);
  }
});

nextPageBtn.addEventListener('click', function () {
  page++;
  fetchImages(query, page);
});

function openModal(image) {
  modalContent.innerHTML = `
    <img src="${image.largeImageURL}" alt="${image.tags}" style="max-width: 90%; max-height: 80vh;">
    <p>Author: ${image.user}</p>
    <p>Tags: ${image.tags}</p>
    <p>Likes: ${image.likes}</p>
    <p>Downloads: ${image.downloads}</p>
  `;
  modal.style.display = 'block';
}

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
  }
});

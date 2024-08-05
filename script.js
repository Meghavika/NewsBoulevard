const API_KEY = "b5d07174718342eaa56f2c42099c8261";
const url = "https://newsapi.org/v2/everything?q=";
let currentQuery = "India";
let currentPage = 1;
let isLoading = false;

window.addEventListener('load', () => fetchNews(currentQuery));

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
        currentPage++;
        fetchNews(currentQuery, currentPage);
    }
});

function reload() {
    window.location.reload();
}

async function fetchNews(query, page = 1) {
    isLoading = true;
    toggleLoadingSpinner(true);
    try {
        const res = await fetch(`${url}${query}&page=${page}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
        bindData(data.articles, page === 1);
    } catch (error) {
        console.error('Error fetching news:', error);
        displayError('Error fetching news. Please try again later.');
    } finally {
        isLoading = false;
        toggleLoadingSpinner(false);
    }
}

function bindData(articles, clearPrevious = false) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    if (clearPrevious) {
        cardsContainer.innerHTML = "";
    }

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    });

    newsSource.innerHTML = `${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function displayError(message) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

function toggleLoadingSpinner(show) {
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = show ? 'block' : 'none';
}

let curSelectNav = null;
function onNavItemClick(id) {
    currentQuery = id;
    currentPage = 1;
    fetchNews(currentQuery, currentPage);
    const navItem = document.getElementById(id);
    curSelectNav?.classList.remove('active');
    curSelectNav = navItem;
    curSelectNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    currentQuery = query;
    currentPage = 1;
    fetchNews(currentQuery, currentPage);
    curSelectNav?.classList.remove('active');
    curSelectNav = null;
});

const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    modeToggle.innerText = document.body.classList.contains('dark-mode') ? 'Toggle Light Mode' : 'Toggle Dark Mode';
});

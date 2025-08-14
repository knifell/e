const API_URL = 'http://localhost:1337/api/News?populate=image';

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const newsListView = document.querySelector('.news-list-view');
    const newsFullView = document.querySelector('.news-full-view');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Show a specific section
    function showSection(targetId) {
        sections.forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(targetId).style.display = 'block';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            showSection(target);
            navMenu.classList.remove('active'); // Close menu on mobile
        });
    });

    // Handle info cards on the home page
    const infoCards = document.querySelectorAll('.home-grid .info-card[data-target]');
    infoCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            showSection(target);
        });
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fetch and display news from Strapi
    async function fetchNews() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const {
                data
            } = await response.json();
            displayNewsList(data);
        } catch (error) {
            console.error("Error fetching news:", error);
            newsListView.innerHTML = '<p>Не удалось загрузить новости. Пожалуйста, попробуйте позже.</p>';
        }
    }

    // Render the list of news
    function displayNewsList(newsItems) {
        newsListView.innerHTML = ''; // Clear previous content
        newsFullView.innerHTML = ''; // Clear full article view
        newsListView.style.display = 'grid'; // Show the list view

        newsItems.sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date));

        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';

        newsItems.forEach(item => {
            const newsData = item.attributes;
            const newsItemEl = document.createElement('div');
            newsItemEl.className = 'news-item';

            const imageUrl = newsData.image.data ? `http://localhost:1337${newsData.image.data.attributes.url}` : 'https://via.placeholder.com/300x200?text=Нет+изображения';

            newsItemEl.innerHTML = `
                <img src="${imageUrl}" alt="${newsData.title}" loading="lazy" width="300" height="200">
                <div class="news-content">
                    <h3>${newsData.title}</h3>
                    <p class="news-date">${new Date(newsData.date).toLocaleDateString('ru-RU')}</p>
                    <p class="news-summary">${newsData.description}</p>
                    <button class="read-more-btn" data-id="${item.id}">Читать далее...</button>
                </div>
            `;
            newsGrid.appendChild(newsItemEl);
        });
        newsListView.appendChild(newsGrid);
    }

    // Display a single full article
    function displayFullArticle(item) {
        const newsData = item.attributes;
        const imageUrl = newsData.image.data ? `http://localhost:1337${newsData.image.data.attributes.url}` : 'https://via.placeholder.com/600x400?text=Нет+изображения';

        newsFullView.innerHTML = `
            <div id="news-${item.id}" class="full-article">
                <h3>${newsData.title}</h3>
                <p class="news-date">${new Date(newsData.date).toLocaleDateString('ru-RU')}</p>
                <img src="${imageUrl}" alt="${newsData.title}" loading="lazy" class="full-article-photo" width="600" height="400">
                <p>${newsData.content}</p>
                <button class="back-to-news-btn">Закрыть</button>
            </div>
        `;
        newsListView.style.display = 'none'; // Hide the list
        newsFullView.style.display = 'block'; // Show the full article

        // Add event listener for the back button
        newsFullView.querySelector('.back-to-news-btn').addEventListener('click', () => {
            newsFullView.style.display = 'none';
            newsListView.style.display = 'grid';
        });
    }

    // Handle clicks on "Read more" buttons
    newsListView.addEventListener('click', async (e) => {
        if (e.target.classList.contains('read-more-btn')) {
            const newsId = e.target.getAttribute('data-id');
            try {
                const response = await fetch(`http://localhost:1337/api/articles/${newsId}?populate=image`);
                const { data } = await response.json();
                if (data) {
                    displayFullArticle(data);
                }
            } catch (error) {
                console.error("Error fetching full article:", error);
            }
        }
    });

    // Initial page load
    showSection('home');
    fetchNews();
});
document.addEventListener('DOMContentLoaded', () => {

    const newsListView = document.querySelector('.news-list-view');
    const newsFullView = document.querySelector('.news-full-view');

    // Функция для загрузки и отображения списка новостей
    const fetchNews = async () => {
        try {
            const response = await fetch('http://localhost:1337/api/News?populate=image');
            if (!response.ok) {
                throw new Error('Сетевая ошибка при загрузке новостей.');
            }
            const data = await response.json();
            displayNews(data.data);
        } catch (error) {
            console.error('Ошибка при загрузке новостей:', error);
            newsListView.innerHTML = '<p>Не удалось загрузить новости. Пожалуйста, попробуйте позже.</p>';
        }
    };

    // Функция для отображения списка новостей
    const displayNews = (articles) => {
        newsListView.innerHTML = '';
        if (articles && articles.length > 0) {
            const newsGrid = document.createElement('div');
            newsGrid.className = 'news-grid';

            articles.forEach(article => {
                const imageUrl = article.attributes.image?.data?.attributes?.url ? `http://localhost:1337${article.attributes.image.data.attributes.url}` : 'images/placeholder-news.jpg';
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <img src="${imageUrl}" alt="${article.attributes.title}" loading="lazy" width="100%" height="200">
                    <div style="padding: 15px;">
                        <h3 class="news-title">${article.attributes.title}</h3>
                        <p class="news-date">${new Date(article.attributes.date).toLocaleDateString('ru-RU')}</p>
                        <p>${article.attributes.description}</p>
                    </div>
                    <a href="#" class="read-more-btn" data-id="${article.id}">Подробнее</a>
                `;
                newsGrid.appendChild(newsItem);
            });
            newsListView.appendChild(newsGrid);
        } else {
            newsListView.innerHTML = '<p>На данный момент новостей нет.</p>';
        }
    };

    // Функция для отображения полной статьи
    const showFullArticle = (article) => {
        newsFullView.style.display = 'block';
        newsListView.style.display = 'none';

        const imageUrl = article.attributes.image?.data?.attributes?.url ? `http://localhost:1337${article.attributes.image.data.attributes.url}` : 'images/placeholder-news.jpg';
        newsFullView.innerHTML = `
            <div class="full-article">
                <button class="back-to-news-btn">← Все новости</button>
                <h3>${article.attributes.title}</h3>
                <p class="news-date" style="text-align: center;">${new Date(article.attributes.date).toLocaleDateString('ru-RU')}</p>
                <img src="${imageUrl}" alt="${article.attributes.title}" class="full-article-photo">
                <div class="full-article-content">
                    <p>${article.attributes.content}</p>
                </div>
            </div>
        `;
        document.querySelector('.back-to-news-btn').addEventListener('click', () => {
            newsFullView.style.display = 'none';
            newsListView.style.display = 'grid';
        });
    };

    // Обработка кликов по кнопке "Подробнее"
    newsListView.addEventListener('click', async (e) => {
        if (e.target.classList.contains('read-more-btn')) {
            e.preventDefault();
            const articleId = e.target.dataset.id;
            try {
                const response = await fetch(`http://localhost:1337/api/News/${articleId}?populate=image`);
                if (!response.ok) {
                    throw new Error('Сетевая ошибка при загрузке статьи.');
                }
                const data = await response.json();
                showFullArticle(data.data);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Ошибка при загрузке статьи:', error);
            }
        }
    });

    // Запускаем загрузку новостей при загрузке страницы
    fetchNews();

});
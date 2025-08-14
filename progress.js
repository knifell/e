document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('progress-search');
    const filterButtons = document.querySelectorAll('.filters .filter-btn');
    const progressCards = document.querySelectorAll('.progress-item');
    const sectionTitles = document.querySelectorAll('.progress-section-title');

    let activeCategoryFilter = 'all';

    const filterAndSearchCards = () => {
        const searchQuery = searchInput.value.toLowerCase();

        // Сначала скрываем все заголовки разделов
        sectionTitles.forEach(title => title.style.display = 'none');

        const visibleCategories = new Set();

        progressCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardContent = card.textContent.toLowerCase();

            const matchesCategory = (activeCategoryFilter === 'all' || cardCategory === activeCategoryFilter);
            const matchesSearch = cardContent.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                visibleCategories.add(cardCategory);
            } else {
                card.style.display = 'none';
            }
        });

        // Показываем только те заголовки, у которых есть видимые проекты
        sectionTitles.forEach(title => {
            const titleCategory = title.getAttribute('data-category-heading');
            if (visibleCategories.has(titleCategory)) {
                title.style.display = 'block';
            }
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            activeCategoryFilter = button.getAttribute('data-filter');

            // Убираем класс 'active' у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем класс 'active' к нажатой кнопке
            button.classList.add('active');

            filterAndSearchCards();
        });
    });

    searchInput.addEventListener('input', filterAndSearchCards);
});
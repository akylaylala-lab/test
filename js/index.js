/**
 * Light Fox Manga - Главная страница
 * Логика для главной страницы: карусель, секции контента
 */

// Состояние карусели
let currentSlide = 0;
let carouselInterval;

// Образцы новостей
const newsData = [
    {
        id: 1,
        title: "Новая система донатов запущена!",
        excerpt: "Теперь вы можете поддерживать любимые тайтлы и ускорить выход новых глав. Каждый донат приближает вас к новому контенту!",
        date: "2025-01-15",
        tag: "Обновление"
    },
    {
        id: 2,
        title: "Добавлено 50+ новых тайтлов",
        excerpt: "В каталог добавлены популярные манхва и маньхуа. Откройте для себя новые захватывающие истории!",
        date: "2025-01-14",
        tag: "Каталог"
    },
    {
        id: 3,
        title: "Улучшена система уведомлений",
        excerpt: "Теперь вы будете получать уведомления о новых главах ваших любимых тайтлов быстрее и надежнее.",
        date: "2025-01-13",
        tag: "Функции"
    }
];

/**
 * ========================================
 * УПРАВЛЕНИЕ КАРУСЕЛЬЮ
 * ========================================
 */

function createCarousel() {
    if (!window.MangaAPI) return;

    const allManga = window.MangaAPI.getAllManga();
    const featuredManga = allManga.slice(0, 5); // Топ 5 манги для карусели

    const carouselContainer = document.getElementById('heroCarousel');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    if (!carouselContainer || !indicatorsContainer) return;

    // Создание слайдов
    carouselContainer.innerHTML = featuredManga.map((manga, index) => `
        <div class="carousel-slide ${index === 0 ? 'active' : ''}" 
             style="background-image: url('${manga.image || 'https://via.placeholder.com/1200x450/FF8A50/FFFFFF?text=' + encodeURIComponent(manga.title)}')">
            <div class="slide-overlay"></div>
            <div class="slide-content">
                <h1 class="slide-title">${manga.title}</h1>
                <p class="slide-description">${manga.description || 'Захватывающая история, которая не оставит вас равнодушными.'}</p>
                <div class="slide-meta">
                    <span class="slide-badge">${manga.type}</span>
                    <span class="slide-badge">⭐ ${manga.rating}</span>
                    <span class="slide-badge">Глав: ${manga.availableEpisodes}/${manga.totalEpisodes}</span>
                </div>
                <div class="slide-actions">
                    <a href="player.html?id=${manga.id}" class="btn btn-primary">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        Читать
                    </a>
                    <a href="#" class="btn btn-secondary" onclick="addToFavorites('${manga.id}')">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        В избранное
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    // Создание индикаторов
    indicatorsContainer.innerHTML = featuredManga.map((_, index) => `
        <div class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
    `).join('');

    // Запуск автопроигрывания
    startCarousel();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    const totalSlides = document.querySelectorAll('.carousel-slide').length;
    if (totalSlides === 0) return;
    
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
}

function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000);
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

/**
 * ========================================
 * РЕНДЕРИНГ КАРТОЧЕК МАНГИ
 * ========================================
 */

function renderMangaCard(manga, showBadge = '') {
    const timeAgo = manga.updatedAt ? window.CommonUtils.formatTime(manga.updatedAt) : window.CommonUtils.formatTime(new Date());
    
    return `
        <div class="manga-card" onclick="window.location.href='player.html?id=${manga.id}'">
            <div class="card-image-container">
                <img src="${manga.image || 'https://via.placeholder.com/300x400/FF8A50/FFFFFF?text=' + encodeURIComponent(manga.title.charAt(0))}" 
                     alt="${manga.title}" 
                     class="card-image"
                     onerror="this.src='https://via.placeholder.com/300x400/FF8A50/FFFFFF?text=' + encodeURIComponent('${manga.title.charAt(0)}')">
                <div class="card-badges">
                    ${manga.rating ? `<span class="badge rating">⭐ ${manga.rating}</span>` : ''}
                    ${showBadge === 'new' ? '<span class="badge new">НОВОЕ</span>' : ''}
                    ${showBadge === 'hot' ? '<span class="badge hot">ХИТ</span>' : ''}
                    ${showBadge === 'updated' ? '<span class="badge updated">UPD</span>' : ''}
                </div>
            </div>
            <div class="card-info">
                <h3 class="card-title">${manga.title}</h3>
                <div class="card-meta">
                    <span class="card-chapters">Глав: ${manga.availableEpisodes || 0}/${manga.totalEpisodes || 0}</span>
                    <span class="card-type">${manga.type}</span>
                </div>
                <div class="card-time">${timeAgo}</div>
            </div>
        </div>
    `;
}

/**
 * ========================================
 * ЗАГРУЗКА СЕКЦИЙ КОНТЕНТА
 * ========================================
 */

function loadHotNew() {
    if (!window.MangaAPI) return;

    const allManga = window.MangaAPI.getAllManga();
    const hotNew = allManga
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 8);

    const grid = document.getElementById('hotNewGrid');
    if (grid) {
        grid.innerHTML = hotNew.map(manga => renderMangaCard(manga, 'new')).join('');
    }
}

function loadPopular() {
    if (!window.MangaAPI) return;

    const allManga = window.MangaAPI.getAllManga();
    const popular = allManga
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 8);

    const grid = document.getElementById('popularGrid');
    if (grid) {
        grid.innerHTML = popular.map(manga => renderMangaCard(manga, 'hot')).join('');
    }
}

function loadNews() {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    
    grid.innerHTML = newsData.map(news => `
        <div class="news-card">
            <h3 class="news-title">${news.title}</h3>
            <p class="news-excerpt">${news.excerpt}</p>
            <div class="news-meta">
                <span class="news-tag">${news.tag}</span>
                <span>${window.CommonUtils.formatTime(news.date)}</span>
            </div>
        </div>
    `).join('');
}

function loadRecentUpdates() {
    if (!window.MangaAPI) return;

    const allManga = window.MangaAPI.getAllManga();
    const recentUpdates = allManga
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
        .slice(0, 10);

    const list = document.getElementById('updatesList');
    if (!list) return;
    
    list.innerHTML = recentUpdates.map(manga => `
        <div class="update-item" onclick="window.location.href='player.html?id=${manga.id}'">
            <img src="${manga.image || 'https://via.placeholder.com/60x80/FF8A50/FFFFFF?text=' + encodeURIComponent(manga.title.charAt(0))}" 
                 alt="${manga.title}" 
                 class="update-image"
                 onerror="this.src='https://via.placeholder.com/60x80/FF8A50/FFFFFF?text=' + encodeURIComponent('${manga.title.charAt(0)}')">
            <div class="update-content">
                <h4 class="update-title">${manga.title}</h4>
                <p class="update-chapter">Глава ${manga.availableEpisodes || 1} • ${manga.type}</p>
                <p class="update-time">${window.CommonUtils.formatTime(manga.updatedAt || manga.createdAt || new Date())}</p>
            </div>
        </div>
    `).join('');
}

/**
 * ========================================
 * ДЕЙСТВИЯ ПОЛЬЗОВАТЕЛЯ
 * ========================================
 */

function addToFavorites(mangaId) {
    if (!window.MangaAPI) return;
    
    const manga = window.MangaAPI.getMangaById(mangaId);
    if (!manga) return;

    const mangaForStorage = {
        id: Date.now(),
        mangaId: manga.id,
        title: manga.title,
        image: manga.image,
        totalEpisodes: manga.totalEpisodes,
        availableEpisodes: manga.availableEpisodes,
        status: manga.status,
        rating: manga.rating,
        addedAt: new Date().toISOString()
    };

    const currentList = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Удаляем если уже есть
    const filtered = currentList.filter(item => item.mangaId !== manga.id);
    
    // Добавляем новую запись
    filtered.push(mangaForStorage);
    
    localStorage.setItem('favorites', JSON.stringify(filtered));
    
    window.CommonUtils.showNotification('Добавлено в избранное', 'success');
}

/**
 * ========================================
 * ИНИЦИАЛИЗАЦИЯ ГЛАВНОЙ СТРАНИЦЫ
 * ========================================
 */

function initializeHomepage() {
    createCarousel();
    loadHotNew();
    loadPopular();
    loadNews();
    loadRecentUpdates();
}

/**
 * ========================================
 * ОБРАБОТЧИКИ СОБЫТИЙ
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ждем загрузки данных
    if (window.MangaAPI) {
        initializeHomepage();
    } else {
        // Слушаем событие готовности данных
        window.addEventListener('mangaDataReady', initializeHomepage);
    }

    // Паузим карусель при наведении
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopCarousel);
        heroSection.addEventListener('mouseleave', startCarousel);
    }
});

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', function() {
    stopCarousel();
});

// Экспорт функций для глобального использования
window.goToSlide = goToSlide;
window.addToFavorites = addToFavorites;

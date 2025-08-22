/**
 * Light Fox Manga - Общая функциональность
 * Содержит функции, используемые на всех страницах
 */

// Глобальные состояния
let isDark = localStorage.getItem('theme') === 'dark';
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

/**
 * ========================================
 * УПРАВЛЕНИЕ ТЕМОЙ
 * ========================================
 */

function updateTheme() {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Обновление всех иконок переключения темы
    const updateIcons = (moonClass, sunClass) => {
        const moonIcons = document.querySelectorAll(moonClass);
        const sunIcons = document.querySelectorAll(sunClass);
        
        moonIcons.forEach(icon => {
            icon.style.display = isDark ? 'none' : 'block';
        });
        
        sunIcons.forEach(icon => {
            icon.style.display = isDark ? 'block' : 'none';
        });
    };
    
    updateIcons('.moon-icon', '.sun-icon');
    updateIcons('.mobile-moon-icon', '.mobile-sun-icon');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function toggleTheme() {
    isDark = !isDark;
    updateTheme();
}

/**
 * ========================================
 * УПРАВЛЕНИЕ ЯЗЫКОМ
 * ========================================
 */

function updateLanguage(lang) {
    localStorage.setItem('language', lang);
    
    // Синхронизация всех селекторов языка
    const langSwitch = document.getElementById('langSwitch');
    const mobileLangSwitch = document.getElementById('mobileLangSwitch');
    
    if (langSwitch) langSwitch.value = lang;
    if (mobileLangSwitch) mobileLangSwitch.value = lang;
}

/**
 * ========================================
 * АУТЕНТИФИКАЦИЯ
 * ========================================
 */

function updateAuthState() {
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (isLoggedIn && currentUser) {
        if (authSection) authSection.style.display = 'none';
        if (userSection) userSection.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
        
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
    } else {
        if (authSection) authSection.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function login() {
    const name = prompt('Введите ваше имя:') || 'Пользователь';
    const email = prompt('Введите ваш email:') || 'user@example.com';
    
    if (name && email) {
        currentUser = { name, email };
        isLoggedIn = true;
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateAuthState();
        closeMenu();
        
        showNotification(`Добро пожаловать, ${name}!`, 'success');
    }
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        isLoggedIn = false;
        currentUser = null;
        
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        
        updateAuthState();
        closeMenu();
        
        showNotification('Вы успешно вышли из системы', 'success');
    }
}

/**
 * ========================================
 * УПРАВЛЕНИЕ МЕНЮ
 * ========================================
 */

function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (sideMenu && menuOverlay) {
        sideMenu.classList.toggle('open');
        menuOverlay.classList.toggle('show');
    }
}

function closeMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (sideMenu && menuOverlay) {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('show');
    }
}

/**
 * ========================================
 * СЛУЧАЙНАЯ МАНГА
 * ========================================
 */

function openRandomManga() {
    if (window.MangaAPI) {
        const allManga = window.MangaAPI.getAllManga();
        if (allManga.length > 0) {
            const randomManga = allManga[Math.floor(Math.random() * allManga.length)];
            window.location.href = `player.html?id=${randomManga.id}`;
        } else {
            showNotification('Каталог пуст. Добавьте тайтлы через админку!', 'error');
        }
    } else {
        showNotification('Система данных не загружена', 'error');
    }
}

/**
 * ========================================
 * УТИЛИТЫ
 * ========================================
 */

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function formatTime(date) {
    const now = new Date();
    const time = new Date(date);
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} дн назад`;
    
    return time.toLocaleDateString('ru-RU');
}

// ========================================
// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ
// ========================================

/**
 * Безопасное получение элемента по ID
 */
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Элемент с ID '${id}' не найден`);
    }
    return element;
}

/**
 * Проверка доступности API
 */
function isAPIReady() {
    return window.MangaAPI && typeof window.MangaAPI.getAllManga === 'function';
}

/**
 * Генерация placeholder изображения
 */
function generatePlaceholder(text, width = 300, height = 400, bgColor = 'FF6B35', textColor = 'FFFFFF') {
    return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
}

/**
 * Валидация URL изображения
 */
function validateImageUrl(url, fallbackText) {
    if (!url || url.trim() === '') {
        return generatePlaceholder(fallbackText);
    }
    return url;
}

/**
 * Безопасное обновление текстового содержимого
 */
function safeUpdateText(elementId, text, fallback = 'N/A') {
    const element = safeGetElement(elementId);
    if (element) {
        element.textContent = text || fallback;
    }
}

/**
 * Безопасное обновление HTML содержимого
 */
function safeUpdateHTML(elementId, html, fallback = '') {
    const element = safeGetElement(elementId);
    if (element) {
        element.innerHTML = html || fallback;
    }
}

/**
 * Получение состояния аутентификации
 */
function getAuthState() {
    return {
        isLoggedIn,
        currentUser: currentUser ? { ...currentUser } : null
    };
}

/**
 * Получение состояния темы
 */
function getThemeState() {
    return {
        isDark,
        theme: isDark ? 'dark' : 'light'
    };
}

/**
 * Навигация между страницами
 */
function navigateTo(page, params = {}) {
    let url = page;
    const searchParams = new URLSearchParams(params);
    if (searchParams.toString()) {
        url += '?' + searchParams.toString();
    }
    window.location.href = url;
}

/**
 * Копирование текста в буфер обмена
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Скопировано в буфер обмена', 'success');
        return true;
    } catch (err) {
        console.error('Ошибка копирования:', err);
        showNotification('Ошибка копирования', 'error');
        return false;
    }
}

/**
 * Проверка мобильного устройства
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Дебаунс функция
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * ========================================
 * ИНИЦИАЛИЗАЦИЯ ОБЩИХ КОМПОНЕНТОВ
 * ========================================
 */

function initializeCommonComponents() {
    // Theme toggles
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const mobileSideThemeToggle = document.getElementById('mobileSideThemeToggle');
    
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
    if (mobileSideThemeToggle) mobileSideThemeToggle.addEventListener('click', toggleTheme);

    // Language switches
    const langSwitch = document.getElementById('langSwitch');
    const mobileLangSwitch = document.getElementById('mobileLangSwitch');
    
    if (langSwitch) {
        langSwitch.addEventListener('change', (e) => updateLanguage(e.target.value));
    }
    if (mobileLangSwitch) {
        mobileLangSwitch.addEventListener('change', (e) => updateLanguage(e.target.value));
    }

    // Profile buttons
    const profileBtn = document.getElementById('profileBtn');
    const mobileProfileBtn = document.getElementById('mobileProfileBtn');
    
    if (profileBtn) profileBtn.addEventListener('click', toggleMenu);
    if (mobileProfileBtn) {
        mobileProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
        });
    }

    // Menu overlay
    const menuOverlay = document.getElementById('menuOverlay');
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Initialize states
    updateTheme();
    updateAuthState();
    
    // Load saved language
    const savedLang = localStorage.getItem('language') || 'ru';
    updateLanguage(savedLang);
}

/**
 * ========================================
 * КЛАВИАТУРНЫЕ СОКРАЩЕНИЯ
 * ========================================
 */

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
}

/**
 * ========================================
 * АВТОИНИЦИАЛИЗАЦИЯ
 * ========================================
 */

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeCommonComponents();
    initializeKeyboardShortcuts();
});

// Экспорт функций для использования в других скриптах
window.CommonUtils = {
    // Основные функции
    updateTheme,
    toggleTheme,
    updateLanguage,
    updateAuthState,
    login,
    logout,
    toggleMenu,
    closeMenu,
    openRandomManga,
    showNotification,
    formatTime,
    
    // Дополнительные утилиты
    safeGetElement,
    isAPIReady,
    generatePlaceholder,
    validateImageUrl,
    safeUpdateText,
    safeUpdateHTML,
    getAuthState,
    getThemeState,
    navigateTo,
    copyToClipboard,
    isMobile,
    debounce
};

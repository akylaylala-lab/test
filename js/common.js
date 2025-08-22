
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
        isLoggedIn

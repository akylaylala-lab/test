// State
        let currentManga = null;
        let currentEpisode = 1;
        let isDark = localStorage.getItem('theme') === 'dark';
        let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

        // Theme functionality
        function updateTheme() {
            document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
            
            // Update all theme toggle icons
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

        // Language functionality
        function updateLanguage(lang) {
            localStorage.setItem('language', lang);
            
            // Sync both language selectors
            const langSwitch = document.getElementById('langSwitch');
            const mobileLangSwitch = document.getElementById('mobileLangSwitch');
            
            if (langSwitch) langSwitch.value = lang;
            if (mobileLangSwitch) mobileLangSwitch.value = lang;
        }

        // Authentication functionality
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

        // Menu functionality
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

        // Random manga functionality
        function openRandomManga() {
            if (window.MangaAPI) {
                const allManga = window.MangaAPI.getAllManga();
                if (allManga.length > 0) {
                    const randomManga = allManga[Math.floor(Math.random() * allManga.length)];
                    window.location.href = `player.html?id=${randomManga.id}`;
                } else {
                    showNotification('Каталог пуст', 'error');
                }
            } else {
                showNotification('Система данных не загружена', 'error');
            }
        }

        // Get manga ID from URL
        function getMangaIdFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id');
        }

        // === ИСПРАВЛЕННАЯ ЗАГРУЗКА ДАННЫХ ===
        function loadDataSystemSafely() {
            return new Promise((resolve) => {
                // Проверяем, уже ли загружен MangaAPI
                if (window.MangaAPI && typeof window.MangaAPI.getAllManga === 'function') {
                    console.log('✅ MangaAPI уже доступен');
                    resolve(true);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'js/data.js';
                
                let isResolved = false;
                const timeout = setTimeout(() => {
                    if (!isResolved) {
                        console.warn('⏰ Таймаут загрузки data.js');
                        isResolved = true;
                        resolve(false);
                    }
                }, 5000);

                script.onload = () => {
                    if (!isResolved) {
                        clearTimeout(timeout);
                        console.log('✅ data.js загружен успешно');
                        
                        setTimeout(() => {
                            if (window.MangaAPI && typeof window.MangaAPI.getAllManga === 'function') {
                                console.log('🎯 MangaAPI готов к использованию');
                                isResolved = true;
                                resolve(true);
                            } else {
                                console.warn('⚠️ MangaAPI не готов');
                                isResolved = true;
                                resolve(false);
                            }
                        }, 500);
                    }
                };

                script.onerror = () => {
                    if (!isResolved) {
                        clearTimeout(timeout);
                        console.warn('❌ Ошибка загрузки data.js');
                        isResolved = true;
                        resolve(false);
                    }
                };

                document.head.appendChild(script);
            });
        }

        // Initialize player
        async function initializePlayer() {
            console.log('🎬 Инициализация плеера...');
            
            const mangaId = getMangaIdFromURL();
            
            if (!mangaId) {
                showError('ID тайтла не указан в URL');
                return;
            }

            // Загружаем систему данных
            const dataLoaded = await loadDataSystemSafely();
            
            if (!window.MangaAPI) {
                showError('Система данных не загружена');
                return;
            }

            currentManga = window.MangaAPI.getMangaById(mangaId);
            
            if (!currentManga) {
                showError(`Тайтл с ID ${mangaId} не найден`);
                return;
            }

            console.log('✅ Тайтл найден:', currentManga.title);
            loadMangaData();
        }

        // Load manga data
        function loadMangaData() {
            console.log('📊 Загрузка данных тайтла...');
            
            // Hide loading, show content
            const loadingState = document.getElementById('loadingState');
            const playerContent = document.getElementById('playerContent');
            
            if (loadingState) loadingState.style.display = 'none';
            if (playerContent) playerContent.style.display = 'block';

            // Update headers
            const title = currentManga.title;
            const headerTitle = document.getElementById('headerTitle');
            const mobileHeaderTitle = document.getElementById('mobileHeaderTitle');
            
            if (headerTitle) headerTitle.textContent = title;
            if (mobileHeaderTitle) mobileHeaderTitle.textContent = title;

            // Update manga info elements
            const mangaPoster = document.getElementById('mangaPoster');
            const mangaTitle = document.getElementById('mangaTitle');
            const mangaStatus = document.getElementById('mangaStatus');
            const episodeCount = document.getElementById('episodeCount');
            const mangaType = document.getElementById('mangaType');
            const mangaYear = document.getElementById('mangaYear');
            const mangaRating = document.getElementById('mangaRating');

            if (mangaPoster) {
                mangaPoster.src = currentManga.image || 'https://via.placeholder.com/300x400/FF6B35/FFFFFF?text=' + encodeURIComponent(title);
                mangaPoster.onerror = function() {
                    this.src = 'https://via.placeholder.com/300x400/FF6B35/FFFFFF?text=' + encodeURIComponent(title.charAt(0));
                };
            }
            
            if (mangaTitle) mangaTitle.textContent = title;
            if (mangaStatus) mangaStatus.textContent = currentManga.status || 'Неизвестно';
            if (episodeCount) episodeCount.textContent = `${currentManga.availableEpisodes || 0}/${currentManga.totalEpisodes || 0}`;
            if (mangaType) mangaType.textContent = currentManga.type || 'Манга';
            if (mangaYear) mangaYear.textContent = currentManga.year || 'Неизвестно';
            if (mangaRating) {
                const ratingSpan = mangaRating.querySelector('span:last-child');
                if (ratingSpan) ratingSpan.textContent = currentManga.rating || 'N/A';
            }

            // Update genres
            if (currentManga.genres && currentManga.genres.length > 0) {
                const genresContainer = document.getElementById('genresContainer');
                if (genresContainer) {
                    genresContainer.innerHTML = currentManga.genres.map(genre => 
                        `<span class="genre-tag">${genre}</span>`
                    ).join('');
                }
            }

            // Update description
            if (currentManga.description) {
                const descriptionContainer = document.getElementById('descriptionContainer');
                const mangaDescription = document.getElementById('mangaDescription');
                if (descriptionContainer && mangaDescription) {
                    descriptionContainer.style.display = 'block';
                    mangaDescription.textContent = currentManga.description;
                }
            }

            // Update donation info
            updateDonationInfo();

            // Generate episode buttons
            generateEpisodeButtons();

            // Update episode info
            updateEpisodeInfo();
            
            console.log('✅ Данные тайтла загружены');
        }

        // Generate episode buttons
        function generateEpisodeButtons() {
            const grid = document.getElementById('episodeGrid');
            if (!grid || !currentManga) return;
            
            const episodes = [];
            const totalEpisodes = currentManga.totalEpisodes || 0;
            const availableEpisodes = currentManga.availableEpisodes || 0;

            if (totalEpisodes === 0) {
                grid.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--secondary-color);">Серии пока не добавлены</p>';
                return;
            }

            for (let i = 1; i <= totalEpisodes; i++) {
                const isAvailable = i <= availableEpisodes;
                const isCurrent = i === currentEpisode;
                
                episodes.push(`
                    <button class="episode-button ${isCurrent ? 'current' : ''} ${!isAvailable ? 'unavailable' : ''}"
                            onclick="selectEpisode(${i})" data-episode="${i}">
                        ${i}
                    </button>
                `);
            }

            grid.innerHTML = episodes.join('');
            console.log(`📺 Создано ${totalEpisodes} кнопок серий (${availableEpisodes} доступно)`);
        }

        // Select episode
        function selectEpisode(episode) {
            console.log(`📺 Выбрана серия ${episode}`);
            currentEpisode = episode;

            // Update current episode styling
            document.querySelectorAll('.episode-button').forEach(btn => {
                btn.classList.remove('current');
                if (parseInt(btn.dataset.episode) === episode) {
                    btn.classList.add('current');
                }
            });

            // Update episode info
            updateEpisodeInfo();

            // Load video if available
            loadVideo(episode);
        }

        // Update episode info
        function updateEpisodeInfo() {
            const info = document.getElementById('episodeInfo');
            if (!info || !currentManga) return;
            
            const isAvailable = currentEpisode <= (currentManga.availableEpisodes || 0);
            
            if (isAvailable) {
                info.innerHTML = `Серия ${currentEpisode} из ${currentManga.totalEpisodes || 0}`;
                info.classList.remove('episode-unavailable');
            } else {
                info.innerHTML = `<span class="episode-unavailable">Серия ${currentEpisode} недоступна</span>`;
                info.classList.add('episode-unavailable');
            }
        }

        // === ИСПРАВЛЕННАЯ ЗАГРУЗКА ВИДЕО ===
        function loadVideo(episode) {
            console.log(`🎥 Загрузка видео для серии ${episode}`);
            
            const player = document.getElementById('videoPlayer');
            const placeholder = document.getElementById('videoPlaceholder');
            const title = document.getElementById('placeholderTitle');
            const text = document.getElementById('placeholderText');
            
            if (!player || !placeholder || !title || !text || !currentManga) {
                console.error('❌ Не найдены элементы плеера');
                return;
            }

            const isAvailable = episode <= (currentManga.availableEpisodes || 0);
            
            // Ищем URL видео для данной серии
            let videoUrl = null;
            if (currentManga.episodes) {
                // Пробуем разные варианты ключей
                const possibleKeys = [
                    String(episode),
                    episode.toString(),
                    `episode${episode}`,
                    `ep${episode}`
                ];
                
                for (const key of possibleKeys) {
                    if (currentManga.episodes[key]) {
                        videoUrl = currentManga.episodes[key];
                        console.log(`✅ Найдено видео для серии ${episode}: ${videoUrl}`);
                        break;
                    }
                }
            }

            if (isAvailable && videoUrl) {
                // Load video
                console.log('🎬 Загружаем видео:', videoUrl);
                
                // Проверяем и конвертируем YouTube ссылки
                let embedUrl = videoUrl;
                if (videoUrl.includes('youtube.com/watch?v=')) {
                    const videoId = videoUrl.split('v=')[1].split('&')[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                } else if (videoUrl.includes('youtu.be/')) {
                    const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }
                
                player.src = embedUrl;
                player.style.display = 'block';
                placeholder.style.display = 'none';
                
                console.log('✅ Видео загружено в плеер');
            } else if (!isAvailable) {
                // Show unavailable message
                console.log('⚠️ Серия недоступна');
                player.style.display = 'none';
                placeholder.style.display = 'flex';
                title.textContent = `Серия ${episode} недоступна`;
                text.innerHTML = `Поддержите проект, чтобы ускорить выход новых серий!<br><strong>Цель: ${((currentManga.donationGoal || 10000)).toLocaleString()}₽</strong>`;
            } else {
                // Video not found
                console.log('⚠️ Видео не найдено для серии', episode);
                player.style.display = 'none';
                placeholder.style.display = 'flex';
                title.textContent = `Серия ${episode}`;
                text.textContent = 'Видео пока не загружено';
            }
        }

        // Update donation info
        function updateDonationInfo() {
            if (!currentManga) return;
            
            const current = currentManga.currentDonations || 0;
            const goal = currentManga.donationGoal || 10000;
            const percentage = (current / goal) * 100;

            const currentDonations = document.getElementById('currentDonations');
            const donationGoal = document.getElementById('donationGoal');
            const progressBarFill = document.getElementById('progressBarFill');
            const progressPercentage = document.getElementById('progressPercentage');
            const donateBtn = document.getElementById('donateBtn');

            if (currentDonations) currentDonations.textContent = current.toLocaleString();
            if (donationGoal) donationGoal.textContent = goal.toLocaleString();
            if (progressBarFill) progressBarFill.style.width = `${Math.min(percentage, 100)}%`;
            if (progressPercentage) progressPercentage.textContent = `${percentage.toFixed(1)}%`;

            // Update donate button
            if (donateBtn) {
                if (percentage >= 100) {
                    donateBtn.textContent = '✅ Цель достигнута!';
                    donateBtn.disabled = true;
                } else {
                    donateBtn.textContent = '💝 Поддержать проект';
                    donateBtn.disabled = false;
                }
            }
        }

        // Donation functions
        function setDonationAmount(amount) {
            const input = document.getElementById('donationAmount');
            if (input) input.value = amount;
        }

        function makeDonation() {
            const amountInput = document.getElementById('donationAmount');
            if (!amountInput) return;
            
            const amount = parseInt(amountInput.value) || 0;
            
            if (amount < 10) {
                showNotification('Минимальная сумма доната: 10₽', 'error');
                return;
            }

            if (amount > 50000) {
                showNotification('Максимальная сумма доната: 50,000₽', 'error');
                return;
            }

            // Update donation amount
            const newTotal = Math.min((currentManga.currentDonations || 0) + amount, currentManga.donationGoal || 10000);
            
            // Update manga data
            if (window.MangaAPI) {
                const updated = window.MangaAPI.updateManga(currentManga.id, {
                    currentDonations: newTotal
                });
                
                if (updated) {
                    currentManga.currentDonations = newTotal;
                } else {
                    console.warn('⚠️ Не удалось обновить данные манги');
                }
            }

            // Update UI
            updateDonationInfo();

            // Clear input
            amountInput.value = '';

            // Show notification
            showNotification(`Спасибо за поддержку! Добавлено ${amount.toLocaleString()}₽`, 'success');

            // Save to user's donation history
            const donationHistory = JSON.parse(localStorage.getItem('donationHistory') || '[]');
            donationHistory.push({
                mangaId: currentManga.id,
                mangaTitle: currentManga.title,
                amount: amount,
                episode: currentEpisode,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
        }

        // User actions
        function addToFavorites() {
            addToUserList('favorites', 'Избранное');
        }

        function addToWatching() {
            addToUserList('watching', 'Смотрю');
        }

        function addToWantToWatch() {
            addToUserList('wantToWatch', 'Хочу посмотреть');
        }

        function addToCompleted() {
            addToUserList('completed', 'Досмотрел');
        }

        function addToUserList(listName, listTitle) {
            if (!currentManga) return;
            
            const mangaForStorage = {
                id: Date.now(),
                mangaId: currentManga.id,
                title: currentManga.title,
                image: currentManga.image,
                currentEpisode: currentEpisode,
                totalEpisodes: currentManga.totalEpisodes,
                availableEpisodes: currentManga.availableEpisodes,
                status: currentManga.status,
                rating: currentManga.rating,
                addedAt: new Date().toISOString()
            };

            const currentList = JSON.parse(localStorage.getItem(listName) || '[]');
            
            // Remove if already exists
            const filtered = currentList.filter(item => item.mangaId !== currentManga.id);
            
            // Add new entry
            filtered.push(mangaForStorage);
            
            localStorage.setItem(listName, JSON.stringify(filtered));
            
            showNotification(`Добавлено в "${listTitle}"`, 'success');
        }

        function markCurrentEpisode() {
            if (!currentManga) return;
            
            const watchingProgress = JSON.parse(localStorage.getItem('watchingProgress') || '{}');
            watchingProgress[currentManga.id] = {
                mangaTitle: currentManga.title,
                currentEpisode: currentEpisode,
                totalEpisodes: currentManga.totalEpisodes,
                lastWatched: new Date().toISOString()
            };
            localStorage.setItem('watchingProgress', JSON.stringify(watchingProgress));
            
            showNotification(`Отмечено: остановился на серии ${currentEpisode}`, 'success');
        }

        function openInCabinet() {
            // Add to watching list first
            addToWatching();
            
            // Redirect to cabinet
            setTimeout(() => {
                window.location.href = 'cabinet.html';
            }, 1000);
        }

        // Utility functions
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            if (notification) {
                notification.textContent = message;
                notification.className = `notification show ${type}`;
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
        }

        function showError(message) {
            console.error('❌ Ошибка плеера:', message);
            
            const loadingState = document.getElementById('loadingState');
            const errorState = document.getElementById('errorState');
            
            if (loadingState) loadingState.style.display = 'none';
            if (errorState) {
                errorState.style.display = 'flex';
                const errorText = errorState.querySelector('p');
                if (errorText) errorText.textContent = message;
            }
        }

        // === ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ СОБЫТИЙ ===
        
        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎬 DOM загружен, инициализация плеера...');
            
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
            
            // Initialize
            updateTheme();
            updateAuthState();
            
            // Load saved language
            const savedLang = localStorage.getItem('language') || 'ru';
            updateLanguage(savedLang);

            // Запускаем инициализацию плеера
            initializePlayer();
        });

        // Listen for data ready event
        window.addEventListener('mangaDataReady', function(e) {
            console.log('📡 Получено событие mangaDataReady');
            if (!currentManga) {
                initializePlayer();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
            
            if (!currentManga) return;

            switch(e.key) {
                case 'ArrowLeft':
                    if (currentEpisode > 1) {
                        selectEpisode(currentEpisode - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (currentEpisode < (currentManga.totalEpisodes || 0)) {
                        selectEpisode(currentEpisode + 1);
                    }
                    break;
                case 'Home':
                    selectEpisode(1);
                    break;
                case 'End':
                    selectEpisode(currentManga.availableEpisodes || 1);
                    break;
            }
        });

        // Экспорт функций для onclick
        window.selectEpisode = selectEpisode;
        window.setDonationAmount = setDonationAmount;
        window.makeDonation = makeDonation;
        window.addToFavorites = addToFavorites;
        window.addToWatching = addToWatching;
        window.addToWantToWatch = addToWantToWatch;
        window.addToCompleted = addToCompleted;
        window.markCurrentEpisode = markCurrentEpisode;
        window.openInCabinet = openInCabinet;
        window.openRandomManga = openRandomManga;
        window.login = login;
        window.logout = logout;
        window.closeMenu = closeMenu;

        console.log('🎉 Исправленный плеер готов к работе!');

// Система управления данными для Light Fox Manga
(function() {
    'use strict';

    // Ключ для localStorage
    const STORAGE_KEY = 'lightfox_manga_data';
    const SETTINGS_KEY = 'lightfox_settings';

    // Образцы данных манги с рабочими видео
    const sampleData = [
        {
            id: '1',
            title: 'Атака титанов',
            type: 'Аниме',
            status: 'Завершён',
            year: 2013,
            rating: 9.0,
            genres: ['Экшен', 'Драма', 'Фэнтези', 'Военное'],
            categories: ['Сёнен'],
            availableEpisodes: 3,
            totalEpisodes: 87,
            availableChapters: 5,
            totalChapters: 139,
            currentDonations: 7500,
            donationGoal: 10000,
            image: 'https://via.placeholder.com/300x450/FF6B35/FFFFFF?text=Атака+титанов',
            description: 'Человечество живёт в городах, окружённых огромными стенами, защищающими от титанов — гигантских гуманоидов, пожирающих людей.',
            episodes: {
                '1': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                '2': 'https://www.youtube.com/embed/oHg5SJYRHA0',
                '3': 'https://www.youtube.com/embed/9bZkp7q19f0'
            }
        },
        {
            id: '2',
            title: 'Наруто',
            type: 'Аниме',
            status: 'Завершён',
            year: 2002,
            rating: 8.7,
            genres: ['Экшен', 'Приключения', 'Боевые искусства'],
            categories: ['Сёнен'],
            availableEpisodes: 2,
            totalEpisodes: 720,
            availableChapters: 10,
            totalChapters: 700,
            currentDonations: 12000,
            donationGoal: 15000,
            image: 'https://via.placeholder.com/300x450/FF6B35/FFFFFF?text=Наруто',
            description: 'История молодого ниндзя Наруто Узумаки, мечтающего стать Хокаге.',
            episodes: {
                '1': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                '2': 'https://www.youtube.com/embed/oHg5SJYRHA0'
            }
        },
        {
            id: '3',
            title: 'Ван Пис',
            type: 'Аниме',
            status: 'Выходит',
            year: 1999,
            rating: 9.1,
            genres: ['Экшен', 'Приключения', 'Комедия'],
            categories: ['Сёнен'],
            availableEpisodes: 4,
            totalEpisodes: 1200,
            availableChapters: 20,
            totalChapters: 1100,
            currentDonations: 8000,
            donationGoal: 20000,
            image: 'https://via.placeholder.com/300x450/FF6B35/FFFFFF?text=Ван+Пис',
            description: 'Приключения Монки Д. Луффи и его команды пиратов в поисках легендарного сокровища.',
            episodes: {
                '1': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                '2': 'https://www.youtube.com/embed/oHg5SJYRHA0',
                '3': 'https://www.youtube.com/embed/9bZkp7q19f0',
                '4': 'https://www.youtube.com/embed/astISOttCQ0'
            }
        },
        {
            id: '4',
            title: 'Моя геройская академия',
            type: 'Аниме',
            status: 'Выходит',
            year: 2016,
            rating: 8.5,
            genres: ['Экшен', 'Школа', 'Супергерои'],
            categories: ['Сёнен'],
            availableEpisodes: 3,
            totalEpisodes: 150,
            availableChapters: 15,
            totalChapters: 400,
            currentDonations: 5500,
            donationGoal: 12000,
            image: 'https://via.placeholder.com/300x450/FF6B35/FFFFFF?text=Моя+геройская+академия',
            description: 'В мире, где 80% населения обладает суперспособностями, обычный мальчик мечтает стать героем.',
            episodes: {
                '1': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                '2': 'https://www.youtube.com/embed/oHg5SJYRHA0',
                '3': 'https://www.youtube.com/embed/9bZkp7q19f0'
            }
        },
        {
            id: '5',
            title: 'Магическая битва',
            type: 'Аниме',
            status: 'Выходит',
            year: 2020,
            rating: 8.8,
            genres: ['Экшен', 'Сверхъестественное', 'Школа'],
            categories: ['Сёнен'],
            availableEpisodes: 2,
            totalEpisodes: 50,
            availableChapters: 8,
            totalChapters: 250,
            currentDonations: 3000,
            donationGoal: 8000,
            image: 'https://via.placeholder.com/300x450/FF6B35/FFFFFF?text=Магическая+битва',
            description: 'Юки Итадори попадает в мир магов и проклятий после того, как съедает палец древнего демона.',
            episodes: {
                '1': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                '2': 'https://www.youtube.com/embed/oHg5SJYRHA0'
            }
        },
        {
            id: '6',
            title: 'Демон разрушения',
            type: 'Аниме',
            status: 'Выходит',
            year: 2019,
            rating: 8.9,
            genres: ['Экшен', 'Исторический', 'Сверхъестественное'],
            categories: ['Сёнен'],
            availableEpisodes: 5,
            totalEpisodes: 44,
            availableChapters: 25,
            totalChapters: 205,
            currentDonations: 9200,
            donationGoal: 11000,
            image: 'https://via.placeholder.com/300x450/FF6B35/FFFFFF?text=Демон+разрушения',
            description: 'Танджиро Камадо становится охотником на демонов, чтобы спасти свою сестру.',
            episodes: {
                '1': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                '2': 'https://www.youtube.com/embed/oHg5SJYRHA0',
                '3': 'https://www.youtube.com/embed/9bZkp7q19f0',
                '4': 'https://www.youtube.com/embed/astISOttCQ0',
                '5': 'https://www.youtube.com/embed/L_jWHffIx5E'
            }
        },
        {
            id: '7',
            title: 'Берсерк',
            type: 'Манга',
            status: 'Выходит',
            year: 1989,
            rating: 9.2,
            genres: ['Экшен', 'Драма', 'Ужасы', 'Фэнтези'],
            categories: ['Сэйнэн'],
            availableEpisodes: 0,
            totalEpisodes: 0,
            availableChapters: 364,
            totalChapters: 400,
            currentDonations: 15000,
            donationGoal: 25000,
            image: 'https://via.placeholder.com/300x450/FF6B35/FFFFFF?text=Берсерк',
            description: 'Тёмное фэнтези о наёмнике Гатсе и его борьбе с демонами.',
            episodes: {}
        },
        {
            id: '8',
            title: 'Токийский гуль',
            type: 'Аниме',
            status: 'Завершён',
            year: 2014,
            rating: 8.3,
            genres: ['Экшен', 'Ужасы', 'Сверхъестественное'],
            categories: ['Сэйнэн'],
            availableEpisodes: 3,
            totalEpisodes: 48,
            availableChapters: 12,
            totalChapters: 144,
            currentDonations: 6800,
            donationGoal: 9000,
            image: 'https://via.placeholder.com/300x450/FF6B35/FFFFFF?text=Токийский+гуль',
            description: 'Кен Канеки становится получеловеком-полугулем после встречи с загадочной девушкой.',
            episodes: {
                '1': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                '2': 'https://www.youtube.com/embed/oHg5SJYRHA0',
                '3': 'https://www.youtube.com/embed/9bZkp7q19f0'
            }
        }
    ];

    // Система управления данными
    class MangaDataSystem {
        constructor() {
            this.data = this.loadData();
            this.settings = this.loadSettings();
            console.log('🦊 MangaDataSystem инициализирована');
        }

        // Загрузка данных из localStorage
        loadData() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsedData = JSON.parse(stored);
                    // Проверяем, что данные валидны
                    if (Array.isArray(parsedData) && parsedData.length > 0) {
                        console.log(`📚 Загружено ${parsedData.length} тайтлов из localStorage`);
                        return parsedData;
                    }
                }
            } catch (error) {
                console.warn('⚠️ Ошибка загрузки данных из localStorage:', error);
            }
            
            // Если нет сохранённых данных, используем образцы
            console.log('📦 Используем образцы данных');
            this.saveData(sampleData);
            return [...sampleData];
        }

        // Сохранение данных в localStorage
        saveData(data = null) {
            try {
                const dataToSave = data || this.data;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
                
                // Уведомляем об обновлении данных
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('mangaDataUpdate', {
                        detail: { data: dataToSave }
                    }));
                }
                console.log('💾 Данные сохранены');
            } catch (error) {
                console.error('❌ Ошибка сохранения данных:', error);
            }
        }

        // Загрузка настроек
        loadSettings() {
            try {
                const stored = localStorage.getItem(SETTINGS_KEY);
                return stored ? JSON.parse(stored) : {};
            } catch (error) {
                console.warn('⚠️ Ошибка загрузки настроек:', error);
                return {};
            }
        }

        // Сохранение настроек
        saveSettings() {
            try {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
            } catch (error) {
                console.error('❌ Ошибка сохранения настроек:', error);
            }
        }

        // Получение всех манги
        getAllManga() {
            return [...this.data];
        }

        // Получение манги по ID
        getMangaById(id) {
            const manga = this.data.find(manga => manga.id === String(id));
            if (manga) {
                console.log(`📖 Найдена манга: ${manga.title}`);
            } else {
                console.warn(`⚠️ Манга с ID ${id} не найдена`);
            }
            return manga;
        }

        // Добавление новой манги
        addManga(manga) {
            const newManga = {
                id: String(Date.now()),
                currentDonations: 0,
                donationGoal: 10000,
                availableEpisodes: 0,
                totalEpisodes: 0,
                availableChapters: 0,
                totalChapters: 0,
                episodes: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...manga
            };
            
            this.data.push(newManga);
            this.saveData();
            console.log(`➕ Добавлена новая манга: ${newManga.title}`);
            return newManga;
        }

        // Обновление манги
        updateManga(id, updates) {
            const index = this.data.findIndex(manga => manga.id === String(id));
            if (index !== -1) {
                this.data[index] = { 
                    ...this.data[index], 
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                this.saveData();
                console.log(`🔄 Обновлена манга: ${this.data[index].title}`);
                return this.data[index];
            }
            console.warn(`⚠️ Не удалось обновить мангу с ID ${id}`);
            return null;
        }

        // Удаление манги
        deleteManga(id) {
            const index = this.data.findIndex(manga => manga.id === String(id));
            if (index !== -1) {
                const deleted = this.data.splice(index, 1)[0];
                this.saveData();
                console.log(`🗑️ Удалена манга: ${deleted.title}`);
                return deleted;
            }
            return null;
        }

        // Получение уникальных жанров
        getGenres() {
            const genres = new Set();
            this.data.forEach(manga => {
                if (manga.genres) {
                    manga.genres.forEach(genre => genres.add(genre));
                }
            });
            return Array.from(genres).sort();
        }

        // Получение уникальных категорий
        getCategories() {
            const categories = new Set();
            this.data.forEach(manga => {
                if (manga.categories) {
                    manga.categories.forEach(category => categories.add(category));
                }
            });
            return Array.from(categories).sort();
        }

        // Получение уникальных статусов
        getStatuses() {
            const statuses = new Set();
            this.data.forEach(manga => {
                if (manga.status) {
                    statuses.add(manga.status);
                }
            });
            return Array.from(statuses).sort();
        }

        // Фильтрация и поиск
        filterManga(filters = {}) {
            let result = [...this.data];

            // Поиск по названию
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                result = result.filter(manga => 
                    manga.title.toLowerCase().includes(searchTerm)
                );
            }

            // Фильтр по жанрам
            if (filters.genres && filters.genres.length > 0) {
                result = result.filter(manga => 
                    manga.genres && filters.genres.some(genre => 
                        manga.genres.includes(genre)
                    )
                );
            }

            // Фильтр по категориям
            if (filters.categories && filters.categories.length > 0) {
                result = result.filter(manga => 
                    manga.categories && filters.categories.some(category => 
                        manga.categories.includes(category)
                    )
                );
            }

            // Фильтр по статусам
            if (filters.statuses && filters.statuses.length > 0) {
                result = result.filter(manga => 
                    manga.status && filters.statuses.includes(manga.status)
                );
            }

            // Фильтр по количеству серий
            if (filters.chaptersFrom) {
                const from = parseInt(filters.chaptersFrom);
                if (!isNaN(from)) {
                    result = result.filter(manga => 
                        (manga.availableEpisodes || 0) >= from
                    );
                }
            }

            if (filters.chaptersTo) {
                const to = parseInt(filters.chaptersTo);
                if (!isNaN(to)) {
                    result = result.filter(manga => 
                        (manga.availableEpisodes || 0) <= to
                    );
                }
            }

            // Сортировка
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'alphabet':
                        result.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    case 'rating':
                        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                        break;
                    case 'updated':
                        result.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
                        break;
                    case 'popularity':
                    default:
                        result.sort((a, b) => {
                            const aPopularity = (a.currentDonations || 0) + (a.rating || 0) * 1000;
                            const bPopularity = (b.currentDonations || 0) + (b.rating || 0) * 1000;
                            return bPopularity - aPopularity;
                        });
                        break;
                }
            }

            return result;
        }

        // Статистика
        getStats() {
            return {
                totalManga: this.data.length,
                totalEpisodes: this.data.reduce((sum, manga) => sum + (manga.availableEpisodes || 0), 0),
                averageRating: this.data.reduce((sum, manga) => sum + (manga.rating || 0), 0) / (this.data.length || 1),
                totalDonations: this.data.reduce((sum, manga) => sum + (manga.currentDonations || 0), 0)
            };
        }

        // Сброс данных к образцам
        resetToSampleData() {
            this.data = [...sampleData];
            this.saveData();
            console.log('🔄 Данные сброшены к образцам');
            return this.data;
        }

        // Экспорт данных
        exportData() {
            return {
                manga: this.data,
                settings: this.settings,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
        }

        // Импорт данных
        importData(importedData) {
            try {
                if (importedData.manga && Array.isArray(importedData.manga)) {
                    this.data = importedData.manga;
                    this.saveData();
                }
                
                if (importedData.settings) {
                    this.settings = { ...this.settings, ...importedData.settings };
                    this.saveSettings();
                }
                
                console.log('📥 Данные импортированы успешно');
                return true;
            } catch (error) {
                console.error('❌ Ошибка импорта данных:', error);
                return false;
            }
        }
    }

    // Создание глобального экземпляра
    const mangaSystem = new MangaDataSystem();

    // Экспорт в глобальную область видимости
    window.MangaAPI = {
        // Основные методы работы с данными
        getAllManga: () => mangaSystem.getAllManga(),
        getMangaById: (id) => mangaSystem.getMangaById(id),
        addManga: (manga) => mangaSystem.addManga(manga),
        updateManga: (id, updates) => mangaSystem.updateManga(id, updates),
        deleteManga: (id) => mangaSystem.deleteManga(id),
        
        // Методы для фильтров
        getGenres: () => mangaSystem.getGenres(),
        getCategories: () => mangaSystem.getCategories(),
        getStatuses: () => mangaSystem.getStatuses(),
        filterManga: (filters) => mangaSystem.filterManga(filters),
        
        // Утилиты
        getStats: () => mangaSystem.getStats(),
        resetToSampleData: () => mangaSystem.resetToSampleData(),
        exportData: () => mangaSystem.exportData(),
        importData: (data) => mangaSystem.importData(data),
        
        // Прямой доступ к системе для расширенного использования
        _system: mangaSystem,
        
        // Флаг готовности
        isReady: true
    };

    // Уведомление о готовности данных
    setTimeout(() => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mangaDataReady', {
                detail: { api: window.MangaAPI }
            }));
            console.log('📡 Отправлено событие mangaDataReady');
        }
    }, 100);

    console.log('🦊 Light Fox Manga Data System загружена');
    console.log(`📚 Загружено ${mangaSystem.data.length} тайтлов`);
    console.log('🔧 API доступен через window.MangaAPI');

})();

// =========================
// MYTHICAPP - APLICACIÓN DE MITOLOGÍA
// Con accesibilidad WCAG AA completa
// =========================

// ESTADO GLOBAL
let currentSection = 'home';
let currentQuizIndex = 0;
let quizScore = 0;
let quizQuestions = [];
let userAnswers = [];
let lastScore = null;
let animationsEnabled = true;

// =========================
// INICIALIZACIÓN
// =========================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupThemeToggle();
    setupMobileMenu();
    setupLibrary();
    setupCharacters();
    setupQuizButton();
    setupAnimationControl();
    loadLastScore();
    updateYear();
    
    // Anunciar página cargada
    announceToScreenReader('Aplicación Mythicapp cargada correctamente', 'polite');
}

// =========================
// UTILIDAD: ANUNCIOS PARA LECTORES DE PANTALLA
// =========================

function announceToScreenReader(message, priority = 'polite') {
    const announcer = document.getElementById('screen-reader-announcer');
    if (!announcer) {
        // Crear announcer si no existe
        const div = document.createElement('div');
        div.id = 'screen-reader-announcer';
        div.className = 'visually-hidden';
        div.setAttribute('role', 'status');
        div.setAttribute('aria-live', priority);
        div.setAttribute('aria-atomic', 'true');
        document.body.appendChild(div);
        
        // Pequeño delay para asegurar que el lector lo detecte
        setTimeout(() => {
            div.textContent = message;
        }, 100);
    } else {
        announcer.setAttribute('aria-live', priority);
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }
}

// =========================
// NAVEGACIÓN CON GESTIÓN DE FOCO
// =========================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.dataset.section;
            showSection(section);
        });
    });
    
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('home');
        });
    }
}

function showSection(sectionId) {
    const navLinks = document.getElementById('nav-links');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    
    // Cerrar menú móvil si está abierto
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Si intentan ir al quiz pero no está iniciado, iniciarlo automáticamente
    if (sectionId === 'quiz' && quizQuestions.length === 0) {
        startQuiz();
        return;
    }
    
    // Si vuelves a Quiz después de completarlo, reiniciarlo
    if (sectionId === 'quiz') {
        if (currentQuizIndex >= quizQuestions.length - 1 || quizQuestions.length === 0) {
            startQuiz();
            return;
        }
    }
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.hidden = true;
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.hidden = false;
        currentSection = sectionId;
        
        // MEJORA: Gestión de foco - mover foco a la sección
        const headingInSection = targetSection.querySelector('h1, h2');
        if (headingInSection) {
            headingInSection.setAttribute('tabindex', '-1');
            headingInSection.focus();
            // Eliminar tabindex después del foco para evitar confusión
            headingInSection.addEventListener('blur', function removeFocusHandler() {
                headingInSection.removeAttribute('tabindex');
                headingInSection.removeEventListener('blur', removeFocusHandler);
            });
        }
        
        // Anunciar cambio de sección
        const sectionNames = {
            home: 'Inicio',
            library: 'Biblioteca de mitos',
            characters: 'Personajes legendarios',
            quiz: 'Quiz de mitología',
            results: 'Resultados del quiz'
        };
        announceToScreenReader(`Navegando a ${sectionNames[sectionId]}`, 'assertive');
    }

    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================
// MENÚ MÓVIL CON FOCUS TRAP
// =========================

function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const willBeOpen = !isExpanded;
            
            toggle.setAttribute('aria-expanded', willBeOpen);
            navLinks.classList.toggle('active');
            
            if (willBeOpen) {
                // MEJORA: Mover foco al primer link cuando se abre
                const firstLink = navLinks.querySelector('.nav-link');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
                
                // MEJORA: Setup focus trap
                setupFocusTrap(navLinks, toggle);
                announceToScreenReader('Menú de navegación abierto', 'polite');
            } else {
                // Remover focus trap
                removeFocusTrap(navLinks);
                announceToScreenReader('Menú de navegación cerrado', 'polite');
            }
        });

        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                removeFocusTrap(navLinks);
            });
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                removeFocusTrap(navLinks);
                toggle.focus(); // Devolver foco al botón
                announceToScreenReader('Menú cerrado', 'polite');
            }
        });
    }
}

// MEJORA: Focus trap para menú móvil
let focusTrapHandler = null;

function setupFocusTrap(container, toggleButton) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    focusTrapHandler = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                toggleButton.focus();
            } else if (document.activeElement === toggleButton) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                toggleButton.focus();
            } else if (document.activeElement === toggleButton) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    document.addEventListener('keydown', focusTrapHandler);
}

function removeFocusTrap(container) {
    if (focusTrapHandler) {
        document.removeEventListener('keydown', focusTrapHandler);
        focusTrapHandler = null;
    }
}

// =========================
// TEMA DARK/LIGHT CON LABEL DINÁMICO
// =========================

function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    
    if (!toggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeLabel(toggle, savedTheme);

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeLabel(toggle, newTheme);
        
        announceToScreenReader(`Tema cambiado a modo ${newTheme === 'dark' ? 'oscuro' : 'claro'}`, 'polite');
    });
}

function updateThemeLabel(button, theme) {
    const label = theme === 'dark' 
        ? 'Cambiar a tema claro' 
        : 'Cambiar a tema oscuro';
    button.setAttribute('aria-label', label);
}

// =========================
// CONTROL DE ANIMACIONES
// =========================

function setupAnimationControl() {
    // Crear botón de control de animaciones si el usuario no tiene prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReduced) {
        const savedPref = localStorage.getItem('animationsEnabled');
        if (savedPref !== null) {
            animationsEnabled = savedPref === 'true';
            applyAnimationPreference();
        }
    } else {
        animationsEnabled = false;
        applyAnimationPreference();
    }
}

function applyAnimationPreference() {
    if (!animationsEnabled) {
        document.documentElement.classList.add('reduce-animations');
    } else {
        document.documentElement.classList.remove('reduce-animations');
    }
}

// =========================
// BIBLIOTECA DE MITOS
// =========================

function setupLibrary() {
    renderMyths('todas');
    setupLibraryTabs();
    setupLibrarySearch();
}

function setupLibraryTabs() {
    const tabs = document.querySelectorAll('#library-tabs .tab');
    const tabList = document.getElementById('library-tabs');
    
    tabs.forEach((tab, index) => {
        // MEJORA: Navegación con teclado (flechas)
        tab.addEventListener('keydown', (e) => {
            handleTabKeyboard(e, tabs, index);
        });
        
        tab.addEventListener('click', () => {
            activateTab(tab, tabs);
            const filter = tab.dataset.filter;
            renderMyths(filter);
        });
    });
}

function handleTabKeyboard(e, tabs, currentIndex) {
    let newIndex = currentIndex;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            break;
        case 'ArrowRight':
            e.preventDefault();
            newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            break;
        case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
        case 'End':
            e.preventDefault();
            newIndex = tabs.length - 1;
            break;
        default:
            return;
    }
    
    tabs[newIndex].focus();
    tabs[newIndex].click();
}

function activateTab(activeTab, allTabs) {
    allTabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
    });
    activeTab.setAttribute('aria-selected', 'true');
    activeTab.tabIndex = 0;
}

function setupLibrarySearch() {
    const searchBox = document.getElementById('library-search');
    if (!searchBox) return;
    
    let searchTimeout;
    searchBox.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase();
        
        // MEJORA: Debounce y anuncio de búsqueda
        searchTimeout = setTimeout(() => {
            const activeTab = document.querySelector('#library-tabs .tab[aria-selected="true"]');
            const filter = activeTab ? activeTab.dataset.filter : 'todas';
            const resultCount = renderMyths(filter, query);
            
            // Anunciar resultados
            if (query) {
                announceToScreenReader(`${resultCount} mitos encontrados para "${query}"`, 'polite');
            }
        }, 300);
    });
}

function renderMyths(filter = 'todas', searchQuery = '') {
    const grid = document.getElementById('myths-grid');
    if (!grid) return 0;

    // MEJORA: Indicar carga
    grid.setAttribute('aria-busy', 'true');

    let filtered = filter === 'todas'
        ? MYTHS.filter(m => m.titulo)
        : MYTHS.filter(m => m.titulo && m.era === filter);

    if (searchQuery) {
        filtered = filtered.filter(m =>
            m.titulo.toLowerCase().includes(searchQuery) ||
            m.resumen.toLowerCase().includes(searchQuery) ||
            m.detalle.toLowerCase().includes(searchQuery)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p role="status" style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding:40px;">No se encontraron mitos.</p>';
        grid.setAttribute('aria-busy', 'false');
        return 0;
    }

    grid.innerHTML = filtered.map((myth, index) => `
        <article class="content-item">
            <span class="item-tag">${capitalizeFirst(myth.era)}</span>
            <h3 class="item-title">${myth.titulo}</h3>
            <p class="item-description">${myth.resumen}</p>
            <div class="item-expandable">
                <button type="button" 
                        class="expand-button" 
                        data-myth-index="${index}"
                        aria-expanded="false"
                        aria-controls="myth-detail-${index}">
                    Leer más
                </button>
                <div class="expanded-content" 
                     id="myth-detail-${index}" 
                     hidden 
                     role="region"
                     aria-label="Detalles de ${myth.titulo}">
                    <p style="margin-top:12px;color:var(--text-secondary);line-height:1.6">${myth.detalle}</p>
                    <p class="caption" style="margin-top:10px;font-style:italic">Fuente: ${myth.ref}</p>
                </div>
            </div>
        </article>
    `).join('');

    // MEJORA: Event delegation en lugar de onclick inline
    grid.querySelectorAll('.expand-button').forEach(button => {
        button.addEventListener('click', () => toggleExpand(button));
    });

    grid.setAttribute('aria-busy', 'false');
    return filtered.length;
}

// =========================
// PERSONAJES
// =========================

function setupCharacters() {
    renderCharacters('todas');
    setupCharactersTabs();
    setupCharactersSearch();
}

function setupCharactersTabs() {
    const tabs = document.querySelectorAll('#characters-tabs .tab');
    
    tabs.forEach((tab, index) => {
        // MEJORA: Navegación con teclado
        tab.addEventListener('keydown', (e) => {
            handleTabKeyboard(e, tabs, index);
        });
        
        tab.addEventListener('click', () => {
            activateTab(tab, tabs);
            const filter = tab.dataset.filter;
            renderCharacters(filter);
        });
    });
}

function setupCharactersSearch() {
    const searchBox = document.getElementById('characters-search');
    if (!searchBox) return;
    
    let searchTimeout;
    searchBox.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase();
        
        searchTimeout = setTimeout(() => {
            const activeTab = document.querySelector('#characters-tabs .tab[aria-selected="true"]');
            const filter = activeTab ? activeTab.dataset.filter : 'todas';
            const resultCount = renderCharacters(filter, query);
            
            if (query) {
                announceToScreenReader(`${resultCount} personajes encontrados para "${query}"`, 'polite');
            }
        }, 300);
    });
}

function renderCharacters(filter = 'todas', searchQuery = '') {
    const grid = document.getElementById('characters-grid');
    if (!grid) return 0;

    grid.setAttribute('aria-busy', 'true');

    let filtered = filter === 'todas'
        ? CHARACTERS
        : CHARACTERS.filter(c => c.era === filter);

    if (searchQuery) {
        filtered = filtered.filter(c =>
            c.nombre.toLowerCase().includes(searchQuery) ||
            c.rol.toLowerCase().includes(searchQuery) ||
            c.detalle.toLowerCase().includes(searchQuery)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p role="status" style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding:40px;">No se encontraron personajes.</p>';
        grid.setAttribute('aria-busy', 'false');
        return 0;
    }

    grid.innerHTML = filtered.map(char => `
        <article class="content-item">
            <span class="item-tag">${capitalizeFirst(char.era)}</span>
            <h3 class="item-title">${char.nombre}</h3>
            <p class="item-subtitle">${char.rol}</p>
            <p class="item-description">${char.detalle}</p>
        </article>
    `).join('');

    grid.setAttribute('aria-busy', 'false');
    return filtered.length;
}

// =========================
// QUIZ CON ACCESIBILIDAD COMPLETA
// =========================

function setupQuizButton() {
    const startBtn = document.getElementById('start-quiz-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startQuiz);
    }
}

function startQuiz() {
    if (QUESTIONS_POOL.length < 15) {
        announceToScreenReader('Error: No hay suficientes preguntas para iniciar el quiz', 'assertive');
        alert('Error: No hay suficientes preguntas.');
        return;
    }
    
    quizQuestions = shuffleArray([...QUESTIONS_POOL]).slice(0, 15);
    currentQuizIndex = 0;
    quizScore = 0;
    userAnswers = [];

    showSection('quiz');
    renderQuestion();
    updateProgress();
    
    announceToScreenReader('Quiz iniciado. Responde 15 preguntas sobre mitología', 'assertive');
}

function renderQuestion() {
    const content = document.getElementById('quiz-content');
    const nextBtn = document.getElementById('next-btn');
    
    if (!content || !nextBtn) return;
    
    const question = quizQuestions[currentQuizIndex];
    if (!question) return;

    nextBtn.disabled = true;
    nextBtn.setAttribute('aria-disabled', 'true');
    nextBtn.textContent = currentQuizIndex === quizQuestions.length - 1 ? 'Ver resultados' : 'Siguiente';

    const questionId = `question-${currentQuizIndex}`;
    const feedbackId = `feedback-${currentQuizIndex}`;

    content.innerHTML = `
        <div class="question-card">
            <span class="question-meta">${capitalizeFirst(question.era)}</span>
            <h3 class="question-text" id="${questionId}">${question.texto}</h3>
            <div class="options" 
                 role="radiogroup" 
                 aria-labelledby="${questionId}"
                 aria-describedby="${feedbackId}">
                ${question.opciones.map((opcion, index) => `
                    <button type="button" 
                            class="option" 
                            role="radio" 
                            aria-checked="false"
                            data-index="${index}">
                        <span class="option-number" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
                        <span>${opcion}</span>
                    </button>
                `).join('')}
            </div>
            <div id="${feedbackId}" class="feedback-container" aria-live="assertive" aria-atomic="true"></div>
        </div>
    `;

    // MEJORA: Event delegation para opciones
    const options = content.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.addEventListener('click', () => selectAnswer(index));
        option.addEventListener('keydown', (e) => {
            // Navegación con flechas entre opciones
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextOption = options[(index + 1) % options.length];
                nextOption.focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevOption = options[(index - 1 + options.length) % options.length];
                prevOption.focus();
            } else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                option.click();
            }
        });
    });

    nextBtn.onclick = () => {
        if (currentQuizIndex < quizQuestions.length - 1) {
            currentQuizIndex++;
            renderQuestion();
            updateProgress();
        } else {
            showResults();
        }
    };

    // Foco en la pregunta
    setTimeout(() => {
        const heading = document.getElementById(questionId);
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }
    }, 100);
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuizIndex];
    const options = document.querySelectorAll('.option');
    const nextBtn = document.getElementById('next-btn');
    const feedbackContainer = document.querySelector('.feedback-container');

    // Deshabilitar todas las opciones
    options.forEach(opt => {
        opt.classList.add('disabled');
        opt.setAttribute('aria-disabled', 'true');
    });

    const isCorrect = selectedIndex === question.correcta;
    userAnswers.push({ question, selectedIndex, isCorrect });

    // Actualizar aria-checked
    options.forEach((opt, idx) => {
        opt.setAttribute('aria-checked', idx === selectedIndex ? 'true' : 'false');
    });

    if (isCorrect) {
        quizScore++;
        options[selectedIndex].classList.add('correct');
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[question.correcta].classList.add('correct');
    }

    const scoreCounter = document.getElementById('score-counter');
    if (scoreCounter) {
        scoreCounter.textContent = `Puntuación: ${quizScore}`;
    }

    // MEJORA: Feedback con aria-live
    const feedbackText = isCorrect 
        ? `✓ ¡Correcto! ${question.pista || ''}` 
        : `✗ Incorrecto. ${question.pista || ''} La respuesta correcta era: ${question.opciones[question.correcta]}`;

    if (feedbackContainer) {
        feedbackContainer.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}" role="status">
                <span class="feedback-icon" aria-hidden="true">${isCorrect ? '✓' : '✗'}</span>
                <span>${feedbackText}</span>
            </div>
        `;
    }

    // Anunciar para lectores de pantalla
    announceToScreenReader(feedbackText, 'assertive');

    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.removeAttribute('aria-disabled');
        nextBtn.focus();
    }
}

function updateProgress() {
    const progress = ((currentQuizIndex + 1) / quizQuestions.length) * 100;
    const fill = document.getElementById('progress-fill');
    const counter = document.getElementById('question-counter');
    const progressBar = document.querySelector('.progress-bar');

    if (fill) fill.style.width = `${progress}%`;
    if (counter) {
        counter.textContent = `Pregunta ${currentQuizIndex + 1} de ${quizQuestions.length}`;
    }
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', Math.round(progress));
        progressBar.setAttribute('aria-valuetext', `${currentQuizIndex + 1} de ${quizQuestions.length} preguntas completadas`);
    }
}

function showResults() {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    
    lastScore = { score: quizScore, total: quizQuestions.length, percentage };
    localStorage.setItem('lastScore', JSON.stringify(lastScore));

    const resultsContent = document.getElementById('results-content');
    if (!resultsContent) return;

    let message = '';
    if (percentage >= 90) message = '¡Eres un verdadero erudito de la mitología! Conocimiento excepcional.';
    else if (percentage >= 70) message = '¡Excelente! Dominas bien los mitos antiguos.';
    else if (percentage >= 50) message = 'Buen trabajo. Conoces bastante sobre mitología.';
    else message = 'Sigue aprendiendo. La mitología es fascinante.';

    resultsContent.innerHTML = `
        <div class="score-display" aria-label="Puntuación final">${quizScore}/${quizQuestions.length}</div>
        <p class="percentage">${percentage}% correcto</p>
        <p class="results-message">${message}</p>
        
        <div class="results-actions">
            <button type="button" class="btn-primary" id="repeat-quiz-btn">Repetir quiz</button>
            <button type="button" class="btn-secondary" id="home-btn">Volver a inicio</button>
        </div>
        
        <div class="results-breakdown">
            <h3>Desglose de respuestas:</h3>
            <ul role="list">
                ${userAnswers.map((answer, index) => `
                    <li>
                        <strong>Pregunta ${index + 1}: ${answer.question.texto}</strong>
                        <p style="color:${answer.isCorrect ? 'var(--success)' : 'var(--error)'};font-weight:600;margin-top:6px">
                            ${answer.isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
                        </p>
                        <p style="color:var(--text-secondary);margin-top:6px">
                            Tu respuesta: ${answer.question.opciones[answer.selectedIndex]}
                            ${!answer.isCorrect ? `<br>Respuesta correcta: ${answer.question.opciones[answer.question.correcta]}` : ''}
                        </p>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Event listeners para botones
    document.getElementById('repeat-quiz-btn')?.addEventListener('click', startQuiz);
    document.getElementById('home-btn')?.addEventListener('click', () => showSection('home'));

    showSection('results');
    loadLastScore();
    
    announceToScreenReader(`Quiz completado. Obtuviste ${quizScore} de ${quizQuestions.length} respuestas correctas. ${percentage}% de acierto. ${message}`, 'assertive');
}

// =========================
// SCORE BADGE
// =========================

function loadLastScore() {
    const scoreContainer = document.getElementById('home-score');
    if (!scoreContainer) return;
    
    const saved = localStorage.getItem('lastScore');

    if (saved) {
        try {
            lastScore = JSON.parse(saved);
            scoreContainer.innerHTML = `
                <div class="score-badge">
                    <div class="score-label">Último resultado</div>
                    <div class="score-value" aria-label="Puntuación: ${lastScore.score} de ${lastScore.total}">${lastScore.score}/${lastScore.total}</div>
                </div>
            `;
        } catch (e) {
            scoreContainer.innerHTML = '';
        }
    } else {
        scoreContainer.innerHTML = '';
    }
}

// =========================
// UTILIDADES
// =========================

function capitalizeFirst(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function toggleExpand(button) {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const content = button.nextElementSibling;

    if (!content) return;

    button.setAttribute('aria-expanded', !expanded);
    content.hidden = expanded;
    button.textContent = expanded ? 'Leer más' : 'Leer menos';
    
    if (!expanded) {
        announceToScreenReader('Contenido expandido', 'polite');
    }
}

function updateYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// =========================
// DATOS - MITOS
// =========================

const MYTHS = [
    { era: 'egipcia', titulo: 'El juicio de Osiris', resumen: 'El alma se pesa con la pluma de Maat.', detalle: 'En la Sala de las Dos Verdades, el corazón del difunto se coloca en una balanza frente a la pluma de Maat. Si el corazón pesa más que la pluma, Ammit lo devora. Si es más ligero, el alma entra al Aaru, el paraíso egipcio.', ref: 'Libro de los Muertos' },
    { era: 'egipcia', titulo: 'Ra y el viaje nocturno', resumen: 'Cada noche cruza el Duat luchando contra Apofis.', detalle: 'Ra navega por el inframundo en su barca. En la séptima hora enfrenta a Apofis, la serpiente del caos. Si vence, el sol renace al amanecer.', ref: 'Textos de las Pirámides' },
    { era: 'egipcia', titulo: 'Isis y el nombre secreto de Ra', resumen: 'Isis arranca a Ra su nombre oculto para obtener poder supremo.', detalle: 'Isis creó una serpiente que mordió a Ra. Solo aceptó sanarlo si le revelaba su nombre verdadero. Ra cedió, transfiriendo gran poder a Isis.', ref: 'Papiros Mágicos' },
    { era: 'egipcia', titulo: 'El asesinato de Osiris', resumen: 'Set asesina y desmiembra a su hermano Osiris.', detalle: 'Set encerró a Osiris en un sarcófago y lo arrojó al Nilo. Luego desmembró su cuerpo en 14 piezas. Isis las recuperó y resucitó a Osiris para concebir a Horus.', ref: 'Plutarco, Sobre Isis y Osiris' },
    { era: 'egipcia', titulo: 'La contienda de Horus y Set', resumen: 'Ochenta años de pruebas divinas para decidir el trono.', detalle: 'Horus y Set compitieron durante 80 años por el trono de Egipto. Finalmente los dioses declararon a Horus rey legítimo, restaurando el orden.', ref: 'Papiro Chester Beatty' },
    { era: 'egipcia', titulo: 'El ave Bennu', resumen: 'El fénix egipcio, ave del renacimiento solar.', detalle: 'El Bennu vive 500 años, luego se inmola en llamas y renace de sus cenizas. Representa la resurrección y el ciclo solar.', ref: 'Textos heliopolitanos' },
    { era: 'egipcia', titulo: 'La creación según Ptah', resumen: 'Ptah crea el mundo con su corazón y su lengua.', detalle: 'Ptah concibió el universo en su pensamiento y lo manifestó mediante la palabra. Este concepto es similar al Logos griego.', ref: 'Piedra de Shabaka' },
    { era: 'egipcia', titulo: 'Sekhmet la Destructora', resumen: 'Ra envía a Sekhmet a castigar la rebelión humana.', detalle: 'Sekhmet comenzó una masacre tan sangrienta que Ra se arrepintió. Los dioses la embriagaron con cerveza roja para detenerla.', ref: 'Libro de la Vaca Celestial' },
    { era: 'egipcia', titulo: 'Thoth y la sabiduría infinita', resumen: 'El ibis divino, escriba de los dioses.', detalle: 'Thoth inventó los jeroglíficos, las matemáticas, la astronomía y la medicina. Registra el juicio de Osiris y posee el conocimiento supremo.', ref: 'Tradición hermopolitana' },
    { era: 'egipcia', titulo: 'Los Siete Hathores', resumen: 'Siete manifestaciones de Hathor predicen el destino.', detalle: 'Las Siete Hathores aparecen al nacer y predicen el destino completo del recién nacido. Su pronunciamiento es irrevocable.', ref: 'Papiro Westcar' },

    { era: 'griega', titulo: 'El nacimiento de Atenea', resumen: 'Surge completamente armada de la cabeza de Zeus.', detalle: 'Zeus se tragó a Metis embarazada. Luego Hefesto abrió su cráneo con un hacha y de allí nació Atenea, completamente adulta y armada.', ref: 'Hesíodo, Teogonía' },
    { era: 'griega', titulo: 'Prometeo y el fuego robado', resumen: 'El titán benefactor entrega el fuego a los humanos.', detalle: 'Prometeo robó el fuego sagrado y lo dio a la humanidad. Zeus lo castigó encadenándolo donde un águila devoraba su hígado eternamente.', ref: 'Hesíodo, Teogonía' },
    { era: 'griega', titulo: 'Los doce trabajos de Heracles', resumen: 'Doce hazañas imposibles para redimirse.', detalle: 'Heracles debió completar doce trabajos imposibles para expiar el asesinato de su familia: matar al león de Nemea, la Hidra, capturar animales mágicos y más.', ref: 'Apolodoro, Biblioteca' },
    { era: 'griega', titulo: 'Orfeo y Eurídice', resumen: 'El músico divino que casi rescata a su amor del Hades.', detalle: 'Orfeo descendió al Hades y con su música conmovió a Hades y Perséfone. Le permitieron llevarse a Eurídice si no miraba atrás. Al final, miró y la perdió.', ref: 'Virgilio, Geórgicas' },
    { era: 'griega', titulo: 'El laberinto del Minotauro', resumen: 'Teseo vence al monstruo taurino.', detalle: 'Teseo usó el hilo de Ariadna para no perderse en el laberinto, mató al Minotauro y escapó.', ref: 'Plutarco, Teseo' },
    { era: 'griega', titulo: 'El rapto de Perséfone', resumen: 'Hades secuestra a Perséfone, creando las estaciones.', detalle: 'Hades raptó a Perséfone. Deméter buscó a su hija y la tierra se volvió estéril. Zeus negoció: Perséfone pasa 6 meses arriba (primavera/verano) y 6 abajo (otoño/invierno).', ref: 'Himno homérico a Deméter' },
    { era: 'griega', titulo: 'Pandora y la jarra', resumen: 'Primera mujer mortal y origen de los males.', detalle: 'Los dioses crearon a Pandora y le dieron una jarra prohibida. Su curiosidad la venció y abrió la jarra liberando todos los males. Solo quedó dentro la Esperanza.', ref: 'Hesíodo, Trabajos y días' },
    { era: 'griega', titulo: 'El vuelo de Ícaro', resumen: 'La arrogancia juvenil y la desobediencia.', detalle: 'Dédalo e Ícaro escaparon con alas de plumas y cera. Dédalo advirtió no volar muy alto. Ícaro desobedeció, el sol derritió la cera y cayó al mar.', ref: 'Ovidio, Metamorfosis' },
    { era: 'griega', titulo: 'Perseo y Medusa', resumen: 'El héroe que decapita a la gorgona.', detalle: 'Perseo usó un escudo como espejo para acercarse a Medusa sin mirarla directamente y la decapitó. De su sangre nacieron Pegaso y Crisaor.', ref: 'Apolodoro, Biblioteca' },
    { era: 'griega', titulo: 'Psique y Eros', resumen: 'Una mortal supera pruebas divinas por amor.', detalle: 'Psique era tan hermosa que Afrodita celosa envió a Eros a maldecirla. Pero Eros se enamoró de ella. Tras pruebas y separación, Zeus la hizo inmortal.', ref: 'Apuleyo, El asno de oro' },

    { era: 'romana', titulo: 'Rómulo y Remo', resumen: 'Gemelos criados por una loba fundan Roma.', detalle: 'Rómulo y Remo fueron amamantados por una loba. Adultos, fundaron Roma. Rómulo mató a Remo por saltar las murallas sagradas.', ref: 'Tito Livio' },
    { era: 'romana', titulo: 'Eneas y el destino de Roma', resumen: 'El héroe troyano viaja hasta Italia.', detalle: 'Eneas escapó de Troya y tras años de viajes llegó al Lacio. Fundó Lavinium, iniciando el linaje que llevaría a Rómulo y Remo.', ref: 'Virgilio, Eneida' },
    { era: 'romana', titulo: 'Numa Pompilio', resumen: 'El segundo rey organiza el calendario y rituales.', detalle: 'Numa transformó Roma mediante la religión. Reformó el calendario, creó colegios sacerdotales y estableció rituales. Roma vivió en paz 43 años.', ref: 'Tito Livio' },
    { era: 'romana', titulo: 'El rapto de las Sabinas', resumen: 'La crisis matrimonial resuelta con integración.', detalle: 'Los romanos raptaron a las sabinas durante un festival. Cuando los pueblos fueron a la guerra, las mujeres se interpusieron pidiendo paz.', ref: 'Tito Livio' },
    { era: 'romana', titulo: 'Hércules y Caco', resumen: 'Hércules mata al monstruo Caco en Roma.', detalle: 'Caco robó ganado de Hércules. El héroe arrancó la montaña, encontró su cueva y estranguló al monstruo de tres cabezas.', ref: 'Virgilio, Eneida' },
    { era: 'romana', titulo: 'Lucrecia', resumen: 'La violación que precipita la República.', detalle: 'Sexto Tarquinio violó a Lucrecia. Ella convocó a su familia, contó lo sucedido y se suicidó. Esto provocó la rebelión que derrocó a los reyes.', ref: 'Tito Livio' },
    { era: 'romana', titulo: 'Horacio Cocles', resumen: 'Un solo hombre detiene un ejército.', detalle: 'Horacio y dos compañeros defendieron el puente Sublicio. Al final, solo Horacio resistió hasta que el puente colapsó. Nadó de vuelta ileso.', ref: 'Tito Livio' },
    { era: 'romana', titulo: 'Los Auspicios', resumen: 'Fundación bajo el signo de los dioses.', detalle: 'Rómulo y Remo observaron aves para decidir quién fundaría Roma. Remo vio 6 buitres, Rómulo 12. Los augures dieron victoria a Rómulo.', ref: 'Plutarco, Rómulo' },
    { era: 'romana', titulo: 'Servio Tulio y Fortuna', resumen: 'El rey esclavo elegido por Fortuna.', detalle: 'Servio Tulio era hijo de esclava. Llamas divinas rodearon su cabeza señalando destino divino. La diosa Fortuna lo protegió y se convirtió en rey.', ref: 'Tito Livio' },
    { era: 'romana', titulo: 'La Sibila de Cumas', resumen: 'Los libros que guiarían el destino de Roma.', detalle: 'La Sibila ofreció 9 libros proféticos. Tarquinio rechazó. Ella quemó 3 y ofreció 6 al mismo precio. Repitió. Finalmente compró los últimos 3.', ref: 'Tito Livio' },

    { era: 'vikinga', titulo: 'Ginnungagap y la creación', resumen: 'Del vacío primordial emergen fuego, hielo y vida.', detalle: 'Entre Muspelheim (fuego) y Niflheim (hielo) existía el vacío Ginnungagap. Del encuentro de calor y frío nació Ymir, el gigante primordial.', ref: 'Völuspá, Gylfaginning' },
    { era: 'vikinga', titulo: 'Yggdrasil', resumen: 'El fresno sagrado conecta los Nueve Mundos.', detalle: 'Yggdrasil es el árbol cósmico que conecta todos los mundos. Tiene tres raíces en diferentes reinos y es mordisqueado constantemente pero se regenera.', ref: 'Grímnismál' },
    { era: 'vikinga', titulo: 'Mjölnir', resumen: 'El martillo de Thor, forjado por enanos.', detalle: 'Loki apostó su cabeza con enanos. Eitri forjó Mjölnir, pero Loki interrumpió dejando el mango corto. Aun así era invencible y protegía Ásgarðr.', ref: 'Skáldskaparmál' },
    { era: 'vikinga', titulo: 'Loki el Tramposo', resumen: 'Hermano de sangre de Odín, catalizador del caos.', detalle: 'Loki causó innumerables problemas pero también salvó a los dioses. Engendró monstruos: Fenrir, Jörmungandr y Hel. Fue castigado con veneno eterno.', ref: 'Lokasenna' },
    { era: 'vikinga', titulo: 'La muerte de Baldr', resumen: 'El dios más amado muere por engaño.', detalle: 'Frigg hizo jurar a todo que no dañaría a Baldr, excepto el muérdago. Loki engañó al ciego Höðr para que lo matara con muérdago.', ref: 'Völuspá' },
    { era: 'vikinga', titulo: 'Ragnarök', resumen: 'El fin apocalíptico y el renacimiento.', detalle: 'Tres inviernos sin verano preceden al fin. Fenrir, Jörmungandr y Loki atacan. Los dioses luchan y caen. Surtr incendia los mundos. Luego nace un mundo nuevo.', ref: 'Völuspá' },
    { era: 'vikinga', titulo: 'La construcción de Ásgarðr', resumen: 'Un gigante constructor y el precio imposible.', detalle: 'Un gigante ofreció reconstruir Ásgarðr a cambio de Freyja, el Sol y la Luna. Loki saboteó seduciendo a su caballo. El gigante falló y Thor lo mató.', ref: 'Gylfaginning' },
    { era: 'vikinga', titulo: 'El hidromiel de la poesía', resumen: 'Odín roba el hidromiel que otorga inspiración.', detalle: 'Los enanos crearon hidromiel de la sangre de Kvasir. Odín sedujo a Gunnlöð, bebió todo el hidromiel, se transformó en águila y escapó.', ref: 'Skáldskaparmál' },
    { era: 'vikinga', titulo: 'Brísingamen', resumen: 'La joya más hermosa obtenida a cambio de cuatro noches.', detalle: 'Freyja vio a enanos forjando el collar Brísingamen. Lo deseaba tanto que aceptó pasar una noche con cada uno de los cuatro enanos.', ref: 'Sörla þáttr' },
    { era: 'vikinga', titulo: 'Fenrir y las cadenas', resumen: 'El lobo profetizado a matar a Odín.', detalle: 'Los dioses intentaron atar a Fenrir. Rompió dos cadenas. Solo Gleipnir, hecha de imposibles, lo retuvo. Tyr perdió su mano en el proceso.', ref: 'Gylfaginning' },

    { era: 'azteca', titulo: 'Nacimiento de Huitzilopochtli', resumen: 'El dios solar nace completamente armado.', detalle: 'Coatlicue quedó embarazada milagrosamente. Sus hijos conspiraron matarla. Huitzilopochtli nació armado, decapitó a Coyolxauhqui y dispersó a sus hermanos.', ref: 'Historia General, Libro III' },
    { era: 'azteca', titulo: 'El Quinto Sol', resumen: 'La creación actual sostenida por sacrificio.', detalle: 'Cuatro eras terminaron en catástrofes. Para el Quinto Sol, Nanahuatzin se sacrificó arrojándose al fuego convirtiéndose en el Sol.', ref: 'Leyenda de los Soles' },
    { era: 'azteca', titulo: 'Quetzalcóatl en el Mictlán', resumen: 'Quetzalcóatl crea la humanidad actual.', detalle: 'Quetzalcóatl descendió al Mictlán por huesos antiguos. Huyendo cayó y los huesos se rompieron. Los molió y mezcló con sangre divina creando humanos.', ref: 'Códice Chimalpopoca' },
    { era: 'azteca', titulo: 'Coyolxauhqui desmembrada', resumen: 'La diosa lunar derrotada por su hermano solar.', detalle: 'Coyolxauhqui lideró a sus 400 hermanos contra Coatlicue. Huitzilopochtli nació y la decapitó, desmembrando su cuerpo.', ref: 'Historia General' },
    { era: 'azteca', titulo: 'Tláloc y el diluvio', resumen: 'El señor de la lluvia inunda el mundo.', detalle: 'Chalchiuhtlicue lloró sangre durante 52 años causando un diluvio apocalíptico. Quetzalcóatl y Tezcatlipoca levantaron el cielo caído.', ref: 'Leyenda de los Soles' },
    { era: 'azteca', titulo: 'Ceremonia del Fuego Nuevo', resumen: 'Renovación cósmica cada 52 años.', detalle: 'Cada 52 años se apagaban todos los fuegos. A medianoche, si se generaba Fuego Nuevo sobre el pecho de un sacrificado, el mundo continuaba.', ref: 'Códice Borbónico' },
    { era: 'azteca', titulo: 'Xochiquetzal', resumen: 'Hermosa diosa raptada del Tlalocan.', detalle: 'Xochiquetzal era esposa de Tláloc. Tezcatlipoca la raptó y la llevó al Tamoanchan. Este fue el primer adulterio divino.', ref: 'Códice Borgia' },
    { era: 'azteca', titulo: 'El nacimiento del maíz', resumen: 'Quetzalcóatl descubre el maíz.', detalle: 'Quetzalcóatl se transformó en hormiga negra para entrar al Tonacatépetl donde estaba escondido el maíz. Cargó granos y alimentó a los humanos.', ref: 'Anales de Cuauhtitlán' },
    { era: 'azteca', titulo: 'Mayahuel y el pulque', resumen: 'La diosa del maguey y el néctar sagrado.', detalle: 'Quetzalcóatl llevó a Mayahuel a la tierra. Su abuela furiosa la despedazó. De sus restos brotó el primer maguey y se descubrió el pulque.', ref: 'Historia General' },
    { era: 'azteca', titulo: 'Chalchiuhtotolin', resumen: 'Dios de pestilencias que castiga pero inspira.', detalle: 'Chalchiuhtotolin (Pavo Jade) era manifestación oscura de Tezcatlipoca. Castigaba pecados con enfermedades pero otorgaba inspiración a quienes soportaban pruebas.', ref: 'Códice Borgia' },

    { era: 'japonesa', titulo: 'Izanagi e Izanami', resumen: 'Creación de las islas de Japón.', detalle: 'Izanagi e Izanami agitaron el mar primordial con la lanza Ame-no-nuboko. Las gotas formaron islas. Procrearon las ocho islas de Japón y muchos dioses.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'La cueva de Amaterasu', resumen: 'La diosa sol se oculta, sumiendo el mundo en oscuridad.', detalle: 'Ofendida por Susanoo, Amaterasu se encerró en una cueva. Ame-no-Uzume bailó eróticamente haciendo reír a los dioses. Amaterasu salió curiosa y fue atrapada.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'Susanoo y Yamata-no-Orochi', resumen: 'El dios mata a la serpiente de ocho cabezas.', detalle: 'Susanoo embriagó a Orochi con sake y lo despedazó. En su cola encontró la espada Kusanagi, una de las tres insignias imperiales.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'Descenso de Ninigi', resumen: 'El nieto de Amaterasu desciende con los Tres Tesoros.', detalle: 'Amaterasu envió a Ninigi a gobernar la tierra. Le dio el espejo, las joyas y la espada. Estos objetos son las insignias del emperador.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'Tsukuyomi y Uke Mochi', resumen: 'El asesinato que separó día y noche.', detalle: 'Uke Mochi sirvió comida que salió de su boca. Tsukuyomi, disgustado, la mató. Amaterasu furiosa se separó de él eternamente, dividiendo día y noche.', ref: 'Nihon Shoki' },
    { era: 'japonesa', titulo: 'Izanagi en Yomi', resumen: 'El dios viaja al inframundo y escapa.', detalle: 'Izanagi descendió a Yomi por Izanami. La vio putrefacta y huyó. Ella lo persiguió. Él bloqueó el paso y se divorciaron. Luego se purificó naciendo Amaterasu, Tsukuyomi y Susanoo.', ref: 'Kojiki' },
    { era: 'japonesa', titulo: 'Inari y los zorros', resumen: 'El dios del arroz servido por zorros blancos mágicos.', detalle: 'Inari es dios del arroz, fertilidad y prosperidad. Sus mensajeros son kitsune (zorros blancos) con poderes sobrenaturales.', ref: 'Tradición sintoísta' },
    { era: 'japonesa', titulo: 'Momotarō', resumen: 'Un niño nacido de un melocotón gigante.', detalle: 'Momotarō nació de un melocotón gigante. Con ayuda de un perro, mono y faisán, viajó a Onigashima y derrotó a los oni, liberando prisioneros.', ref: 'Folclore japonés' },
    { era: 'japonesa', titulo: 'Urashima Tarō', resumen: 'Un pescador pierde 300 años en un día mágico.', detalle: 'Urashima salvó una tortuga que lo llevó al palacio del Rey Dragón. Vivió "unos días" pero al regresar habían pasado 300 años. Abrió una caja prohibida y envejeció instantáneamente.', ref: 'Folclore japonés' },
    { era: 'japonesa', titulo: 'Raijin y Fujin', resumen: 'Hermanos divinos que controlan las tormentas.', detalle: 'Raijin (trueno) toca tambores y Fujin (viento) abre su bolsa de vientos. Durante la invasión mongola enviaron los kamikaze (vientos divinos) salvando Japón.', ref: 'Tradición sintoísta' }
];

// =========================
// DATOS - PERSONAJES
// =========================

const CHARACTERS = [
    { era: 'egipcia', nombre: 'Ra', rol: 'Dios solar', detalle: 'Creador y garante del orden cósmico.' },
    { era: 'egipcia', nombre: 'Isis', rol: 'Magia y maternidad', detalle: 'Diosa más poderosa en artes mágicas.' },
    { era: 'egipcia', nombre: 'Osiris', rol: 'Más allá', detalle: 'Juez de los muertos, símbolo de resurrección.' },
    { era: 'egipcia', nombre: 'Horus', rol: 'Realeza', detalle: 'Halcón divino, dios del cielo.' },
    { era: 'egipcia', nombre: 'Anubis', rol: 'Momificación', detalle: 'Chacal que guía las almas.' },
    { era: 'egipcia', nombre: 'Thoth', rol: 'Sabiduría', detalle: 'Ibis, escriba divino, inventor de escritura.' },
    { era: 'egipcia', nombre: 'Sekhmet', rol: 'Guerra', detalle: 'Leona feroz, ojo vengador de Ra.' },
    { era: 'egipcia', nombre: 'Ptah', rol: 'Creador', detalle: 'Artesano divino de Menfis.' },
    { era: 'egipcia', nombre: 'Hathor', rol: 'Amor', detalle: 'Vaca sagrada, alegría y maternidad.' },
    { era: 'egipcia', nombre: 'Set', rol: 'Caos', detalle: 'Dios de tormentas y desiertos.' },

    { era: 'griega', nombre: 'Zeus', rol: 'Soberano', detalle: 'Rey de dioses, rayo y trueno.' },
    { era: 'griega', nombre: 'Atenea', rol: 'Sabiduría', detalle: 'Estratega, patrona de Atenas.' },
    { era: 'griega', nombre: 'Hades', rol: 'Inframundo', detalle: 'Gobierna el reino de los muertos.' },
    { era: 'griega', nombre: 'Prometeo', rol: 'Titán', detalle: 'Ladrón del fuego divino.' },
    { era: 'griega', nombre: 'Heracles', rol: 'Héroe', detalle: 'Fuerza sobrehumana, doce trabajos.' },
    { era: 'griega', nombre: 'Afrodita', rol: 'Amor', detalle: 'Nacida de la espuma del mar.' },
    { era: 'griega', nombre: 'Apolo', rol: 'Luz', detalle: 'Dios solar, música y profecía.' },
    { era: 'griega', nombre: 'Artemisa', rol: 'Caza', detalle: 'Cazadora virgen, diosa de la luna.' },
    { era: 'griega', nombre: 'Hermes', rol: 'Mensajero', detalle: 'Psicopompo, comercio y viajes.' },
    { era: 'griega', nombre: 'Poseidón', rol: 'Mar', detalle: 'Tridente, dominio de océanos.' },

    { era: 'romana', nombre: 'Júpiter', rol: 'Soberano', detalle: 'Rey de dioses, protector de Roma.' },
    { era: 'romana', nombre: 'Juno', rol: 'Matrimonio', detalle: 'Reina, protectora de mujeres.' },
    { era: 'romana', nombre: 'Eneas', rol: 'Fundador', detalle: 'Ancestor de romanos.' },
    { era: 'romana', nombre: 'Rómulo', rol: 'Fundador de Roma', detalle: 'Primer rey, estableció instituciones.' },
    { era: 'romana', nombre: 'Marte', rol: 'Guerra', detalle: 'Padre de Rómulo y Remo.' },
    { era: 'romana', nombre: 'Venus', rol: 'Amor', detalle: 'Madre de Eneas, protectora de Roma.' },
    { era: 'romana', nombre: 'Minerva', rol: 'Sabiduría', detalle: 'Patrona de artesanos.' },
    { era: 'romana', nombre: 'Vesta', rol: 'Hogar', detalle: 'Fuego eterno del estado.' },
    { era: 'romana', nombre: 'Jano', rol: 'Transiciones', detalle: 'Dios de dos caras, comienzos.' },
    { era: 'romana', nombre: 'Numa', rol: 'Legislador', detalle: 'Segundo rey, organizó religión.' },

    { era: 'vikinga', nombre: 'Odín', rol: 'Padre de todo', detalle: 'Sabiduría, runas, sacrificio.' },
    { era: 'vikinga', nombre: 'Thor', rol: 'Trueno', detalle: 'Protector con Mjölnir.' },
    { era: 'vikinga', nombre: 'Loki', rol: 'Trickster', detalle: 'Cambio, caos, engaño.' },
    { era: 'vikinga', nombre: 'Freya', rol: 'Amor', detalle: 'Guerra, fertilidad, magia.' },
    { era: 'vikinga', nombre: 'Baldr', rol: 'Luz', detalle: 'Amado por todos, muerte trágica.' },
    { era: 'vikinga', nombre: 'Tyr', rol: 'Guerra justa', detalle: 'Sacrificó su mano por Fenrir.' },
    { era: 'vikinga', nombre: 'Heimdall', rol: 'Guardián', detalle: 'Vigila Bifröst.' },
    { era: 'vikinga', nombre: 'Frigg', rol: 'Maternidad', detalle: 'Esposa de Odín, clarividencia.' },
    { era: 'vikinga', nombre: 'Fenrir', rol: 'Lobo', detalle: 'Devorará a Odín en Ragnarök.' },
    { era: 'vikinga', nombre: 'Hel', rol: 'Muertos', detalle: 'Señora del reino de los muertos.' },

    { era: 'azteca', nombre: 'Quetzalcóatl', rol: 'Serpiente emplumada', detalle: 'Viento, sabiduría, vida.' },
    { era: 'azteca', nombre: 'Huitzilopochtli', rol: 'Guerra y sol', detalle: 'Patrono de México-Tenochtitlan.' },
    { era: 'azteca', nombre: 'Tezcatlipoca', rol: 'Noche', detalle: 'Espejo humeante, destino.' },
    { era: 'azteca', nombre: 'Coatlicue', rol: 'Madre', detalle: 'Falda de serpientes.' },
    { era: 'azteca', nombre: 'Tláloc', rol: 'Lluvia', detalle: 'Dios de tormentas.' },
    { era: 'azteca', nombre: 'Xochiquetzal', rol: 'Amor', detalle: 'Belleza, flores, placer.' },
    { era: 'azteca', nombre: 'Mictlantecuhtli', rol: 'Muertos', detalle: 'Soberano del Mictlán.' },
    { era: 'azteca', nombre: 'Chalchiuhtlicue', rol: 'Aguas', detalle: 'Ríos, lagos, lluvia.' },
    { era: 'azteca', nombre: 'Coyolxauhqui', rol: 'Luna', detalle: 'Desmembrada por Huitzilopochtli.' },
    { era: 'azteca', nombre: 'Mayahuel', rol: 'Maguey', detalle: 'Diosa del pulque.' },

    { era: 'japonesa', nombre: 'Amaterasu', rol: 'Sol', detalle: 'Deidad suprema sintoísta.' },
    { era: 'japonesa', nombre: 'Susanoo', rol: 'Tormentas', detalle: 'Vencedor de Orochi.' },
    { era: 'japonesa', nombre: 'Tsukuyomi', rol: 'Luna', detalle: 'Separado eternamente de Amaterasu.' },
    { era: 'japonesa', nombre: 'Izanagi', rol: 'Progenitor', detalle: 'Creador de islas.' },
    { era: 'japonesa', nombre: 'Izanami', rol: 'Progenitora', detalle: 'Señora de Yomi.' },
    { era: 'japonesa', nombre: 'Inari', rol: 'Arroz', detalle: 'Fertilidad, zorros mensajeros.' },
    { era: 'japonesa', nombre: 'Raijin', rol: 'Trueno', detalle: 'Demonio oni de tormentas.' },
    { era: 'japonesa', nombre: 'Fujin', rol: 'Viento', detalle: 'Bolsa de vientos.' },
    { era: 'japonesa', nombre: 'Ryūjin', rol: 'Dragón', detalle: 'Rey del océano.' },
    { era: 'japonesa', nombre: 'Kitsune', rol: 'Zorros', detalle: 'Mensajeros mágicos de Inari.' }
];

// =========================
// DATOS - PREGUNTAS
// =========================

const QUESTIONS_POOL = [
    { era: 'egipcia', texto: '¿Qué se pesa contra la pluma de Maat?', opciones: ['El corazón', 'El cerebro', 'El hígado', 'El alma'], correcta: 0, pista: 'Órgano del pensamiento en Egipto.' },
    { era: 'egipcia', texto: '¿A quién combate Ra cada noche?', opciones: ['Apofis', 'Set', 'Anubis', 'Sobek'], correcta: 0, pista: 'La serpiente del caos.' },
    { era: 'egipcia', texto: '¿Cómo obtuvo Isis el nombre secreto de Ra?', opciones: ['Se lo robó', 'Creó una serpiente', 'Se lo dijo Thoth', 'Lo adivinó'], correcta: 1, pista: 'Usó veneno como chantaje.' },
    { era: 'egipcia', texto: '¿Cuántas piezas tenía el cuerpo desmembrado de Osiris?', opciones: ['7', '12', '14', '40'], correcta: 2, pista: 'Número de provincias.' },
    { era: 'egipcia', texto: '¿Cuánto duró la contienda entre Horus y Set?', opciones: ['7 años', '40 años', '80 años', '100 años'], correcta: 2, pista: 'Ocho décadas.' },

    { era: 'griega', texto: '¿De dónde nació Atenea?', opciones: ['Del mar', 'Del corazón de Hera', 'De la cabeza de Zeus', 'De un olivo'], correcta: 2, pista: 'Hefesto la liberó con hacha.' },
    { era: 'griega', texto: '¿Quién robó el fuego del Olimpo?', opciones: ['Hermes', 'Prometeo', 'Hefesto', 'Apolo'], correcta: 1, pista: 'Un titán benefactor.' },
    { era: 'griega', texto: '¿Cuántos trabajos realizó Heracles?', opciones: ['7', '10', '12', '20'], correcta: 2, pista: 'Meses del año.' },
    { era: 'griega', texto: '¿Qué condición impuso Hades para liberar a Eurídice?', opciones: ['No hablar', 'No mirar atrás', 'No tocarla', 'No mencionar su nombre'], correcta: 1, pista: 'Orfeo falló al final.' },
    { era: 'griega', texto: '¿Qué le dio Ariadna a Teseo?', opciones: ['Una espada', 'Un mapa', 'Un ovillo de hilo', 'Una antorcha'], correcta: 2, pista: 'Para salir del laberinto.' },

    { era: 'romana', texto: '¿Quién fundó Roma?', opciones: ['Eneas', 'Rómulo', 'Numa', 'Remo'], correcta: 1, pista: 'Mató a su gemelo.' },
    { era: 'romana', texto: '¿Qué obra narra el viaje de Eneas?', opciones: ['Ilíada', 'Odisea', 'Eneida', 'Metamorfosis'], correcta: 2, pista: 'Escrita por Virgilio.' },
    { era: 'romana', texto: '¿Qué rey organizó el calendario romano?', opciones: ['Rómulo', 'Numa Pompilio', 'Tulio Hostilio', 'Tarquinio'], correcta: 1, pista: 'El segundo rey pacífico.' },
    { era: 'romana', texto: '¿De qué pueblo raptaron a las mujeres?', opciones: ['Etruscos', 'Latinos', 'Sabinos', 'Griegos'], correcta: 2, pista: 'Vecinos cercanos.' },
    { era: 'romana', texto: '¿Qué monstruo mató Hércules en el Foro Boario?', opciones: ['La Quimera', 'Cerbero', 'Caco', 'El Minotauro'], correcta: 2, pista: 'Gigante de tres cabezas.' },

    { era: 'vikinga', texto: '¿Cómo se llama el abismo primordial nórdico?', opciones: ['Midgard', 'Ginnungagap', 'Niflheim', 'Hel'], correcta: 1, pista: 'Vacío entre fuego y hielo.' },
    { era: 'vikinga', texto: '¿Cuántos mundos conecta Yggdrasil?', opciones: ['Tres', 'Siete', 'Nueve', 'Doce'], correcta: 2, pista: 'Número sagrado nórdico.' },
    { era: 'vikinga', texto: '¿Qué arma distingue a Thor?', opciones: ['Gungnir', 'Draupnir', 'Mjölnir', 'Skidbladnir'], correcta: 2, pista: 'Martillo que regresa.' },
    { era: 'vikinga', texto: '¿Qué sacrificó Odín para beber del Pozo de Mímir?', opciones: ['Su mano', 'Un ojo', 'Su hijo', 'Su trono'], correcta: 1, pista: 'Por eso es tuerto.' },
    { era: 'vikinga', texto: '¿Con qué planta mataron a Baldr?', opciones: ['Cicuta', 'Muérdago', 'Acónito', 'Mandrágora'], correcta: 1, pista: 'La única que no juró.' },

    { era: 'azteca', texto: '¿Dónde nació Huitzilopochtli?', opciones: ['Tenochtitlan', 'Coatepec', 'Tamoanchan', 'Tollan'], correcta: 1, pista: 'Cerro de la Serpiente.' },
    { era: 'azteca', texto: '¿Qué número identifica al Sol actual?', opciones: ['Tercer Sol', 'Cuarto Sol', 'Quinto Sol', 'Sexto Sol'], correcta: 2, pista: 'Nahui-Ollin.' },
    { era: 'azteca', texto: '¿Con qué creó Quetzalcóatl a los humanos?', opciones: ['Maíz', 'Arcilla', 'Huesos y sangre divina', 'Jade'], correcta: 2, pista: 'Del Mictlán.' },
    { era: 'azteca', texto: '¿Quién desmembró a Coyolxauhqui?', opciones: ['Tezcatlipoca', 'Quetzalcóatl', 'Huitzilopochtli', 'Tláloc'], correcta: 2, pista: 'Su hermano recién nacido.' },
    { era: 'azteca', texto: '¿Cada cuántos años se celebraba el Fuego Nuevo?', opciones: ['13 años', '20 años', '52 años', '104 años'], correcta: 2, pista: 'Ciclo de calendarios.' },

    { era: 'japonesa', texto: '¿Quién se encerró en la cueva celestial?', opciones: ['Susanoo', 'Amaterasu', 'Tsukuyomi', 'Izanami'], correcta: 1, pista: 'Diosa del Sol.' },
    { era: 'japonesa', texto: '¿Qué espada encontró Susanoo en Orochi?', opciones: ['Muramasa', 'Masamune', 'Kusanagi', 'Onimaru'], correcta: 2, pista: 'Una de las tres insignias.' },
    { era: 'japonesa', texto: '¿Cuántas cabezas tenía Yamata-no-Orochi?', opciones: ['Tres', 'Cinco', 'Ocho', 'Doce'], correcta: 2, pista: 'También ocho colas.' },
    { era: 'japonesa', texto: '¿Quién mató a Uke Mochi?', opciones: ['Izanagi', 'Susanoo', 'Tsukuyomi', 'Ninigi'], correcta: 2, pista: 'Dios de la luna.' },
    { era: 'japonesa', texto: '¿Cuántos años habían pasado cuando Urashima regresó?', opciones: ['10 años', '100 años', '300 años', '1000 años'], correcta: 2, pista: 'Tres siglos.' }
];

// =========================
// MYTHICAPP - APLICACIÓN DE MITOLOGÍA
// =========================

// ESTADO GLOBAL
let currentSection = 'home';
let currentQuizIndex = 0;
let quizScore = 0;
let quizQuestions = [];
let userAnswers = [];
let lastScore = null;

// DATOS - Los mitos y personajes están al final del archivo

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
    loadLastScore();
    updateYear();
}

// =========================
// NAVEGACIÓN
// =========================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.dataset.section;
            showSection(section);
        });
    });
}

function showSection(sectionId) {
    // Cerrar menú móvil si está abierto
    const navLinks = document.getElementById('nav-links');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.hidden = true;
    });

    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.hidden = false;
        currentSection = sectionId;
    }

    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================
// MENÚ MÓVIL
// =========================

function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// =========================
// TEMA DARK/LIGHT
// =========================

function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
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
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Actualizar tabs
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.tabIndex = -1;
            });
            tab.setAttribute('aria-selected', 'true');
            tab.tabIndex = 0;

            // Renderizar mitos filtrados
            const filter = tab.dataset.filter;
            renderMyths(filter);
        });
    });
}

function setupLibrarySearch() {
    const searchBox = document.getElementById('library-search');
    searchBox.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeTab = document.querySelector('#library-tabs .tab[aria-selected="true"]');
        const filter = activeTab.dataset.filter;
        renderMyths(filter, query);
    });
}

function renderMyths(filter = 'todas', searchQuery = '') {
    const grid = document.getElementById('myths-grid');

    let filtered = filter === 'todas'
        ? MYTHS.filter(m => m.titulo) // Solo mitos (tienen título)
        : MYTHS.filter(m => m.titulo && m.era === filter);

    if (searchQuery) {
        filtered = filtered.filter(m =>
            m.titulo.toLowerCase().includes(searchQuery) ||
            m.resumen.toLowerCase().includes(searchQuery) ||
            m.detalle.toLowerCase().includes(searchQuery)
        );
    }

    grid.innerHTML = filtered.map(myth => `
    <article class="content-item">
      <span class="item-tag">${capitalizeFirst(myth.era)}</span>
      <h3 class="item-title">${myth.titulo}</h3>
      <p class="item-description">${myth.resumen}</p>
      <div class="item-expandable">
        <button class="expand-button" onclick="toggleExpand(this)" aria-expanded="false">
          Leer más
        </button>
        <div class="expanded-content" hidden>
          <p style="margin-top:12px;color:var(--text-secondary);line-height:1.6">${myth.detalle}</p>
          <p class="caption" style="margin-top:10px;font-style:italic">Fuente: ${myth.ref}</p>
        </div>
      </div>
    </article>
  `).join('');
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
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.tabIndex = -1;
            });
            tab.setAttribute('aria-selected', 'true');
            tab.tabIndex = 0;

            const filter = tab.dataset.filter;
            renderCharacters(filter);
        });
    });
}

function setupCharactersSearch() {
    const searchBox = document.getElementById('characters-search');
    searchBox.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeTab = document.querySelector('#characters-tabs .tab[aria-selected="true"]');
        const filter = activeTab.dataset.filter;
        renderCharacters(filter, query);
    });
}

function renderCharacters(filter = 'todas', searchQuery = '') {
    const grid = document.getElementById('characters-grid');

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

    grid.innerHTML = filtered.map(char => `
    <article class="content-item">
      <span class="item-tag">${capitalizeFirst(char.era)}</span>
      <h3 class="item-title">${char.nombre}</h3>
      <p class="item-subtitle">${char.rol}</p>
      <p class="item-description">${char.detalle}</p>
    </article>
  `).join('');
}

// =========================
// QUIZ
// =========================

function startQuiz() {
    // Seleccionar 15 preguntas aleatorias
    quizQuestions = shuffleArray([...QUESTIONS_POOL]).slice(0, 15);
    currentQuizIndex = 0;
    quizScore = 0;
    userAnswers = [];

    showSection('quiz');
    renderQuestion();
    updateProgress();
}

function renderQuestion() {
    const content = document.getElementById('quiz-content');
    const question = quizQuestions[currentQuizIndex];
    const nextBtn = document.getElementById('next-btn');

    nextBtn.disabled = true;
    nextBtn.textContent = currentQuizIndex === quizQuestions.length - 1 ? 'Ver resultados' : 'Siguiente';

    content.innerHTML = `
    <div class="question-card">
      <span class="question-meta">${capitalizeFirst(question.era)}</span>
      <h3 class="question-text">${question.texto}</h3>
      <div class="options" role="radiogroup" aria-label="Opciones de respuesta">
        ${question.opciones.map((opcion, index) => `
          <button class="option" role="radio" aria-checked="false" onclick="selectAnswer(${index})">
            <span class="option-number">${String.fromCharCode(65 + index)}</span>
            <span>${opcion}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

    // Setup next button
    nextBtn.onclick = () => {
        if (currentQuizIndex < quizQuestions.length - 1) {
            currentQuizIndex++;
            renderQuestion();
            updateProgress();
        } else {
            showResults();
        }
    };
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuizIndex];
    const options = document.querySelectorAll('.option');
    const nextBtn = document.getElementById('next-btn');
    const content = document.getElementById('quiz-content');

    // Deshabilitar opciones
    options.forEach(opt => opt.classList.add('disabled'));

    // Marcar respuesta seleccionada
    const isCorrect = selectedIndex === question.correcta;
    userAnswers.push({ question, selectedIndex, isCorrect });

    if (isCorrect) {
        quizScore++;
        options[selectedIndex].classList.add('correct');
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[question.correcta].classList.add('correct');
    }

    // Actualizar contador de puntuación
    document.getElementById('score-counter').textContent = `Puntuación: ${quizScore}`;

    // Mostrar feedback
    const feedbackHTML = `
    <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}" role="status">
      <span style="font-size:20px">${isCorrect ? '✓' : '✗'}</span>
      <span>${isCorrect ? '¡Correcto!' : 'Incorrecto. '} ${question.pista || ''}</span>
    </div>
  `;
    content.querySelector('.question-card').insertAdjacentHTML('beforeend', feedbackHTML);

    nextBtn.disabled = false;
}

function updateProgress() {
    const progress = ((currentQuizIndex + 1) / quizQuestions.length) * 100;
    const fill = document.getElementById('progress-fill');
    const counter = document.getElementById('question-counter');
    const progressBar = document.querySelector('.progress-bar');

    fill.style.width = `${progress}%`;
    counter.textContent = `Pregunta ${currentQuizIndex + 1} de ${quizQuestions.length}`;
    progressBar.setAttribute('aria-valuenow', progress);
}

function showResults() {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    lastScore = { score: quizScore, total: quizQuestions.length, percentage };
    localStorage.setItem('lastScore', JSON.stringify(lastScore));

    const resultsContent = document.getElementById('results-content');

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
      <button class="btn-primary" onclick="startQuiz()">Repetir quiz</button>
      <button class="btn-secondary" onclick="showSection('home')">Volver a inicio</button>
    </div>
    
    <div class="results-breakdown">
      <h3>Desglose de respuestas:</h3>
      <ul>
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

    showSection('results');
    loadLastScore(); // Actualizar badge en home
}

// =========================
// SCORE BADGE
// =========================

function loadLastScore() {
    const scoreContainer = document.getElementById('home-score');
    const saved = localStorage.getItem('lastScore');

    if (saved) {
        lastScore = JSON.parse(saved);
        scoreContainer.innerHTML = `
      <div class="score-badge">
        <div class="score-label">Último resultado</div>
        <div class="score-value">${lastScore.score}/${lastScore.total}</div>
      </div>
    `;
    }
}

// =========================
// UTILIDADES
// =========================

function capitalizeFirst(str) {
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

    button.setAttribute('aria-expanded', !expanded);
    content.hidden = expanded;
    button.textContent = expanded ? 'Leer más' : 'Leer menos';
}

function updateYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// =========================
// DATOS DE LA APLICACIÓN - PARTE 2/2
// Agrega esto al final de script.js después del código de la Parte 1
// =========================

/**
 * Colección de mitos organizados por cultura 
 * 10 mitos por cultura con detalles extensos
 */
const MYTHS = [
    /* Egipcia - 10 mitos */
    { era: 'egipcia', titulo: 'El juicio de Osiris', resumen: 'El alma se pesa con la pluma de Maat.', detalle: 'En la Sala de las Dos Verdades, el corazón del difunto se coloca en una balanza frente a la pluma de Maat, símbolo de la justicia y el orden cósmico. Si el corazón, cargado con los actos de toda una vida, pesa más que la pluma debido a malas acciones, la criatura Ammit (mitad cocodrilo, mitad león, mitad hipopótamo) devora el alma del difunto, condenándola a la inexistencia. Si el corazón es más ligero o igual que la pluma, el alma es declarada «verdadera de voz» y obtiene permiso para entrar en el Aaru, los Campos de Juncos, el paraíso egipcio donde vive eternamente bajo la protección de Osiris.', ref: 'Libro de los Muertos, Conjuro 125' },
    { era: 'egipcia', titulo: 'Ra y el viaje nocturno', resumen: 'Cada noche cruza el Duat luchando contra Apofis.', detalle: 'Cada atardecer, Ra embarca en su barca solar dorada (Mandjet durante el día, Mesektet por la noche) y navega a través del Duat, el peligroso inframundo egipcio dividido en doce horas/regiones. En la séptima hora, Ra debe enfrentarse a su archienemigo Apofis, la gigantesca serpiente del caos que intenta detener el ciclo solar bebiendo las aguas primordiales. Set, normalmente antagonista, defiende la barca con su lanza. Si Ra emerge victorioso al amanecer, el mundo se renueva; si Apofis prevaleciera alguna vez, el universo entero caería en la oscuridad eterna.', ref: 'Textos de las Pirámides, Libro de las Puertas' },
    { era: 'egipcia', titulo: 'Isis y el nombre secreto de Ra', resumen: 'Isis arranca a Ra su nombre oculto para obtener poder supremo.', detalle: 'Isis, la más astuta de los dioses, anhelaba el poder del nombre verdadero de Ra, que era la fuente de todo su poder divino. Creó una serpiente de tierra y saliva de Ra, que mordió al dios solar causándole un dolor insoportable que ningún otro dios podía curar. Isis se ofreció a sanarlo, pero exigió conocer su nombre secreto. Ra intentó engañarla enumerando sus muchos títulos, pero el veneno continuaba devastándolo. Finalmente, desesperado, susurró su verdadero nombre directamente a Isis, transfiriéndole así un poder equivalente al suyo propio. Con este conocimiento, Isis se convirtió en la más poderosa de las magias.', ref: 'Papiros Mágicos de Turín, Ramésida' },
    { era: 'egipcia', titulo: 'El asesinato de Osiris por Set', resumen: 'Set asesina y desmiembra a su hermano Osiris por envidia al trono.', detalle: 'Set, dios del desierto y el caos, consumido por los celos del poder y popularidad de su hermano Osiris, conspiró para asesinarlo. Durante un banquete, Set presentó un magnífico sarcófago decorado prometiendo regalarlo a quien cupiera perfectamente. Cuando Osiris se recostó dentro, Set y sus 72 conspiradores cerraron la tapa, la sellaron con plomo fundido y la arrojaron al Nilo. Isis recuperó el cuerpo, pero Set lo encontró, lo desmembró en 14 piezas y las esparció por todo Egipto. Isis, con ayuda de Neftis y Anubis, encontró todas las piezas excepto el falo, reconstruyó a Osiris con vendas mágicas y lo revivió temporalmente para concebir a Horus, vengador de su padre.', ref: 'Plutarco, Sobre Isis y Osiris; Textos de los Sarcófagos' },
    { era: 'egipcia', titulo: 'La contienda de Horus y Set', resumen: 'Ochenta años de pruebas divinas para decidir el trono de Egipto.', detalle: 'Tras la muerte de Osiris, Horus y Set reclamaron el trono de Egipto ante la Enéada. Durante 80 años se sometieron a pruebas: carreras de barcos de piedra (Horus hizo trampa usando madera pintada), transformaciones en hipopótamos, y competencias que los textos describen explícitamente. Finalmente, tras muchas batallas (en una de las cuales Set arranca el ojo de Horus y Horus castra a Set), la Enéada declaró a Horus rey legítimo, restaurando el Maat (orden) sobre Isfet (caos).', ref: 'Papiro Chester Beatty I' },
    { era: 'egipcia', titulo: 'El ave Bennu y la creación cíclica', resumen: 'El fénix egipcio, ave del renacimiento solar.', detalle: 'El Bennu es una garza o ave similar que representa el ba (alma-manifestación) de Ra. Según el mito, el Bennu se posó en la piedra Benben al amanecer de la creación y emitió el primer grito que dividió el silencio primigenio. El ave vive durante 500 años, luego construye un nido de ramas aromáticas, se inmola en llamas y renace de sus propias cenizas. Los griegos adoptaron esta creencia como el mito del Fénix. El Bennu también guía a las almas en el Duat y representa la esperanza de resurrección.', ref: 'Textos heliopolitanos, Herodoto' },
    { era: 'egipcia', titulo: 'La creación según Ptah de Menfis', resumen: 'Ptah crea el mundo con su corazón y su lengua.', detalle: 'En la cosmogonía menfita, Ptah concibió el universo en su corazón (sede del pensamiento) y lo manifestó mediante su lengua (la palabra). Primero pensó en Atum, y Atum existió. Luego pronunció los nombres de todos los dioses y cosas, y vinieron a la existencia. Este concepto de creación mediante el pensamiento y el logos es similar al "En el principio era el Verbo". Ptah también creó la Enéada y estableció los centros de culto. Es el patrono de artesanos, arquitectos y herreros.', ref: 'Piedra de Shabaka, Teología Menfita' },
    { era: 'egipcia', titulo: 'Sekhmet la Destructora', resumen: 'Ra envía a Sekhmet a castigar la rebelión humana.', detalle: 'Cuando Ra envejeció y los humanos conspiraron contra él, transformó a su ojo divino en Sekhmet, una leonina feroz e insaciable. Sekhmet descendió y comenzó una masacre tan sangrienta que vadeó en sangre hasta las rodillas. Ra, arrepentido, intentó detenerla, pero Sekhmet estaba en un frenesí. Los dioses prepararon 7.000 jarras de cerveza mezclada con granada roja para que pareciera sangre. Sekhmet bebió la "sangre", se embriagó, y al despertar se había transformado en la dulce diosa Hathor. Este mito explica el carácter dual de Sekhmet (destructora) y Hathor (nutricia).', ref: 'Libro de la Vaca Celestial' },
    { era: 'egipcia', titulo: 'Thoth y la sabiduría infinita', resumen: 'El ibis divino, escriba de los dioses e inventor de la escritura.', detalle: 'Thoth, representado como ibis o babuino, inventó los jeroglíficos, las matemáticas, la astronomía, la medicina y la música. En el juicio de Osiris, Thoth registra el resultado del pesaje del corazón. Actuó como mediador entre Horus y Set, curando las heridas de Horus. Como medidor del tiempo, Thoth dividió el año en 365 días mediante una apuesta con la luna. Se le atribuye el mítico Libro de Thoth, que contenía todo el conocimiento mágico del universo y podía otorgar poder sobre la naturaleza y los dioses mismos.', ref: 'Tradición hermopolitana, Papiros mágicos' },
    { era: 'egipcia', titulo: 'Los Siete Hathores y el destino', resumen: 'Siete manifestaciones de Hathor predicen el destino al nacer.', detalle: 'Las Siete Hathores aparecen como siete mujeres jóvenes (o vacas sagradas) en el momento del nacimiento de un niño. Cada una pronuncias una parte del destino del recién nacido, prediciendo su personalidad, fortuna, amor, muerte y vida después de la muerte. Su pronunciamiento es irrevocable y ni siquiera los dioses pueden alterarlo. En los cuentos populares egipcios, los Hathores frecuentemente predicen muertes prematuras que luego los protagonistas intentan evadir, aunque el destino siempre se cumple. Este concepto es similar a las Moiras griegas o las Nornas nórdicas.', ref: 'Cuentos del Papiro Westcar' },

    /* Griega - 10 mitos */
    { era: 'griega', titulo: 'El nacimiento de Atenea', resumen: 'Surge completamente armada de la cabeza de Zeus.', detalle: 'Zeus recibió una profecía de que Metis (Astucia), su primera esposa, daría a luz a un hijo que lo destronaría. Para evitarlo, Zeus se la tragó estando embarazada. Pero Metis ya gestaba a Atenea. Zeus desarrolló un dolor de cabeza insoportable, y ordenó a Hefesto que le abriera el cráneo con un hacha. De la herida surgió Atenea, completamente adulta, armada con casco, égida y lanza, dando un grito de guerra que hizo temblar el Olimpo. Así nació la diosa de la sabiduría estratégica, quien nunca conoció madre y es la hija favorita de Zeus.', ref: 'Hesíodo, Teogonía 886-900' },
    { era: 'griega', titulo: 'Prometeo y el fuego robado', resumen: 'El titán benefactor entrega el fuego a los humanos.', detalle: 'Prometeo sintió compasión por los humanos que Zeus había dejado sin fuego. Ascendió al Olimpo, robó el fuego sagrado del taller de Hefesto ocultándolo en un tallo hueco de hinojo, y lo entregó a la humanidad. Furioso, Zeus ordenó a Hefesto encadenar a Prometeo al monte Cáucaso, donde cada día un águila devoraba su hígado regenerativo. El tormento duró treinta mil años hasta que Heracles lo liberó. El precio del fuego fue Pandora y su jarra de males, enviada a castigar a la humanidad.', ref: 'Hesíodo, Teogonía; Esquilo, Prometeo encadenado' },
    { era: 'griega', titulo: 'Los doce trabajos de Heracles', resumen: 'Doce hazañas imposibles para redimirse del crimen.', detalle: 'Heracles, enloquecido por Hera, asesinó a su esposa Megara y sus hijos. Al recuperar la cordura, el oráculo de Delfos lo envió a servir a Euristeo durante doce años. Euristeo le impuso doce trabajos imposibles: matar al león de Nemea invulnerable, matar a la Hidra de Lerna que regeneraba cabezas, capturar a la cierva de Cerinea sagrada de Artemisa, capturar al jabalí de Erimanto, limpiar los establos de Augías en un día, matar a las aves del Estínfalo, capturar al toro de Creta, robar las yeguas comedoras de hombres de Diomedes, obtener el cinturón de Hipólita, robar el ganado de Gerión, robar las manzanas de oro de las Hespérides, y capturar a Cerbero del Hades. Cada trabajo demostró que Heracles era el más grande héroe mortal.', ref: 'Apolodoro, Biblioteca II.4.12-5.12' },
    { era: 'griega', titulo: 'Orfeo y Eurídice', resumen: 'El músico divino que casi rescata a su amor del Hades.', detalle: 'Orfeo tocaba la lira con maestría que hasta las piedras lloraban. Se casó con Eurídice, pero ella murió por mordedura de serpiente el día de su boda. Desolado, Orfeo descendió al Hades tocando música tan conmovedora que Caronte lo llevó sin pago, Cerbero lo dejó pasar, y los condenados dejaron de sufrir. Hades y Perséfone acordaron liberar a Eurídice con una condición: Orfeo debía caminar delante sin mirar atrás hasta salir completamente. Casi al final, Orfeo no resistió y giró. Eurídice se desvaneció como humo, perdida para siempre. Orfeo vagó inconsolable hasta que las Ménades lo despedazaron.', ref: 'Virgilio, Geórgicas IV; Ovidio, Metamorfosis X' },
    { era: 'griega', titulo: 'El laberinto del Minotauro', resumen: 'Teseo vence al monstruo taurino en el centro del laberinto.', detalle: 'El rey Minos castigó a Atenas a enviar siete jóvenes y siete doncellas cada nueve años para alimentar al Minotauro, monstruo mitad hombre mitad toro nacido de la esposa de Minos y un toro divino. El Minotauro vivía en el Laberinto, estructura tan compleja que quien entrara jamás podría salir. Teseo se ofreció voluntario. Ariadna, hija de Minos, se enamoró de él y le dio un ovillo de hilo. Teseo lo desenrolló al entrar, mató al Minotauro con sus puños, y siguió el hilo de regreso. Escapó llevándose a Ariadna pero la abandonó en Naxos. Al regresar, olvidó cambiar las velas negras por blancas, y su padre Egeo, creyéndolo muerto, se arrojó al mar.', ref: 'Plutarco, Teseo 15-20; Apolodoro' },
    { era: 'griega', titulo: 'El rapto de Perséfone', resumen: 'Hades secuestra a Perséfone, creando las estaciones.', detalle: 'Perséfone recogía flores cuando Hades emergió desde la tierra, la raptó y la llevó al inframundo. Deméter, su madre y diosa de la agricultura, buscó desesperadamente por nueve días. Helios reveló la verdad. Furiosa, Deméter abandonó el Olimpo y la tierra se volvió estéril. Zeus ordenó a Hades devolver a Perséfone, pero ella había comido seis semillas de granada, obligándola a permanecer en el Hades. Se alcanzó un compromiso: Perséfone pasaría seis meses con Hades (otoño e invierno, cuando la tierra es estéril) y seis meses con Deméter (primavera y verano, cuando la tierra florece). Así nacieron las estaciones.', ref: 'Himno homérico a Deméter; Ovidio, Metamorfosis V' },
    { era: 'griega', titulo: 'Pandora y la jarra', resumen: 'Primera mujer mortal y origen de los males del mundo.', detalle: 'Tras el robo del fuego por Prometeo, Zeus conspiró vengarse. Ordenó a Hefesto moldear a la primera mujer de arcilla. Cada dios le otorgó un don: Afrodita belleza, Hermes astucia, Apolo música, Atenea la vistió. La llamaron Pandora ("todos los dones"). Zeus la envió como esposa a Epimeteo con una jarra que contenía todos los males del mundo. Zeus le prohibió abrirla pero le dio curiosidad irresistible. Finalmente, Pandora abrió la jarra. Todos los males escaparon y se dispersaron por el mundo. Pandora cerró rápidamente, pero solo quedó dentro Elpis (Esperanza), razón por la cual la humanidad, aunque sufre infinitos males, nunca pierde la esperanza.', ref: 'Hesíodo, Trabajos y días 42-105' },
    { era: 'griega', titulo: 'El vuelo de Ícaro', resumen: 'La arrogancia juvenil y la desobediencia a advertencias paternas.', detalle: 'Dédalo y su hijo Ícaro fueron aprisionados en una torre por el rey Minos. Dédalo recolectó plumas de aves, las unió con hilo y las fijó con cera de abejas, creando dos pares de alas. Antes de volar, Dédalo advirtió: "No vueles bajo o la humedad mojará las plumas, ni alto o el calor derretirá la cera". Ícaro, exultante por volar, desobedeció y ascendió cada vez más alto acercándose al sol. La cera se derritió, las plumas se dispersaron, e Ícaro cayó al mar y se ahogó. Dédalo recuperó su cuerpo y lo enterró en la isla que lleva su nombre, Icaria. Este mito advierte contra la hibris (arrogancia desmedida).', ref: 'Ovidio, Metamorfosis VIII.183-235' },
    { era: 'griega', titulo: 'Perseo y Medusa', resumen: 'El héroe que decapita a la gorgona usando su reflejo.', detalle: 'El rey Polidectes ordenó a Perseo traer la cabeza de Medusa, la gorgona cuya mirada petrificaba, para deshacerse de él. Atenea dio a Perseo un escudo pulido como espejo; Hermes sandalias aladas y espada adamantina; las ninfas el yelmo de Hades (invisibilidad) y bolsa mágica. Perseo localizó a las Grayas, tres brujas que compartían un ojo, lo robó y las chantajeó para que revelaran la ubicación de Medusa. Usando el escudo como espejo, se acercó sin mirarla directamente y la decapitó. De su cuello brotaron Pegaso (caballo alado) y Crisaor, hijos que Medusa había concebido con Poseidón antes de su transformación.', ref: 'Apolodoro, Biblioteca II.4.1-3; Ovidio, Metamorfosis IV' },
    { era: 'griega', titulo: 'Psique y Eros', resumen: 'Una mortal supera pruebas divinas por amor.', detalle: 'Psique era tan hermosa que los hombres la adoraban en lugar de a Afrodita. Celosa, Afrodita envió a Eros a hacerla enamorarse del ser más vil, pero Eros se enamoró de ella. La visitaba cada noche en oscuridad, prohibiéndole ver su rostro. Sus hermanas la convencieron de que su marido era un monstruo. Una noche, Psique encendió una lámpara mientras Eros dormía. Una gota de aceite caliente cayó sobre él, despertándolo. Eros huyó reprochando su desconfianza. Afrodita impuso a Psique cuatro tareas imposibles: clasificar granos (hormigas ayudaron), obtener lana dorada (juncos enseñaron), llenar cristal del Estigia (águila de Zeus ayudó), y descender al Hades (torre dio instrucciones). Psique abrió la caja de Perséfone cayendo en coma, pero Eros la despertó y Zeus la hizo inmortal.', ref: 'Apuleyo, El asno de oro IV.28-VI.24' },

    /* Romana - 10 mitos */
    { era: 'romana', titulo: 'Rómulo y Remo: fundación de Roma', resumen: 'Gemelos criados por una loba fundan Roma tras fratricidio.', detalle: 'Rea Silvia, vestal, fue violada por Marte dando a luz a Rómulo y Remo. Su tío Amulio ordenó arrojarlos al Tíber. Una loba los amamantó hasta que el pastor Fáustulo los encontró. Adultos, mataron a Amulio y decidieron fundar una ciudad. Disputaron sobre ubicación y nombre. Consultaron auspicios: Remo vio seis buitres; Rómulo doce. Rómulo trazó el surco sagrado del Palatino, decretando muerte a quien lo cruzara. Remo, burlándose, lo saltó. Rómulo lo mató declarando: "Así perezca quien salte mis murallas". Fundó Roma el 21 de abril de 753 a.C. Para conseguir mujeres, organizó un festival e invitó a los sabinos, raptando a sus mujeres. La guerra resultante terminó cuando las sabinas se interpusieron pidiendo paz.', ref: 'Tito Livio, Ab Urbe Condita I.3-16; Plutarco, Rómulo' },
    { era: 'romana', titulo: 'Eneas y el destino de Roma', resumen: 'El héroe troyano viaja desde Troya hasta Italia fundando el linaje romano.', detalle: 'Eneas escapó de Troya llevando a su padre Anquises sobre los hombros y guiando a su hijo Ascanio. Los dioses le encomendaron navegar hasta Italia y fundar una nueva nación. Tras siete años de viajes (naufragio en Cartago donde Dido se enamoró de él; Eneas la abandonó por deber causando su suicidio; descenso al Averno donde Anquises le mostró la futura grandeza de Roma), desembarcó en el Lacio. El rey Latino le ofreció a su hija Lavinia, enfureciendo a Turno quien estaba prometido con ella. Tras batallas épicas, Eneas mató a Turno. Fundó Lavinium, y su hijo Ascanio fundó Alba Longa. De su linaje descendieron Rómulo y Remo.', ref: 'Virgilio, Eneida' },
    { era: 'romana', titulo: 'Numa Pompilio: legislador religioso', resumen: 'El segundo rey de Roma organiza el calendario y rituales sagrados.', detalle: 'Tras Rómulo, los romanos eligieron a Numa Pompilio como segundo rey (715-673 a.C.). Numa transformó a los romanos guerreros en sociedad civilizada mediante la religión. Consultaba a la ninfa Egeria quien le transmitía la voluntad divina. Numa reformó el calendario añadiendo enero y febrero, estableciendo el año de 12 meses. Creó colegios sacerdotales: Flamines, Pontífices, Vestales, Salios, Feciales y Augures. Instituyó rituales para Jano, Fides, Término, y construyó el templo de Jano cuyas puertas permanecían abiertas en guerra y cerradas en paz. Bajo Numa, Roma no hizo guerra durante 43 años. Numa representa el equilibrio de la piedad con el poder militar romano.', ref: 'Tito Livio, Ab Urbe Condita I.18-21; Plutarco, Numa' },
    { era: 'romana', titulo: 'El rapto de las Sabinas', resumen: 'La crisis matrimonial resuelta con integración de dos pueblos.', detalle: 'Roma carecía de mujeres. Los pueblos vecinos rechazaban alianzas matrimoniales. Rómulo anunció un festival en honor de Consus e invitó a los sabinos. Durante el festival, los romanos raptaron a las jóvenes sabinas, pero no las violaron; las cortejaron honestamente ofreciéndoles matrimonio, ciudadanía y propiedad. Los sabinos prepararon venganza. Cuando los ejércitos finalmente se enfrentaron, las sabinas, ahora esposas romanas y madres, se interpusieron con sus bebés rogando: "¿Mataríais a nuestros padres o haríais huérfanos a nuestros hijos?". Conmovidos, romanos y sabinos hicieron paz, compartieron el gobierno, y se fusionaron en un solo pueblo.', ref: 'Tito Livio, Ab Urbe Condita I.9-13' },
    { era: 'romana', titulo: 'Hércules y Caco en Roma', resumen: 'Hércules mata al monstruo Caco y establece su culto en Roma.', detalle: 'Hércules, tras robar el ganado de Gerión, descansó en el futuro emplazamiento de Roma. Caco, hijo de Vulcano y monstruo de tres cabezas que escupía fuego, robó cuatro toros y cuatro vacas arrastrándolos hacia atrás para confundir. Al despertar, Hércules notó la falta. Cuando conducía el rebaño restante, una vaca robada mugió desde la cueva de Caco. Hércules arrancó la cima de la montaña, expuso la cueva y estranguló a Caco con sus manos desnudas. Los romanos locales, liderados por Evandro, agradecidos, erigieron el Ara Maxima en el Foro Boario para Hércules. Este culto heroico conectaba Roma con la mitología griega.', ref: 'Virgilio, Eneida VIII.185-275; Tito Livio' },
    { era: 'romana', titulo: 'Lucrecia y el fin de la monarquía', resumen: 'La violación de Lucrecia precipita la revolución que establece la República.', detalle: 'Sexto Tarquinio, hijo del tiránico rey, estaba obsesionado con Lucrecia, esposa del noble Colatino. Una noche, llegó como huésped y fue recibido con hospitalidad. Después de cenar, Sexto entró al dormitorio de Lucrecia con espada, amenazándola: si no cedía, la mataría junto con un esclavo y diría que los encontró en adulterio. Lucrecia cedió para proteger su reputación. Al amanecer, convocó a su padre, esposo, y Lucio Junio Bruto. Les contó todo, demandó venganza, y declaró: "Solo yo me absuelvo de pecado, mas no de castigo; ninguna mujer deshonrada vivirá alegando el ejemplo de Lucrecia". Se apuñaló en el corazón. Bruto juró expulsar a los Tarquinios. El pueblo se rebeló, los Tarquinios fueron exiliados y Roma estableció la República en 509 a.C.', ref: 'Tito Livio, Ab Urbe Condita I.57-60' },
    { era: 'romana', titulo: 'Horacio Cocles en el puente Sublicio', resumen: 'Un solo hombre detiene un ejército en el puente.', detalle: 'En 508 a.C., el rey etrusco Lars Porsena marchó contra Roma con ejército masivo. Horacio Cocles ("el tuerto") y dos compañeros tomaron posición en el extremo del puente Sublicio. Mientras los romanos desmontaban el puente detrás de ellos, Horacio y sus compañeros resistieron. Cuando el puente estaba casi destruido, Horacio ordenó a sus camaradas retirarse. Solo, enfrentó al ejército etrusco completo. Finalmente, cuando el puente colapsó, Horacio se lanzó al Tíber completamente armado y nadó de regreso bajo lluvia de flechas, emergiendo ileso. Roma le otorgó tanta tierra como pudiera arar en un día y erigieron una estatua. Se convirtió en símbolo de virtus romana: un ciudadano dispuesto a morir solo por la patria.', ref: 'Tito Livio, Ab Urbe Condita II.10' },
    { era: 'romana', titulo: 'Los Auspicios de Rómulo y Remo', resumen: 'Fundación bajo el signo de los dioses mediante observación de aves.', detalle: 'Cuando Rómulo y Remo decidieron fundar una ciudad, disputaron sobre localización. Para resolver pacíficamente, consultaron auspicios, práctica de interpretar la voluntad divina mediante observación de aves. Remo, en el Aventino al amanecer, vio seis buitres. Rómulo, en el Palatino, vio doce buitres. Disputaron el significado: ¿importaba más quién vio primero o quién vió más? Los augures declararon que doce era el doble de seis, otorgando victoria a Rómulo. La ciencia augural se convirtió en fundamental para Roma: ninguna decisión importante se tomaba sin consultar auspicios. Esta historia establece que Roma fue fundada con aprobación divina explícita.', ref: 'Plutarco, Rómulo 9; Tito Livio I.6-7' },
    { era: 'romana', titulo: 'Servio Tulio y la diosa Fortuna', resumen: 'El rey esclavo elegido por Fortuna para gobernar Roma.', detalle: 'Servio Tulio, sexto rey de Roma (578-535 a.C.), era hijo de una esclava. Siendo bebé, llamas divinas rodearon su cabeza sin quemarlo, señal de destino divino. La reina Tanaquil lo crió como príncipe. Otra versión dice que Fortuna, diosa del destino, se enamoró de Servio y lo visitaba por una ventana del palacio. Tras el asesinato de Tarquinio Prisco, Servio se convirtió en rey. Reformó Roma: dividió ciudadanos en clases censitarias según riqueza, reorganizó el ejército, expandió la ciudad incorporando las siete colinas, y construyó la Muralla Serviana. Su yerno Tarquinio el Soberbio lo asesinó empujándolo por las escaleras del Senado y su hija Tulia condujo su carruaje sobre el cadáver.', ref: 'Tito Livio, Ab Urbe Condita I.39-48' },
    { era: 'romana', titulo: 'La Sibila de Cumas y los Libros Proféticos', resumen: 'Los libros que guiarían el destino de Roma durante siglos.', detalle: 'Una anciana misteriosa llegó a Roma durante el reinado de Tarquinio el Soberbio llevando nueve libros proféticos. Se presentó como la Sibila de Cumas. Ofreció los nueve libros por precio exorbitante. Tarquinio rechazó. La Sibila quemó tres libros y ofreció los seis restantes al mismo precio. Tarquinio rechazó. La Sibila quemó otros tres y ofreció los últimos tres al mismo precio original. Tarquinio, alarmado, compró los tres últimos. Los Libri Sibyllini fueron depositados en el templo de Júpiter Capitolino. Solo el Senado podía ordenar su consulta durante desastres. Las profecías ordenaron introducir cultos extranjeros, instituir los Juegos Seculares, y guiaron decisiones críticas. Este mito valida que Roma tenía un destino divino registrado.', ref: 'Tito Livio, Ab Urbe Condita I.45' },

    /* Vikinga - 10 mitos */
    { era: 'vikinga', titulo: 'Ginnungagap y la creación', resumen: 'Del vacío primordial emergen fuego, hielo y vida.', detalle: 'En el principio solo existía Ginnungagap, el abismo bostezante entre Muspelheim (fuego al sur) y Niflheim (niebla helada al norte). De Niflheim fluyeron once ríos venenosos que se congelaron en el vacío. El calor de Muspelheim derritió parcialmente el hielo y de las gotas surgió Ymir, el gigante primordial, y la vaca Auðumla. Auðumla lamió bloques de hielo liberando a Búri. Los hijos de Búri (Odín, Vili y Vé) mataron a Ymir. De Ymir crearon el mundo: su carne en tierra, sangre en mares, huesos en montañas, cerebro en nubes, cráneo en bóveda celeste, y cejas en Midgard. De chispas de Muspelheim crearon estrellas, sol y luna. Así nacieron los Nueve Mundos.', ref: 'Völuspá, Gylfaginning cap. 4-8' },
    { era: 'vikinga', titulo: 'Yggdrasil: el árbol cósmico', resumen: 'El fresno sagrado conecta los Nueve Mundos.', detalle: 'Yggdrasil ("corcel de Ygg") es un fresno colosal cuyas ramas sostienen el universo nórdico. Conecta Nueve Mundos en tres niveles. Tiene tres raíces principales: una en Ásgarðr bebiendo del Pozo de Urðr (donde las Nornas tallan el destino), otra en Jötunheimr bebiendo del Pozo de Mímir (Odín sacrificó un ojo para beber), y la tercera en Niflheimr donde Níðhöggr roe constantemente. Cuatro ciervos mordisquean hojas. La ardilla Ratatoskr corre arriba y abajo llevando insultos entre el águila en la copa y Níðhöggr en las raíces. Yggdrasil sufre pero se regenera, simbolizando el ciclo eterno. En Ragnarök temblará pero sobrevivirá, y dos humanos se refugiarán dentro.', ref: 'Grímnismál 25-35, Gylfaginning cap. 15-16' },
    { era: 'vikinga', titulo: 'Mjölnir: el martillo de Thor', resumen: 'El arma más poderosa de los dioses, forjada por enanos.', detalle: 'Loki cortó el cabello dorado de Sif. Thor lo amenazó. Loki pidió a enanos hijos de Ívaldi crear cabello de oro real, el barco Skíðblaðnir y la lanza Gungnir. Presumiendo, apostó su cabeza con los hermanos Brokkr y Eitri que no podían crear tesoros mejores. Eitri forjó el jabalí Gullinbursti, el anillo Draupnir, y finalmente Mjölnir. Durante la forja, Loki (como mosca) picó a Brokkr interrumpiendo el fuelle. El martillo quedó con mango corto, pero aún era invencible: nunca fallaba su objetivo, siempre regresaba a Thor, y podía reducirse. Los dioses lo declararon el mejor tesoro pues protegía Ásgarðr. Loki perdió la apuesta pero argumentó que había apostado su cabeza, no su cuello. Brokkr le cosió los labios.', ref: 'Skáldskaparmál cap. 35, Gylfaginning cap. 42-43' },
    { era: 'vikinga', titulo: 'Loki el Tramposo', resumen: 'Hermano de sangre de Odín, catalizador del caos y cambio.', detalle: 'Loki, hijo del gigante Fárbauti, vive en Ásgarðr como hermano jurado de Odín. Loki es hermoso, astuto, mentiroso, cambiaformas y ambiguamente leal. Causó innumerables problemas pero frecuentemente salvó a los dioses. Se casó con Sigyn pero tuvo hijos con la giganta Angrboða: Fenrir (lobo), Jörmungandr (serpiente), y Hel (señora de muertos). Los dioses arrojaron a Jörmungandr al océano, desterraron a Hel bajo Niflheim, y encadenaron a Fenrir. Loki se transformó en yegua, sedujo al semental Svaðilfari, y dio a luz a Sleipnir. Tras provocar la muerte de Baldr e insultar a todos los dioses, lo capturaron, lo ataron con entrañas de su hijo sobre rocas, y colocaron una serpiente goteando veneno sobre su rostro. Permanecerá hasta Ragnarök.', ref: 'Lokasenna, Gylfaginning cap. 49-51, Völuspá 35' },
    { era: 'vikinga', titulo: 'La muerte de Baldr', resumen: 'El dios más amado muere por engaño, presagiando Ragnarök.', detalle: 'Baldr el Brillante comenzó a tener pesadillas sobre su muerte. Frigg viajó por los Nueve Mundos haciendo jurar a todas las cosas que no dañarían a Baldr. Los dioses organizaron un juego arrojando objetos que rebotaban inofensivamente. Loki, disfrazado de anciana, descubrió que Frigg omitió el muérdago, demasiado joven. Loki talló una lanza de muérdago y guió la mano del dios ciego Höðr, quien arrojó la lanza atravesando a Baldr. Frigg envió a Hermóðr a negociar con Hel. Hel acordó liberar a Baldr si todas las cosas lloraban. Todas lloraron excepto la giganta Þökk (probablemente Loki). Así Baldr permaneció en Helheimr. La muerte de Baldr es el primer evento de Ragnarök.', ref: 'Völuspá 31-33, Gylfaginning cap. 49' },
    { era: 'vikinga', titulo: 'Ragnarök: el destino de los dioses', resumen: 'El fin apocalíptico y el renacimiento del mundo.', detalle: 'Ragnarök ("destino de los dioses") es el apocalipsis nórdico. Comienza con tres inviernos sin verano, durante los cuales la moralidad colapsa. El sol y luna son devorados por lobos. Fenrir rompe sus cadenas, Jörmungandr emerge envenenando el cielo, Loki lidera un barco de muertos. Los gigantes de fuego cruzan Bifröst rompiéndolo. Heimdallr toca el Gjallarhorn convocando a la batalla final. Los duelos: Odín vs Fenrir (el lobo lo devora, Víðarr venga), Thor vs Jörmungandr (Thor mata a la serpiente pero sucumbe al veneno), Heimdallr vs Loki (se matan mutuamente), Freyr vs Surtr (Freyr muere). Surtr incendia los Nueve Mundos. Algunos dioses sobreviven y dos humanos escondidos en Yggdrasil. Emergen a un mundo renovado. El ciclo continúa.', ref: 'Völuspá 40-66, Gylfaginning cap. 51-53' },
    { era: 'vikinga', titulo: 'La construcción de Ásgarðr', resumen: 'Un gigante constructor y el precio: Freyja, el sol y la luna.', detalle: 'Tras la guerra, las murallas de Ásgarðr quedaron destruidas. Un constructor ofreció reconstruir murallas inexpugnables en solo tres temporadas. Su precio: Freyja, el Sol y la Luna. Loki sugirió aceptar con modificación: terminar en un solo invierno sin ayuda. El constructor aceptó usando su semental Svaðilfari. Trabajaron con velocidad sobrenatural. Con tres días antes del límite, las murallas estaban casi completas. Los dioses amenazaron a Loki. Loki se transformó en yegua en celo, sedujo a Svaðilfari alejándolo. Sin su caballo, el constructor no pudo terminar. Furioso, reveló ser un gigante. Thor lo mató con Mjölnir. Loki dio a luz a Sleipnir. Este mito muestra cómo los dioses recurren al engaño cuando están desesperados.', ref: 'Völuspá 25, Gylfaginning cap. 42' },
    { era: 'vikinga', titulo: 'El hidromiel de la poesía', resumen: 'Odín roba el hidromiel que otorga inspiración poética.', detalle: 'Los dioses crearon a Kvasir de su saliva. Dos enanos lo asesinaron, mezclaron su sangre con miel, creando el Hidromiel de la Poesía: quien lo bebiera se volvería poeta. Los enanos mataron también a Gilling y su esposa. Suttungr, hijo de Gilling, exigió compensación. Le dieron el hidromiel. Suttungr lo guardó en la montaña Hnitbjörg, custodiado por su hija Gunnlöð. Odín, disfrazado, trabajó para el hermano de Suttungr. Tras trabajar un verano, le negaron el pago. Odín persuadió de perforar la montaña. Transformándose en serpiente, se deslizó hasta Gunnlöð. Sedujo a Gunnlöð, pasó tres noches, y ella le permitió tres tragos. Odín bebió los tres recipientes completos, se transformó en águila y voló de regreso. Gotas cayeron a Midgard, creando a los malos poetas.', ref: 'Skáldskaparmál cap. 1-4, Hávamál 104-110' },
    { era: 'vikinga', titulo: 'Brísingamen: el collar de Freyja', resumen: 'La joya más hermosa obtenida a cambio de cuatro noches.', detalle: 'Freyja vio destellos dorados emanando de una cueva. Descubrió a cuatro enanos forjando Brísingamen ("collar de fuego"), el collar más hermoso jamás creado, hecho de oro y joyas con propiedades mágicas que amplificaban la ya irresistible belleza de su portadora. Freyja ofreció oro, plata, cualquier cosa. Los enanos propusieron un precio: ella debía pasar una noche con cada uno. Freyja, aunque orgullosa, aceptó. Pasó cuatro noches y obtuvo Brísingamen. Loki informó a Odín. Furioso, Odín ordenó a Loki robarlo. Loki se transformó en pulga, entró al dormitorio, picó a Freyja haciéndola girar, y robó el collar. Odín dijo que solo lo devolvería si Freyja causaba guerra eterna entre dos reyes. Ella lo hizo. Brísingamen representa el poder de Freyja y el precio de desear lo prohibido.', ref: 'Sörla þáttr, Húsdrápa, Þrymskviða 13' },
    { era: 'vikinga', titulo: 'Fenrir y las cadenas', resumen: 'El lobo profetizado a matar a Odín, atado con engaño.', detalle: 'Fenrir, hijo de Loki y Angrboða, era un lobo que crecía alarmantemente rápido. Profecías decían que devoraría a Odín en Ragnarök. Los dioses lo criaron en Ásgarðr, pero solo Tyr se atrevía a alimentarlo. Decidieron atarlo. Forjaron Læðingr, cadena masiva. Fenrir la rompió con facilidad. Crearon Drómi, el doble de fuerte. Fenrir la rompió. Pidieron a los enanos forjar Gleipnir de seis ingredientes imposibles: barba de mujer, raíces de montaña, tendones de oso, aliento de pez, escupitina de pájaro, ruido de pasos de gato. Gleipnir parecía una cinta de seda pero era irrompible. Fenrir, sospechando magia, solo aceptó si un dios ponía su mano en su boca como garantía. Tyr colocó su mano. Gleipnir se apretó. Fenrir arrancó la mano de Tyr. Permanecerá atado hasta Ragnarök.', ref: 'Gylfaginning cap. 34, Völuspá 53' },

    /* Azteca - 10 mitos */
    { era: 'azteca', titulo: 'Nacimiento de Huitzilopochtli', resumen: 'El dios solar nace completamente armado en el Cerro de la Serpiente.', detalle: 'En Coatepec, Coatlicue barría cuando una bola de plumas de colibrí cayó del cielo. Coatlicue la guardó en su seno, quedando embarazada. Sus 400 hijos y Coyolxauhqui conspiraron matarla. Mientras ascendían armados el Coatepec, el bebé nonato habló tranquilizándola. Al alcanzar la cima, Huitzilopochtli nació completamente armado, portando el Xiuhcóatl. Decapitó y desmembró a Coyolxauhqui; su cabeza rodó montaña abajo. Persiguió y mató o dispersó a los Centzon Huitznahua. Este evento cósmico se repite diariamente: Huitzilopochtli (Sol) nace cada amanecer, vence a Coyolxauhqui (Luna) y a sus hermanos (estrellas), elevándose victorioso. Este mito legitimaba la guerra sagrada y los sacrificios humanos.', ref: 'Historia General, Libro III; Códice Aubin' },
    { era: 'azteca', titulo: 'El Quinto Sol', resumen: 'La creación actual sostenida por sacrificio cósmico.', detalle: 'Los aztecas creían que el universo había pasado por cuatro eras previas, cada una terminando en cataclismo: Primer Sol (gigantes devorados por jaguares), Segundo Sol (huracanes convirtieron humanos en monos), Tercer Sol (lluvias de fuego, humanos en pájaros), Cuarto Sol (diluvio, humanos en peces). Para el Quinto Sol, dos dioses debían sacrificarse arrojándose a hoguera: Tecuciztécatl (rico) y Nanahuatzin (humilde). Tecuciztécatl vaciló; Nanahuatzin saltó inmediatamente. Nanahuatzin emergió como el Sol brillante; Tecuciztécatl como segundo sol. Los dioses arrojaron un conejo a Tecuciztécatl atenuándolo, convirtiéndolo en Luna. Pero el Sol no se movía, exigiendo sangre. Quetzalcóatl sacrificó a los demás dioses y sopló, poniendo el Sol en movimiento. Este mito justifica el sacrificio humano.', ref: 'Leyenda de los Soles; Códice Vaticano A' },
    { era: 'azteca', titulo: 'Quetzalcóatl en el Mictlán', resumen: 'Quetzalcóatl desciende al inframundo para crear la humanidad actual.', detalle: 'Tras la creación del Quinto Sol, no había humanos. Quetzalcóatl decidió descender al Mictlán, reino de Mictlantecuhtli, señor de la muerte. Pidió los huesos de humanos antiguos. Mictlantecuhtli aparentó acceder pero impuso condiciones: Quetzalcóatl debía soplar un caracol sin agujeros. Quetzalcóatl pidió a gusanos perforarlo y a abejas entrar y zumbar. Cumplida la prueba, Mictlantecuhtli ordenó cavar una trampa. Quetzalcóatl, huyendo con los huesos, cayó en el hoyo y murió brevemente. Codornices picotearon los huesos rompiéndolos en fragmentos. Quetzalcóatl revivió, recolectó los fragmentos, y los llevó a Tamoanchan donde la diosa los molió. Quetzalcóatl y otros dioses se sajaron los penes, goteando sangre divina sobre el polvo. Amasaron la mezcla creando a los humanos.', ref: 'Leyenda de los Soles; Códice Chimalpopoca' },
    { era: 'azteca', titulo: 'Coyolxauhqui desmembrada', resumen: 'La diosa lunar derrotada por su hermano solar.', detalle: 'Coyolxauhqui ("La de los Cascabeles en las Mejillas") era hija mayor de Coatlicue. Cuando Coatlicue quedó embarazada milagrosamente, Coyolxauhqui interpretó esto como deshonra y conspiró con sus 400 hermanos para asesinar a su madre. Armada con espadas de obsidiana, lideró la ascensión del Coatepec. Huitzilopochtli esperó estratégicamente hasta que alcanzaron la cima. En ese momento nació completamente crecido, armado con el Xiuhcóatl. Decapitó a Coyolxauhqui con un solo golpe, luego desmembró su cuerpo. Su cabeza rodó al valle. Este mito simboliza la victoria diaria del sol sobre la luna y las estrellas. La monumental piedra de Coyolxauhqui descubierta en 1978 yace exactamente donde el mito prescribía: a los pies del Templo Mayor, representando su cuerpo desmembrado.', ref: 'Historia General, Libro III cap. 1; Monumentos arqueológicos' },
    { era: 'azteca', titulo: 'Tláloc y el diluvio', resumen: 'El señor de la lluvia inunda y renueva el mundo.', detalle: 'Tláloc (Néctar de la Tierra) gobernaba el Tlalocan, paraíso donde iban quienes morían por agua, rayo o enfermedades del "agua". Tláloc es simultáneamente benévolo (envía lluvias) y destructivo (granizo, heladas, inundaciones). Su esposa Chalchiuhtlicue fue convertida en sol en el Cuarto Sol. Los otros dioses la insultaron. Chalchiuhtlicue lloró sangre durante 52 años. Sus lágrimas sangrientas inundaron el mundo en diluvio apocalíptico. El cielo colapsó. Todo pereció excepto una pareja que Tezcatlipoca advirtió. El diluvio duró hasta que Quetzalcóatl y Tezcatlipoca se transformaron en árboles colosales, levantaron el cielo y lo sostuvieron en cuatro esquinas. Tláloc envió a los Tlaloque a romper las vasijas almacenando distintos tipos de lluvia. En rituales, niños eran sacrificados a Tláloc.', ref: 'Leyenda de los Soles; Códice Borgia' },
    { era: 'azteca', titulo: 'La Ceremonia del Fuego Nuevo', resumen: 'Renovación cósmica cada 52 años para evitar el apocalipsis.', detalle: 'Cada 52 años solares, ambos calendarios volvían a sincronizarse. Este momento era de terror existencial porque profecías decían que el Quinto Sol terminaría en uno de estos ciclos. Durante los cinco días previos, se extinguían todos los fuegos, se destruía cerámica, se ayunaba, embarazadas se encerraban con máscaras. Al atardecer del día crucial, sacerdotes caminaban procesionalmente hasta el Cerro de la Estrella. A medianoche, cuando las Pléyades cruzaban el meridiano, sacerdotes sacrificaban a un prisionero. Sobre su pecho abierto, generaban Fuego Nuevo. Si el fuego brotaba, el público estallaba en júbilo: ¡el mundo continuaría otros 52 años! Corredores llevaban antorchas a los templos; cada familia reencendía su hogar. Se construían nuevos edificios sobre los antiguos.', ref: 'Historia General, Libro VII cap. 10; Códice Borbónico' },
    { era: 'azteca', titulo: 'Xochiquetzal: la diosa del amor y las flores', resumen: 'Hermosa diosa raptada, causa primer adulterio divino.', detalle: 'Xochiquetzal (Flor Preciosa) era la joven y hermosa diosa de belleza, amor sexual, flores, plantas, fertilidad, artes femeninas, prostitución sagrada y placer. Estaba casada con Tláloc. El dios Tezcatlipoca la deseaba. La raptó del Tlalocan y la llevó a los Nueve Cielos, específicamente al Tamoanchan. Xochiquetzal se convirtió en consorte de Tezcatlipoca. Este rapto representa el primer adulterio divino. Xochiquetzal reside en Tamoanchan sentada entre flores, mariposas y aves tropicales. Durante el festival Tecuilhuitontli, una mujer era elegida para personificar a Xochiquetzal; durante 9 días bailaba. El décimo día, era sacrificada y desollada; un sacerdote vestía su piel mientras tejía en un telar ritual representando la renovación de la fertilidad.', ref: 'Códice Borgia; Códice Florentino' },
    { era: 'azteca', titulo: 'El nacimiento del maíz', resumen: 'Quetzalcóatl descubre el maíz transformándose en hormiga.', detalle: 'Tras crear a los humanos, los dioses se preguntaron qué comerían. Quetzalcóatl descubrió que el maíz estaba escondido dentro del Tonacatépetl (Montaña de Nuestro Sustento). Quetzalcóatl preguntó a la hormiga roja Azcatl cómo acceder. La hormiga reveló un túnel secreto demasiado estrecho para dioses. Quetzalcóatl se transformó en hormiga negra y siguió a Azcatl por túneles hasta la cámara donde el maíz estaba almacenado: granos blancos, amarillos, rojos y negros. Quetzalcóatl cargó un grano y salió. Los dioses alimentaron a los humanos recién creados; instantáneamente se fortalecieron. Los Tlaloque abrieron la montaña con relámpagos, pero en el proceso, parte del maíz se quemó, explicando las variedades. Los humanos obtuvieron las semillas y aprendieron agricultura. "Somos hombres de maíz".', ref: 'Leyenda de los Soles; Anales de Cuauhtitlán' },
    { era: 'azteca', titulo: 'Mayahuel y la invención del pulque', resumen: 'La diosa del maguey y el néctar sagrado embriagante.', detalle: 'Mayahuel era una hermosa diosa tzitzimitl que vivía con su abuela Tzitzimitl en el cielo. Quetzalcóatl persuadió a Mayahuel a escapar con él a la Tierra. Para ocultarse, se transformaron en un árbol de dos ramas entrelazadas. La abuela despertó, descendió furiosa con hordas de tzitzimimeh. Reconocieron el árbol, lo rompieron, identificaron la rama de Mayahuel y la despedazaron. Quetzalcóatl lloró sobre los fragmentos, los enterró, y de ellos brotó el primer maguey. Cuando maduró, pequeñas criaturas perforaron el corazón del maguey, bebieron su aguamiel, se embriagaron y bailaron. Quetzalcóatl observó la fermentación y enseñó a los humanos la técnica. Así nació el pulque, bebida sagrada ritual restringida a ancianos, guerreros y sacerdotes en festivales.', ref: 'Códice Magliabechiano; Historia General, Libro II cap. 29' },
    { era: 'azteca', titulo: 'Chalchiuhtotolin: el pavo precioso', resumen: 'Dios de pestilencias que castiga pero también inspira.', detalle: 'Chalchiuhtotolin (Pavo Precioso/Jade) era una manifestación oscura de Tezcatlipoca, representado como pavo enorme con plumas tornasoladas jade, azul, y negro. Aparecía en la noche o durante eclipses de luna. Gobernaba pestilencias, enfermedades, misterio, y lo impredecible. Castigaba transgresiones sexuales y pecados ocultos con enfermedades venéreas, deformidades y locura. Paradójicamente, también otorgaba bendiciones: aquellos que soportaban sus pruebas con dignidad recibían inspiración artística, visiones proféticas, y entendimiento de misterios divinos. Durante la fiesta Tecuilhuitontli, se sacrificaba un pavo real ritual en su honor. Su dualidad representaba la filosofía náhuatl de equilibrio: placer excesivo conduce a castigo, sufrimiento aceptado conduce a iluminación.', ref: 'Códice Borgia; Historia General' },

    /* Japonesa - 10 mitos */
    { era: 'japonesa', titulo: 'Izanagi e Izanami', resumen: 'Creación de las islas de Japón.', detalle: 'Izanagi e Izanami, los dioses creadores primordiales, fueron enviados por los dioses celestiales para solidificar y dar forma al mundo flotante. Parados en el puente celestial Ame-no-uki-hashi, sumergieron la lanza enjoyada Ame-no-nuboko en el mar primordial y la agitaron. Cuando la retiraron, las gotas de agua salada que cayeron de la punta se solidificaron formando la primera isla, Onogoro. Descendieron a esta isla y construyeron un pilar celestial y un palacio. Decidieron casarse y procrear más tierras. Realizaron un ritual matrimonial caminando en direcciones opuestas alrededor del pilar. Cuando se encontraron, Izanami habló primero, lo cual violó el protocolo. Como resultado, su primer hijo, Hiruko, nació sin huesos y fue abandonado en el mar. Su segundo hijo, Awashima, también fue deforme. Consultaron a los dioses celestiales quienes explicaron el error. Repitiendo el ritual correctamente (con Izanagi hablando primero), procrearon las ocho islas principales de Japón: Awaji, Shikoku, Oki, Kyushu, Iki, Tsushima, Sado, y Honshu. Luego engendraron múltiples dioses de montañas, ríos, vientos, árboles y otros elementos naturales. El último dios que Izanami dio a luz fue Kagutsuchi, el dios del fuego. Su nacimiento quemó tan severamente a Izanami que murió, descendiendo a Yomi, el sombrío reino de los muertos.', ref: 'Kojiki, capítulos 4-5; Nihon Shoki, Era de los Dioses' },
    { era: 'japonesa', titulo: 'La cueva de Amaterasu', resumen: 'La diosa sol se oculta, sumiendo el mundo en oscuridad.', detalle: 'Susanoo, dios de las tormentas y hermano de Amaterasu, se comportó de manera escandalosa: destruyó los arrozales sagrados de Amaterasu, defecó en su palacio sagrado durante el festival de la cosecha, y finalmente arrojó un caballo desollado a través del techo de la sala de tejido, aterrorizando a las doncellas tejedoras (una murió al clavarse una lanzadera). Amaterasu, profundamente ofendida y asustada, se retiró a la Cueva Celestial de la Roca (Ama-no-Iwato) y la selló con una roca gigante. El mundo entero quedó sumido en oscuridad perpetua. Los espíritus malignos proliferaron y el caos reinó. Los ochocientos myriadas de dioses (yaoyorozu no kami) se reunieron en el lecho del río celestial para idear un plan. Forjaron un espejo sagrado (Yata no Kagami) y crearon joyas curvadas magatama. Colgaron el espejo y las joyas en un árbol sakaki sagrado fuera de la cueva. Ame-no-Uzume, la diosa de la alegría y el amanecer, realizó una danza erótica extática sobre un tonel invertido, exponiendo sus pechos y genitales. Los dioses rieron estrepitosamente. Amaterasu, curiosa por el alboroto, abrió ligeramente la puerta de la cueva y preguntó por qué los dioses celebraban estando el mundo en oscuridad. Ame-no-Uzume respondió que habían encontrado una diosa superior a Amaterasu. Intrigada, Amaterasu abrió más la puerta. Los dioses dirigieron su mirada hacia el espejo, donde Amaterasu vio su propio reflejo brillante. Mientras se acercaba fascinada, el dios de la fuerza Ame-no-Tajikarao agarró su mano y la sacó de la cueva. Inmediatamente, otro dios extendió una cuerda sagrada (shimenawa) detrás de ella para prevenir su reingreso. La luz regresó al mundo y los dioses castigaron a Susanoo, expulsándolo del cielo.', ref: 'Kojiki, capítulos 16-17; Nihon Shoki, Era de los Dioses, capítulo 7' },
    { era: 'japonesa', titulo: 'Susanoo y Yamata-no-Orochi', resumen: 'El dios de las tormentas mata a la serpiente de ocho cabezas.', detalle: 'Tras ser exiliado del cielo por su comportamiento atroz, Susanoo descendió a la provincia de Izumo en la tierra. Allí encontró a un anciano y su esposa llorando junto a su hermosa hija Kushinada-hime. Susanoo preguntó la causa de su dolor. El anciano explicó que era el dios de la tierra Ashinazuchi y que originalmente tenía ocho hijas. Cada año durante ocho años consecutivos, el monstruo Yamata-no-Orochi había venido y devorado a una de sus hijas. Orochi era una serpiente aterradora con ocho cabezas y ocho colas, ojos rojos como cerezas de invierno, cipreses y cedros creciendo en su espalda, y un cuerpo tan largo que se extendía sobre ocho valles y ocho colinas. Su vientre siempre sangraba, y ahora había llegado el momento de que devorara a la última hija, Kushinada-hime. Susanoo ofreció matar a Orochi a cambio de la mano de Kushinada en matrimonio. Los padres aceptaron con gratitud. Susanoo transformó a Kushinada en un peine que colocó en su cabello para protegerla. Luego instruyó a la familia a preparar ocho recipientes de sake destilado ocho veces, colocándolos en plataformas rodeadas por una cerca con ocho puertas. Cuando Orochi llegó, cada una de sus ocho cabezas encontró un recipiente de sake, bebió hasta embriagarse profundamente, y se durmió. Susanoo desenvainó su espada Totsuka-no-Tsurugi y cortó metódicamente a Orochi en pedazos. Los ríos de Izumo corrieron rojos con la sangre del monstruo. Al cortar la cola media, la espada de Susanoo golpeó algo duro que astilló la hoja. Investigando, Susanoo encontró una magnífica espada incrustada en el cuerpo: Kusanagi-no-Tsurugi (Espada Cortadora de Hierba), una de las Tres Insignias Imperiales Sagradas de Japón. Susanoo la presentó a Amaterasu como gesto de disculpa. Luego se casó con Kushinada-hime y se estableció en Izumo como dios protector.', ref: 'Kojiki, capítulos 18-19; Nihon Shoki, Era de los Dioses, capítulo 8' },
    { era: 'japonesa', titulo: 'Descenso de Ninigi', resumen: 'El nieto de Amaterasu desciende con los Tres Tesoros Sagrados.', detalle: 'Amaterasu decidió que su nieto Ninigi-no-Mikoto debía descender a la tierra (Ashihara-no-Nakatsukuni, "la Tierra Media de las Llanuras de Juncos") y gobernar en su nombre. Le confió los Tres Tesoros Sagrados: el espejo Yata no Kagami (que la había atraído de la cueva), las joyas curvadas Yasakani no Magatama, y la espada Kusanagi-no-Tsurugi (recuperada de Orochi por Susanoo). Estos tres objetos se convirtieron en las insignias regalia del emperador de Japón. Antes del descenso, el camino celestial estaba bloqueado por el dios Sarutahiko, cuya nariz medía siete pulgadas de largo, iluminaba como espejo brillante, y cuyos ojos resplandecían como sol rojo. Ame-no-Uzume negoció con Sarutahiko, quien acordó guiar a Ninigi a Japón. Ninigi descendió al Monte Takachiho en Kyushu acompañado por un séquito divino. Amaterasu le instruyó: "Este espejo-observa a mi hijo como si fuera mi espíritu mismo, y venéralo como me venerarías a mí". Así estableció que los emperadores japoneses gobiernan con autoridad divina como descendientes directos de los dioses celestiales. Ninigi se casó con Konohana-sakuya-hime (Princesa-que-hace-florecer-los-árboles), hija del dios de la montaña. Ella quedó embarazada en una sola noche. Ninigi dudó de la paternidad, sugiriendo que el padre podría ser un dios terrenal en lugar de él. Ofendida, Konohana-sakuya-hime construyó una choza sin puertas, entró, y prendió fuego al edificio, jurando que si los niños no eran hijos de Ninigi, perecerían en las llamas, pero si eran verdaderamente de linaje divino, sobrevivirían. Dio a luz a tres hijos en medio del incendio, todos sobrevivieron ilesos, demostrando su legitimidad divina. De estos descendientes eventualmente nacería Jimmu, el primer emperador humano de Japón.', ref: 'Kojiki, capítulos 33-38; Nihon Shoki, Era de los Dioses, capítulos 9-10' },
    { era: 'japonesa', titulo: 'Tsukuyomi y Uke Mochi', resumen: 'El asesinato que separó el día y la noche eternamente.', detalle: 'Tsukuyomi, dios de la luna y hermano de Amaterasu y Susanoo, fue enviado por Amaterasu a un banquete organizado por Uke Mochi (u Ogetsu-hime), la diosa de la comida y la abundancia. Cuando Tsukuyomi llegó, Uke Mochi giró su rostro hacia la tierra y de su boca surgió arroz cocido. Giró hacia el mar y de su boca salieron peces y algas marinas. Giró hacia las montañas y de su boca emergió carne de caza. Preparó todos estos alimentos y se los ofreció a Tsukuyomi en un festín elaborado. Tsukuyomi, horrorizado y disgustado de que la comida hubiera salido directamente de la boca de Uke Mochi (considerándolo grotesco e impuro), se ofendió gravemente. En su ira, desenvainó su espada y mató a Uke Mochi. Cuando Amaterasu se enteró del asesinato de Uke Mochi, se enfureció con Tsukuyomi. Declaró: "Eres un dios malvado. No te veré más cara a cara". Desde ese momento, Amaterasu y Tsukuyomi vivieron separados, lo que explica por qué el sol y la luna nunca aparecen juntos en el cielo: el día y la noche están eternamente divididos. Del cadáver de Uke Mochi brotaron diversos alimentos: de su cabeza surgieron vacas y caballos, de su frente creció mijo, de sus cejas surgieron gusanos de seda, de sus ojos brotó arroz, de su vientre surgió trigo, y de sus genitales nacieron frijoles. Amaterasu recolectó todos estos alimentos y los presentó a la humanidad, estableciendo la agricultura y la sericultura. Este mito explica el origen de los alimentos cultivados y también por qué el sol y la luna nunca comparten el cielo simultáneamente, estableciendo el ciclo eterno del día y la noche.', ref: 'Nihon Shoki, Era de los Dioses, capítulo 5 (versión alternativa); Kojiki registra una versión similar con la diosa Ogetsu-hime' },
    { era: 'japonesa', titulo: 'Izanagi en Yomi', resumen: 'El dios creador viaja al inframundo y escapa con purificación.', detalle: 'Tras la muerte de Izanami al dar a luz al dios del fuego Kagutsuchi, Izanagi quedó devastado. Incapaz de aceptar su pérdida, descendió a Yomi-no-kuni, la tierra de los muertos, para recuperarla. Encontró el palacio oscuro de Yomi y llamó a Izanami desde la entrada. Ella respondió desde las sombras, diciendo que había comido del alimento de Yomi y por tanto no podía regresar fácilmente al mundo de los vivos, pero consultaría con los dioses de Yomi. Le rogó que no la mirara. Izanagi esperó, pero cuando ella no regresó, su impaciencia creció. Encendió un fuego con su peine y entró al palacio. Lo que vio lo horrorizó: el cuerpo de Izanami estaba putrefacto, cubierto de gusanos, y ocho dioses del trueno habían nacido de su carne descompuesta. Izanagi gritó de terror y huyó. Izanami, enfurecida y humillada de que la hubiera visto en ese estado, envió a las feas brujas de Yomi (yomotsu-shikome) para perseguirlo. Izanagi arrojó su tocado que se transformó en racimos de uvas; mientras las brujas las devoraban, ganó distancia. Arrojó su peine que se convirtió en brotes de bambú. Finalmente, Izanami envió a los ocho dioses del trueno y un ejército de guerreros de Yomi. Izanagi alcanzó la salida del inframundo, encontró tres melocotones (fruta sagrada), y los arrojó a sus perseguidores, expulsándolos. Izanami misma lo persiguió. Justo cuando ella llegaba, Izanagi bloqueó el paso de Yomi (Yomotsu Hirasaka) con una roca enorme. Desde lados opuestos de la roca, Izanami e Izanagi pronunciaron su divorcio. Izanami juró: "Cada día estrangularé a mil personas de tu tierra". Izanagi respondió: "Cada día construiré mil quinientas chozas de parto". Así se estableció que cada día mueren mil personas pero nacen mil quinientas, asegurando que la población humana siempre crezca. Izanagi, contaminado por su contacto con la muerte, realizó misogi (purificación ritual) en el río Woto en Tachibana en Himuka, Kyushu. Cuando se quitó sus prendas, cada pieza se transformó en una deidad. Al lavarse, nacieron múltiples dioses de la suciedad de su cuerpo. Finalmente, cuando lavó su ojo izquierdo nació Amaterasu (sol), de su ojo derecho nació Tsukuyomi (luna), y de su nariz nació Susanoo (tormenta). Estos tres se conocen como las "Tres Nobles Deidades". Izanagi asignó a Amaterasu los cielos, a Tsukuyomi la noche, y a Susanoo el mar.', ref: 'Kojiki, capítulos 9-13; Nihon Shoki, Era de los Dioses, capítulos 5-6' },
    { era: 'japonesa', titulo: 'Inari y los zorros mensajeros', resumen: 'El dios del arroz servido por zorros blancos mágicos.', detalle: 'Inari Ōkami es una de las deidades más veneradas del sintoísmo, dios (o diosa, dependiendo de la interpretación) del arroz, la fertilidad, la agricultura, los zorros, la industria y el éxito mundano. Inari tiene orígenes antiguos predatando el budismo en Japón. Inari no es un solo dios sino una manifestación compleja que puede aparecer como varón anciano, mujer joven, o incluso como zorro. Los zorros blancos (byakko) son los mensajeros y sirvientes de Inari. Estos kitsune no son zorros ordinarios sino criaturas mágicas con habilidades sobrenaturales: pueden adoptar forma humana, generar fuego de sus colas, poseer personas, y vivir enormes períodos de tiempo. Los zorros fieles a Inari se llaman zenko ("zorros buenos"), en contraste con los yako o nogitsune (zorros salvajes maliciosos que engañan a humanos). Los santuarios Inari se reconocen por hileras de torii rojos (puertas sagradas) y estatuas de zorros flanqueando la entrada, a menudo sosteniendo llaves (del granero de arroz), joyas wish-granting, o rollos. El santuario Fushimi Inari-taisha en Kyoto, con sus famosos miles de torii formando túneles, es el santuario principal de Inari. La leyenda cuenta que Inari descendió a la montaña Inariyama en el año 711 EC (aunque la deidad es mucho más antigua). Los agricultores oraban a Inari por cosechas abundantes, colocando ofrendas de arroz, sake y aburaage (tofu frito, favorito de los zorros). Con el tiempo, Inari también se asoció con comercio, industria y prosperidad general, convirtiéndose en patrón de comerciantes y artesanos. En sincretismo budista, Inari se fusionó con Dakiniten, una deidad budista que monta un zorro volador. Algunas historias cuentan de comerciantes arruinados que oraron sinceramente a Inari y fueron visitados por un zorro blanco que les reveló secretos comerciales o les condujo a fortuna escondida. Los zorros de Inari a veces prueban el carácter de devotos: podrían aparecerse como mendigos necesitados; aquellos que muestren bondad genuina son recompensados, mientras que los egoístas son castigados o engañados.', ref: 'Tradición sintoísta, folclore; Documentos del santuario Fushimi Inari-taisha; cuentos folclóricos Konjaku Monogatari-shū' },
    { era: 'japonesa', titulo: 'Momotarō: el niño del melocotón', resumen: 'Un niño nacido de un melocotón gigante derrota a demonios.', detalle: 'Una pareja anciana y sin hijos vivía en una aldea japonesa. Un día, la anciana lavaba ropa en el río cuando un melocotón gigante flotó corriente abajo. Lo llevó a casa, y cuando ella y su esposo intentaron cortarlo para comerlo, el melocotón se abrió espontáneamente revelando a un bebé humano perfecto en su interior. Agradecidos por este regalo divino, lo nombraron Momotarō ("Hijo del Melocotón") y lo criaron con amor. Momotarō creció fuerte, valiente y virtuoso, comiendo kibi-dango (bolas de mijo dulce). Cuando alcanzó mayoría de edad, anunció que viajaría a la Isla Oni (Onigashima) para derrotar a los oni (demonios ogro) que aterrorizaban la región, saqueando aldeas y secuestrando personas. Su madre adoptiva preparó kibi-dango para su viaje. En el camino, Momotarō encontró a un perro que le pidió una bola de mijo. Momotarō la compartió generosamente, y el perro juró lealtad convirtiéndose en su primero compañero. Luego encontró a un mono, y finalmente a un faisán, ambos pidieron kibi-dango y juraron seguirlo tras recibirlo. Los cuatro viajaron a Onigashima navegando en un barco. Al llegar, encontraron un castillo fortificado de hierro habitado por oni feroces con cuernos, colmillos, piel de colores (roja, azul, verde), portando garrotes con clavos de hierro. Momotarō lideró el asalto: el perro mordió a los oni, el mono arañó sus caras, y el faisán picoteó sus ojos. Momotarō luchó contra el jefe oni en combate singular y lo derrotó. Los oni supervivientes se rindieron, jurando nunca más aterrorizar humanos. Momotarō liberó a los prisioneros y recuperó los tesoros que los oni habían robado: oro, plata, coral, y joyas. Regresó triunfante a su aldea donde vivió próspero con sus padres adoptivos. El cuento de Momotarō se convirtió en una de las historias más famosas de Japón, simbolizando valor, cooperación y filialidad. Durante la era Meiji y Segunda Guerra Mundial, fue apropiado como propaganda nacionalista, pero originalmente era un simple cuento folclórico de héroes.', ref: 'Nihon Shoki mención temprana; desarrollado en Otogizōshi; Popularizado en periodo Edo; versiones en Man\'yōshū (poesía temprana)' },
    { era: 'japonesa', titulo: 'Urashima Tarō: el pescador en el palacio del dragón', resumen: 'Un pescador amable pierde 300 años en un día mágico.', detalle: 'Urashima Tarō era un joven pescador amable de la provincia de Tango. Un día, mientras caminaba por la playa, vio a unos niños torturando a una tortuga pequeña. Conmovido por compasión, Urashima compró la tortuga a los niños y la liberó en el mar. Varios días después, mientras pescaba, una gran tortuga nadó hasta su barca y habló con voz humana: "Soy la tortuga que salvaste. Mi amo, el Rey Dragón del Mar (Ryūjin), desea agradecerte por tu bondad. Por favor, súbete a mi caparazón". Urashima aceptó la invitación. La tortuga se sumergió en el océano, y para sorpresa de Urashima, pudo respirar bajo el agua. Descendieron más y más profundo hasta que alcanzaron Ryūgū-jō, el maravilloso Palacio del Rey Dragón construido de coral rojo y blanco, techos de jade, y pilares de gemas. Las puertas estaban hechas de perlas. El Rey Dragón Ryūjin y su hermosa hija, la princesa Otohime, recibieron a Urashima con gran honor. Otohime se enamoró de Urashima y le pidió que se quedara en el palacio. Urashima, encantado por la belleza de Otohime y las maravillas del palacio submarino, acordó quedarse "unos días". Vivió en éxtasis: banquetes suntuosos, música celestial, y cada habitación del palacio representaba una estación diferente del año. Finalmente, Urashima sintió nostalgia por su madre anciana y su aldea. Pidió regresar, aunque fuera brevemente. Otohime, entristecida pero comprensiva, le dio una hermosa caja decorada (tamatebako) con una advertencia solemne: "Esta caja te protegerá de todo daño, pero nunca, bajo ninguna circunstancia, debes abrirla". Urashima montó la tortuga de regreso a la superficie. Al llegar a su aldea, todo parecía extrañamente diferente. Las casas eran desconocidas, la gente eran extraños, y su propia casa había desaparecido. Confundido, preguntó por su madre y familia. Un anciano respondió: "¿Urashima? Ese nombre aparece en historias antiguas. Dicen que un pescador llamado Urashima desapareció en el mar hace trescientos años". Urashima comprendió horrorizadamente que mientras vivió "unos días" en el palacio submarino, tres siglos habían pasado en la tierra. Todos los que amaba estaban muertos hace generaciones. Desesperado y sin esperanza, olvidó la advertencia de Otohime y abrió la tamatebako. De la caja surgió una nube de humo blanco. Instantáneamente, Urashima envejeció dramáticamente: su piel se arrugó, su cabello se volvió blanco y se cayó, su espalda se encorvó, y en momentos se transformó en un hombre extremadamente anciano. Algunas versiones dicen que murió inmediatamente; otras que vivió algunos años más como mendigo anciano añorando Ryūgū-jō. Una versión más amable sugiere que se transformó en grulla y voló de regreso al mar. El cuento advierte sobre los peligros de la curiosidad, la relatividad del tiempo en reinos mágicos, y la inevitabilidad del tiempo.', ref: 'Nihon Shoki mención temprana; desarrollado en Otogizōshi; Popularizado en periodo Edo; versiones en Man\'yōshū (poesía temprana)' },
    { era: 'japonesa', titulo: 'El nacimiento de los dioses del viento y el trueno', resumen: 'Raijin y Fujin, hermanos divinos que controlan las tormentas.', detalle: 'Raijin (dios del trueno) y Fujin (dios del viento) son dos de las deidades más antiguas y poderosas del panteón sintoísta, hermanos que nacieron de Izanami antes de su muerte. Raijin es representado como un demonio oni musculoso con piel roja o azul, portando tambores (taiko) que rodean su cuerpo. Cuando golpea estos tambores con baquetas, crea el trueno. Tiene garras afiladas y una expresión feroz, pero no es malévolo - simplemente es una fuerza natural incontrolable. Fujin es representado como otro demonio oni, generalmente con piel verde, portando una gran bolsa de vientos sobre sus hombros. Cuando abre la bolsa, libera los vientos que causan desde brisas suaves hasta tifones devastadores. Los dos hermanos son inseparables y frecuentemente representados juntos en el arte japonés. Durante la invasión mongol de Japón en 1274 y 1281, se dice que Raijin y Fujin enviaron los "kamikaze" (vientos divinos) - enormes tifones que destruyeron las flotas mongolas, salvando a Japón de la conquista. Este evento consolidó su posición como protectores divinos de Japón. Los agricultores oraban a ambos dioses: a Raijin por lluvia para los cultivos (el trueno trae lluvia), y a Fujin por vientos favorables para secar los campos de arroz. Sin embargo, también temían su ira, pues tormentas excesivas podían destruir cosechas enteras. Existe una creencia popular de que esconderse bajo los árboles mosquitos durante tormentas eléctricas puede proteger contra Raijin, pues se dice que el dios evita estos árboles. Los niños japoneses a veces son advertidos de cubrir sus ombligos durante tormentas, pues se dice que Raijin come ombligos de niños traviesos. En templos budistas, estatuas de Raijin y Fujin frecuentemente flanquean las puertas de entrada como guardianes protectores, sus expresiones feroces alejando espíritus malignos. Su dualidad representa el equilibrio necesario en la naturaleza: viento y trueno, destrucción y renovación, temor y reverencia. Juntos, encarnan el poder impredecible pero esencial de las fuerzas naturales que tanto dan vida como la quitan.', ref: 'Kojiki menciones tempranas; arte budista y sintoísta; folclore sobre invasiones mongolas; tradición de estatuas guardianas' }
];
/**
 * Personajes legendarios 
 */
const CHARACTERS = [
    /* Egipcia - 25 personajes */
    { era: 'egipcia', nombre: 'Ra', rol: 'Dios solar', detalle: 'Creador y garante del orden cósmico, viaja en barca.' },
    { era: 'egipcia', nombre: 'Isis', rol: 'Magia y maternidad', detalle: 'Protectora de reyes, diosa más poderosa en artes mágicas.' },
    { era: 'egipcia', nombre: 'Osiris', rol: 'Más allá', detalle: 'Juez de los muertos, símbolo de regeneración y resurrección.' },
    { era: 'egipcia', nombre: 'Horus', rol: 'Realeza', detalle: 'Halcón divino, heredero legítimo, dios del cielo.' },
    { era: 'egipcia', nombre: 'Anubis', rol: 'Momificación', detalle: 'Chacal que guía las almas al juicio, protector de tumbas.' },
    { era: 'egipcia', nombre: 'Thoth', rol: 'Sabiduría', detalle: 'Ibis, escriba divino, inventor de escritura y ciencias.' },
    { era: 'egipcia', nombre: 'Sekhmet', rol: 'Guerra y medicina', detalle: 'Leona feroz, ojo vengador de Ra, sanadora paradójica.' },
    { era: 'egipcia', nombre: 'Ptah', rol: 'Creador menfita', detalle: 'Artesano divino que crea con pensamiento y palabra.' },
    { era: 'egipcia', nombre: 'Hathor', rol: 'Amor y música', detalle: 'Vaca sagrada, alegría, maternidad, embriaguez ritual.' },
    { era: 'egipcia', nombre: 'Set', rol: 'Caos y desiertos', detalle: 'Hermano celoso de Osiris, dios de tormentas y frontera.' },
    { era: 'egipcia', nombre: 'Neftis', rol: 'Duelo y transición', detalle: 'Hermana de Isis, asiste en momificación y funerales.' },
    { era: 'egipcia', nombre: 'Bastet', rol: 'Hogar y protección', detalle: 'Gata doméstica, protectora de hogares, fertilidad.' },
    { era: 'egipcia', nombre: 'Sobek', rol: 'Cocodrilo del Nilo', detalle: 'Poder del río, ferocidad protectora, fertilidad.' },
    { era: 'egipcia', nombre: 'Maat', rol: 'Verdad y justicia', detalle: 'Orden cósmico personificado, su pluma pesa corazones.' },
    { era: 'egipcia', nombre: 'Atum', rol: 'Creador primordial', detalle: 'Dios autoengendrado de Heliópolis, sol poniente.' },
    { era: 'egipcia', nombre: 'Bes', rol: 'Protector doméstico', detalle: 'Enano grotesco pero benévolo, aleja espíritus malignos.' },
    { era: 'egipcia', nombre: 'Taweret', rol: 'Parto y maternidad', detalle: 'Hipopótamo femenino, protege embarazadas y recién nacidos.' },
    { era: 'egipcia', nombre: 'Khonsu', rol: 'Luna viajera', detalle: 'Hijo de Amón y Mut, dios lunar de curación.' },
    { era: 'egipcia', nombre: 'Amón', rol: 'Rey de dioses', detalle: 'Fusionado con Ra como Amón-Ra, dios imperial de Tebas.' },
    { era: 'egipcia', nombre: 'Mut', rol: 'Madre divina', detalle: 'Consorte de Amón, diosa buitre, madre de Khonsu.' },
    { era: 'egipcia', nombre: 'Neith', rol: 'Tejedora primordial', detalle: 'Diosa guerrera y creadora, teje el cosmos.' },
    { era: 'egipcia', nombre: 'Khepri', rol: 'Renacimiento solar', detalle: 'Escarabajo, empuja el sol al amanecer, transformación.' },
    { era: 'egipcia', nombre: 'Nut', rol: 'Cielo estrellado', detalle: 'Diosa bóveda celeste, traga el sol cada noche.' },
    { era: 'egipcia', nombre: 'Geb', rol: 'Tierra fértil', detalle: 'Dios de la tierra, yace bajo Nut, padre de Osiris.' },
    { era: 'egipcia', nombre: 'Serket', rol: 'Escorpiones', detalle: 'Protege contra venenos y picaduras, guardiana de tumbas.' },

    /* Griega - 25 personajes */
    { era: 'griega', nombre: 'Zeus', rol: 'Soberano olímpico', detalle: 'Rey de dioses, rayo, trueno, justicia divina.' },
    { era: 'griega', nombre: 'Atenea', rol: 'Sabiduría', detalle: 'Estratega, patrona de Atenas, nació de la cabeza de Zeus.' },
    { era: 'griega', nombre: 'Hades', rol: 'Inframundo', detalle: 'Gobierna el reino de los muertos con Perséfone.' },
    { era: 'griega', nombre: 'Ariadna', rol: 'Heroína', detalle: 'Princesa de Creta, salvó a Teseo con el hilo.' },
    { era: 'griega', nombre: 'Prometeo', rol: 'Titán benefactor', detalle: 'Ladrón del fuego divino para la humanidad.' },
    { era: 'griega', nombre: 'Heracles', rol: 'Héroe supremo', detalle: 'Fuerza sobrehumana, doce trabajos imposibles.' },
    { era: 'griega', nombre: 'Afrodita', rol: 'Amor y belleza', detalle: 'Nacida de la espuma del mar, irresistible.' },
    { era: 'griega', nombre: 'Apolo', rol: 'Luz y artes', detalle: 'Dios solar, música, poesía, profecía, medicina.' },
    { era: 'griega', nombre: 'Artemisa', rol: 'Caza y luna', detalle: 'Hermana gemela de Apolo, cazadora virgen.' },
    { era: 'griega', nombre: 'Hermes', rol: 'Mensajero', detalle: 'Psicopompo, comercio, ladrones, viajes.' },
    { era: 'griega', nombre: 'Poseidón', rol: 'Mar y terremotos', detalle: 'Tridente, caballos, dominio de océanos.' },
    { era: 'griega', nombre: 'Deméter', rol: 'Cosecha', detalle: 'Diosa de agricultura, madre de Perséfone.' },
    { era: 'griega', nombre: 'Dioniso', rol: 'Vino y éxtasis', detalle: 'Liberación mediante embriaguez, teatro, locura divina.' },
    { era: 'griega', nombre: 'Hefesto', rol: 'Forja', detalle: 'Herrero de los dioses, cojo, genio artesano.' },
    { era: 'griega', nombre: 'Ares', rol: 'Guerra violenta', detalle: 'Batalla sangrienta, furia, menos estratégico que Atenea.' },
    { era: 'griega', nombre: 'Perseo', rol: 'Matador de Medusa', detalle: 'Héroe que decapitó a la gorgona con ayuda divina.' },
    { era: 'griega', nombre: 'Teseo', rol: 'Héroe ateniense', detalle: 'Mató al Minotauro, unificó Ática.' },
    { era: 'griega', nombre: 'Aquiles', rol: 'Guerrero invencible', detalle: 'Héroe de la guerra de Troya, talón vulnerable.' },
    { era: 'griega', nombre: 'Odiseo', rol: 'Astuto viajero', detalle: 'Héroe de la Odisea, inteligencia sobre fuerza.' },
    { era: 'griega', nombre: 'Medea', rol: 'Hechicera', detalle: 'Ayudó a Jasón, venganza terrible contra traición.' },
    { era: 'griega', nombre: 'Orfeo', rol: 'Músico divino', detalle: 'Lira encanta todo, viajó al Hades por amor.' },
    { era: 'griega', nombre: 'Pan', rol: 'Naturaleza salvaje', detalle: 'Sátiro con patas de cabra, flauta, pánico.' },
    { era: 'griega', nombre: 'Asclepio', rol: 'Medicina', detalle: 'Dios sanador, resucitaba muertos con medicina.' },
    { era: 'griega', nombre: 'Hestia', rol: 'Hogar', detalle: 'Diosa del fuego doméstico, centro de la casa.' },
    { era: 'griega', nombre: 'Némesis', rol: 'Retribución', detalle: 'Castiga hibris (arrogancia), equilibrio divino.' },

    /* Romana - 25 personajes */
    { era: 'romana', nombre: 'Júpiter', rol: 'Soberano', detalle: 'Rey de dioses, protector del estado romano.' },
    { era: 'romana', nombre: 'Juno', rol: 'Matrimonio', detalle: 'Reina, protectora de mujeres y nacimientos.' },
    { era: 'romana', nombre: 'Eneas', rol: 'Fundador', detalle: 'Piedad y destino, ancestor de romanos.' },
    { era: 'romana', nombre: 'Rómulo', rol: 'Fundador de Roma', detalle: 'Primer rey, estableció instituciones y fronteras.' },
    { era: 'romana', nombre: 'Marte', rol: 'Guerra', detalle: 'Padre de Rómulo y Remo, dios militar.' },
    { era: 'romana', nombre: 'Venus', rol: 'Amor divino', detalle: 'Madre de Eneas, protectora de Roma.' },
    { era: 'romana', nombre: 'Minerva', rol: 'Sabiduría táctica', detalle: 'Patrona de artesanos y estrategas.' },
    { era: 'romana', nombre: 'Vesta', rol: 'Hogar sagrado', detalle: 'Fuego eterno del estado, vírgenes vestales.' },
    { era: 'romana', nombre: 'Jano', rol: 'Transiciones', detalle: 'Dios de dos caras, puertas, comienzos.' },
    { era: 'romana', nombre: 'Numa Pompilio', rol: 'Rey legislador', detalle: 'Segundo rey, organizó religión y calendario.' },
    { era: 'romana', nombre: 'Neptuno', rol: 'Mar', detalle: 'Tridente, caballos, dominio de océanos.' },
    { era: 'romana', nombre: 'Plutón', rol: 'Inframundo', detalle: 'Señor del mundo de los muertos, riquezas subterráneas.' },
    { era: 'romana', nombre: 'Diana', rol: 'Caza y luna', detalle: 'Cazadora virgen, protectora de naturaleza.' },
    { era: 'romana', nombre: 'Apolo', rol: 'Sol y profecía', detalle: 'Luz, música, oráculos, epidemias.' },
    { era: 'romana', nombre: 'Vulcano', rol: 'Forja', detalle: 'Herrero divino, volcanes, trabajo del metal.' },
    { era: 'romana', nombre: 'Mercurio', rol: 'Mensajero', detalle: 'Comercio, viajeros, ladrones, elocuencia.' },
    { era: 'romana', nombre: 'Ceres', rol: 'Agricultura', detalle: 'Cosecha, pan, leyes agrarias.' },
    { era: 'romana', nombre: 'Baco', rol: 'Vino', detalle: 'Éxtasis, festivales, teatro, liberación.' },
    { era: 'romana', nombre: 'Fortuna', rol: 'Suerte', detalle: 'Destino, prosperidad, rueda de la fortuna.' },
    { era: 'romana', nombre: 'Saturno', rol: 'Tiempo', detalle: 'Edad dorada, Saturnalia, cosechas.' },
    { era: 'romana', nombre: 'Lucrecia', rol: 'Mártir republicana', detalle: 'Su suicidio causó la caída de los reyes.' },
    { era: 'romana', nombre: 'Horacio Cocles', rol: 'Héroe guerrero', detalle: 'Defendió solo el puente contra ejército.' },
    { era: 'romana', nombre: 'Cincinnato', rol: 'Dictador virtuoso', detalle: 'Dejó el poder voluntariamente, ejemplo de virtud.' },
    { era: 'romana', nombre: 'Fauno', rol: 'Naturaleza', detalle: 'Dios rústico, profecía, fertilidad de rebaños.' },
    { era: 'romana', nombre: 'Lares', rol: 'Espíritus guardianes', detalle: 'Protectores del hogar y encrucijadas.' },

    /* Vikinga - 25 personajes */
    { era: 'vikinga', nombre: 'Odín', rol: 'Padre de todo', detalle: 'Sabiduría, runas, sacrificio por conocimiento.' },
    { era: 'vikinga', nombre: 'Thor', rol: 'Trueno', detalle: 'Protector con Mjölnir, defensor de Midgard.' },
    { era: 'vikinga', nombre: 'Loki', rol: 'Trickster', detalle: 'Cambio, caos, engaño, padre de monstruos.' },
    { era: 'vikinga', nombre: 'Freya', rol: 'Amor y seiðr', detalle: 'Guerra, fertilidad, magia, collar Brísingamen.' },
    { era: 'vikinga', nombre: 'Baldr', rol: 'Belleza y luz', detalle: 'Hijo de Odín, amado por todos, muerte trágica.' },
    { era: 'vikinga', nombre: 'Tyr', rol: 'Guerra justa', detalle: 'Sacrificó su mano para atar a Fenrir.' },
    { era: 'vikinga', nombre: 'Heimdall', rol: 'Guardián', detalle: 'Vigila Bifröst, oído y vista superiores.' },
    { era: 'vikinga', nombre: 'Frigg', rol: 'Maternidad', detalle: 'Esposa de Odín, madre de Baldr, clarividencia.' },
    { era: 'vikinga', nombre: 'Jörmungandr', rol: 'Serpiente del mundo', detalle: 'Rodea Midgard, enemiga de Thor.' },
    { era: 'vikinga', nombre: 'Sleipnir', rol: 'Corcel divino', detalle: 'Caballo de ocho patas de Odín.' },
    { era: 'vikinga', nombre: 'Fenrir', rol: 'Lobo del caos', detalle: 'Devorará a Odín en Ragnarök.' },
    { era: 'vikinga', nombre: 'Hel', rol: 'Señora de los muertos', detalle: 'Gobierna el reino de los muertos deshonrosos.' },
    { era: 'vikinga', nombre: 'Frey', rol: 'Fertilidad', detalle: 'Prosperidad, sol, lluvia, paz, sexualidad.' },
    { era: 'vikinga', nombre: 'Iðunn', rol: 'Juventud eterna', detalle: 'Manzanas que mantienen jóvenes a los dioses.' },
    { era: 'vikinga', nombre: 'Skadi', rol: 'Invierno y caza', detalle: 'Giganta que se casó con Njörðr, esquí.' },
    { era: 'vikinga', nombre: 'Njörðr', rol: 'Mar y viento', detalle: 'Dios vani, riqueza, navegación, pesca.' },
    { era: 'vikinga', nombre: 'Bragi', rol: 'Poesía', detalle: 'Escaldo de los dioses, elocuencia.' },
    { era: 'vikinga', nombre: 'Ullr', rol: 'Arquería', detalle: 'Caza, invierno, juramentos, duelo.' },
    { era: 'vikinga', nombre: 'Valquirias', rol: 'Elegidoras de caídos', detalle: 'Llevan guerreros a Valhalla, hijas de Odín.' },
    { era: 'vikinga', nombre: 'Nornas', rol: 'Destino', detalle: 'Urðr, Verðandi, Skuld, tallan runas del destino.' },
    { era: 'vikinga', nombre: 'Sif', rol: 'Cosecha', detalle: 'Esposa de Thor, cabello dorado como trigo.' },
    { era: 'vikinga', nombre: 'Sigurd', rol: 'Matador de dragones', detalle: 'Héroe, mató a Fafnir, Nibelungenlied.' },
    { era: 'vikinga', nombre: 'Ragnar Lothbrok', rol: 'Rey legendario', detalle: 'Vikingo famoso, padre de hijos conquistadores.' },
    { era: 'vikinga', nombre: 'Hrym', rol: 'Gigante de hielo', detalle: 'Liderará a los gigantes en Ragnarök.' },
    { era: 'vikinga', nombre: 'Surtr', rol: 'Gigante de fuego', detalle: 'Incendiará los mundos con espada flamígera.' },

    /* Azteca - 25 personajes */
    { era: 'azteca', nombre: 'Quetzalcóatl', rol: 'Serpiente emplumada', detalle: 'Viento, sabiduría, vida, creador de humanidad.' },
    { era: 'azteca', nombre: 'Huitzilopochtli', rol: 'Guerra y sol', detalle: 'Patrono de México-Tenochtitlan, dios solar.' },
    { era: 'azteca', nombre: 'Tezcatlipoca', rol: 'Noche y destino', detalle: 'Espejo humeante, contraparte de Quetzalcóatl.' },
    { era: 'azteca', nombre: 'Coatlicue', rol: 'Madre de dioses', detalle: 'Falda de serpientes, tierra y vida.' },
    { era: 'azteca', nombre: 'Tláloc', rol: 'Lluvia', detalle: 'Dios de tormentas, fertilidad, paraíso acuático.' },
    { era: 'azteca', nombre: 'Xochiquetzal', rol: 'Amor y flores', detalle: 'Belleza, placer, artes femeninas.' },
    { era: 'azteca', nombre: 'Mictlantecuhtli', rol: 'Señor de muertos', detalle: 'Soberano del Mictlán, esqueleto viviente.' },
    { era: 'azteca', nombre: 'Chalchiuhtlicue', rol: 'Aguas terrestres', detalle: 'Ríos, lagos, lluvia fecunda, esposa de Tláloc.' },
    { era: 'azteca', nombre: 'Xiuhtecuhtli', rol: 'Fuego', detalle: 'Señor del año, fuego doméstico, centro.' },
    { era: 'azteca', nombre: 'Coyolxauhqui', rol: 'Luna', detalle: 'Hermana de Huitzilopochtli, desmembrada.' },
    { era: 'azteca', nombre: 'Xipe Tótec', rol: 'Primavera', detalle: 'Nuestro señor desollado, renovación.' },
    { era: 'azteca', nombre: 'Mayahuel', rol: 'Maguey', detalle: 'Diosa del pulque, 400 pechos.' },
    { era: 'azteca', nombre: 'Centeotl', rol: 'Maíz', detalle: 'Dios del maíz, sustento básico.' },
    { era: 'azteca', nombre: 'Tonatiuh', rol: 'Quinto Sol', detalle: 'Sol actual, exige sacrificios.' },
    { era: 'azteca', nombre: 'Mixcóatl', rol: 'Caza', detalle: 'Serpiente de nube, cazador estelar.' },
    { era: 'azteca', nombre: 'Tlahuizcalpantecuhtli', rol: 'Venus', detalle: 'Estrella matutina, peligrosa.' },
    { era: 'azteca', nombre: 'Chalchiuhtotolin', rol: 'Pavo jade', detalle: 'Pestilencias, castigos, inspiración.' },
    { era: 'azteca', nombre: 'Itztlacoliuhqui', rol: 'Hielo y justicia', detalle: 'Dios de obsidiana, castigo.' },
    { era: 'azteca', nombre: 'Xólotl', rol: 'Gemelo de Quetzalcóatl', detalle: 'Perro, guía al inframundo, monstruos.' },
    { era: 'azteca', nombre: 'Tlazoltéotl', rol: 'Inmundicia', detalle: 'Come pecados, purificación, parto.' },
    { era: 'azteca', nombre: 'Ehécatl', rol: 'Viento', detalle: 'Aspecto de Quetzalcóatl, sopló el Sol.' },
    { era: 'azteca', nombre: 'Itzpapálotl', rol: 'Mariposa de obsidiana', detalle: 'Tzitzimitl guerrera, estrella demoníaca.' },
    { era: 'azteca', nombre: 'Tlaltecuhtli', rol: 'Señor de la tierra', detalle: 'Monstruo primordial despedazado para crear mundo.' },
    { era: 'azteca', nombre: 'Toci', rol: 'Abuela', detalle: 'Madre de dioses, medicina, partera.' },
    { era: 'azteca', nombre: 'Xochipilli', rol: 'Príncipe flor', detalle: 'Arte, juegos, belleza, placer, plantas sagradas.' },

    /* Japonesa - 25 personajes */
    { era: 'japonesa', nombre: 'Amaterasu', rol: 'Sol', detalle: 'Deidad suprema del panteón sintoísta.' },
    { era: 'japonesa', nombre: 'Susanoo', rol: 'Tormentas', detalle: 'Vencedor de Orochi, hermano de Amaterasu.' },
    { era: 'japonesa', nombre: 'Tsukuyomi', rol: 'Luna', detalle: 'Hermano de Amaterasu, separado eternamente.' },
    { era: 'japonesa', nombre: 'Izanagi', rol: 'Progenitor', detalle: 'Creador de islas, padre de tres nobles.' },
    { era: 'japonesa', nombre: 'Izanami', rol: 'Progenitora', detalle: 'Creadora de islas, señora de Yomi.' },
    { era: 'japonesa', nombre: 'Inari', rol: 'Arroz y prosperidad', detalle: 'Fertilidad, comercio, zorros mensajeros.' },
    { era: 'japonesa', nombre: 'Raijin', rol: 'Trueno', detalle: 'Demonio oni que controla tormentas.' },
    { era: 'japonesa', nombre: 'Fujin', rol: 'Viento', detalle: 'Compañero de Raijin, bolsa de vientos.' },
    { era: 'japonesa', nombre: 'Benzaiten', rol: 'Música y sabiduría', detalle: 'Única diosa entre siete dioses de fortuna.' },
    { era: 'japonesa', nombre: 'Jizō', rol: 'Protector', detalle: 'Bodhisattva protector de niños y viajeros.' },
    { era: 'japonesa', nombre: 'Tengu', rol: 'Guerreros místicos', detalle: 'Espíritus de montañas, maestros marciales.' },
    { era: 'japonesa', nombre: 'Kitsune', rol: 'Zorros mágicos', detalle: 'Mensajeros de Inari, cambiaformas.' },
    { era: 'japonesa', nombre: 'Ryūjin', rol: 'Rey dragón', detalle: 'Gobierna el océano desde palacio submarino.' },
    { era: 'japonesa', nombre: 'Ame-no-Uzume', rol: 'Alegría y amanecer', detalle: 'Sacó a Amaterasu de la cueva con danza.' },
    { era: 'japonesa', nombre: 'Hachiman', rol: 'Guerra', detalle: 'Dios samurái, protector de guerreros.' },
    { era: 'japonesa', nombre: 'Ebisu', rol: 'Pesca y fortuna', detalle: 'Dios de pescadores y comercio honesto.' },
    { era: 'japonesa', nombre: 'Daikokuten', rol: 'Riqueza', detalle: 'Dios de cocina, agricultura, fortuna.' },
    { era: 'japonesa', nombre: 'Hotei', rol: 'Felicidad', detalle: 'Buda risueño, contentamiento.' },
    { era: 'japonesa', nombre: 'Bishamonten', rol: 'Guerra justa', detalle: 'Guerrero divino, protección.' },
    { era: 'japonesa', nombre: 'Fukurokuju', rol: 'Longevidad', detalle: 'Sabiduría, larga vida, felicidad.' },
    { era: 'japonesa', nombre: 'Jurojin', rol: 'Longevidad', detalle: 'Anciano sabio, vida larga.' },
    { era: 'japonesa', nombre: 'Ōkuninushi', rol: 'Nación', detalle: 'Gran señor de la tierra, medicina.' },
    { era: 'japonesa', nombre: 'Sarutahiko', rol: 'Encrucijadas', detalle: 'Guía, nariz larga, dios terrenal.' },
    { era: 'japonesa', nombre: 'Kagutsuchi', rol: 'Fuego', detalle: 'Nacimiento quemó a Izanami.' },
    { era: 'japonesa', nombre: 'Yamata-no-Orochi', rol: 'Serpiente de 8 cabezas', detalle: 'Monstruo derrotado por Susanoo.' }
];

/**
 * Pool de preguntas del quiz - COMPLETO
 * 15-20 preguntas por cultura
 */
const QUESTIONS_POOL = [
    /* Egipcia - 18 preguntas */
    { era: 'egipcia', texto: '¿Qué se pesa contra la pluma de Maat en el juicio de Osiris?', opciones: ['El corazón', 'El cerebro', 'El hígado', 'El alma'], correcta: 0, pista: 'Órgano asociado con pensamiento en Egipto.' },
    { era: 'egipcia', texto: '¿A quién combate Ra cada noche en su viaje por el Duat?', opciones: ['Apofis', 'Set', 'Anubis', 'Sobek'], correcta: 0, pista: 'La serpiente del caos primordial.' },
    { era: 'egipcia', texto: '¿Cómo obtuvo Isis el nombre secreto de Ra?', opciones: ['Se lo robó', 'Creó una serpiente que lo mordió', 'Se lo susurró Thoth', 'Lo adivinó'], correcta: 1, pista: 'Usó veneno como chantaje.' },
    { era: 'egipcia', texto: '¿Cuántas piezas tenía el cuerpo de Osiris tras ser desmembrado por Set?', opciones: ['7 piezas', '12 piezas', '14 piezas', '40 piezas'], correcta: 2, pista: 'Número relacionado con las provincias.' },
    { era: 'egipcia', texto: '¿Cuánto duró la contienda entre Horus y Set por el trono?', opciones: ['7 años', '40 años', '80 años', '100 años'], correcta: 2, pista: 'Ocho décadas de pruebas.' },
    { era: 'egipcia', texto: '¿Qué ave egipcia es precursora del fénix griego?', opciones: ['Halcón', 'Ibis', 'Bennu', 'Buitre'], correcta: 2, pista: 'Ave asociada con Ra y renacimiento.' },
    { era: 'egipcia', texto: '¿Qué dios egipcio creó el mundo con su corazón y lengua?', opciones: ['Atum', 'Ra', 'Ptah', 'Amón'], correcta: 2, pista: 'Dios de Menfis, el artesano.' },
    { era: 'egipcia', texto: '¿Cuántas jarras de cerveza prepararon los dioses para embriagar a Sekhmet?', opciones: ['100', '1000', '7000', '10000'], correcta: 2, pista: 'Un número muy grande, miles.' },
    { era: 'egipcia', texto: '¿Qué inventó Thoth según la mitología egipcia?', opciones: ['La rueda', 'Los jeroglíficos', 'El papiro', 'Las pirámides'], correcta: 1, pista: 'Sistema de escritura sagrado.' },
    { era: 'egipcia', texto: '¿Cuántas Hathores predicen el destino al nacer?', opciones: ['Tres', 'Cinco', 'Siete', 'Nueve'], correcta: 2, pista: 'Número sagrado en muchas culturas.' },
    { era: 'egipcia', texto: '¿Qué monstruo devora el corazón de los impuros en el juicio?', opciones: ['Apofis', 'Sobek', 'Ammit', 'Taweret'], correcta: 2, pista: 'Mitad cocodrilo, león e hipopótamo.' },
    { era: 'egipcia', texto: '¿Qué parte del cuerpo de Osiris no pudo encontrar Isis?', opciones: ['La cabeza', 'El corazón', 'El falo', 'Las manos'], correcta: 2, pista: 'Fue devorada por un pez.' },
    { era: 'egipcia', texto: '¿Quién es el dios egipcio con cabeza de chacal?', opciones: ['Set', 'Anubis', 'Wepwawet', 'Upuaut'], correcta: 1, pista: 'Dios de la momificación.' },
    { era: 'egipcia', texto: '¿Qué texto funerario egipcio contiene el Conjuro 125?', opciones: ['Textos de las Pirámides', 'Textos de los Sarcófagos', 'Libro de los Muertos', 'Libro de las Puertas'], correcta: 2, pista: 'El más famoso, para el más allá.' },
    { era: 'egipcia', texto: '¿Qué representa la pluma de Maat?', opciones: ['Poder', 'Verdad y justicia', 'Sabiduría', 'Eternidad'], correcta: 1, pista: 'El orden cósmico y moral.' },
    { era: 'egipcia', texto: '¿En qué hora del viaje nocturno Ra enfrenta a Apofis?', opciones: ['Primera', 'Cuarta', 'Séptima', 'Última'], correcta: 2, pista: 'En el punto medio de la noche.' },
    { era: 'egipcia', texto: '¿Qué faraona fue considerada manifestación de Hathor?', opciones: ['Nefertiti', 'Hatshepsut', 'Cleopatra', 'Todas ellas'], correcta: 3, pista: 'Muchas reinas se asociaban con ella.' },
    { era: 'egipcia', texto: '¿Qué animal sagrado representa a Thoth además del ibis?', opciones: ['Gato', 'Cocodrilo', 'Babuino', 'Escarabajo'], correcta: 2, pista: 'Primate del desierto.' },

    /* Griega - 20 preguntas */
    { era: 'griega', texto: '¿De dónde nació Atenea según la mitología?', opciones: ['Del mar', 'Del corazón de Hera', 'De la cabeza de Zeus', 'De un olivo'], correcta: 2, pista: 'Hefesto la liberó con un hacha.' },
    { era: 'griega', texto: '¿Quién robó el fuego del Olimpo para dárselo a los humanos?', opciones: ['Hermes', 'Prometeo', 'Hefesto', 'Apolo'], correcta: 1, pista: 'Un titán benefactor.' },
    { era: 'griega', texto: '¿Cuántos trabajos realizó Heracles para redimirse?', opciones: ['7', '10', '12', '20'], correcta: 2, pista: 'Número de meses del año.' },
    { era: 'griega', texto: '¿Qué condición impuso Hades para liberar a Eurídice?', opciones: ['No hablar', 'No mirar atrás', 'No tocarla', 'No mencionar su nombre'], correcta: 1, pista: 'Orfeo falló al final.' },
    { era: 'griega', texto: '¿Qué le dio Ariadna a Teseo para escapar del laberinto?', opciones: ['Una espada', 'Un mapa', 'Un ovillo de hilo', 'Una antorcha'], correcta: 2, pista: 'Podía seguirlo de regreso.' },
    { era: 'griega', texto: '¿Cuántas semillas de granada comió Perséfone en el Hades?', opciones: ['Tres', 'Seis', 'Nueve', 'Doce'], correcta: 1, pista: 'Determina meses en el inframundo.' },
    { era: 'griega', texto: '¿Qué quedó en la jarra después de que Pandora la abriera?', opciones: ['Nada', 'Esperanza', 'Amor', 'Sabiduría'], correcta: 1, pista: 'Lo único que no escapó.' },
    { era: 'griega', texto: '¿Qué le pasó a Ícaro por volar demasiado alto?', opciones: ['Se quemó', 'La cera se derritió', 'Se mareó', 'Un águila lo atacó'], correcta: 1, pista: 'El sol afectó su invención.' },
    { era: 'griega', texto: '¿Qué usó Perseo para evitar la mirada petrificadora de Medusa?', opciones: ['Ojos cerrados', 'Un velo', 'Un escudo pulido', 'Magia'], correcta: 2, pista: 'Usó el reflejo.' },
    { era: 'griega', texto: '¿Cuántas noches pasó Psique con Eros antes de verlo?', opciones: ['Una', 'Tres', 'Siete', 'Muchas'], correcta: 3, pista: 'Un tiempo indefinido en oscuridad.' },
    { era: 'griega', texto: '¿Quién era la primera esposa de Zeus que se tragó?', opciones: ['Hera', 'Metis', 'Leto', 'Deméter'], correcta: 1, pista: 'Diosa de la astucia.' },
    { era: 'griega', texto: '¿Cuántos años duró el tormento de Prometeo encadenado?', opciones: ['100 años', '1000 años', '10000 años', '30000 años'], correcta: 3, pista: 'Miles y miles de años.' },
    { era: 'griega', texto: '¿Cuál era el talón de Aquiles (literalmente)?', opciones: ['Su orgullo', 'Su único punto vulnerable', 'Su debilidad por mujeres', 'Su cobardía'], correcta: 1, pista: 'Punto físico no sumergido.' },
    { era: 'griega', texto: '¿Qué transformación sufrió el rey Midas?', opciones: ['En burro', 'Todo lo que tocaba era oro', 'En piedra', 'En árbol'], correcta: 1, pista: 'Una maldición dorada.' },
    { era: 'griega', texto: '¿Quién mató al Minotauro?', opciones: ['Perseo', 'Teseo', 'Heracles', 'Jasón'], correcta: 1, pista: 'Príncipe ateniense con el hilo.' },
    { era: 'griega', texto: '¿Qué monstruo guardaba el Vellocino de Oro?', opciones: ['Medusa', 'Cerbero', 'Un dragón', 'La Quimera'], correcta: 2, pista: 'Reptil que nunca dormía.' },
    { era: 'griega', texto: '¿Cuántos ojos tenía el cíclope Polifemo?', opciones: ['Uno', 'Dos', 'Tres', 'Ninguno tras Odiseo'], correcta: 0, pista: 'Característica definitoria de cíclopes.' },
    { era: 'griega', texto: '¿Qué diosa emergió de la espuma del mar?', opciones: ['Atenea', 'Hera', 'Afrodita', 'Artemisa'], correcta: 2, pista: 'Diosa del amor y la belleza.' },
    { era: 'griega', texto: '¿Quién derrotó a la Esfinge de Tebas?', opciones: ['Edipo', 'Teseo', 'Heracles', 'Perseo'], correcta: 0, pista: 'Resolvió su acertijo.' },
    { era: 'griega', texto: '¿Qué nacía cada vez que cortaban una cabeza de la Hidra?', opciones: ['Nada', 'Otra criatura', 'Dos cabezas', 'Veneno'], correcta: 2, pista: 'Se multiplicaba.' },

    /* Romana - 16 preguntas */
    { era: 'romana', texto: '¿Quién fundó Roma según el mito?', opciones: ['Eneas', 'Rómulo', 'Numa', 'Remo'], correcta: 1, pista: 'Mató a su hermano gemelo.' },
    { era: 'romana', texto: '¿Qué obra épica narra el viaje de Eneas a Italia?', opciones: ['Ilíada', 'Odisea', 'Eneida', 'Metamorfosis'], correcta: 2, pista: 'Escrita por Virgilio.' },
    { era: 'romana', texto: '¿Qué rey romano organizó el calendario y los rituales religiosos?', opciones: ['Rómulo', 'Numa Pompilio', 'Tulio Hostilio', 'Tarquinio'], correcta: 1, pista: 'El segundo rey, el pacífico.' },
    { era: 'romana', texto: '¿De qué pueblo raptaron los romanos a sus mujeres?', opciones: ['Etruscos', 'Latinos', 'Sabinos', 'Griegos'], correcta: 2, pista: 'Vecinos cercanos de Roma.' },
    { era: 'romana', texto: '¿Qué monstruo mató Hércules en el Foro Boario?', opciones: ['La Quimera', 'Cerbero', 'Caco', 'El Minotauro'], correcta: 2, pista: 'Gigante de tres cabezas que escupía fuego.' },
    { era: 'romana', texto: '¿Qué romana se suicidó tras ser violada, causando la revolución?', opciones: ['Lucrecia', 'Virginia', 'Cornelia', 'Veturia'], correcta: 0, pista: 'Su muerte acabó con la monarquía.' },
    { era: 'romana', texto: '¿Cuántos hombres defendieron el puente con Horacio Cocles?', opciones: ['Solo él', 'Dos compañeros', 'Cinco soldados', 'Diez guerreros'], correcta: 1, pista: 'Tenía ayuda inicial.' },
    { era: 'romana', texto: '¿Qué observaban Rómulo y Remo para decidir quién fundaría Roma?', opciones: ['Estrellas', 'Entrañas de animales', 'Vuelo de aves', 'Truenos'], correcta: 2, pista: 'Auspicios, práctica etrusca.' },
    { era: 'romana', texto: '¿Quién protegió a Servio Tulio según el mito?', opciones: ['Júpiter', 'Marte', 'Fortuna', 'Venus'], correcta: 2, pista: 'Diosa del destino y suerte.' },
    { era: 'romana', texto: '¿Cuántos libros sibilianos compró Tarquinio al final?', opciones: ['Tres', 'Seis', 'Nueve', 'Doce'], correcta: 0, pista: 'Los que quedaron tras quemar seis.' },
    { era: 'romana', texto: '¿Qué animal amamantó a Rómulo y Remo?', opciones: ['Una osa', 'Una loba', 'Una cierva', 'Una cabra'], correcta: 1, pista: 'Símbolo de Roma.' },
    { era: 'romana', texto: '¿En qué fecha se fundó Roma según la tradición?', opciones: ['21 de abril', '1 de marzo', '15 de mayo', '1 de enero'], correcta: 0, pista: 'Día de la fundación, 753 a.C.' },
    { era: 'romana', texto: '¿Qué dios romano tiene dos caras?', opciones: ['Mercurio', 'Jano', 'Saturno', 'Plutón'], correcta: 1, pista: 'Dios de comienzos y transiciones.' },
    { era: 'romana', texto: '¿A qué diosa huyó Eneas de Troya como hijo?', opciones: ['Juno', 'Minerva', 'Venus', 'Diana'], correcta: 2, pista: 'Diosa del amor, su madre.' },
    { era: 'romana', texto: '¿Cuántos años duró la paz bajo el rey Numa?', opciones: ['7 años', '23 años', '43 años', '100 años'], correcta: 2, pista: 'Cuatro décadas sin guerra.' },
    { era: 'romana', texto: '¿Qué guardaban las Vestales en el templo de Vesta?', opciones: ['Tesoros', 'El fuego sagrado', 'Libros', 'Armas'], correcta: 1, pista: 'Símbolo del estado romano.' },

    /* Vikinga - 18 preguntas */
    { era: 'vikinga', texto: '¿Cómo se llama el abismo primordial en la cosmogonía nórdica?', opciones: ['Midgard', 'Ginnungagap', 'Niflheim', 'Hel'], correcta: 1, pista: 'Vacío bostezante entre fuego y hielo.' },
    { era: 'vikinga', texto: '¿Cuántos mundos conecta Yggdrasil?', opciones: ['Tres', 'Siete', 'Nueve', 'Doce'], correcta: 2, pista: 'Número sagrado nórdico.' },
    { era: 'vikinga', texto: '¿Qué arma distingue a Thor?', opciones: ['Gungnir', 'Draupnir', 'Mjölnir', 'Skidbladnir'], correcta: 2, pista: 'Martillo que siempre regresa.' },
    { era: 'vikinga', texto: '¿Qué sacrificó Odín para beber del Pozo de Mímir?', opciones: ['Su mano', 'Un ojo', 'Su hijo', 'Su trono'], correcta: 1, pista: 'Por eso es tuerto.' },
    { era: 'vikinga', texto: '¿Con qué planta mataron a Baldr?', opciones: ['Cicuta', 'Muérdago', 'Acónito', 'Mandrágora'], correcta: 1, pista: 'La única que no juró no dañarlo.' },
    { era: 'vikinga', texto: '¿Qué significa Ragnarök?', opciones: ['Fin del mundo', 'Destino de los dioses', 'Última batalla', 'Crepúsculo'], correcta: 1, pista: 'Literalmente sobre el destino divino.' },
    { era: 'vikinga', texto: '¿Qué sacrificio pidió el constructor de Ásgarðr como pago?', opciones: ['Oro', 'Freyja, el sol y la luna', 'Un tesoro', 'El trono'], correcta: 1, pista: 'Precio imposible que aceptaron.' },
    { era: 'vikinga', texto: '¿Qué dio Odín a Gunnlöð a cambio del hidromiel de la poesía?', opciones: ['Oro', 'Tres noches con él', 'Un anillo', 'Poder'], correcta: 1, pista: 'La sedujo para obtenerlo.' },
    { era: 'vikinga', texto: '¿Cuántas noches pasó Freyja con los enanos por Brísingamen?', opciones: ['Una', 'Dos', 'Tres', 'Cuatro'], correcta: 3, pista: 'Una noche con cada enano.' },
    { era: 'vikinga', texto: '¿Qué perdió Tyr al atar a Fenrir?', opciones: ['Un ojo', 'Una pierna', 'Una mano', 'Su espada'], correcta: 2, pista: 'La puso en la boca del lobo.' },
    { era: 'vikinga', texto: '¿De qué estaba hecha la cadena Gleipnir?', opciones: ['Acero', 'Oro', 'Seis imposibles', 'Magia pura'], correcta: 2, pista: 'Cosas que no existen.' },
    { era: 'vikinga', texto: '¿Quién mató a Baldr directamente?', opciones: ['Loki', 'Höðr', 'Thor', 'Odín'], correcta: 1, pista: 'El hermano ciego manipulado.' },
    { era: 'vikinga', texto: '¿Qué animal de ocho patas monta Odín?', opciones: ['Un lobo', 'Sleipnir', 'Un dragón', 'Un águila'], correcta: 1, pista: 'Hijo de Loki.' },
    { era: 'vikinga', texto: '¿Quién toca el Gjallarhorn para anunciar Ragnarök?', opciones: ['Odín', 'Thor', 'Heimdall', 'Tyr'], correcta: 2, pista: 'El guardián de Bifröst.' },
    { era: 'vikinga', texto: '¿Cuántos inviernos sin verano preceden a Ragnarök?', opciones: ['Uno', 'Tres', 'Siete', 'Nueve'], correcta: 1, pista: 'Fimbulvetr, tres inviernos.' },
    { era: 'vikinga', texto: '¿Qué serpiente rodea Midgard?', opciones: ['Níðhöggr', 'Jörmungandr', 'Fafnir', 'Sköll'], correcta: 1, pista: 'Enemiga de Thor.' },
    { era: 'vikinga', texto: '¿Qué diosa tiene las manzanas de la juventud eterna?', opciones: ['Frigg', 'Freyja', 'Iðunn', 'Sif'], correcta: 2, pista: 'Sin ellas, los dioses envejecen.' },
    { era: 'vikinga', texto: '¿Quién incendiará los mundos en Ragnarök?', opciones: ['Loki', 'Fenrir', 'Surtr', 'Jörmungandr'], correcta: 2, pista: 'Gigante de fuego con espada flamígera.' },

    /* Azteca - 18 preguntas */
    { era: 'azteca', texto: '¿Dónde nació Huitzilopochtli completamente armado?', opciones: ['Tenochtitlan', 'Coatepec', 'Tamoanchan', 'Tollan'], correcta: 1, pista: 'Cerro de la Serpiente.' },
    { era: 'azteca', texto: '¿Qué número identifica al Sol actual?', opciones: ['Tercer Sol', 'Cuarto Sol', 'Quinto Sol', 'Sexto Sol'], correcta: 2, pista: 'Nahui-Ollin.' },
    { era: 'azteca', texto: '¿Con qué creó Quetzalcóatl a los humanos del Quinto Sol?', opciones: ['Maíz', 'Arcilla', 'Huesos del Mictlán y sangre divina', 'Jade'], correcta: 2, pista: 'Descendió al inframundo por ellos.' },
    { era: 'azteca', texto: '¿Quién desmembró a Coyolxauhqui?', opciones: ['Tezcatlipoca', 'Quetzalcóatl', 'Huitzilopochtli', 'Tláloc'], correcta: 2, pista: 'Su hermano recién nacido.' },
    { era: 'azteca', texto: '¿Cuántos años lloró Chalchiuhtlicue causando el diluvio?', opciones: ['7 años', '13 años', '52 años', '104 años'], correcta: 2, pista: 'Un ciclo completo de calendario.' },
    { era: 'azteca', texto: '¿Cada cuántos años se celebraba la Ceremonia del Fuego Nuevo?', opciones: ['13 años', '20 años', '52 años', '104 años'], correcta: 2, pista: 'Ciclo de sincronización de calendarios.' },
    { era: 'azteca', texto: '¿Quién raptó a Xochiquetzal del Tlalocan?', opciones: ['Quetzalcóatl', 'Huitzilopochtli', 'Tezcatlipoca', 'Mictlantecuhtli'], correcta: 2, pista: 'Espejo Humeante la deseaba.' },
    { era: 'azteca', texto: '¿En qué se transformó Quetzalcóatl para robar el maíz?', opciones: ['Serpiente', 'Águila', 'Hormiga', 'Jaguar'], correcta: 2, pista: 'Insecto que cabía en túneles.' },
    { era: 'azteca', texto: '¿Qué bebida sagrada se hizo de los restos de Mayahuel?', opciones: ['Chocolate', 'Pulque', 'Atole', 'Balché'], correcta: 1, pista: 'Fermento del maguey.' },
    { era: 'azteca', texto: '¿Qué forma tiene Chalchiuhtotolin?', opciones: ['Serpiente', 'Jaguar', 'Pavo', 'Águila'], correcta: 2, pista: 'Ave con plumas jade.' },
    { era: 'azteca', texto: '¿Cuántos hermanos tenía Coyolxauhqui?', opciones: ['100', '200', '400', '1000'], correcta: 2, pista: 'Centzon Huitznahua.' },
    { era: 'azteca', texto: '¿Qué arma portaba Huitzilopochtli al nacer?', opciones: ['Macuahuitl', 'Xiuhcóatl', 'Atlatl', 'Tecpatl'], correcta: 1, pista: 'Serpiente de fuego/turquesa.' },
    { era: 'azteca', texto: '¿Cuántos Soles existieron antes del actual?', opciones: ['Dos', 'Tres', 'Cuatro', 'Seis'], correcta: 2, pista: 'Todos terminaron en cataclismo.' },
    { era: 'azteca', texto: '¿Qué dios se sacrificó primero arrojándose al fuego para crear el Quinto Sol?', opciones: ['Tecuciztécatl', 'Nanahuatzin', 'Quetzalcóatl', 'Tezcatlipoca'], correcta: 1, pista: 'El humilde cubierto de llagas.' },
    { era: 'azteca', texto: '¿Cuántos niveles tiene el Mictlán?', opciones: ['Siete', 'Nueve', 'Trece', 'Veinte'], correcta: 1, pista: 'Nueve niveles de inframundo.' },
    { era: 'azteca', texto: '¿Qué representa Quetzalcóatl además de serpiente emplumada?', opciones: ['Lluvia', 'Viento', 'Fuego', 'Tierra'], correcta: 1, pista: 'Ehécatl es su manifestación.' },
    { era: 'azteca', texto: '¿Qué dios azteca se asocia con la obsidiana y el hielo?', opciones: ['Tláloc', 'Itztlacoliuhqui', 'Mictlantecuhtli', 'Xipe Tótec'], correcta: 1, pista: 'Dios de la justicia y castigo.' },
    { era: 'azteca', texto: '¿Quién es el hermano gemelo oscuro de Quetzalcóatl?', opciones: ['Tezcatlipoca', 'Xólotl', 'Huitzilopochtli', 'Tláloc'], correcta: 1, pista: 'Perro que guía al inframundo.' },

    /* Japonesa - 18 preguntas */
    { era: 'japonesa', texto: '¿Quién se encerró en la cueva celestial ocultando la luz?', opciones: ['Susanoo', 'Amaterasu', 'Tsukuyomi', 'Izanami'], correcta: 1, pista: 'Diosa del Sol ofendida.' },
    { era: 'japonesa', texto: '¿Qué espada sagrada encontró Susanoo en Orochi?', opciones: ['Muramasa', 'Masamune', 'Kusanagi', 'Onimaru'], correcta: 2, pista: 'Una de las tres insignias imperiales.' },
    { era: 'japonesa', texto: '¿Cuántas cabezas tenía Yamata-no-Orochi?', opciones: ['Tres', 'Cinco', 'Ocho', 'Doce'], correcta: 2, pista: 'También tenía ocho colas.' },
    { era: 'japonesa', texto: '¿Qué usó Ame-no-Uzume para atraer a Amaterasu?', opciones: ['Música', 'Una danza erótica', 'Comida', 'Joyas'], correcta: 1, pista: 'Hizo reír a los dioses.' },
    { era: 'japonesa', texto: '¿Quién mató a Uke Mochi causando la separación de día y noche?', opciones: ['Izanagi', 'Susanoo', 'Tsukuyomi', 'Ninigi'], correcta: 2, pista: 'Dios de la luna ofendido.' },
    { era: 'japonesa', texto: '¿Qué bloqueó Izanagi para impedir el regreso de Izanami?', opciones: ['Una puerta', 'Una roca enorme', 'Un río', 'Un abismo'], correcta: 1, pista: 'Cerró el paso a Yomi.' },
    { era: 'japonesa', texto: '¿De dónde nació Amaterasu cuando Izanagi se purificó?', opciones: ['Su boca', 'Su ojo izquierdo', 'Su mano', 'Su pecho'], correcta: 1, pista: 'Al lavarse los ojos.' },
    { era: 'japonesa', texto: '¿Qué animales son mensajeros de Inari?', opciones: ['Cuervos', 'Zorros blancos', 'Gatos', 'Ciervos'], correcta: 1, pista: 'Kitsune sagrados.' },
    { era: 'japonesa', texto: '¿De qué fruta gigante nació Momotarō?', opciones: ['Sandía', 'Melocotón', 'Calabaza', 'Melón'], correcta: 1, pista: 'Su nombre significa "hijo del...".' },
    { era: 'japonesa', texto: '¿Cuántos años habían pasado cuando Urashima Tarō regresó?', opciones: ['10 años', '100 años', '300 años', '1000 años'], correcta: 2, pista: 'Tres siglos en la tierra.' },
    { era: 'japonesa', texto: '¿Qué habilidad dominan los Tengu?', opciones: ['Magia', 'Artes marciales', 'Medicina', 'Navegación'], correcta: 1, pista: 'Maestros de la espada.' },
    { era: 'japonesa', texto: '¿Cuántos tesoros sagrados llevó Ninigi a la tierra?', opciones: ['Uno', 'Tres', 'Cinco', 'Siete'], correcta: 1, pista: 'Insignias imperiales.' },
    { era: 'japonesa', texto: '¿Qué causó la muerte de Izanami?', opciones: ['Enfermedad', 'Dar a luz al dios del fuego', 'Batalla', 'Veneno'], correcta: 1, pista: 'Kagutsuchi la quemó.' },
    { era: 'japonesa', texto: '¿Qué maldición abrió Urashima Tarō al abrir la caja?', opciones: ['Enfermedad', 'Pobreza', 'Envejecimiento instantáneo', 'Muerte'], correcta: 2, pista: 'Siglos en segundos.' },
    { era: 'japonesa', texto: '¿Qué defecto tienen los Tengu a pesar de su poder?', opciones: ['Codicia', 'Orgullo', 'Ira', 'Pereza'], correcta: 1, pista: 'Irónicamente, lo que castigan.' },
    { era: 'japonesa', texto: '¿Quién es el rey dragón del mar?', opciones: ['Susanoo', 'Ryūjin', 'Ōkuninushi', 'Sarutahiko'], correcta: 1, pista: 'Vivía en palacio submarino.' },
    { era: 'japonesa', texto: '¿Qué tres compañeros ayudaron a Momotarō?', opciones: ['Gato, ratón, pájaro', 'Perro, mono, faisán', 'Tigre, dragón, tortuga', 'Zorro, tanuki, conejo'], correcta: 1, pista: 'Animales leales por kibi-dango.' },
    { era: 'japonesa', texto: '¿Cuántos dioses nacieron cuando Izanagi se purificó?', opciones: ['Tres nobles', 'Siete', 'Doce', 'Innumerables'], correcta: 3, pista: 'Muchos de diferentes partes.' }
];
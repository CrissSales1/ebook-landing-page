// Rolagem suave para links âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animação de aparecimento suave para os elementos quando aparecem na tela
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elementos para animar
document.querySelectorAll('.benefit-card, .testimonial-card, .author-content').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    observer.observe(el);
});

// Classe CSS para a animação
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

const quizQuestions = [
    {
        question: "Como você se sente em relação a um novo relacionamento?",
        answers: [
            "Estou ansiosa e com medo de me machucar novamente",
            "Sinto-me pronta e aberta a novas possibilidades",
            "Ainda estou processando relacionamentos passados",
            "Estou focada em mim mesma no momento"
        ]
    },
    {
        question: "O que você mais valoriza em um relacionamento?",
        answers: [
            "Comunicação aberta e honesta",
            "Companheirismo e diversão",
            "Estabilidade e segurança",
            "Crescimento pessoal mútuo"
        ]
    },
    {
        question: "Como você lida com conflitos em relacionamentos?",
        answers: [
            "Prefiro evitar confrontos",
            "Busco diálogo e resolução",
            "Às vezes reajo emocionalmente",
            "Tento entender o ponto de vista do outro"
        ]
    },
    {
        question: "Qual é sua maior preocupação em relação a relacionamentos?",
        answers: [
            "Medo de perder minha independência",
            "Receio de não encontrar alguém compatível",
            "Dificuldade em confiar",
            "Equilibrar vida pessoal e relacionamento"
        ]
    },
    {
        question: "Como você se vê daqui a 5 anos?",
        answers: [
            "Em um relacionamento estável e feliz",
            "Focada em crescimento pessoal e profissional",
            "Construindo uma família",
            "Vivendo cada momento sem planos rígidos"
        ]
    }
];

let currentQuestion = 0;
let answers = [];

function startQuiz() {
    document.getElementById('quiz-start').classList.remove('active');
    document.getElementById('quiz-questions').classList.add('active');
    showQuestion();
}

function showQuestion() {
    const questionData = quizQuestions[currentQuestion];
    const questionContent = document.querySelector('.question-content');
    const progress = document.querySelector('.progress');
    
    // Update progress bar
    progress.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
    
    // Create question HTML
    let html = `
        <h3>${questionData.question}</h3>
        <div class="answers">
            ${questionData.answers.map((answer, index) => `
                <button class="answer-option ${answers[currentQuestion] === index ? 'selected' : ''}" 
                        onclick="selectAnswer(${index})">
                    ${answer}
                </button>
            `).join('')}
        </div>
    `;
    
    questionContent.innerHTML = html;
    
    // Update navigation buttons
    document.getElementById('prev-btn').style.display = currentQuestion === 0 ? 'none' : 'block';
    document.getElementById('next-btn').textContent = 
        currentQuestion === quizQuestions.length - 1 ? 'Ver Resultado' : 'Próxima';
}

function selectAnswer(index) {
    answers[currentQuestion] = index;
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.answer-option')[index].classList.add('selected');
}

function nextQuestion() {
    if (answers[currentQuestion] === undefined) {
        alert('Por favor, selecione uma resposta antes de continuar.');
        return;
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResult();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function showResult() {
    document.getElementById('quiz-questions').classList.remove('active');
    document.getElementById('quiz-result').classList.add('active');
    
    // Analyze answers and show personalized result
    const resultContent = document.querySelector('.result-content');
    const result = analyzeAnswers();
    
    resultContent.innerHTML = `
        <h4>${result.title}</h4>
        <p>${result.description}</p>
        <div class="result-tips">
            <h5>Dicas Personalizadas:</h5>
            <ul>
                ${result.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    `;
}

function analyzeAnswers() {
    // Simple analysis based on most common answers
    const results = {
        cautious: {
            title: "Fase de Autodescoberta",
            description: "Você está em um momento importante de autoconhecimento e reflexão. Este é um período valioso para entender melhor seus desejos e necessidades em um relacionamento.",
            tips: [
                "Dedique tempo para atividades que te fazem feliz",
                "Pratique o autoconhecimento diariamente",
                "Estabeleça limites saudáveis em suas relações"
            ]
        },
        ready: {
            title: "Pronta para um Novo Amor",
            description: "Você demonstra maturidade emocional e está aberta para construir um relacionamento saudável e duradouro.",
            tips: [
                "Mantenha sua autenticidade nas relações",
                "Continue cultivando sua independência",
                "Seja clara sobre seus valores e objetivos"
            ]
        },
        healing: {
            title: "Momento de Cura e Transformação",
            description: "Você está passando por um processo de cura e crescimento pessoal, que é fundamental para futuros relacionamentos.",
            tips: [
                "Permita-se sentir suas emoções",
                "Busque apoio quando necessário",
                "Celebre seu processo de crescimento"
            ]
        }
    };
    
    // Simple logic to determine result (can be made more sophisticated)
    if (answers[0] === 1 && answers[2] === 1) {
        return results.ready;
    } else if (answers[0] === 0 || answers[0] === 2) {
        return results.healing;
    } else {
        return results.cautious;
    }
}

function restartQuiz() {
    currentQuestion = 0;
    answers = [];
    document.getElementById('quiz-result').classList.remove('active');
    document.getElementById('quiz-start').classList.add('active');
}

// Inicialização do AOS
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa AOS com configurações otimizadas
    AOS.init({
        duration: 800, // Reduzido de 1200
        once: true, // Animação acontece apenas uma vez
        offset: 100, // Reduzido de 200
        delay: 0, // Remove delays
        easing: 'ease-out'
    });

    startCountdown();
    
    // Mostrar primeiro popup após 10 segundos
    setTimeout(showRandomSocialProof, 10000);
    
    // Detectar intenção de saída apenas se não foi mostrado antes
    if (!localStorage.getItem('exitPopupShown')) {
        document.addEventListener('mouseleave', handleExitIntent);
    }
});

// Contador regressivo
function startCountdown() {
    // Define o tempo inicial (10 minutos)
    let timeLeft = 10 * 60; // 10 minutos em segundos

    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Atualiza o display
        document.getElementById('countdown').innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateCountdown, 1000);
        } else {
            document.getElementById('countdown').innerHTML = "Oferta encerrada";
        }
    }

    updateCountdown();
}

// Controle do botão flutuante
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.fixed-nav');
    const floatingElements = document.querySelector('.floating-elements');
    const offerSection = document.querySelector('.offer');
    const heroSection = document.querySelector('.hero');
    
    // Posição da seção de oferta
    const offerPosition = offerSection.getBoundingClientRect();
    const heroPosition = heroSection.getBoundingClientRect();
    
    // Mostrar botão apenas quando estiver próximo à seção de preços
    if (window.scrollY > heroPosition.bottom && offerPosition.top > window.innerHeight) {
        floatingElements.classList.add('show');
    } else {
        floatingElements.classList.remove('show');
    }
    
    // Atualizar classe do menu fixo
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Menu fixo com scroll
// window.addEventListener('scroll', () => {
//     const nav = document.querySelector('.fixed-nav');
//     const floatingCta = document.querySelector('.floating-cta');
    
//     if (window.scrollY > 100) {
//         nav.style.background = 'rgba(255, 255, 255, 0.95)';
//         nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
//         floatingCta.style.display = 'block';
//     } else {
//         nav.style.background = 'transparent';
//         nav.style.boxShadow = 'none';
//         floatingCta.style.display = 'none';
//     }
// });

// FAQ Toggle
function toggleFaq(element) {
    const wasActive = element.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    if (!wasActive) {
        element.classList.add('active');
    }
}

// Social Proof Popups
function showRandomSocialProof() {
    const names = ['Maria', 'Ana', 'Júlia', 'Carolina', 'Beatriz'];
    const times = ['há 2 minutos', 'há 5 minutos', 'há 8 minutos', 'há 12 minutos'];
    
    const popup = document.getElementById('social-proof-popup');
    const name = names[Math.floor(Math.random() * names.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    
    popup.querySelector('strong').textContent = `${name} acabou de comprar`;
    popup.querySelector('p:last-child').textContent = time;
    
    popup.style.display = 'flex';
    
    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
}

// Mostrar popups a cada 30 segundos
setInterval(showRandomSocialProof, 30000);

// Prévia dos capítulos
function showChapterPreview(chapterNumber) {
    const chapters = {
        1: {
            title: 'Autoconhecimento e Amor Próprio',
            content: `
                <h4>Neste capítulo você vai descobrir:</h4>
                <ul>
                    <li>Como desenvolver uma autoestima saudável em qualquer idade</li>
                    <li>Exercícios práticos de autocuidado e amor próprio</li>
                    <li>Como identificar e superar crenças limitantes sobre relacionamentos</li>
                    <li>O poder da maturidade emocional nos relacionamentos</li>
                </ul>
            `
        },
        2: {
            title: 'Padrões de Relacionamento',
            content: `
                <h4>Principais tópicos abordados:</h4>
                <ul>
                    <li>Como identificar padrões repetitivos em relacionamentos</li>
                    <li>Técnicas para transformar dinâmicas prejudiciais</li>
                    <li>O impacto das experiências passadas nas relações atuais</li>
                    <li>Construindo novos padrões saudáveis de relacionamento</li>
                </ul>
            `
        },
        3: {
            title: 'Comunicação Assertiva',
            content: `
                <h4>Você vai aprender:</h4>
                <ul>
                    <li>Técnicas práticas de comunicação não-violenta</li>
                    <li>Como expressar necessidades e estabelecer limites saudáveis</li>
                    <li>Estratégias para resolver conflitos de forma construtiva</li>
                    <li>O poder da escuta ativa nos relacionamentos maduros</li>
                </ul>
            `
        }
    };

    const chapter = chapters[chapterNumber];
    
    Swal.fire({
        title: chapter.title,
        html: chapter.content,
        confirmButtonText: 'Quero Aprender Mais',
        confirmButtonColor: '#9f7aea',
        showCloseButton: true,
        customClass: {
            container: 'chapter-preview-modal'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector('#oferta').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function handleExitIntent(e) {
    if (e.clientY < 0) {
        // Remover o evento após mostrar o popup
        document.removeEventListener('mouseleave', handleExitIntent);
        
        // Marcar como mostrado
        localStorage.setItem('exitPopupShown', 'true');
        
        Swal.fire({
            title: 'Espere!',
            text: 'Não perca essa oportunidade única de transformar sua vida amorosa!',
            icon: 'warning',
            confirmButtonText: 'Quero Aproveitar',
            confirmButtonColor: '#9f7aea',
            showCancelButton: true,
            cancelButtonText: 'Agora não'
        }).then((result) => {
            if (result.isConfirmed) {
                document.querySelector('#oferta').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Função para resetar o popup (use apenas para testes)
function resetExitPopup() {
    localStorage.removeItem('exitPopupShown');
    document.addEventListener('mouseleave', handleExitIntent);
}

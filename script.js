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
AOS.init({
    duration: 800,
    offset: 100,
    once: true
});

// Contador regressivo
function startCountdown() {
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 24); // 24 horas a partir de agora

    function updateCountdown() {
        const now = new Date();
        const distance = endDate - now;

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.querySelector('.countdown').innerHTML = `
            <span>${hours.toString().padStart(2, '0')}h</span>:
            <span>${minutes.toString().padStart(2, '0')}m</span>:
            <span>${seconds.toString().padStart(2, '0')}s</span>
        `;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown').innerHTML = "Oferta encerrada!";
        }
    }

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Menu fixo com scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.fixed-nav');
    const floatingCta = document.querySelector('.floating-cta');
    
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        floatingCta.style.display = 'block';
    } else {
        nav.style.background = 'transparent';
        nav.style.boxShadow = 'none';
        floatingCta.style.display = 'none';
    }
});

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

// Chat
function openChat() {
    document.getElementById('chat-widget').style.display = 'block';
    // Mensagem inicial automática
    setTimeout(() => {
        addChatMessage("Olá! Como posso ajudar você hoje?", 'bot');
    }, 500);
}

function closeChat() {
    document.getElementById('chat-widget').style.display = 'none';
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chat-input-field');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage(message, 'user');
        input.value = '';
        
        // Simular resposta do bot
        setTimeout(() => {
            const responses = [
                "Claro! Posso ajudar você com isso.",
                "Entendi sua dúvida. O e-book aborda esse tema em detalhes.",
                "Que ótima pergunta! Deixa eu te explicar melhor...",
                "O e-book é perfeito para isso! Ele contém estratégias práticas que vão te ajudar."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage(randomResponse, 'bot');
        }, 1000);
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
    const previews = {
        1: {
            title: "Autoconhecimento e Amor Próprio",
            content: "Neste capítulo, você vai descobrir como desenvolver uma base sólida de amor próprio e autoestima..."
        },
        2: {
            title: "Padrões de Relacionamento",
            content: "Aprenda a identificar e transformar padrões que podem estar sabotando sua vida amorosa..."
        },
        3: {
            title: "Comunicação Assertiva",
            content: "Desenvolva habilidades de comunicação que fortalecem seus relacionamentos..."
        }
    };

    const preview = previews[chapterNumber];
    Swal.fire({
        title: preview.title,
        text: preview.content,
        icon: 'info',
        confirmButtonText: 'Quero o E-book Completo',
        confirmButtonColor: '#9f7aea',
        showCancelButton: true,
        cancelButtonText: 'Fechar',
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector('#oferta').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    
    // Mostrar primeiro popup após 10 segundos
    setTimeout(showRandomSocialProof, 10000);
    
    // Detectar intenção de saída apenas se não foi mostrado antes
    if (!localStorage.getItem('exitPopupShown')) {
        document.addEventListener('mouseleave', handleExitIntent);
    }
});

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

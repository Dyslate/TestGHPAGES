let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Charge les questions à partir du fichier JSON
fetch('ISO_IEC_27001_QCM_Relevant_Questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadNextQuestion();
    })
    .catch(error => console.error("Erreur lors du chargement du QCM:", error));

// Affiche une question aléatoire
function loadNextQuestion() {
    if (questions.length === 0) {
        document.getElementById('question').textContent = "QCM terminé!";
        document.getElementById('options').innerHTML = '';
        document.getElementById('score').textContent = `Votre score : ${score}`;
        return;
    }

    // Sélection aléatoire d'une question
    currentQuestionIndex = Math.floor(Math.random() * questions.length);
    const currentQuestion = questions[currentQuestionIndex];

    // Affiche la question et les options
    document.getElementById('question').textContent = currentQuestion.question;
    const optionsList = document.getElementById('options');
    optionsList.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', () => checkAnswer(option, currentQuestion.answer));
        optionsList.appendChild(li);
    });
}

// Vérifie la réponse et met à jour le score
function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
    }
    loadNextQuestion();
}

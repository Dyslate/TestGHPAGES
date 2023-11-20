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

function loadNextQuestion() {
    if (questions.length === 0) {
        document.getElementById('question').textContent = "QCM terminé!";
        document.getElementById('options').innerHTML = '';
        document.getElementById('score').innerHTML = `<strong>Votre score : ${score}</strong>`;
        return;
    }

    currentQuestionIndex = Math.floor(Math.random() * questions.length);
    const currentQuestion = questions[currentQuestionIndex];

    document.getElementById('question').textContent = currentQuestion.question;
    const optionsList = document.getElementById('options');
    optionsList.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = option;
        li.addEventListener('click', () => checkAnswer(option, currentQuestion.answer));
        optionsList.appendChild(li);
    });
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
    }
    questions.splice(currentQuestionIndex, 1);
    loadNextQuestion();
}

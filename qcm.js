let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let results = []; // Pour stocker les résultats de chaque question

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
        displayResults();
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
        li.addEventListener('click', () => checkAnswer(option, currentQuestion));
        optionsList.appendChild(li);
    });
}

function checkAnswer(selectedOption, question) {
    const correct = selectedOption === question.answer;
    if (correct) {
        score++;
    }
    results.push({
        question: question.question,
        selectedOption,
        correctAnswer: question.answer,
        correct
    });
    questions.splice(currentQuestionIndex, 1);
    loadNextQuestion();
}

function displayResults() {
    const resultsElement = document.getElementById('score');
    resultsElement.innerHTML = `<strong>Votre score : ${score}</strong><ul class="list-group mt-3">`;
    results.forEach(result => {
        resultsElement.innerHTML += `
            <li class="list-group-item ${result.correct ? 'list-group-item-success' : 'list-group-item-danger'}">
                ${result.question} - <strong>${result.correct ? 'Correct' : 'Faux'}</strong><br>
                Votre réponse: ${result.selectedOption}<br>
                Réponse correcte: ${result.correctAnswer}
            </li>`;
    });
    resultsElement.innerHTML += '</ul>';
}

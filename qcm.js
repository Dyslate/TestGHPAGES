let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let results = []; // Pour stocker les résultats de chaque question
let totalQuestions = 0; // Nouvelle variable pour stocker le nombre total de questions

fetch('anime.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        totalQuestions = questions.length; // Définir le nombre total de questions ici
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

    // Ajoutez cette partie pour afficher l'image
    const questionImage = document.getElementById('questionImage'); // Assurez-vous qu'il y a un élément avec cet id dans votre HTML
    if (currentQuestion.imgQuizz) {
        questionImage.src = currentQuestion.image;
        questionImage.style.display = 'block'; // Affiche l'image si elle existe
    } else {
        questionImage.style.display = 'none'; // Cache l'image si elle n'existe pas pour la question actuelle
    }

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



function getScoreMessage(score) {
    if (score >= 0 && score <= 5) {
        return "Échec";
    } else if (score > 5 && score <= 10) {
        return "Pas terrible";
    } else if (score > 10 && score <= 15) {
        return "Peut mieux faire";
    } else if (score > 15 && score <= 19) {
        return "Bien joué";
    } else if (score === 20) {
        return "Tu es incollable";
    }
    return ""; // Retourne une chaîne vide si le score n'entre dans aucune catégorie
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
    const scoreMessage = getScoreMessage(score); // Utilise la nouvelle fonction pour obtenir le message
    resultsElement.innerHTML = `<strong>Votre score : ${score}/${totalQuestions}</strong> - ${scoreMessage}<ul class="list-group mt-3">`;
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


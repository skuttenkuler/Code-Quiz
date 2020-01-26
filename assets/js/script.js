// Store the HTML elements we need in variables and initalize other global variables
var quizContainer = document.querySelector('#quizContainer');
var questionContainer = document.querySelector('#questionContainer');
var choicesContainer = document.querySelector('#choices');
var resultsContainer = document.querySelector('#quizResults');
var selectQuizContainer = document.querySelector('#selectQuizContainer');
var timerContainer = document.querySelector('#timeLeftContainer');
var timeLeftContainer = document.querySelector('#timeLeft');
var easyQuizIntro = document.querySelector('#easyQuizIntro');
var hardQuizIntro = document.querySelector('#hardQuizIntro');
var scoresContainer = document.querySelector('#highScores');
var introContainer = document.querySelector('#intro');

var selectQuiz = document.querySelector('#selectQuiz');
var questionText = document.querySelector('#question');

var finalScore = document.querySelector('#finalScore');
var initials = document.querySelector('#yourInitials');

var startBtn = document.querySelector('#startQuiz');
var submitScore = document.querySelector('#submitScore');
var viewScores = document.querySelector('#viewScores');
var startOverBtn = document.querySelector('#startOver');
var startOverAlso = document.querySelector('#startOverAlso');
var clearScoresBtn = document.querySelector('#clearScores');

var theScores = document.querySelector('#theScores');

// This will store the active quiz
var activeQuiz;

//This will hold our questions array once a quiz is chosen
var questions = [];

// Set current question to -1 so we can have loadQuestion function queue up question 0
var currentQuestion = -1;
var currentQuestionInfo;

// This will hold the time left. Set the starting time based on how many questions there are.
var timeLeft;
var timer;
var secondsPerQuestion = 15;
var score = 0;
var activeQuiz;
var highScores = {easyquiz: [], hardquiz: []};
var timeWarning = false;
var questionTimer;
var timeElapsed;

// Setup our sound effects
var correctSound = new Audio('/assets/sounds/woohoo.mp3');
var wrongSound = new Audio('/assets/sounds/doh.mp3');
var timeOverSound = new Audio('/assets/sounds/bart.mp3');
var successSound = new Audio('/assets/sounds/theme.mp3');

// Add a click listener to the choicesContainer
choicesContainer.addEventListener('click',checkAnswer);

// Toggles the quiz intro
function toggleQuiz(e) {
    activeQuiz = e.target.value;
    if (activeQuiz == "Easy") {

        // Clear the page and display the correct intro
        clearPage();
        easyQuizIntro.style.display="block";

        // Set the questions and timeLeft
        questions = easyQuestions;
        timeLeft = questions.length * secondsPerQuestion;
        timeLeftContainer.textContent = timeLeft;


    } else if (activeQuiz == "Hard") {

        // Clear the page and display the correct intro
        clearPage();
        hardQuizIntro.style.display="block";

        // Set the questions and timeLeft
        questions = hardQuestions;
        timeLeft = questions.length * secondsPerQuestion;
        timeLeftContainer.textContent = timeLeft;
    }
}

// Function to kick off the quiz
function startQuiz(e) {

    if (e.target.matches('button')) {
        // Clear the page and reset all the variables
        clearPage();
        resetVars();

        // Toggle the quiz selector
        toggleQuizSelector();

        // Show the timer and set it;
        timerContainer.style.display = "block";
        setTimer();

        // Run loadQuestion function
        loadQuestion();
    }
}

function toggleQuizSelector() {
    // disabled the selector if it's not
    if (!selectQuiz.hasAttribute('disabled')) {
        selectQuiz.setAttribute('disabled','');
    } else {
        //enabled the selector if it's disabled and reset the values
        selectQuiz.removeAttribute('disabled');
        selectQuiz.value = "";
    }
}

function setTimer() {
    // Just in case there's an interval already set, let's clear it
    clearInterval(timer);

    // set an interval to run every 1 second
    timer = setInterval(function() {
        //Subtract one from the timeLeft and display it on the frontend
        timeLeft--;
        timeLeftContainer.textContent = timeLeft;
            
        // If there are 10 seconds left, warn the player
        if (timeLeft <= 10) {
            // If the player hasn't been warned yet
            if (!timeWarning) {
                timerContainer.classList.add('bg-danger');
                timeWarning = true;
            }
            // Don't do anything if the player has already received the warning
        }

        // When the time left gets to zero, clear the interval and end the quiz
        if (timeLeft === 0) {
            // Play timer ran out sound
            timeOverSound.play();
            clearInterval(timer);
            endQuiz();
        }
    }, 1000)
    
}

//This function loads a question and choices into our DOM
function loadQuestion() {
    // Empty the choices container
    resetChoices();

    // Initialize a variable to track how much time has elapsed since the user got the question
    timeElapsed = 0;

    // Set an interval to track the time elapsed
    questionTimer = setInterval(function() {
        timeElapsed++;
    },1000);

    //Load the next question
    currentQuestion++;

    // if currentQuestion is equal to the length of questions then the quiz is over
    if (currentQuestion == questions.length) {
        return endQuiz();
    }

    currentQuestionInfo = questions[currentQuestion];

    questionText.innerHTML = currentQuestionInfo.title;

    // for each answer choice, do the following...
    for (var i = 0; i < currentQuestionInfo.choices.length; i++) {
        // Create a div and set its class to 'choice'
        var newChoice = document.createElement('div');
        newChoice.setAttribute('class','choice');
        
        // Create a button and set its text content to the choice
        var newButton = document.createElement('button');
        newButton.setAttribute('class','btn btn-secondary');
        newButton.innerHTML = currentQuestionInfo.choices[i];

        // Append the button to the choice div and append the choice div to the choicesContainer
        newChoice.appendChild(newButton);
        choicesContainer.appendChild(newChoice);
    }
    questionContainer.style.display = "block";
}

// Use this to clear out the choices div when loading a new question
function resetChoices() {
    choicesContainer.innerHTML = "";
}

// This function checks the selected answer and manipulates the DOM
function checkAnswer(e) {
    //Get the click target
    var target = e.target;
    
    //If the part of the container that was clicked was a button
    if (target.matches('button')) {
        //Check the textContent of that button against the answer
        if (target.textContent == currentQuestionInfo.answer) {
            logCorrectAnswer(target);
        } else {
            logIncorrectAnswer(target);
        }
    }
}

// This function handles a correct answer
function logCorrectAnswer(target) {
    // Disable the choices so user doesn't accidentally hit another button
    disableChoices();

    // Stop the question timer interval
    clearInterval(questionTimer);

    // Give them 1 point for answering correctly
    target.classList.add('btn-success');
    score++;
    
    //If they answer within 5 seconds, give them a bonus point
    if (timeElapsed <= 5) {
        score++;
    }

    //Bonus bonus!
    if (timeElapsed <= 2) {
        score++;
    }
    
    // Play sound
    correctSound.play();

    nextQuestion();
}

// This function handles an incorrect answer
function logIncorrectAnswer(target) {
    // Disable the choices so user doesn't accidentally hit another button
    disableChoices();

    target.classList.add('btn-danger');

    // Play sound
    wrongSound.play();

    // Deduct some time from the timer but only if there are more than 5 seconds left
    if (timeLeft > 5) {
        timeLeft += -5;
    }

    //Let's also highlight what the correct answer was by looping all the choices until we find the one that matches the answer
    var options = document.querySelectorAll('.choice');
    for (var i = 0; i < options.length; i++) {
        if (options[i].children[0].textContent == currentQuestionInfo.answer) {
            options[i].children[0].classList.add('btn-success');
        }
    }
    nextQuestion();
}

function disableChoices() {
    for (var i = 0; i < choicesContainer.children.length; i++) {
        choicesContainer.children[i].children[0].setAttribute('disabled','');
    }
}

//calls the loadQuestion function after .8 seconds
function nextQuestion() {
    setTimeout(function() {
        // Make sure the timer didn't run out while we were waiting
        if (timeLeft > 0) {
            loadQuestion();
        }
    }, 800);
}

//Ends the quiz and calculates score
function endQuiz() {
    // In case the timer is still running, clear it.
    clearInterval(timer);
    
    // If we finished the quiz without the timer running out, let's play a happier quiz over sound
    if (timeLeft > 0) {
        successSound.play();
    }

    // Clear the page and load the results
    clearPage();
    loadQuizResults();
}

//Load the quiz results
function loadQuizResults() {
    console.log(questions.length);
    // Display the final score
    finalScore.textContent = score;
    // Now display the results container
    resultsContainer.style.display = "block";
}

//Save the high score in local storage
function saveScore(e) {
    // Let's grab our stored scores
    var getScores = JSON.parse(localStorage.getItem('scores'));
    
    // If there are scores stored, let's overwite our highScores array with them
    if (getScores) {
        highScores = getScores;
    }

    //Now based on which quiz, let's store our score
    if (activeQuiz == "Easy") {
        highScores.easyquiz.push(saveScoreArray());
    } else if (activeQuiz == "Hard") {
        highScores.hardquiz.push(saveScoreArray());
    } 

    // Sort the scores in order of highest to lowest if there are multiple entries
    if (highScores.easyquiz.length > 1) {
        highScores.easyquiz.sort(function(a, b) {
            return parseInt(b.score) - parseInt(a.score);
        });
    }
    if (highScores.hardquiz.length > 1) {
        highScores.hardquiz.sort(function(a, b) {
            return parseInt(b.score) - parseInt(a.score);
        });
    }
    
    localStorage.setItem('scores',JSON.stringify(highScores));

    showHighScores();
}

function saveScoreArray() {
    return {
        initials: yourInitials.value,
        score: finalScore.textContent
    }
}

function showHighScores() {
    clearPage();
    resetVars();
    resetQuizSelectorVal();
    theScores.innerHTML = "";
    var getScores = JSON.parse(localStorage.getItem('scores'));

    scoresContainer.style.display = "block";
    if (!getScores) {
        var newP = document.createElement('p');
        newP.textContent = "No high scores saved!";
        theScores.appendChild(newP);
    } else {
        var newH4 = document.createElement('h4');
        newH4.textContent = "Easy Quiz Scores";
        theScores.append(newH4);
        var newUl = document.createElement('ul');
        generateScoresLi(newUl, getScores.easyquiz);
        theScores.append(newUl);

        var secondH4 = document.createElement('h4');
        secondH4.textContent = "Hard Quiz Scores";
        theScores.append(secondH4);
        var secondUl = document.createElement('ul');
        generateScoresLi(secondUl, getScores.hardquiz);
        theScores.append(secondUl);
    }
}

function generateScoresLi(ul, scores) {
    if (scores) {
        for (var i = 0; i < scores.length; i++) {
            var newLi = document.createElement('li');
            newLi.textContent = scores[i].initials + ": "+ scores[i].score;
            ul.appendChild(newLi);
        }
    } else {
        var newLi = document.createElement('li');
        newLi.textContent = "No scores :(";
        ul.appendChild(newLi);
    }
}

// This function clears the content on the main part of the quiz
function clearPage() {
    introContainer.style.display = "none";
    easyQuizIntro.style.display = "none";
    hardQuizIntro.style.display = "none";
    questionContainer.style.display = "none";
    resultsContainer.style.display = "none";
    scoresContainer.style.display = "none";
    timerContainer.style.display = "none";
}

// This function resets all variables
function resetVars() {
    clearInterval(timer);
    score = 0;
    currentQuestion = -1;
    yourInitials.value = "";
    selectQuiz.removeAttribute('disabled');
    timeWarning = false;
}

// Starts over at the very beginning
function startOver() {
    clearPage();
    resetVars();
    resetQuizSelectorVal();
    introContainer.style.display = "block";
}

//resets the value of the quiz selector
function resetQuizSelectorVal() {
    selectQuiz.value = "";
}

// Clears the scores and refreshes the high scores div
function clearScores() {
    localStorage.removeItem('scores');
    showHighScores();
}

// All of our listeners will live here
selectQuiz.addEventListener('change',toggleQuiz);
easyQuizIntro.addEventListener('click',startQuiz);
hardQuizIntro.addEventListener('click',startQuiz);
submitScore.addEventListener('click',saveScore);
viewScores.addEventListener('click',showHighScores);
startOverBtn.addEventListener('click',startOver);
startOverAlso.addEventListener('click',startOver);
clearScoresBtn.addEventListener('click',clearScores);
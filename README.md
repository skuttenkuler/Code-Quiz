# Code-Quiz
Responsive Multiple Choice Simpsons Quiz with Local Storage for Berkley Bootcamp

# Technologies
* HTML
* CSS
* Javascript
* JQuery

# Deployed Site
* [Simpsons Quiz](https://skuttenkuler.github.io/Code-Quiz/)

# Screenshot
![Alt text](./assets/img/screen.png?raw=true "Optional Title")
![Alt text](./assets/img/screen1.png?raw=true "Optional Title")
![Alt text](./assets/img/screen2.png?raw=true "Optional Title")
# Code Snippet
```javascript
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
```
# Author
- Sam Kuttenkuler
    - [Github](https://www.github.com/skuttenkuler)
    - [LinkedIn](https://www.linkedin.com/in/skdev91)
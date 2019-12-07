$(document).ready(function(){

//pointers
minutesDisplay = document.querySelector("#minutes");
secondsDisplay = document.querySelector("#seconds");
let currentQuestion = 0;
const lastQuestion = questions.length -1;
let userScore = 0;
var timer;

//var woohoo = new Audio("../mp3/woohoo.wsrcav").src;
//var doh = new Audio("../mp3/1doh.wav").src;
//var theme = new Audio("../mp3/the-simpsons-theme-song.mp3").src;
//function playWohoo(){
//woohoo.play();
//}
//function playDoh(){
 // doh.play();
//}
//function playTheme(){
 // theme.play(theme);
//}
function renderQuiz(){
      $(".quizButton").hide()
      $("h3").hide()
      let question = questions[currentQuestion];
      $("#question").text((question.title))
      
      
      for(i=0; i < 4; i++){
        var choiceButton = $("<button>");
        choiceButton.addClass("choice-button");
        choiceButton.attr("value", question.choices[i]);
        choiceButton.text(question.choices[i]);
        $(".choices").append(choiceButton)
      }

      console.log(question.answer)
      $(".choice-button").on("click", function(){

        //playWohoo();
        if(this.value === question.answer){
            console.log("right");
          //add +1 to player score
            userScore = userScore + 100;

        }
        else{
          console.log("wrong");
        }
        if(currentQuestion < lastQuestion){
          currentQuestion ++;
          $(".choices").empty();
          renderQuiz();
        }
        else if(currentQuestion >= lastQuestion){
          renderFinalScore();
          
        }
        return userScore;
        });
      };
      function renderFinalScore() {
        $("#question").hide()
        $(".choices").hide()
        var score = $("<h1>");
        var scoreForm = $("<form>")
        var firstName = $("<input>")
        var submitButton = $("<button>");
        var score = $("<h1>")
        score.text("Score: " + userScore)
        firstName.attr("placeholder", "First Name")
        submitButton.attr("type", "submit")
        scoreForm.append(score,firstName, submitButton)
        $(".quizContainer").append(scoreForm)

        //event on submit button to take
        submitButton.on("click", function(event) {
          event.preventDefault();
          if(!firstName){
            alert("must have name")
          }
          let finalScore = userScore;
          let nameScore = firstName.val()
          var user =[finalScore, nameScore]
          localStorage.setItem("User", JSON.stringify(user));
          window.location.href= "highscore.html";
        });

      }

    //startTimer();
    
      
    //restartQuiz
        
        //hide the h3 tag and quizbutton
       
        //point question to question index 0
    
    //set score variable
    //timer == '0' return the value or score and stop quiz
    //prompt user with question
    //if correct or true then 
    //score ++
    //else
    //don't add point
    
    //take score and add name to it
    //send data to storage
    
// TIMER
    function getFormattedMinutes() {
        var secondsLeft = totalSeconds - secondsElapsed;
      
        var minutesLeft = Math.floor(secondsLeft / 60);
      
        var formattedMinutes;
      
        if (minutesLeft < 10) {
          formattedMinutes = "0" + minutesLeft;
        } else {
          formattedMinutes = minutesLeft;
        }
      
        return formattedMinutes;
      }
      
      function getFormattedSeconds() {
        var secondsLeft = (totalSeconds - secondsElapsed) % 60;
      
        var formattedSeconds;
      
        if (secondsLeft < 10) {
          formattedSeconds = "0" + secondsLeft;
        } else {
          formattedSeconds = secondsLeft;
        }
      
        return formattedSeconds;
      }
      
      function setTime() {
        const minutes = 75
      
        
      
        clearInterval(interval);
        totalSeconds = minutes * 60;
      }
      
      function renderTime() {
        minutesDisplay.textContent = getFormattedMinutes();
        secondsDisplay.textContent = getFormattedSeconds();
      
        if (secondsElapsed >= totalSeconds) {
      
          stopTimer();
        }
      }
      
      function startTimer() {
        setTime();
      
        interval = setInterval(function() {
          secondsElapsed++;
          renderTime();
        }, 1000);
      }
      
      function stopTimer() {
        secondsElapsed = 0;
        setTime();
        renderTime();
      }
    
    //eventListener
    $(".quizButton").on("click", renderQuiz);



    function renderScores () {
      localStorage.getItem("user");
      let playerScore = $("<p>");
      let playerName = $("<p>");
      playerScore.text(localStorage.getItem(JSON.parse("user")));
      $(".highscoreContainer").append(playerScore, playerName)
    
        }
      renderScores();
});
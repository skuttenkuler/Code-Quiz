
//pointers
let playerScore = 0
var timer;


$(document).ready(function(){
    //click for start button
   
     
    
    function renderQuiz(){
    currentQuestionIndex = 0
    //renderQuiz
    //startTimer
    //hadnleSubmit
    //nextQuestion
    //restartQuiz
        
        //hide the h3 tag and quizbutton
        $("h3").hide()
        $("#quizButton").hide()
        //point question to question index 0
    };
    //set score variable
    //timer == '0' return the value or score and stop quiz
    //prompt user with question
    //if correct or true then 
    //score ++
    //else
    //don't add point
    
    //take score and add name to it
    //send data to storage
    
    
    
    //eventListener
    $("#quizButton").click(renderQuiz())
});
const global = new Global();
const contentMgr = contentManager();
const controlMgr = controlManager(); 
const listenerMgr = listenerManager();

(function initialize() {
  contentMgr.start();
  global.nextButton.disabled = true; // Disable `global.nextButton` at the start
  global.nextButton.addEventListener("click", listenerMgr.nextButtonClick); // Add event listener to Next button
})();

function contentManager() {
  let questions = []; // Data will be fetch from JSON
  let shuffledQuestionsArray = []; // To copy the questions array to manipulate without touching the original question array.
  let currentQuestionIndex; // Index to match the question and the answers.

  const answerClassList = ["ans-a", "ans-b", "ans-c", "ans-d"];
  const alphabetImg = ["assets/a.png", "assets/b.png", "assets/c.png", "assets/d.png"];
  const alphabetAlt = ["a", "b", "c", "d"];

  async function start() {
    await loadJSON();
    randomQuestion();
    controlMgr.displayPagination();
  }

  async function loadJSON() {
    console.groupCollapsed("loadJSON()");
    try {
      const response = await fetch('assets/data/questions.json'); // Fetch data using await
      const data = await response.json(); // Convert to JSON using await
      questions = data; // Assign the fetched data to questions
      shuffledQuestionsArray = [...questions]; // Copy to shuffledQuestionsArray
      console.log("questions:", questions);
      console.log("shuffledQuestionsArray:", shuffledQuestionsArray);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
    console.groupEnd();
  }

  function randomQuestion() {
    console.groupCollapsed("randomQuestion()");

    global.setNodeDisabled({
      node: global.nextButton,
      isDisabled: true,
      changeItFast: true,
    });

    global.cleanNode({ // Clear previous answers
      node: global.answersContainer,
      isDeepClean: true,
    }); 

    // Generate a global.random question index
    currentQuestionIndex = global.random(0, (shuffledQuestionsArray.length - 1));
    console.info("currentQuestionIndex:", currentQuestionIndex);

    // Display the question
    global.addTextContent({
      node: global.questionContainer,
      content: shuffledQuestionsArray[currentQuestionIndex].question,
    });

    // Copy `answers` array from `shuffledQuestionsArray` to a temporary array
    let tempAnswersArray = [...shuffledQuestionsArray[currentQuestionIndex].answers];

    // Display the answers
    tempAnswersArray.forEach((answer, index) => {
      console.groupCollapsed("Building answer btn: ", index);
      buildAnswerBtn(answer, index);
      console.groupEnd();
    });

    console.groupEnd();
  }

  function buildAnswerBtn(answer, index) {
    console.groupCollapsed("buildAnswerBtn()");
    // REFER to this HTML structure
    // <div class="answer-container ans-a">
    //    <div class="answer-alphabet"><img src="assets/a.png" alt="A"></div>
    //    <div class="answer-text">aaaaa</div>
    //  </div>

    const tempAnswerContainer = global.buildNode({
      element: "div",
      classNames: ["answer-container", answerClassList[index]],
    });

    const tempAnswerAlphabet = global.buildNode({
      element: "div",
      classNames: ["answer-alphabet"],
    });

    const tempAlphabetImg = global.buildNode({
      element: "img",
    });

    tempAlphabetImg.src = alphabetImg[index];
    tempAlphabetImg.alt = alphabetAlt[index];

    const tempAnswerText = global.buildNode({
      element: "div",
      classNames: ["answer-text"],
    });

    // JS: assign answer
    global.addTextContent({
      node: tempAnswerText,
      content: answer,
    });

    // HTML: add '<img>' to 'answer-alphabet'
    tempAnswerAlphabet.append(tempAlphabetImg);

    // HTML: add two divs 'answer-alphabet' and 'answer-text' to 'answer-container'
    tempAnswerContainer.append(tempAnswerAlphabet);
    tempAnswerContainer.append(tempAnswerText);

    tempAnswerContainer.addEventListener("click", listenerMgr.handleAnswerClick);

    // HTML: add 'answer-container' to 'section-answers'
    global.answersContainer.append(tempAnswerContainer);
    console.groupEnd();

  }

  function spliceShuffledQuestionsArray() {
    console.groupCollapsed("spliceShuffledQuestionsArray()");
    shuffledQuestionsArray.splice(currentQuestionIndex, 1);
    console.info(`spliceShuffledQuestionsArray: ${shuffledQuestionsArray}`);
    console.groupEnd();
  }
  
  function getCurrentQuestionIndex() { return currentQuestionIndex; }
  function getShuffledQuestionsArray() { return shuffledQuestionsArray; }
  function getShuffledQuestionsArrayLength() { return shuffledQuestionsArray.length; }

  return {
    start,
    loadJSON,
    randomQuestion,
    spliceShuffledQuestionsArray,
    getCurrentQuestionIndex,
    getShuffledQuestionsArray,
    getShuffledQuestionsArrayLength,
  }
}

function controlManager() {
  let totalNumOfQuestion = 5; // Set the total num of questions to show in the quiz.
  let currentQuestionNo = 1; // For paginations and to contol the number of questions to be shown.

  function displayPagination() {
    console.groupCollapsed("displayPagination()");
      
      global.cleanNode({ // Clear previous pagination (if needed)
        node: global.paginationContainer,
        isDeepClean: true,
      }); 
  
      for (let i = 1; i <= totalNumOfQuestion; i++) { // Display pagination
        console.groupCollapsed("Building pagination: ", i);
        buildPagination(i); // calling sub-function
        console.groupEnd();
      }
      currentQuestionNo++;
      console.groupEnd();
      
      // sub-function 
      function buildPagination(i) {
        const pagination = global.buildNode({
          element: "div",
          classNames: ["pagination"],
        });
        // Add 'active' class to show where we are right now with the pagination
        if (i === currentQuestionNo) {
          global.addClass({
            element: pagination,
            classNames: "active"
          });
        }
        global.paginationContainer.append(pagination);
      }
  }
  
  // To disable all answer btns when the correct answer is selected
  function disableAllBtns() {
    console.groupCollapsed("disableAllBtns()");
  
    const allButtons = document.querySelectorAll(".answer-container");
    for (let button of allButtons) {
      global.addClass({
        element: button,
        classNames: "disabled",
      });
    }
  
    console.groupEnd();
  }

  function getTotalNumOfQuestion() { return totalNumOfQuestion; }
  function getCurrentQuestionNo() { return currentQuestionNo; }

  return {
    displayPagination,
    disableAllBtns,
    getTotalNumOfQuestion,
    getCurrentQuestionNo,
  }

}

function listenerManager() {
  const correctMessages = ["Fantastic!", "Awesome!", "Brilliant!", "Great job!", "Excellent!", "Superb!", "Outstanding!"];
  const wrongMessages = ["Almost there!", "Keep going!", "Nice effort!", "Keep practicing!", "Good try!"];

  let noOfTries = 1;
  let score = 0;

  // When the answer button is clicked
  function handleAnswerClick(event) {
    console.groupCollapsed("handleAnswerClick()");
  
    const selectedAnswer = event.target.textContent;
    console.info(`Previous score is ${score}`);
    
    const currentQuestionSet = fetchCurrentQuestionSet();
  
    // If the answer is correct
    if (selectedAnswer === currentQuestionSet.correctAnswer) {
      answerIsCorrect(event);
    } 
    // If the answer is NOT correct
    else {
      answerIsNotCorrect(event);
    }
    score = calScore();
  
    console.groupEnd();
  }

  // Assign currently showing question and answer set to a temp object.
  function fetchCurrentQuestionSet() {
    console.groupCollapsed("fetchCurrentQuestionSet()");

    console.info("contentMgr.currentQuestionIndex:", contentMgr.getCurrentQuestionIndex());
    let fetchedArray = contentMgr.getShuffledQuestionsArray();
    let fetchedIndex = contentMgr.getCurrentQuestionIndex();

    console.groupEnd();
    return fetchedArray[fetchedIndex];
  }
  
  function answerIsCorrect(event) {
    global.addClass({ // Adds the `correct` class to the button that was clicked
      element: event.target,
      classNames: "correct",
    });
    
    controlMgr.disableAllBtns(); // Disable all buttons
    global.setNodeDisabled({ // Simulate re-enabling the NEXT button after 0.3 seconds
      node: global.nextButton,
      isDisabled: false,
      changeItFast: true,
    });
    
    // Show global.random correct message drawn from `correctMessages` array
    global.addTextContent({
      node: global.messageContainer,
      content: fetchRandomMessage("correct"),
    });
    
    // Remove all classes of the global.messageContainer
    global.removeAllClass({element: global.messageContainer});
  
    global.addClass({
      element: global.messageContainer,
      classNames: "correct",
    });
  }
  
  function answerIsNotCorrect(event) {
    // Adds the `incorrect` class to the button that was clicked
    global.addClass({
      element: event.target,
      classNames: "disabled",
    });
    global.addTextContent({
      node: global.messageContainer,
      content: fetchRandomMessage("incorrect"),
    });
  
    // Remove all classes of the global.messageContainer
    global.removeAllClass({element: global.messageContainer});
  
    global.addClass({
      element: global.messageContainer,
      classNames: "incorrect",
    });
    noOfTries++;
    console.info(`Incorrect answser.`);
    console.info(`noOfTries is increased as: ${noOfTries}`);
  }
  
  function nextButtonClick(event) {
    console.groupCollapsed("nextButtonClick()");
  
    prepareForNewQuestion();
    if (isWithinQuestionLimit() && isShuffledQuestionsArrayNotEmpty()) { // calling sub-functions
      spliceQuestion(); // spliceQuestion() is called, if there is still a question left in `shuffledQuestionsArray`
    } else {
      finishSession();
    }
    controlMgr.displayPagination();

    // Sub-function #1
    function isWithinQuestionLimit() {
      const result = controlMgr.getCurrentQuestionNo() <= controlMgr.getTotalNumOfQuestion();
      console.log(`isWithinQuestionLimit: ${result}`);
      return result;
    }
  
    // Sub-function #2
    function isShuffledQuestionsArrayNotEmpty() {
      const result = contentMgr.getShuffledQuestionsArray().length !== 0;
      console.log(`isShuffledQuestionsArrayNotEmpty: ${result}`);
      return result;
    } 
  
    console.groupEnd();
  }
  
  function prepareForNewQuestion() {
    console.groupCollapsed("prepareForNewQuestion()");
  
    global.cleanNode({
      node: global.messageContainer,
      isDeepClean: false,
    });
    global.removeAllClass({element: global.messageContainer});
  
    // reset no. of tries to 1
    noOfTries = 1;
    console.info("noOfTries is reset.  Currently:", noOfTries);
  
    console.groupEnd();
  }
  
  function spliceQuestion() {
    // Delete shown questions from `shuffleQuestions` array
    contentMgr.spliceShuffledQuestionsArray();
  
    // randomQestion() is called again, if there is still a question left after the splice()
    contentMgr.getShuffledQuestionsArrayLength() === 0 ? finishSession() : contentMgr.randomQuestion();
  }
  
  function finishSession() {
    // Clear header, previous question, answers, and pagination; then show the complete message
    global.headerContainer.remove();
    global.questionContainer.remove();
    global.answersContainer.remove();
    global.paginationContainer.remove();
    global.separatorContainer.remove();

    global.removeAllClass({
      element: global.messageContainer,
    });

    global.addClass({
      element: global.mainContainer,
      classNames: "finished",
    });

    global.addClass({
      element: global.messageContainer,
      classNames: "finished",
    });
    
    global.messageContainer.innerHTML = `Well done!<br>You've completed all the questions.<br><br>Your score: ${score} of ${controlMgr.getTotalNumOfQuestion()}`;
  
    // Remove Next button from display
    if (global.nextButton) {
      global.nextButton.remove();
    }
  
    global.removeClass({
      element: global.reloadContainer,
      classNames: "hide",
    });

    global.reloadContainer.addEventListener("click", reloadSession);
  }
  
  function reloadSession() {
    console.groupCollapsed("reloadSession()");
  
    // Clear header, previous question, answers, and pagination; then show the complete message
    global.removeClass({
      element: global.reloadContainer,
      classNames: "hide",
    });
    global.messageContainer.remove();
    global.headerContainer.remove();
    global.questionContainer.remove();
    global.answersContainer.remove();
    global.paginationContainer.remove();
    global.separatorContainer.remove();
    
    // Remove Next button from display
    if (global.nextButton) {
      global.nextButton.remove();
    }
    location.reload();
  
    console.groupEnd();
  }
  
  function calScore() {
    if (noOfTries === 1) {
      console.log(`Correct on the first time.`);
      noOfTries = 1;
      console.log(`noOfTries is reset to 1.`);
      score++;
    }
    console.log(`Updated score is: ${score}`);
    return score;
  }

  function fetchRandomMessage(status) {
    console.groupCollapsed("fetchRandomMessage()");

    let messageArray;
    switch (status) {
      case 'correct':
        messageArray = correctMessages;
        console.info("Case:", status, " | Array: ", messageArray);
        break;
      case 'incorrect':
        messageArray = wrongMessages;
        console.info("Case:", status, " | Array: ", messageArray);
        break;
    }
    console.groupEnd();
    return messageArray[global.random(0, messageArray.length - 1)];
  }

  return {
    handleAnswerClick,
    nextButtonClick,
  }
}

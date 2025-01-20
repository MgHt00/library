export default contentManager;

function contentManager(global, listenerMgr, controlMgr) {

  function setListenerMgr(listenerMgrInstance) {
    listenerMgr = listenerMgrInstance; //[LE01]
  }

  let questions = []; // Data will be fetch from JSON
  let shuffledQuestionsArray = []; // To copy the questions array to manipulate without touching the original question array.
  let currentQuestionIndex; // Index to match the question and the answers.

  const answerClassList = ["ans-a", "ans-b", "ans-c", "ans-d"];
  
  console.groupCollapsed("Building image buttons.");
  const alphabetImg = [
    global.constructAbsoluteURL("assets/images/a.png"), 
    global.constructAbsoluteURL("assets/images/b.png"), 
    global.constructAbsoluteURL("assets/images/c.png"), 
    global.constructAbsoluteURL("assets/images/d.png")
  ];
  console.groupEnd();

  const alphabetAlt = ["a", "b", "c", "d"];

  async function start() {
    await loadJSON();
    randomQuestion();
    controlMgr.displayPagination();
  }

  async function loadJSON() {
    console.groupCollapsed("loadJSON()");
    try {
      const jsonURL = global.constructAbsoluteURL("assets/data/questions.json");
      const response = await fetch(jsonURL); // Fetch data using await
      const data = await response.json(); // Convert to JSON using await
      questions = data; // Assign the fetched data to questions
      shuffledQuestionsArray = [...questions]; // Copy to shuffledQuestionsArray
      //console.log("questions:", questions);
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
    setListenerMgr,
    start,
    loadJSON,
    randomQuestion,
    spliceShuffledQuestionsArray,
    getCurrentQuestionIndex,
    getShuffledQuestionsArray,
    getShuffledQuestionsArrayLength,
  }
}

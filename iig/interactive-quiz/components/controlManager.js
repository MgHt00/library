export default controlManager;

function controlManager(global) {
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

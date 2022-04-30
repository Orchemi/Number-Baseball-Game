// 변수 지정
// main 화면
const newStartBtn = document.querySelector("#newStartBtn");
const loadDataBtn = document.querySelector("#loadDataBtn");
const main = document.querySelector("#main");

// 플레이 화면
const playView = document.querySelector("#playView");
const goHome = document.querySelector("#goHome");
const goHelp = document.querySelector("#goHelp");
const noticeBoard = document.querySelector("#noticeBoard");
const showAnswer = document.querySelector("#showAnswer");
const myAnswerInput = document.querySelector("#myAnswerInput");

let ansArr = [];
let pastAnsArr = [];
let answerLogList = {};

// 도움말 화면
const helpView = document.querySelector("#helpView");
const helpLists = document.querySelector("#helpView");
const closeHelpBtn = document.querySelector("#closeHelpBtn");

// 정답 화면
const answerView = document.querySelector("#answerView");
const closeAnswerBtn = document.querySelector("#closeAnswerBtn");
/////////////////////////////////////////////////////////////

// page name
const PAGENOW = "pageNow"
const MAINPAGE = "mainpage";
const PLAYPAGE = "playpage";

const DISPLAY_NONE = 'd-none';



// 도움말 화면 이동
closeHelpBtn.addEventListener("click", changeGameNHelp);
goHelp.addEventListener("click", changeGameNHelp);

function changeGameNHelp() {
  helpView.classList.toggle("d-none");
  playView.classList.toggle("d-none");
}



// 시작 페이지 버튼 클릭
newStartBtn.addEventListener("click", onClickNewStart);
loadDataBtn.addEventListener("click", onClickLoadData);

// 새 게임 시작 버튼
function onClickNewStart(event){
  event.preventDefault();
  turnToNewPlay();
}

// 새 게임 시작
function turnToNewPlay(){
  main.classList.toggle(DISPLAY_NONE);
  playView.classList.toggle(DISPLAY_NONE);
  localStorage.setItem(PAGENOW, PLAYPAGE);
  NewGameStart();
}

// 이어하기 버튼 클릭
function onClickLoadData(event){
  event.preventDefault();
  turnToLoadPlay();
}

function turnToLoadPlay(){
  main.classList.toggle(DISPLAY_NONE);
  playView.classList.toggle(DISPLAY_NONE);
  localStorage.setItem(PAGENOW, PLAYPAGE);
  loadData();
}

// 페이지 시작과 함께 확인
const pageNow = localStorage.getItem("pageNow");
if (pageNow == MAINPAGE){
  main.classList.remove(DISPLAY_NONE);
} else {
  playView.classList.remove(DISPLAY_NONE);
}









// 버튼 클릭 시 (도움말 버튼은 하위에)
// HOME 버튼
goHome.addEventListener("click", turnToMain);

function turnToMain(event){
  event.preventDefault();
  main.classList.toggle(DISPLAY_NONE);
  playView.classList.toggle(DISPLAY_NONE);
  localStorage.setItem(PAGENOW, MAINPAGE);
}




// 새 게임 시작 ////////////////////////////////////////////////
function NewGameStart(){
  makeAnswer();
  let answerLogList = {};
  localStorage.setItem("answerLogList", JSON.stringify(answerLogList));
  
  // 기존 정보 지우기
  // 게시판 지우기
  noticeBoard.innerText="";
  // history 지우기
  while(logContainer.hasChildNodes()) {
    logContainer.removeChild(
      logContainer.firstChild
    );
  }

  // 입력칸 지우기
  while(myAnswerInput.hasChildNodes()) {
    myAnswerInput.removeChild(
      myAnswerInput.firstChild
    );
  }

  // 직전 답안 지우기
  while(showAnswer.hasChildNodes()) {
    showAnswer.removeChild(
      showAnswer.firstChild
    );
  }

  // 직전답안창 생성
  makeShowAnswer();

  // 입력창 생성
  makeMyAnswerInput();
  makeSubmitBtn();

  changePlayNHelp();
}


// 불러오기
function loadData(){
  // 기존 정보 지우기
  // 게시판 지우기
  noticeBoard.innerText="";
  // history 지우기
  while(logContainer.hasChildNodes()) {
    logContainer.removeChild(
      logContainer.firstChild
    );
  }

  // 입력칸 지우기
  while(myAnswerInput.hasChildNodes()) {
    myAnswerInput.removeChild(
      myAnswerInput.firstChild
    );
  }

  // 직전 답안 지우기
  while(showAnswer.hasChildNodes()) {
    showAnswer.removeChild(
      showAnswer.firstChild
    );
  }

  // 직전답안창 생성
  makeShowAnswer();

  // 입력창 생성
  makeMyAnswerInput();
  makeSubmitBtn();

  // 직전 데이터 가져오기
  let answerLogList = JSON.parse(localStorage.getItem("answerLogList"));
  let logListCnt = Object.keys(answerLogList).length;
  console.log(logListCnt);
  const loadedData = answerLogList[logListCnt]

  // HISTORY 채우기
  writeHistoryAll();

  // 게시판 데이터 넣기
  let STRIKE = loadedData[1];
  let BALL = loadedData[2];
  let OUT = loadedData[3];
  noticeBoard.innerText = `${STRIKE}STRIKE ${BALL}BALL ${OUT}OUT`

  // 직전 답안 채우기
  let pastInputs = showAnswer.querySelectorAll(".numBox");
  for (let i=0; i<4; i++) {
    console.log(loadedData[i+4]);
    pastInputs[i].innerText = loadedData[i+4];
  }
}



// 답 만들기
function makeAnswer(){
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffle(arr);
  let ansArr = []
  for (let i = 0; i < 4; i++) {
    ansArr.push(arr.pop(Math.floor(Math.random() * arr.length)));
  }
  localStorage.setItem("ansArr", JSON.stringify(ansArr));
}

// 배열 섞기
function shuffle(arr){
  arr.sort(() => Math.random() - 0.5);
}


closeAnswerBtn.addEventListener("click", goToMain);

function goToMain(){
  answerView.classList.toggle("d-none");
  main.classList.toggle("d-none");
}

// 채점
myAnswerInput.addEventListener("submit", acceptSubmit);

function acceptSubmit(event){
  event.preventDefault();
  const answerInfo = checkAnswer();

  // 정답 확인
  let ansArr = JSON.parse(localStorage.getItem("ansArr"));
  let check4 = 0;
  if(parseInt(answerInfo[4])===ansArr[0]){check4++}
  if(parseInt(answerInfo[5])===ansArr[1]){check4++}
  if(parseInt(answerInfo[6])===ansArr[2]){check4++}
  if(parseInt(answerInfo[7])===ansArr[3]){check4++}

  // 입력 값 4개가 정답이면
  if (check4===4){
    playView.classList.toggle("d-none");
    answerView.classList.toggle("d-none");
  } else {
    // 게시판에 결과 쓰기
    writeBoard(answerInfo);
    // 로컬 스토리지에 결과 저장
    saveLog(answerInfo);
    // 답안을 위의 공간으로 올리고 입력 공간 비우기
    moveInput(answerInfo);
    // HISTORY에 결과 반영
    writeHistory(answerInfo);
  }
}

// 입력값으로부터 로컬 스토리지 답과 비교해 S, B, O 계산
function checkAnswer(){
  // 로컬 스토리지에 저장해둔 정답
  let ansArr = JSON.parse(localStorage.getItem("ansArr"));
  // 내가 쓴 답안
  let answers = myAnswerInput.querySelectorAll("input");
  // 변수 지정
  let OUT = 0;
  let STRIKE = 0;
  let BALL = 0;

  for (let i=0; i<4; i++){
    if (parseInt(answers[i].value) == ansArr[i]) {
      STRIKE++
    } else if (ansArr.includes(parseInt(answers[i].value))) {
      BALL++
    } else {
      OUT++
    }
  }
  const n1 = answers[0].value;
  const n2 = answers[1].value;
  const n3 = answers[2].value;
  const n4 = answers[3].value;
  return [answers, STRIKE, BALL, OUT, n1, n2, n3, n4]
}

// 게시판에 결과 쓰기
function writeBoard(answerInfo){
  let STRIKE = answerInfo[1]
  let BALL = answerInfo[2]
  let OUT = answerInfo[3]
  noticeBoard.innerText = `${STRIKE}STRIKE ${BALL}BALL ${OUT}OUT`;
}

// 답안 정보를 결과 로컬스토리지에 저장
function saveLog(answerInfo){
  let answerLogList = JSON.parse(localStorage.getItem("answerLogList"));
  let logListCnt = Object.keys(answerLogList).length;
  answerLogList[logListCnt+1] = answerInfo;
  localStorage.setItem("answerLogList", JSON.stringify(answerLogList));
}

// 답안을 위의 공간으로 올리고 입력 공간 비우기
function moveInput(answerInfo) {
  const toPastAns = answerInfo[0];
  const spaceForAns = showAnswer.querySelectorAll("div");

  // 입력칸의 text를 위 칸으로 이동
  for(let i=0;i<4;i++){
    spaceForAns[i].innerText = toPastAns[i].value;
  }

  // 입력칸 비우기
  toPastAns.forEach((answer) => {
    answer.value = "";
  })
}

// log 파트
const logContainer = document.querySelector("#logContainer");

function writeHistory(answerInfo) {
  let log = answerInfo;
  const logText = `${log[4]}${log[5]}${log[6]}${log[7]} : ${log[1]} STRIKE ${log[2]} BALL ${log[3]} OUT`;

  const logElement = document.createElement("span");
  logElement.className ="log";
  logElement.innerText = logText;
  logContainer.appendChild(logElement);
}

function writeHistoryAll() {
  // 로컬 스토리지에서 answerLogList 가져오기
  let answerLogList = JSON.parse(localStorage.getItem("answerLogList"));
  let loglistcnt = Object.keys(answerLogList).length;
  for (let i=1; i<=loglistcnt; i++){
    let answerInfo = answerLogList[String(i)];
    writeHistory(answerInfo);
  }
}






// myAnswer form에 input 생성////////////////////////////////////////////////////////////
function makeMyAnswerInput() {
  for (i=0; i<4; i++) {
    makeInputs(i+1);
  }

}

function makeInputs(i){
  let answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.id = `myAnswer${i}`;
  answerInput.className = "numBox";
  answerInput.placeholder = "#";
  answerInput.required = true;
  myAnswerInput.appendChild(answerInput);
}

function makeSubmitBtn(){
  let submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = DISPLAY_NONE;
  myAnswerInput.appendChild(submitBtn);
}

function makeShowAnswer(){
  for (i=0; i<4; i++) {
    makeDiv();
  }
}

function makeDiv(){
  let answerDiv = document.createElement("div");
  answerDiv.className = "numBox";
  answerDiv.classList.add("bg-dark");
  answerDiv.classList.add("text-bwhite");
  showAnswer.append(answerDiv);
}


if (localStorage.getItem("pageNow")=="playpage"){
  loadData();
}



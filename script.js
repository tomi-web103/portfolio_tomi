"use strict";

// ファーストビューの本をめくる処理

// めくる紙をすべて取得する
const sheets = document.querySelectorAll(".flip-sheet");

// 操作に使うボタンを取得する
const prevButton = document.getElementById("prev-button");
const playButton = document.getElementById("play-button");
const nextButton = document.getElementById("next-button");
const replayButton = document.getElementById("replay-button");

// 本とページ数表示を取得する
const book = document.getElementById("portfolio-book");
const bookStatus = document.getElementById("book-status");

// あとから値が変わるもの
let currentPage = 0;
let autoTimer;// 自動再生に使うタイマー
let isPlaying = false;// 自動再生中かどうか


// 現在のページに合わせて表示を更新する関数
function updateBook(){

  for(let i = 0; i < sheets.length; i++){
    if(i < currentPage){
      // 現在のページより前の紙は、左側へめくる
      sheets[i].classList.add("is-flipped");

      // 後からめくった紙が左ページの一番上にくる
      sheets[i].style.zIndex = i + 1;
    }else{
      // まだめくっていない紙は右側へ戻す
      sheets[i].classList.remove("is-flipped");

      // 最初の紙から順番に上へ重なるようにする
      sheets[i].style.zIndex = sheets.length - i;
    }
  }

  // 現在の枚数を表示する
  bookStatus.textContent = (currentPage + 1) + " / " + (sheets.length + 1);

  // 最初と最後では、不要なボタンを押せないようにする
  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === sheets.length;

  // すべてめくれたら、本を少し手前へ近づける
  if(currentPage === sheets.length){
    book.classList.add("is-finished");
  }else{
    book.classList.remove("is-finished");
  }
}


// 自動再生を止める関数
function stopAutoPlay(){
  clearTimeout(autoTimer);
  isPlaying = false;
  playButton.textContent = "再生";
}


// 1枚ずつ自動でめくる関数
function turnPageAutomatically(){
  autoTimer = setTimeout(function(){
    if(currentPage < sheets.length){
      currentPage = currentPage + 1;
      updateBook();

      // 次のページも続けてめくる
      turnPageAutomatically();
    }else{
      // 最後までめくったら自動で止める
      stopAutoPlay();
    }
  }, 3000);
}


// 自動再生を始める関数
function startAutoPlay(){
  // 最後のページで再生した場合は、最初へ戻す
  if(currentPage === sheets.length){
    currentPage = 0;
    updateBook();
  }

  clearTimeout(autoTimer);
  isPlaying = true;
  playButton.textContent = "一時停止";
  turnPageAutomatically();
}


// 「戻る」ボタン
prevButton.addEventListener("click", function(){
  stopAutoPlay();

  if(currentPage > 0){
    currentPage = currentPage - 1;
    updateBook();
  }
});


// 「次へ」ボタン
nextButton.addEventListener("click", function(){
  stopAutoPlay();

  if(currentPage < sheets.length){
    currentPage = currentPage + 1;
    updateBook();
  }
});


// 「一時停止・再生」ボタン
playButton.addEventListener("click", function(){
  if(isPlaying === true){
    stopAutoPlay();
  }else{
    startAutoPlay();
  }
});


// 「最初から」ボタン
replayButton.addEventListener("click", function(){
  stopAutoPlay();
  currentPage = 0;
  updateBook();
  startAutoPlay();
});


// スマホ版：レポート用紙をめくる処理

const mobilePages = document.querySelectorAll(".mobile-page");

const mobilePrevButton = document.getElementById("mobile-prev-button");
const mobilePlayButton = document.getElementById("mobile-play-button");
const mobileNextButton = document.getElementById("mobile-next-button");
const mobileStatus = document.getElementById("mobile-status");

let mobileCurrentPage = 0;
let mobileTimer;
let mobileIsPlaying = false;


// スマホ版：ページ表示を更新する
function updateMobileBook(){

  for(let i = 0; i < mobilePages.length; i++){

    // 最初のページが一番上になるように重ねる
    mobilePages[i].style.zIndex = mobilePages.length - i;

    // 今のページより前だけ上へめくる
    if(i < mobileCurrentPage){
      mobilePages[i].classList.add("is-turned");
    }else{
      mobilePages[i].classList.remove("is-turned");
    }
  }

  mobileStatus.textContent = (mobileCurrentPage + 1) + " / " + mobilePages.length;

  mobilePrevButton.disabled = mobileCurrentPage === 0;
  mobileNextButton.disabled = mobileCurrentPage === mobilePages.length - 1;
}


// スマホ版：自動再生を止める
function stopMobileAutoPlay(){

  clearTimeout(mobileTimer);
  mobileIsPlaying = false;
  mobilePlayButton.textContent = "再生";
}


// スマホ版：1ページずつ自動でめくる
function turnMobilePageAutomatically(){

  mobileTimer = setTimeout(function(){

    if(mobileCurrentPage < mobilePages.length - 1){
      mobileCurrentPage = mobileCurrentPage + 1;
      updateMobileBook();
      turnMobilePageAutomatically();

    }else{
      stopMobileAutoPlay();
    }

  }, 3000);
}


// スマホ版：自動再生を始める
function startMobileAutoPlay(){

  if(mobileCurrentPage === mobilePages.length - 1){
    mobileCurrentPage = 0;
    updateMobileBook();
  }

  clearTimeout(mobileTimer);
  mobileIsPlaying = true;
  mobilePlayButton.textContent = "一時停止";
  turnMobilePageAutomatically();
}


// スマホ：戻る
mobilePrevButton.addEventListener("click", function(){

  stopMobileAutoPlay();

  if(mobileCurrentPage > 0){
    mobileCurrentPage = mobileCurrentPage - 1;
    updateMobileBook();
  }
});


// スマホ：次へ
mobileNextButton.addEventListener("click", function(){

  stopMobileAutoPlay();

  if(mobileCurrentPage < mobilePages.length - 1){
    mobileCurrentPage = mobileCurrentPage + 1;
    updateMobileBook();
  }
});


// スマホ：一時停止・再生
mobilePlayButton.addEventListener("click", function(){

  if(mobileIsPlaying === true){
    stopMobileAutoPlay();
  }else{
    startMobileAutoPlay();
  }
});


// ページを開いたとき
window.addEventListener("load", function(){

  updateBook();
  updateMobileBook();

  // 0.3秒待ってから自動再生を始める
  autoTimer = setTimeout(function(){
    startAutoPlay();
  }, 300);

  mobileTimer = setTimeout(function(){
    startMobileAutoPlay();
  }, 300);
});

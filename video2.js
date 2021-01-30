'use strict';

// 비디오 위에 낙서하기(?)

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
ctx.font = 'bold 50px serif'; 
// The CanvasRenderingContext2D.font property of the Canvas 2D API specifies the current text style to use when drawing text. 
// This string uses the same syntax as the CSS font specifier. 
ctx.fillStyle = 'red';

const videoElem = document.querySelector('.video');
videoElem.addEventListener('canplaythrough', render);

// for loop에 사용하여 자막을 만들려고 array를 정의해놓은 것
// x, y는 text position으로 지정할 값들
const messages = [
  {time: 1, message: '1 ㅋㅋ', x: 100, y: 100},
  {time: 3, message: '2 ㅎㅎ', x: 300, y: 300},
  {time: 5, message: '3 ㅊㅊ', x: 400, y: 200}
];

function render(){
  // console.log(videoElem.currentTime); 
  // HTMLMediaElement.currentTime
  // 이거는 video element에서 비디오 재생시간, 현재 몇초가 재생됬는지를 return해준다고 보면 됨.
  // 지금 render함수 안에서 쓰이고 있으니까 콘솔창에는 1초에 60번씩 현재 재생시간이 찍히고 있는거..
  ctx.drawImage(videoElem, 0, 0, 600, 400); 

  for (let i = 0; i < messages.length; i++) {
    if (videoElem.currentTime > messages[i].time) {
      // 그니까 각각  item들 마다 1초, 3초, 5초를 넘어갔을때 if블록을 실행하라는 뜻.
      // .fillText()는 캔버스에서 text를 쓸 때 사용하는 메소드
      ctx.fillText(messages[i].message, messages[i].x, messages[i].y);
    }
  }

  requestAnimationFrame(render);
}
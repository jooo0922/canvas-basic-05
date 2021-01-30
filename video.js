'use strict';

/**
 * 캔버스에서 비디오를 쓰는 이유
 * 
 * 캔버스는 기본적으로 px단위로 조작 가능. 비디오도 마찬가지.
 * 비디오의 색깔을 바꾼다던지, 잘게 쪼개서 뒤섞는다던지
 * 일반 html로 할 수 없는 작업들을 이미지로 했듯이 비디오도 할 수 있다는 것.
 * 
 * 그래서 이러한 특수한 용도가 있을 때 캔버스 사용.
 * 캔버스에서 비디오를 그리는 것은 똑같이 생각하면 됨.
 * 캔버스에서 requestAnimationFrame()으로 빠르게 반복해줘서 애니메이션 만들었듯이
 * 내 소스가 될 비디오를 잡아두고, 걔를 반복적으로 계속 그려내는 원리!
 * 
 * 그래서 비디오가 재생이 되고 있으면 캔버스에도 계속 빠르게 그 장면들이 그려짐.
 * 비디오가 멈춰있으면 캔버스는 계속 반복해서 그려내지만 비디오가 멈춰있으니 중지된 것처럼 보임.
 * 
 * 반대로, requestAnimationFrame()을 안해주면, 비디오가 아무리 재생되고 있다고 해도
 * 캔버스는 멈춰있겠지?
 * 
 * 이것도 특별하게 생각하지 말고, 이미지 대신에 비디오를 캔버스에 그려낸다고 생각하면 됨.
 */

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

ctx.textAlign = 'center';
ctx.fillText('비디오 로딩 중..', 300, 200); 
// fillText('text', x, y [, maxWidth])
// 주어진 (x, y) 위치에 주어진 텍스트를 채웁니다. -> 페이지 로딩 시에 잠깐 나옴 

const videoElem = document.querySelector('.video');
videoElem.addEventListener('canplaythrough', render);
// The canplaythrough event occurs when the browser estimates it can play through the specified audio/video without having to stop for buffering.
// 그니까 브라우저가 오디오, 또는 비디오를 버퍼링으로 인한 정지 없이 플레이할 수 있다고 판단했을 때 해당 이벤트가 발생함.
// 이미지는 load 이벤트를 걸어서 load가 완료되었을 때 캔버스에 그려내도록 했지? 마찬가지로
// 비디오는 canplaythrough로 해서 재생 준비가 되면 발생하는 이벤트라고 생각하면 됨.

function render(){
  ctx.drawImage(videoElem, 0, 0, 600, 400); 
  // 이미지 넣기랑 똑같음. image element 자리에 video element만 넣어주면 됨.
  // 이 파라미터 자리에 넣을 수 있는 것은 3개: 이미지 요소, 비디오 요소, 다른 캔버스
  // 성능면에서 비디오를 그냥 플레이 하는것과 캔버스에 플레이 하는것에는 차이가 있음.

  requestAnimationFrame(render);
}
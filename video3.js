'use strict';

// 캔버스에서 비디오를 그래픽적으로 조작해보기
// 비디오 색상 필터 만들기
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

const videoElem = document.querySelector('.video');
videoElem.addEventListener('canplaythrough', render);

const btnsElem = document.querySelector('.btns');

let imageData;
let colorValue;
let leng;

function render(){
  ctx.drawImage(videoElem, 0, 0, 600, 400); 
  imageData = ctx.getImageData(0, 0, 600, 400); 
  // console.log(imageData.data);
  /**
   * ctx.getImageData(x, y, width, height)
   * getImageData () 메소드는 위치, 사이즈가 지정된 캔버스 부분에 있는 모든 픽셀의 색상 데이터를 가져오고 변경할 수 있음.
   * 
   * 콘솔창에 imageData.data 찍어보면 Uint8ClampedArray(960000)[...] 이렇게 length = 96만 배열이 프레임마다 계속 찍힘.
   * 이게 뭐냐면 지금 이 프레임의 전체 픽셀 개수가 600 * 400 = 24만개인데, 24만 * 4 해서 96만개가 된거임.
   * 배열 안에 있는 숫자들이 바로 각 픽셀들의 rgba값들인 거지. 그래서 4개가 곱해지니까 저만큼의 개수가 나온거. 
   * 
   * 그래서 저 배열에서 처음 4개의 숫자들은 (0, 0)에 위치한 pixel의 rgba값을 순서대로 나타낸거임.
   * 지금 프레임에서 투명한 영역이 없기 때문에 4의 배수 자리에 해당하는 숫자들, 즉 Alpha값은 모두 255로 나와있음. 
   */

  leng = imageData.data.length / 4;
  // 방금전에 본 96만개짜리 Uint8ClampedArray(960000)[...] 이 배열의 길이를 4로 나눈 것
  // 그러면 결국 24만개니까, 프레임 한장 당 픽셀 개수를 구해서 값을 할당한거지!
  // 그래서 24만개의 픽셀을 루프를 돌면서 픽셀 하나하나에 뭔가 처리하려고 길이값을 구해놓은 것.

  // 요런식으로 for loop를 24만번 돌면서 각각의 픽셀에 대해서 뭔가를 처리하려는거.
  for (let i = 0; i < leng; i++) {
    // colorValue라는 값을 세팅해놓고, 그 값에 해당하는 한 가지의 case에 대해 24만번 수행하는 것.
    switch (colorValue) {
      case 'red':
        // 96만개짜리 배열의 index값인데, 지금 i를 24만번 돌리니까 인덱스 값이 0, 4, 8, 12, .... 이렇게 되겠지?
        // 한마디로 얘내 전부 각 픽셀마다 r에 해당하는 데이터값의 index들임. 그 값에 접근해서 255를 할당하라는 것.
        // 즉 r(빨간색 값)의 최대값을 할당하라는 거임. rgba는 0 ~ 255 의 값을 할당해서 색상을 선택하니까!
        imageData.data[i * 4 + 0] = 255;
        break;
      case 'green':
        // 얘도 마찬가지로 인덱스값이 1, 5, 9, 13, ... 등 g에 해당하는 index의 값에 255(최댓값)를 할당하라는 것.
        imageData.data[i * 4 + 1] = 255;
        break;
        case 'blue':
        // 얘도 마찬가지로 인덱스값이 2, 6, 10, 14, ... 등 b에 해당하는 index의 값에 255(최댓값)를 할당하라는 것.
        imageData.data[i * 4 + 2] = 255;
        break;
    }
  }

  // 이제 imageData의 data들을 바꿨으니까 얘내들을 실제 프레임들마다 다시 반영하려면
  // putImageData(imageData, x, y, [dx, dy, dw, dh] )를 이용하여 imageData 전체를 x, y 위치에 써 넣는다.
  ctx.putImageData(imageData, 0, 0);

  requestAnimationFrame(render);

  // 캔버스 이미지를 조작 절차를 정리하면,
  // 1. getImageData로 사본을 뜨고 
  // 2. 이 사본을 쪼물딱거려 원하는대로 바꾼 후 
  // 3. 다시 putImageData로 캔버스에 밀어 넣는다!

  // 이런 원리를 응용해서 해당 픽셀의 컬러값을 다른 픽셀에 찍어주면 마치 그 픽셀이 이동하는 것 같은 효과도 만들어줄 수 있음.
}

// 버튼 컨테이너에 이벤트리스너를 걸어서 이벤트 위임을 한거임!
btnsElem.addEventListener('click', function(e){
  // 이벤트 위임에서 클릭한 요소를 조작하려면 currentTarget(X) 'target'을 써야함!
  // currentTarget = '현재' 이벤트가 걸린 타겟으로 생각할 것
  // target = '실제' 타겟. 즉, 클릭한 요소(= 이벤트 버블링의 최하위 요소)
  colorValue = e.target.getAttribute('data-color');
});

// 여기서 만약 e.target.getAttribute('data-color') 요거로 가져온 게 '' 라면, 즉 비어있는 스트링, 즉 Reset 버튼이겠지?
// 그럼 colorValue값이 switch구문에 해당하는 케이스가 없기 때문에, imageData에 대해 아무것도 수행하지 않고 switch문을 빠져나옴.
// 그러면 그냥 getImageData로 가져와서 사본을 뜬 imageData 상태 고대로 putImageData하니까 
// 원래의 프레임들이 캔버스에 계속 찍히겠지 
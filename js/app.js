/*
 * 创建一个包含所有卡片的数组
 */
var card1 = 'fa-diamond';
var card2 = 'fa-paper-plane-o';
var card3 = 'fa-anchor';
var card4 = 'fa-bolt';
var card5 = 'fa-cube';
var card6 = 'fa-bomb';
var card7 = 'fa-leaf';
var card8 = 'fa-bicycle';

var cardArr = [card1, card1, card2, card2, card3, card3, card4, card4, card5, card5, card6, card6, card7, card7, card8, card8];
var openArr = [];

//洗牌后的卡片数组
var newCardArr = shuffle(cardArr);
//设置移动计数器
var moveCount = 0;
//设置计时器,
var timer;
//设置计时数，单位秒
var timeCount = 0;
//取得card类对象
var cardList;



/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */

//监听卡片点击
window.onload = function() {
  //生成页面卡片
  createCard();

  // Get the modal
  var modal = document.getElementById('myModal');
  // When the user clicks anywhere outside of the modal, close it
  //点击空白区域隐藏对话框
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  //点击刷新按钮
  document.body.querySelector(".restart").addEventListener("click", function() {
    cleanData();
    createCard();
  });

  //点击再玩一次
  document.getElementById("rePlay").onclick = function() {
    //隐藏结束对话框
    modal.style.display = "none";
    cleanData();
    createCard();
  };
};

//生成页面卡片
function createCard() {
  //启动计时器
  launchTimer();

  var _html = '';
  newCardArr.forEach(function(item) {
    _html += '<li class="card">';
    _html += '<i class="fa ' + item + '"></i>';
    _html += '</li>';
  });
  document.body.querySelector(".deck").innerHTML = _html;

  //给卡片添加点击事件
  cardClickListener();
}

//点击重开游戏后的清除数据操作
function cleanData() {
  //清除定时器
  timeCount=0;
  document.getElementById("timeCost").innerText=timeCount;
  window.clearInterval(timer);
  //清楚翻开的卡片数组
  openArr = [];
  //清除移动数
  moveCount = 0;
  document.getElementsByClassName("moves")[0].innerText = moveCount;
  //清除星星
  var _html = "<li><i class='fa fa-star'></i></li> <li><i class='fa fa-star'></i></li> <li><i class='fa fa-star'></i></li>";
  document.getElementsByClassName("stars")[0].innerHTML = _html;
}


//卡片点击监听
function cardClickListener() {
  //获取卡片对象
  cardList = document.getElementsByClassName("card");

  for (var i = 0; i < cardList.length; i++) {
    cardList[i].onclick = function() {
      //判断是否点击已翻开的蓝卡片
      if (this.className.indexOf("show")!=-1) {
        return;
      }

      //判断卡片是否属于匹配成功的
      if (this.className.indexOf("match")!=-1) {
        //点击已匹配卡片则无效
        return;
      }

      //阻止同时存在3个翻开的蓝色卡片的情况
      if (document.getElementsByClassName("show").length==2) {
        return;
      }

      //翻转卡片
      openCard(this);
      //取得卡片符号
      var cardPic = this.children[0].className.split(" ")[1];

      //取得翻开的蓝色卡片数
      var cardShowCount = getShowCount();

      if (cardShowCount == 2) {
        //卡片匹配，显示两个卡片
        if (checkCardMatch(cardPic)) {
          this.className = "card match";
          //卡片匹配，不再盖上
          lockCard();
          //卡片第二次出现
          addToopenArr(cardPic);
        } else {
          //移除翻开卡片数组
          removeCard();

          //盖上卡片
          setTimeout(function() {
            hideCard();
          }, 500);
        }
      } else if (cardShowCount == 1) {
        //卡片第一次出现
        addToopenArr(cardPic);
      }

      //设置移动步数
      moveCount++;
      showMoveCount(moveCount);
      //通过移动数设置星星数
      setStarByMove(moveCount);
      //判断是否所有卡片都匹配
      checkWin(openArr.length);
    };
  }
}

function openCard(card) {
  //添加翻转状态到卡片类
  card.classList.add('open');
  card.classList.add('show');
}

//返回已翻开蓝色卡片数
function getShowCount() {
  var showCardList = document.getElementsByClassName("show");
  return showCardList.length;
}

function checkCardMatch(card) {
  return openArr.indexOf(card) == -1 ? false : true;
}

function addToopenArr(card) {
  openArr.push(card);
}

function removeCard() {
  openArr.pop();
}

//修改卡片为show状态
function lockCard() {
  var showCardArr = document.getElementsByClassName('show');

  for (var i = 0; i < showCardArr.length; i++) {
    showCardArr[i].className = "card match";
  }
}

//盖上卡片
function hideCard() {
  var showCardList = document.getElementsByClassName('card');
  for (var i = 0; i < showCardList.length; i++) {
    showCardList[i].classList.remove("open", "show");
  }
}

//移动步数显示功能
function showMoveCount(count) {
  document.getElementsByClassName("moves")[0].innerText = count;
}

//通过定时器设置星星数
function setStarByTimer(timeCount) {
  var starElement = document.getElementsByClassName("stars")[0];

  //通过时间设置星级
  if(timeCount<41){
    //维持默认3星
  }else if (timeCount>40&&timeCount<91) {
    //设为2星
    starElement.children[2].children[0].className = "fa fa-star-o";
  }else if (timeCount>90&&timeCount<121) {
    //设为1星
    starElement.children[1].children[0].className = "fa fa-star-o";
  }else {
    //设为0星
    starElement.children[0].children[0].className = "fa fa-star-o";
  }
}

//通过操作数设置星级
function setStarByMove(moveCount) {
  var starElement = document.getElementsByClassName("stars")[0];
  switch (moveCount) {
    case 40:
    //超过40步时，设为2星
      starElement.children[2].children[0].className = "fa fa-star-o";
      break;
    case 60:
    //超过60步时，设为1星
      starElement.children[1].children[0].className = "fa fa-star-o";
      break;
    case 80:
    //超过80步时，设为0星
      starElement.children[0].children[0].className = "fa fa-star-o";
      break;
    default:
      break;
  }
}

//游戏结束
function checkWin(matchCount) {
  if (matchCount == 16) {
    //清除定时器
    window.clearInterval(timer);
    //设置记录总结
    setGameSummary(moveCount);
    //打开对话框
    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    modal.style.display = "block";
  }
}

//计时器
function launchTimer() {
  timer=setInterval(function() {
    timeCount++;
    //检查用时，设置星级评分
    setStarByTimer(timeCount);
    //设置用时
    document.getElementById("timeCost").innerText=timeCount;
  }, 1000);
}

//设置结束界面总结数据
function setGameSummary(moveCount) {
  //设置步数
  document.getElementById("moveCount").innerText = moveCount;
  //设置星星数
  document.getElementById("starCount").innerText = document.getElementsByClassName("fa-star").length;
  //设置用时
  document.getElementById("second").innerText = timeCount;
}

//document.getElementById("myBtn").onclick=function(){displayDate()};

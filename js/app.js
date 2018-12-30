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
    createCard();
    cleanData();
  });

  //点击再玩一次
  document.getElementById("rePlay").onclick=function() {
    createCard();
    cleanData();
  };
};

//生成页面卡片
function createCard() {
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
  //清楚翻开的卡片数组
  openArr = [];
  //清除移动数
  moveCount = 0;
  document.getElementsByClassName("moves")[0].innerText = moveCount;
  //清除星星
  var _html = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
  document.getElementsByClassName("stars")[0].innerHTML = _html;
}


//卡片点击监听
function cardClickListener() {
  //获取卡片对象
  cardList = document.getElementsByClassName("card");

  for (var i = 0; i < cardList.length; i++) {
    cardList[i].onclick = function() {
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
      showMoveCount(++moveCount);
      //设置星星数
      setStar(openArr.length);
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
    // showCardArr[i].classList.add("match");
    // showCardArr[i].classList.remove("open","show");
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

//设置星星数
function setStar(matchCount) {
  var starElement = document.getElementsByClassName("stars")[0];
  switch (matchCount) {
    case 4:
      starElement.children[0].children[0].className = "fa fa-star";
      break;
    case 10:
      starElement.children[1].children[0].className = "fa fa-star";
      break;
    case 16:
      starElement.children[2].children[0].className = "fa fa-star";
      break;
    default:
      break;
  }
}

//游戏结束
function checkWin(matchCount) {
  if (matchCount == 16) {
    //设置记录总结
    setGameSummary(moveCount,starCount);
    //打开对话框
    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    modal.style.display = "block";
  }
}




//document.getElementById("myBtn").onclick=function(){displayDate()};

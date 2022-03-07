const opn = require('opn');     //执行语句
var robot = require("robotjs");   //控制鼠标键盘等操作
 

var mouse = robot.getMousePos();

// Get pixel color in hex format.
var hex = robot.getPixelColor(mouse.x, mouse.y);
console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);

var screenSize = robot.getScreenSize();
console.log(screenSize)
robot.moveMouseSmooth(0,0);	//移动鼠标
robot.mouseClick();	 //鼠标点击
robot.moveMouseSmooth(screenSize.width, screenSize.height);
robot.mouseClick()
robot.moveMouseSmooth(100, 100);
robot.setMouseDelay(3000)

opn('/Users/sec-test2/Desktop/未命名文件夹')

opn('/Users/sec-test2/Desktop/Google Chrome');
robot.mouseClick()
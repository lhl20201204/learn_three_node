class Person{
    constructor(name, age){
      this.name = name
      this.age = age
     }
 
     static type = 'being'
 
   sayName (){
     return this.name
     }
 
   static intro(){
     console.log("")
     }
 }
 
 class Men extends Person{
     constructor(name, age){
         super()
       this.gender = 'male'
     }
 }
 

 'use strict';

var _createClass = function () {...}();// 给类添加方法

function _possibleConstructorReturn(self, call) { ...}//实现super

function _inherits(subClass, superClass) {...}// 实现继承

function _classCallCheck(instance, Constructor) {...} // 防止以函数的方式调用class

var Person = function () {
  function Person(name, age) {
      _classCallCheck(this, Person);

      this.name = name;
      this.age = age;
  }

  _createClass(Person, [{
      key: 'sayName',
      value: function sayName() {
        return this.name;
      }
  }], [{
      key: 'intro',
      value: function intro() {
        console.log("");
      }
  }]);

  return Person;
  }();

Person.type = 'being'; //静态变量

var Men = function (_Person) {
  _inherits(Men, _Person);

  function Men(name, age) {
    _classCallCheck(this, Men);

    var _this = _possibleConstructorReturn(this, (Men.__proto__ || Object.getPrototypeOf(Men)).call(this));

    _this.gender = 'male';
    return _this;
  }
    
  return Men;
  }(Person);

var men = new Men();


window.css=css
window.less=less
window.scss=scss
// window.$=$
import css from  './css/index.css';
import less from './css/black.less';
import scss from'./css/bb.scss';
//js模块化开发引入
import jspang from './jspang.js';
jspang();
// import $ from 'jquery';
// document.getElementById("title").innerHTML="Hello JSPang!!!~~~~~~~~~!!!!!!";

{
    let jspangString = 'Hello Webpack'
    document.getElementById('title').innerHTML = jspangString;
}
//jquery语言
$('#title').html('Hello king~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~啦啦啦啦啦');
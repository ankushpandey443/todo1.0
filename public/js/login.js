var signup = document.querySelector(".in .below span");
var signin = document.querySelector(".up .below span");
var signinpage = document.querySelector(".in");
var signuppage = document.querySelector(".up");
var i=0;
signup.addEventListener("click",(e)=>{
  signinpage.classList.remove("going");
  signuppage.classList.remove("going");
  signinpage.classList.add("coming");
  signuppage.classList.add("coming");
})
signin.addEventListener("click",(e)=>{
    signinpage.classList.remove("coming");
    signuppage.classList.remove("coming");
    signinpage.classList.add("going");
    signuppage.classList.add("going");
})


var passmatch = document.querySelector(".up form");
passmatch.children[3].addEventListener("input",verify);
passmatch.children[5].addEventListener("input",verify);
function verify(){
  if(passmatch.children[3].value!=passmatch.children[5].value){
    passmatch.children[6].setAttribute("style","color:#ff0000;opacity:1");
    passmatch.children[7].setAttribute("disabled","true");
  }else{
    passmatch.children[6].setAttribute("style","color:#ff0000;opacity:0");
    passmatch.children[7].removeAttribute("disabled");
  }
}
// js for the header and footer 



var burger = document.querySelector("header>img");
burger.addEventListener("click",(e)=>{
    document.querySelector("header ul").classList.toggle("showlist");
})
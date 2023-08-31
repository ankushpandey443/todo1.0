// js for the header and footer 
var list = document.querySelector(".list");
var objpost;
list.addEventListener("click",async(e)=>{
    if(e.target.getAttribute("src")=== "\\src\\images\\icons8-delete-100.png"){
        objpost={
            todo:e.target.parentNode.children[1].innerText,
            done:"delete"
        };
        try{
            const result=await xmlhandler(objpost);
            console.log("kam ban gya bhai",e.target.parentNode);
            e.target.parentNode.remove();
        }catch(e){
            if(e==300){
                alert("something wrong happened reload site")
            }else{
                location.reload();
            }
        }
    }
    if(e.target.getAttribute("src")==="\\src\\images\\icons8-tick-100.png"){
        if(e.target.parentNode.classList.contains("blur")){
            objpost={
                todo:e.target.parentNode.children[1].innerText,
                done:"false"
            };
            try{
                const result=await xmlhandler(objpost);
                console.log("kam ban gya bhai");
                e.target.parentNode.classList.toggle("blur");
                e.target.parentNode.children[2].title ="mark as done";
            }catch(e){
                if(e==300){
                    alert("something wrong happened reload ");
                }else{
                    location.reload();
                }
            }
            console.log(objpost);
            
        }else{
            objpost={
                todo:e.target.parentNode.children[1].innerText,
                done:"true"
            };
            try{
                const result=await xmlhandler(objpost);
                console.log("kam ban gya bhai");
                e.target.parentNode.classList.toggle("blur");
                e.target.parentNode.children[2].title ="mark as undone";
            }catch(e){
                if(e==300){
                    alert("something wrong happened reload ");
                }else{
                    location.reload();
                }
            }

        }
        
    }
})

function xmlhandler(obj,e){
    var reqtype;
    if(obj.done==="delete"){
        reqtype="DELETE";
    }else{
        reqtype="PUT";
    }
    let promise = new Promise(function(resolve,reject){
        const xhr = new XMLHttpRequest();
        xhr.open(reqtype,"/change",true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onreadystatechange=function(){
            if(this.readyState==XMLHttpRequest.DONE&&this.status==200){
                resolve("done");
            }
            if(this.readyState==XMLHttpRequest.DONE&&(this.status==300||this.status==400)){
                reject(this.status);
            }
        }
        xhr.send(JSON.stringify(obj));
    })
    return promise;
}

var burger = document.querySelector("header>img");
burger.addEventListener("click",(e)=>{
    document.querySelector("header ul").classList.toggle("showlist");
})
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import url, { fileURLToPath } from "url";
console.log(dirname(fileURLToPath(import.meta.url)))
const __dirname=dirname(fileURLToPath(import.meta.url))
// const __dirname=path.dirname(new URL(import.meta.url).pathname)
// const publicPath = path.join(__dirname+"\\static");
// console.log(__dirname+"static") 
const app=express();
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.get('/',(req,res)=>{
   res.render("home.ejs",{css:"hapt",js:"todo"});
});
app.get('/about',(req,res)=>{
   res.render("about.ejs",{css:"hapt",js:"todo"});
});
app.get('/terms',(req,res)=>{
   res.render("terms.ejs",{css:"hapt",js:"todo"});
});
app.get('/privacy',(req,res)=>{
   res.render("privacy.ejs",{css:"hapt",js:"todo"});
});
app.delete('/change',async(req,res)=>{
    if(req.cookies.username){
    await mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
        console.log("deletion a new todo");
    }).catch(()=>{
        console.log("deletion to-do connection failed");
    })
    try{
        const post = new mongoose.Schema({
            username:String,
            posts:[{task:String,done:Boolean}]
        });
        let posts;
        try{
            posts= mongoose.model("post");
        }catch{
            posts = mongoose.model("post",post);
        }
        try{
            await posts.updateOne({username:req.cookies.username},{$pull:{posts:{task:req.body.todo}}});
            res.sendStatus(200);
        }catch{
            console.log("error deletion a todo");
            res.sendStatus(300);
        }
    }finally{
        mongoose.connection.close();
    }
}else{
    res.sendStatus(400);
}
})
app.put('/change',async(req,res)=>{
    if(req.cookies.username){
        await mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
            console.log("updating a new todo");
        }).catch(()=>{
            console.log("updating to-do connection failed");
        })
        try{
            const post = new mongoose.Schema({
                username:String,
                posts:[{task:String,done:Boolean}]
            });
            let posts;
            try{
                posts= mongoose.model("post");
            }catch{
                posts = mongoose.model("post",post);
            }
            let bool;
            if(req.body.done==="true"){
                bool=true;
            }else{
                bool=false;
            }
            try{
                const a = await posts.findOneAndUpdate({username:req.cookies.username,posts:{$elemMatch:{task:req.body.todo}}},{$set:{'posts.$.done':bool}});
                res.sendStatus(200)
            }
            catch(err){
                res.sendStatus(300);
            }
        }finally{
            console.log("hmm");
            mongoose.connection.close();
        }
    }else{
        res.sendStatus(400);
    }
})
app.post("/newtodo",login1,async(req,res)=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
        console.log("added a new todo");
    }).catch(()=>{
        console.log("new to-do connection failed");
    })
    try{
        const post = new mongoose.Schema({
            username:String,
            posts:[{task:String,done:Boolean}]
        });
        let posts;
        try{
            posts= mongoose.model("post");
        }catch{
            posts = mongoose.model("post",post);
        }
        var data ={
            task:req.body.todo,
            done:false
        }
        try{
            const a = await posts.findOne({username:req.cookies.username})
            a.posts.push(data);
            await a.save();
        }catch{
            console.log("error inserting a todo");
        }
    }finally{
        mongoose.connection.close();
        res.redirect("/mydiary/1");
    }
})
app.get('/mydiary/:username',login,async(req,res)=>{
    var data;
    await mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
        console.log("connection was succesfull for my diary ");
    }).catch(()=>{
        console.log("connection was not successfull for my diary ");
    })
    try{
        const postsschema = new mongoose.Schema({
            username:String,
            posts:[{task:String,done:Boolean}]
        });
        let posts;
        try{
            posts=mongoose.model("post");
        }catch{
            posts = mongoose.model("post",postsschema);
        }
        try{
        data = await posts.findOne({username:req.cookies.username});
        console.log(data.posts);
       }catch{
        console.log("hnji yhi error hai");
       }
    }
    finally{
        mongoose.connection.close();
    }
    res.render("todo.ejs",{css:"todo",js:"todo",data:data.posts});
})
app.get("/login",(req,res)=>{
    res.render("login.ejs",{css:"login",js:"login"})
})
app.post("/login",async(req,res)=>{
    var data;
    await mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
        console.log("connection was succesfull for login ");
    }).catch(()=>{
        console.log("connection was not successfull for login ");
    })
    try{
        const userschema = new mongoose.Schema({
            username:{
                type:String,
            }
            ,password:{
                type:String
            }
        });

          let user;
          try {
               user = mongoose.model('user');
            } catch (error) {
               user = mongoose.model('user', userschema);
            }

        try{
        data = await user.findOne({username:req.body.username});
        console.log(data);
       }catch{
        console.log("hnji yhi error hai");
       }
    }
    finally{
        mongoose.connection.close();
    }
    console.log(req.body.username,data.username,req.body.password,data.password);
    if(req.body.username===data.username&&req.body.password===data.password){
        res.cookie("username",req.body.username,{maxAge:100000});
        res.cookie("password",req.body.password,{maxAge:100000});
        console.log("mai chala bhai");
        res.redirect("/mydiary/"+data.username);
    }else{
        res.redirect("/login");
    }
})
app.post("/createaccount",async(req,res)=>{
    if(req.body.password===req.body.password1&&req.body.username!="user"&&req.body.username!="users"){
    await mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
        console.log("connection was succesfull for account creation");
    }).catch(()=>{
        console.log("connection was not successfull for account creation");
    })
    try{
        const userschema = new mongoose.Schema({
            username:{
                type:String,
            }
            ,password:{
                type:String
            }
        });
        const postsschema = new mongoose.Schema({
            username:String,
            posts:[{task:String,done:Boolean}]
        });

        const post = mongoose.model("post",postsschema);
        const newpost = {
            username:req.body.username,
            posts:[{task:"add your todo below",done:false}]
        }
        let user;
        try{
            user = mongoose.model("user");
        }catch{
            user = mongoose.model("user",userschema)
        }
        const newdata={
            username:req.body.username,
            password:req.body.password,
        }
        try{
            const a = new user(newdata);
            const b = new post(newpost);
            await b.save();
            await a.save();
            console.log("insertion was successfull");
        }catch{
            console.log("insertion was not successfull");
        }
    }finally{
        mongoose.connection.close();
        res.redirect("/login");

    }
}else{
    console.log("password didint match");
    res.redirect("/login");
}

})
app.listen(3000,()=>{
    console.log("server is listning at port 3000");
})
 async function login(req,res,next){
    var data;
    if(req.cookies.username){
        console.log("mai chala",req.cookies.username,req.params.username);
        if(req.cookies.username!=req.params.username){
            console.log("mai async wala")
            res.redirect("/mydiary/"+req.cookies.username);
        }else{
        await mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
            console.log("connection is successfull");
        }).catch(()=>{
            console.log("error connecting to database")
        })
        try{
            const userschema = new mongoose.Schema({
                username:{
                    type:String,
                }
                ,password:{
                    type:String
                }
            });
            let user;
          try {
               user = mongoose.model('user');
            } catch (error) {
                   user = mongoose.model('user', userschema);
                }

            try{
             data = await user.findOne({username:req.params.username});
             console.log(data)
           }catch{
            console.log("hnji yhi error hai");
           }
        }
        finally{
            mongoose.connection.close();
        }
        if(data.username===req.cookies.username&&data.password==req.cookies.password){
         next();
        }else{
         res.redirect("/login");
        }
    }
    }else{
        res.redirect('/login');
    }

}
 async function login1(req,res,next){
    var data;
    if(req.cookies.username){
        await mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
            console.log("connection is successfull");
        }).catch(()=>{
            console.log("error connecting to database")
        })
        try{
            const userschema = new mongoose.Schema({
                username:{
                    type:String,
                }
                ,password:{
                    type:String
                }
            });
            let user;
          try {
               user = mongoose.model('user');
            } catch (error) {
                   user = mongoose.model('user', userschema);
                }

            try{
             data = await user.findOne({username:req.cookies.username});
             console.log(data)
           }catch{
            console.log("hnji yhi error hai");
           }
        }
        finally{
            mongoose.connection.close();
        }
        if(data.username===req.cookies.username&&data.password==req.cookies.password){
         next();
        }else{
         res.redirect("/login");
        }
    }else{
        res.redirect('/login');
    }

}





















// future use

// const myModel = mongoose.model('MyModel', mySchema);
// const myDoc = new myModel();
// myDoc.myArray.push('data');
// myDoc.save();

// const mySchema = new mongoose.Schema({
//     myArray: [String]
//   });
  

// const doc = await Model.findById(id);
// doc.friends.push({firstName: 'John', lastName: 'Doe'});
// await doc.save();

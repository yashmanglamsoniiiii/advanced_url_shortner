const {v4 : uuidv4} = require("uuid");
const User=require("../models/user");
const {setUser}=require("../service/auth");

async function handleUserSignup(req,res){
    const {name, email,password}=req.body;
    await User.create({
        name,
        email,
        password,
    })
    // return res.render("home");
    return res.redirect("/");
}

async function handleUserLogin(req,res){
    const {email,password}=req.body;
    const user=await User.findOne({email,password});
    console.log("User",user);
    if (!user){
        return res.render("login",{
            error:"invalid email or password",
        });
    }
   
    //maintaining the state ( stateful )

    // const sessionId=uuidv4();
    // setUser(sessionId,user);
    // res.cookie("uid", sessionId);

    // stateless

    //cookies mei send kara
    const token= setUser(user);
//     res.cookie('uid',token,
//         //{
//         //domain : ".yms.com",  //www.yms.com  , blog.yms.com ,.. anything having yms.com
//         //}
// );

    // res.cookie("uid",token);
    // return res.redirect("/");

    //response mei send kara
    // return res.json({token});
    

    //cookie format mei send kara
    res.cookie("token",token);
    return res.redirect("/");
}
module.exports={
    handleUserSignup,
    handleUserLogin,
}
const {getUser}=require("../service/auth");

//AUTHENTICATION:-
function checkForAuthentication(req,res,next){  //soft check

    // in response format , json mei send kara
    // const AuthenticationHeaderVal=req.headers["authorization"];
    // req.user=null;

    // if (!AuthenticationHeaderVal || !AuthenticationHeaderVal.startsWith("Bearer") )
    //     return next();   // user is null basically 

    // //validating now:-

    // const token =AuthenticationHeaderVal.split("Bearer ")[1];
    // const user=getUser(token);
    // req.user=user;
    // return next();


    // in cookie format mei send kara
    const tokenVal=req.cookies?.token;
    req.user=null;
    if (!tokenVal) return next();

    const token = tokenVal;
    const user=getUser(token);
    req.user=user;
    return next();
}

//AUTHORIZATION:-
 //hard check 
function restrictTo(roles = []){  // at time of passing this middleware in index we gave role = "NORMAL " , roles is array
    return function(req,res,next){
        if (!req.user) return res.redirect("/login");

        if (!roles.includes(req.user.role)) return res.end("Unauthorized");

// ["NORMAL"].includes("NORMAL");  true
// ["NORMAL"].includes("ADMIN");   false
        return next();
    }
}
// async function restrictToLoggedInUserOnly(req,res,next){
//     // const userUid=req.cookies.uid;
//     // console.log(req); 
    
//     const userUid=req.headers["authorization"];
//     console.log(req.headers);

//     if (!userUid) return res.redirect("/login");
    
//     const token=userUid.split("Bearer ")[1];    //"Bearer [12341252154] "
//     // const user=getUser(userUid);
//     const user=getUser(token);
//     if (!user) return res.redirect ("/login");

//     req.user=user;    
//     next();
// }


// async function checkAuth(req, res, next){
//     // const userUid=req.cookies.uid;
//     // const user=getUser(userUid);
//     console.log(req.headers);
//     const userUid=req.headers["authorization"];
//     const token=userUid.split("Bearer ")[1];
    
//     const user=getUser(token); 
//     req.user=user;
//     next();
// }

module.exports={
    // restrictToLoggedInUserOnly,
    // checkAuth,
checkForAuthentication,
restrictTo,

}
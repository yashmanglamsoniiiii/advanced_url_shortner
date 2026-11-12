// const sessionIdToUserMap=new Map();    //maintaining the state. (stateful authentication)

// function setUser(id,user){
//     sessionIdToUserMap.set(id,user);
// }

// function getUser(id){

//     return sessionIdToUserMap.get(id);
// }

const jwt= require('jsonwebtoken');    //(stateless)
const secretKey="my-super-secret-key-that-is-long-enough-123!@112233Y1a2s3h4$%";   //tokens ko vhi change kar sakta hai who have the secretKey

//making token:-
function setUser(user){
    return jwt.sign({// it is called payload , we are storing payload.
        _id:user._id,
        email:user.email,
        role : user.role,
    },secretKey);
}

function getUser(token){
    if (!token) return null
    try{
        return jwt.verify(token,secretKey);
    }catch(err){
        return null;
    }
}
module.exports={
    setUser,
    getUser,
}


// IMP points for stateless server (jwt):-

// email bhi hona chaiye and token  if Want to change, then just give the secret key in jwt.io . Just paste your secret key there and copy-paste that particular cookie, or I can say token, which you will get there. Now forget about all the email IDs you have changed or not. 

// *****basically when we jwt.sign we generate a token  and also pass the secret key , so when we verify we check that whether it is that token only which we generated on frontend using the particular secret key.
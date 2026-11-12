const express= require("express");
const app=express();
const {connectToMongoDB}= require ("./connect");
const path = require ("path");
const cookieParser=require("cookie-parser");
const {checkForAuthentication,restrictTo}=require("./middlewares/auth");

const URL = require("./models/url")

const urlRoute=require("./routes/url");
const staticRoute= require("./routes/staticRouter")
const userRoute=require("./routes/user");

const PORT=8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
    .then(()=> console.log("mongodb successfully connected"))
    .catch((err)=>console.log(`there is some error${err}`));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());//json data parser
app.use(express.urlencoded({extended : false})) ; // form data parser
app.use(cookieParser());

app.use(checkForAuthentication);

//server side rendering (server se hi webpage render karna)
// app.get("/test",(req,res)=>{
//     return res.end("<h1> hi from server</h1>");
// })

// app.get("/test",async(req,res)=>{
//     const allURLs=await URL.find({});
//     return res.render("home",{
//         urls : allURLs,
//     })
    // return res.end(
    //     `<html>
    //     <head></head>
    //     <body>
    //     <ol>
    //       ${allURLs.map((url)=> 
    //         `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`)
    //     .join("")}
    //     </ol>
    //     </body>
    //     </html>`
    // )
// })

//     ||
//     V
// on home.ejs:-

//     <h1>hi from server</h1>
//     <% urls.forEach(url=>{ %>
//     <li><%=url.shortId%></li>
//     <% }) %>
     


app.use("/url", restrictTo(["NORMAL","ADMIN"]),urlRoute);
app.use("/user",userRoute);
app.use("/",staticRoute);

app.get("/url/:shortId",async(req,res)=>{
    const shortId=req.params.shortId;
    const entry= await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory : {
                    timestamp :Date.now(),
                },
            },
        }
    )

    if (!entry) {
        return res.status(404).json({
            error: "Short URL not found",
        });
    }

    res.redirect(entry.redirectURL);
})

app.listen(PORT, ()=> console.log(`server started on ${PORT}`));
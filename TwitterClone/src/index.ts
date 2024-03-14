import express from "express";
import UserRoute from "./routes/users";
import loginRoute from "./routes/login";
import twittRoute from "./routes/twitt";
import likeRoute from "./routes/like";
import cookieParser from "cookie-parser"
const PORT =3001;
const app=express();
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.set("view engine","hbs");

app.get("/",(req,res)=>{
    res.render("home");
})
app.use("/twitt",twittRoute);
app.use("/user",UserRoute);
app.use("/login",loginRoute)
app.use("/likes",likeRoute);
app.listen(PORT,()=>{
    console.log(`https://localhost:${PORT}`);
})

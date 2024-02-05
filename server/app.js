const express = require("express");
const app = express();
require("dotenv/config")

const cors = require("cors");
const {default : mongoose} = require("mongoose");

app.use(cors({ origin : true}));
app.use(express.json());

app.get("/", (req,res) => {
    return res.json("hai there....")
})
//user authentication route
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);



//Artist routes
const artistsRoutes = require("./routes/artist");
app.use("/api/artist/", artistsRoutes);

//Album routes
const albumRoutes = require("./routes/albums");
app.use("/api/albums/", albumRoutes);

//Songs routes
const songRoutes = require("./routes/songs");
app.use("/api/songs/", songRoutes);

mongoose.connect(process.env.DB_STRING, {useNewUrlParser : true});
mongoose.connection
.once("open", () => console.log("connected"))
.on("error",(error) =>{
    console.log(`ERROR :${error}`);
})

app.listen(4000, () => console.log("Listening to port 4000"));

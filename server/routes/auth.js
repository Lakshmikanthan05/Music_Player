const router = require("express").Router();
const user = require("../models/user")
const admin = require("../config/firebase.congif");

router.get("/login", async(req, res) => {
    if(!req.headers.authorization){
        return res.status(500).send({message : "Invalid Token"});
    }
    const token = req.headers.authorization.split(" ")[1];
    try{
        const decodeValue = await admin.auth().verifyIdToken(token);
        if(!decodeValue){
            return res.status(505).json({message : "un Authorized"})
        }else{
            const userExists = await user.findOne({"user_id" : decodeValue.user_id})
            if(!userExists){
                newUserData(decodeValue, req, res)
            }else{
                updateNewUserData(decodeValue, req, res)
            }
        }
    }catch(error){
        return res.status(505).json({message : error})
    }
})

const newUserData = async (decodeValue, req, res) => {
    const newUser = new user({
        name : decodeValue.name,
        email : decodeValue.email,
        imageURL : decodeValue.picture,
        user_id : decodeValue.user_id,
        email_verified : decodeValue.email_verified,
        role : "member",
        auth_time : decodeValue.auth_time
    })
    try{
        const savedUser = await newUser.save();
        res.status(200).send({user : savedUser})
    }catch (error){
        res.status(400).send({success : false, msg : error});
    }
}

const updateNewUserData = async (decodeValue, req, res) => {
    const filter = {user_id : decodeValue.user_id};

    const options ={
        upset : true,
        new : true 
    };
    try {
        const result = await user.findOneAndUpdate(
            filter,
            {auth_time : decodeValue.auth_time},
            options
        );
        res.status(200).send({user : result})
    }catch(error){
        res.status(400).send({success : false, msg :error});
    }
}

router.get("/getUsers", async(req, res) => {
    

    const datas = await user.find({});
     if(datas) {
        return res.status(200).send({ success: true, user: datas });
    } 
    else{
        return res.status(400).send({ success: false, msg: "Data not found"});
    }
});

router.put("/updateRole/:userId", async (req, res) =>{
    const filter = { _id: req.params.userId };
    const role = req.body.data.role;
    
    

    try{
        const result = await user.findOneAndUpdate(filter, {role: role});
        res.status(200).send({ user: result });
    }catch (error){
        res.status(200).send({ success: false, msg: error});
    }
});

router.delete("/deleteUser/:userid", async(req, res) => {
    const filter ={ _id: req.params.userid};

    const result = await user.deleteOne(filter);

     if(result.deletedCount === 1) {
        return res.status(200).send({ success: true, msg: "User Removed"});
    } 
    else{
        return res.status(400).send({ success: false, msg: "User not found"});
    }
});

module.exports = router;

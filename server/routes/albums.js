const router = require("express").Router();

const album = require("../models/album");

router.post("/save", async(req, res) =>{
    const newAlbum = album({
        name: req.body.name,
        imageURL: req.body.imageURL,
        
    });
    try{
        const saveAlbum = await newAlbum.save();
        return res.status(200).send({ success: true, album: saveAlbum });
    }catch(error){
        return res.status(400).send({ success: false, msg: error});
    }
});

router.get("/getOne/:id", async(req, res) => {
    const filter ={ _id: req.params.id};

    const data = await album.findOne(filter);

    if(data) {
        return res.status(200).send({ success: true, artist: data });
    } else{
        return res.status(400).send({ success: false, msg: "Data not found"});
    }
});

router.get("/getAll", async(req, res) => {
    

    const datas = await album.find({});
     if(datas) {
        return res.status(200).send({ success: true, album: datas });
    } 
    else{
        return res.status(400).send({ success: false, msg: "Data not found"});
    }
});

router.put("/update/:id", async (req, res) =>{
    const filter ={ _id: req.params.id};

    const options ={
        upset: true,
        new: true,
    };
    try{
        const result = await album.findOneAndUpdate(
            filter,
            {
                name: req.body.name,
                imageURL: req.body.imageURL,
                
            },
            options
        );
        return res.status(200).send({ success: true, album: result});
    }catch(error){
        return res.status(400).send({ success: false, msg: error});
    }
});

router.delete("/delete/:id", async(req, res) => {
    const filter ={ _id: req.params.id};

    const result = await album.deleteOne(filter);

     if(result) {
        return res.status(200).send({ success: true, msg: "Data deleted successfully", data: result });
    } 
    else{
        return res.status(400).send({ success: false, msg: "Data not found"});
    }
});

module.exports = router;

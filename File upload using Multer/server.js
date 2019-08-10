const express = require('express');
const ejs=require('ejs');
const multer=require('multer');
const path=require('path');
const app = express();


//Configration of multer
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./public/myupload");
    },
    filename: (req,file,cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname) );
    }
});

var upload = multer({
    storage: storage
}).single('profilepic')

//Set view engine for ejs 
app.set('view engine', 'ejs');

//Set static folder
app.use(express.static('./public'));


//@type    GET
//@route   welcome route
//@desc    for testing
//@access  PUBLIC
app.get("/", (req, res) => {
    res.render("index");
});

//@type    POST
//@route   /upload
//@desc    upload image/file
//@access  PUBLIC
app.post('/upload', (req, res)=>{
    upload(req, res, error => {
        if(error){
            res.render('index',{
                message:error
            });
        }
        else{
            res.render('index', {
                message:"Successfully Uploaded...",
                filename:`myupload/${req.file.filename}`
            });
         }
    });
});
    
const port = 3000;

app.listen(port, () => console.log(`Server running on port:${port}`));
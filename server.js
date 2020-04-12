var express = require('express');
var multer = require('multer');
var path = require('path');
const mongoose = require('mongoose');
const Resume = require('./models/resume.model')
var Convertor = require('./Controllers/convertor');
var Controller = require('./Controllers/pdfParse');
var DocController = require('./Controllers/docParse');
var app = express();

app.set('view engine', 'ejs');

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://localhost:27017/";
// const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});

mongoose.connect('mongodb://localhost:27017/resume-reader', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to MongoDB")
})

app.get('/', function(req, res) {
    res.render('index', {failure: "none"});
});

var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        cb(null, "resumes") 
    }, 
    filename: function (req, file, cb) { 
        console.log(file)
      cb(null, Date.now() + "-" + file.originalname ) 
    } 
  }) 
       

const maxSize = 1 * 1000 * 1000; 
    
var upload = multer({  
    storage: storage, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
    
        var filetypes = /pdf|doc|docx/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("File upload only supports the following filetypes of docx or pdf!!"); 
      }  
  
}).single("resume");        
    
app.post("/uploadResume",function async (req, res, next) { 
    upload(req,res,async function(err) { 
  
        if(err) { 
            res.render('index', {failure: err});
        } 
        else {
            if(path.extname(res.req.file.originalname) == ".pdf") {
                tables = await Controller.tablePdf(res.req);
                name = await Controller.parsePdf(res.req);
                console.log(name)
                console.log(tables)

                const form = {
                    filename: res.req.file.originalname,
                    name: name.name, 
                    email: name.email, 
                    pno: name.pno, 
                    linked: name.linked, 
                    lines: name.textlines, 
                    chars: name.chars
                }
                a = await Convertor.convertxls(form);
                b = await Convertor.convertcsv(form);
                convFile = res.req.file.originalname;

                console.log(convFile)

                const resume = new Resume({
                    filename: res.req.file.filename,
                    name: name.name, 
                    email: name.email, 
                    pno: name.pno, 
                    linked: name.linked, 
                    lines: name.textlines, 
                    chars: name.chars
                })
                resume.save().then((result) => {
                    console.log(result)
                    // console.log(res)
                    res.render('parseResume', {message : " Successfully Uploaded", filename: convFile,name: name.name, email: name.email, pno: name.pno, linked: name.linked, lines: name.textlines, chars: name.chars})
                }).catch(err => {
                    console.log(err.message)
                })
            } else if(path.extname(res.req.file.originalname) == ".docx") {
                chars = await DocController.getChars(res.req);
                lines = await DocController.getLines(res.req);
                name = await DocController.parseDoc(res.req);
                console.log(name)
                console.log(lines)
                console.log(chars)

                const resume = new Resume({
                    filename: res.req.file.filename,
                    name: name.name, 
                    email: name.email, 
                    pno: name.pno, 
                    linked: name.linked, 
                    lines: lines, 
                    chars: chars
                })
                resume.save().then(async (result) => {
                    console.log(result)
                    const form = {
                        filename: res.req.file.originalname,
                        name: name.name, 
                        email: name.email, 
                        pno: name.pno, 
                        linked: name.linked, 
                        lines: lines, 
                        chars: chars
                    }
                    a = await Convertor.convertxls(form);
                    b = await Convertor.convertcsv(form);
                    convFile = res.req.file.originalname;
    
                    console.log(convFile)
                    // console.log(res)
                    res.render('parseResume', {message : " Successfully Uploaded", filename: convFile,name: name.name, email: name.email, pno: name.pno, linked: name.linked, lines: lines, chars: chars})
                }).catch(err => {
                    console.log(err.message)
                })
                   
            }
            
        } 
    }) 
}) 

app.use(express.static('connverted'))

app.get("/downloadxlsx/:name", function (req, res) {
    console.log(req.params.name)
    res.download("./converted/xlsx/" + req.params.name)
})

app.get("/downloadcsv/:name", function (req, res) {
    console.log(req.params.name)
    res.download("./converted/csv/" + req.params.name)
})

app.listen(8080);
console.log('8080 is the magic port');
const fs = require('fs');
var json2xls = require('json2xls');
let converter = require('json-2-csv');

const convertxls = function (form) {
    var xls = json2xls(form);
    fs.writeFileSync("./converted/xlsx/" + form.filename + "xlsxFile.xlsx", xls, 'binary', (err) => {
       if (err) {
             console.log("writeFileSync :", err);
        }
      console.log( filename+" file is saved!");
   }); 
}

const convertcsv = (form) => {
    let json2csvCallback = function (err, csv) {
        if (err) throw err;
        console.log(csv);
        fs.writeFileSync("./converted/csv/" + form.filename + "csvFile.csv", csv, 'binary', (err) => {
            if (err) {
                  console.log("writeFileSync :", err);
             }
           console.log( filename+" file is saved!");
        }); 
    };
    
    converter.json2csv(form, json2csvCallback);
}

exports.convertxls = convertxls;
exports.convertcsv = convertcsv;
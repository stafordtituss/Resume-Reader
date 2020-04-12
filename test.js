let converter = require('json-2-csv');

let documents = [
    {
        Make: 'Nissan',
        Model: 'Murano',
        Year: '2013',
        Specifications: {
            Mileage: '7106',
            Trim: 'S AWD'
        }
    },
    {
        Make: 'BMW',
        Model: 'X5',
        Year: '2014',
        Specifications: {
            Mileage: '3287',
            Trim: 'M'
        }
    }
];

let json2csvCallback = function (err, csv) {
    if (err) throw err;
    console.log(csv);
    fs.writeFileSync("./converted/" + form.filename + Date.now() + ".csv", csv, 'binary', (err) => {
        if (err) {
              console.log("writeFileSync :", err);
         }
       console.log( filename+" file is saved!");
    }); 
};

converter.json2csv(documents, json2csvCallback);
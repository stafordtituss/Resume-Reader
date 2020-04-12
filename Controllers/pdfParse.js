const parse = require('pdf-parse');
var pdf_table_extractor = require("pdf-table-extractor");

const parsePdf = (req) => {
    var name = req.file.filename;

    return parse("./resumes/" + name).then((data)=>{
        dats = data.text.toString()
        // console.log(dats)
        var name = dats.match(/([\-'.a-z]+\s?){2,4}/gi)
        console.log(name[0])
        var email=dats.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi)
        // console.log(email)
        var linked=dats.match(/(linkedin\.com\/in\/[A-z0-9_-]+)/gi)
        // console.log(linked)
        var pno=dats.match(/(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g)
        // console.log(pno)
        var textlines=dats.split(/\r\n|\r|\n/).length;
        // console.log(textlines)
        var chars=dats.length-2*textlines;
        // console.log(chars)
        
        const stuff = {
            name: name[0],
            email: email,
            pno: pno,
            linked: linked,
            textlines: textlines,
            chars: chars
        }
        console.log(stuff)
        return stuff;
    })
};

const tablePdf = async (req) => {
    var name = req.file.filename;

    datso = await pdf_table_extractor("./resumes/" + name,success,error);

    function success(result)
    {
    //    console.log(JSON.stringify(result.pageTables[0].tables));
        count = 0;
        var stuff = result.pageTables.map(x => {
            x.tables.map(y => {
                count += 1;
            })
            return count;
        })
        return stuff;
    }

    console.log(datso)
    
    function error(err)
    {
        console.error('Error: ' + err);
    }
    
}

exports.parsePdf = parsePdf;
exports.tablePdf = tablePdf;
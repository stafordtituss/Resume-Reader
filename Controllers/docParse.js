const ResumeParser = require('simple-resume-parser');
var mammoth = require("mammoth");


const parseDoc = (req) => {
  var ename = req.file.filename;
  resume = new ResumeParser("./resumes/" + ename);

  return resume.parseToJSON()
  .then(data => {
    var name = data.parts.name;
    var email = data.parts.email;
    var pno = data.parts.phone;
    var linked = data.parts.profiles;

    // .done();
    var dats = {
      name: name,
      email: email,
      pno: pno,
      linked: linked
    }
    return dats;
  })


// resume.parseToFile('converted')
//   .then(file => {
//     console.log('Yay! ', file);
//   })
//   .catch(error => {
//     console.error(error);
//   });

}

const getLines = (req) => {
  var ename = req.file.filename;
  resume = new ResumeParser("./resumes/" + ename);
  return mammoth.convertToHtml({path: "./resumes/" + ename})
  .then(function(result){
      var html = result.value; // The generated HTML
      var lines = html.split(/<p>|<li>/).length;
      console.log(lines)
      var messages = result.messages; // Any messages, such as warnings during conversion
      return lines;
  })
}

const getChars = (req) => {
  var ename = req.file.filename;
  resume = new ResumeParser("./resumes/" + ename);
  return mammoth.extractRawText({path: "./resumes/" + ename})
  .then(function(result){
      var text = result.value; // The raw text
      var textlines=text.split(/\r\n|\r|\n/).length;
      var chars=text.length-2*textlines;
      console.log(chars)
      return chars;
  })
}

exports.parseDoc = parseDoc;
exports.getLines = getLines;
exports.getChars = getChars;
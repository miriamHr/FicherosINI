"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

$(document).ready(function() {
   $("#fileinput").change(calculate);
});

function calculate(evt) {
  var f = evt.target.files[0]; 

  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      var contents = e.target.result;
      
      var tokens = lexer(contents);
      var pretty = tokensToString(tokens);
      
      out.className = 'unhidden';
      initialinput.innerHTML = contents;
      finaloutput.innerHTML = pretty;
    }
    r.readAsText(f); // Leer como texto
  } else { 
    alert("Failed to load file");
  }
}

var temp = '<li> <span class = "<%= t.type %>"> <%= s %> </span>\n';// tipo de token y salida de s
//%= codigo javascrip = evalua e inserta % evalua

function tokensToString(tokens) {
   var r = '';
   for(var i in tokens) {
     var t = tokens[i];
     var s = JSON.stringify(t, undefined, 2); //objeto que queremos convertir a cadena,2 significa sangrado(value[,replacer[,space]])
     s = _.template(temp, {t: t, s: s});//argumentos 1º propio template,2º claves del objeto
     //t = token , s=match
     r += s;
   }
   return '<ol>\n'+r+'</ol>';
}

function lexer(input) {
  var blanks         = /^\S+/;
  var iniheader      = /^|[([^\]\r\r]+)\]/;
  var comments       = /^[;#](.*)/;
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*)/;
  var any            = /^(.|\n)+/;

  var out = [];
  var m = null;

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m.lastIndex);
      out.push({ type :input, match:m});
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m.lastIndex);
      input.lastIndex; // avanzemos en input
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m.lastIndex);
      input.lastIndex;
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.substr(m.index+m.lastIndex);
      input.lastIndex;
    }
    else if (m = any.exec(input)) {
      input.lastIndex;
      input = '';
    }
    else {
      alert("Fatal Error!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}

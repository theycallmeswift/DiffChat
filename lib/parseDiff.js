var express = require('express');

function strip(text) {
  return text.replace(/^\s+|\s+$/g, '');
}

parseDiff = function(source) {
  // separate file by line
  source = source.split('\n'); 
  var data = [];
  var file = ''; // keeps track of current file
  var oldFileLine; // keep track of line #s within file
  var newFileLine; 
  var deleted = false

  try {
    // parse each line and add to its file's list
    for (var i = 1; i <= source.length; i++) {
      last = data.length - 1;
      line = strip(source[i - 1]);

      // first line of new file
      if (/^diff \-\-git/.test(line)) {
        d = {
          file: '',
          type: 'head',
          text: line, 
          diffLine: i,
          oldFileLine: 0,
          newFileLine: 0
        };
        // create a new list for the file
        data.push([d]);

      // header lines for file
      } else if (/^new file/.test(line) || 
                 /^deleted file/.test(line) || 
                 /^index [\dabcdef]+\.\.[\dabcdef]+/.test(line) || 
                 /^\-\-\- /.test(line)) {
        d = {
          file: '',
          type: 'head',
          text: line, 
          diffLine: i,
          oldFileLine: 0,
          newFileLine: 0
        };
        // hack for deleted files
        if (/^deleted file/.test(line)) {
          deleted = true;
        // record the filenames from the --- line for deleted files
        } else if (deleted && /^\-\-\- /.test(line)) {
          file = line.replace(/\-\-\- /, '');
          d.file = file
          // update other headers with file name
          for (var j = 0; j < data[last].length; j++) {
            data[last][j].file = file;
          }
        }
        data[last].push(d);

      // header line that contains new file name
      } else if (/^\+\+\+ /.test(line)) {
        file = line.replace(/\+\+\+ /, '');
        d = {
          file: file,
          type: 'head',
          text: line, 
          diffLine: i,
          oldFileLine: 0,
          newFileLine: 0
        };
        // update other headers with file name if not a deleted file
        if (deleted == false) {
          for (var j = 0; j < data[last].length; j++) {
            data[last][j].file = file;
          }
        } else {
          deleted = false;
        }
        data[last].push(d);

      // line that indicates starting line # within file
      } else if (/^\@\@/.test(line)) {
        oldFileLine = newFileLine = parseInt(line.match(/\d+/g)[2]) - 1;
        d = {
          file: file,
          type: 'head',
          text: line, 
          diffLine: i,
          oldFileLine: '..',
          newFileLine: '..'
        };
        data[last].push(d);

      // added line
      } else if (/^\+/.test(line)) {
        newFileLine += 1; // new line in new file
        d = {
          file: file,
          type: 'add',
          text: line.replace(/^\+/, ''), 
          diffLine: i,
          oldFileLine: '',
          newFileLine: newFileLine
        };
        data[last].push(d);

      // removed line
      } else if (/^\-/.test(line)) {
        oldFileLine += 1; // new line in old file
        d = {
          file: file,
          type: 'rem',
          text: line.replace(/^\-/, ''), 
          diffLine: i,
          oldFileLine: oldFileLine,
          newFileLine: ''
        };
        data[last].push(d);

      // unchanged line
      } else {
        oldFileLine += 1; // new line in both files
        newFileLine += 1;
        d = {
          file: file,
          type: 'unch',
          text: line, 
          diffLine: i,
          oldFileLine: oldFileLine,
          newFileLine: newFileLine
        };

        data[last].push(d);
      }
    }
    return data;
  } catch (err) {
    return new Error("Encountered a problem while parsing the diff file: " + err);
  }
}

module.exports = function(url, callback) {
  var http;
  var parsed = require('url').parse(url);
  var protocol = parsed.protocol;
  if (/^https/.test(protocol)) {
    http = require('https');
  } else {
    http = require('http');
  }

  var options = {
    host: parsed.hostname,
    path: parsed.pathname,
    protocol: 'GET'
  };
  var data = '';

  var req = http.request(options, function(res) {
    res.on('data', function(d) {
      data += d;
    });
    res.on('end', function() {
      data = parseDiff(data);
      callback(null, data);
    });
  });
  req.on('error', function(e) {
    callback(new Error("Could not get repo's list"));
  });

  req.end()
}

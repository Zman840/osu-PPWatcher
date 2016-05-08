var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var moment = require('moment');
var watch = require('watch');
var config = require('./config.json');
var osrDirectory = config.osrDir;
var SCDir = config.osuStreamDir;
var ScoreVersion = config.scoreVersion;
var start = '';
var end = '';
var currentosu = '';

/**
 * Use the console to output response file
 * @param  {string} cmd        'command name'
 * @param  {array } args       'Array of Arguments'
 * @param  {function} callBack 'execute function afterwards'
 * @return {null  }            'nothing'
 */
var run_cmd = function run_cmd(cmd, args, callBack) { // eslint-disable-line camelcase
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = '';

  args.forEach((element, index) => {
    var replacement = element.replace(/\\/g, '\\\\');

    args[index] = replacement;
  });

  child.stdout.on('data', (buffer) => {
    resp += buffer.toString();
  });
  child.stdout.on('end', () => {
    callBack(resp);
  });
};

// Use sync to keep order
var getMRFN = function getMRFN(dir) {
  var files = fs.readdirSync(dir); // eslint-disable-line no-sync

  return _.max(files, (f) => {
    var fullpath = '';

    if (f.match(/.osr$/)) {
      fullpath = path.join(dir, f);
      // ctime = creation time is used
      // replace with mtime for modification time

      return fs.statSync(fullpath).ctime; // eslint-disable-line no-sync
    }

    return new Error('no files found');
  });
};

var pythonResponse = (text, song) => {
  var lines = text.split('\n');
  var accuracy = lines[1].match(/.*: (.*)/)[1];
  var mods = lines[2].match(/.*: (.*)/)[1];
  var total = lines[3].match(/.*: (.*)/)[1];
  var misses = lines[4].match(/.*: (.*)/)[1];
  var osuFile = song;
  var breaktest = 0;
  var argArray = [];

  console.log('executed python script');
  console.log(song);
  while (osuFile.match(/\\\\/g)) {
    osuFile = `${osuFile.replace(/\\\\/g, '/')}`;
    breaktest++;
    if (breaktest > 5) {
      break;
    }
  }

  argArray = [osuFile, accuracy, mods, total, ScoreVersion];

  console.log('\n\nrunning ppcalc using file:');
  console.log(osuFile);
  run_cmd('oppai', argArray, (ppResponse) => {
    var pp = ppResponse.match(/([0-9]{1,4}.[0-9]{2}pp)/gm);
    var songName = '';
    var ppInfo = '';

    console.log(`\nCommand Info\n----------\noppai\n${argArray.join('\n')}\n----------`);
    console.log('executed oppai');
    console.log(`----------\n${ppResponse}\n--------\n`);
    console.log(pp[0]);

    fs.readFile(`${SCDir}\\Song.txt`, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      songName = data;
      ppInfo = `Song: ${songName}\n${pp}`;
      fs.writeFile('pp.txt', ppInfo, (err2) => {
        if (err2) {
          throw err2;
        }
      });
    });


    fs.writeFile('ReplayInfo.txt', argArray.join('\n'), (err) => {
      if (err) {
        throw err;
      }
    });

    end = moment();
    console.log(`${end.diff(start)} milliseconds\n--------\n`);
    if (pp) {
      return pp;
    }

    return console.log('pp not found');
  });
};

var executeFile = (song) => {
  var recent = getMRFN(osrDirectory);

  console.log(recent);
  run_cmd('py', [`${__dirname}\\parseRecentReplay.py`, `${osrDirectory}\\${recent}`], (text) => {
    pythonResponse(text, song);
  });
};


var checkSameFile = (a, b) => {
  if (a !== b && b.match(/.osr$/)) {
    return false;
  }

  return true;
};

fs.watchFile(`${SCDir}\\filepath.txt`, () => {
  fs.readFile(`${SCDir}\\filepath.txt`, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    if (currentosu !== data && data !== '') {
      // console.log(data);
      // console.log(`${currentosu}\n`);
      currentosu = data;
    }
  });
});

watch.createMonitor(osrDirectory, (monitor) => {
  var currentFile = '';

  monitor.on('created', (f) => {
    // Handle new files
    start = moment();
    if (!checkSameFile(currentFile, f)) {
      console.log('a new .osr has been added');
      currentFile = f;
      executeFile(currentosu);
    }
  });
});
console.log('starting osu file watches');

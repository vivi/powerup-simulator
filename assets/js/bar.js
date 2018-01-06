const TOTAL_TIME = 150; // seconds
const RED = "#ff0000";
const BLUE = "#0000ff";
const NEUTRAL = "#333";

var blueHangs = 0;
var redHangs = 0;
var blueForce = 0;
var blueLev = 0;
var blueBoost = 0;
var redForce = 0;
var redLev = 0;
var redBoost = 0;

function Shape(x, y, w, h, fill) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
}

function Second() {
  this.blueScaleForce = 0;
  this.redScaleForce = 0;
  this.blueSwitchForce = 0;
  this.redSwitchForce = 0;
  this.redScaleBoost = 0;
  this.blueScaleBoost = 0;
  this.redSwitchBoost = 0;
  this.blueSwitchBoost = 0;

  this.blueScale = 0;
  this.redScale = 0;
  this.redRedSwitch = 0;
  this.blueRedSwitch = 0;
  this.redBlueSwitch = 0;
  this.blueBlueSwitch = 0;
}


// get canvas element.
var scaleBar = document.getElementById('scale-bar');
var redSwitchBar = document.getElementById('red-switch-bar');
var blueSwitchBar = document.getElementById('blue-switch-bar');

// check if context exist
var scaleBars = [];
var redSwitchBars = [];
var blueSwitchBars = [];
var seconds = [];

function initialize() {
  var s = 3;
  for (var i=0; i < TOTAL_TIME; i++) {
    seconds.push(new Second());
    scaleBars.push(new Shape(i * s, 0, s, s, "#333"));
    redSwitchBars.push(new Shape(i, 0, 1, 2, "#333"));
    blueSwitchBars.push(new Shape(i, 0, 1, 2, "#333"));
  }

  redrawBars();
}

function calculateBars() {
  for (var i=0; i < TOTAL_TIME; i++) {
    var cur = seconds[i];
    if (i == 0) {
      updateSecondBlock(cur, i);
      continue;
    }
    var prev = seconds[i-1];
    cur.blueScale = Math.max(prev.blueScale, cur.blueScale);
    cur.redScale = Math.max(prev.redScale, cur.redScale);
    cur.redRedSwitch = Math.max(prev.redRedSwitch, cur.redRedSwitch);
    cur.blueRedSwitch = Math.max(prev.blueRedSwitch, cur.blueRedSwitch);
    cur.redBlueSwitch = Math.max(prev.redBlueSwitch, cur.redBlueSwitch);
    cur.blueBlueSwitch = Math.max(prev.blueBlueSwitch, cur.blueBlueSwitch);
    updateSecondBlock(cur, i);
  }
}

function updateSecondBlock(sec, i) {
  if (sec.blueScaleForce || (!sec.redScaleForce && sec.blueScale > sec.redScale)) {
    scaleBars[i].fill = BLUE;
  }
  if (sec.redScaleForce || (!sec.blueScaleForce && sec.blueScale < sec.redScale)) {
    scaleBars[i].fill = RED;
  }
  if (!sec.redScaleForce && !sec.blueScaleForce && sec.blueScale == sec.redScale) {
    scaleBars[i].fill = NEUTRAL;
  }

  if (sec.blueSwitchForce || sec.blueBlueSwitch > sec.redBlueSwitch) {
    blueSwitchBars[i].fill = BLUE;
  } else if (sec.blueBlueSwitch < sec.redBlueSwitch) {
    blueSwitchBars[i].fill = RED;
  } else {
    blueSwitchBars[i].fill = NEUTRAL;
  }

  if (sec.blueRedSwitch > sec.redRedSwitch) {
    redSwitchBars[i].fill = BLUE;
  } else if (sec.redSwitchForce || sec.blueRedSwitch < sec.redRedSwitch) {
    redSwitchBars[i].fill = RED;
  } else {
    redSwitchBars[i].fill = NEUTRAL;
  }
}

function updateScore() {
  var blueAuto = 0;
  var blueTeleop = 0;
  var redAuto = 0;
  var redTeleop = 0;

  var scalePrev = null;
  var rSwitchPrev = null;
  var bSwitchPrev = null;
  for (var i=0; i < 15; i++) {
    var scale = scaleBars[i];
    if (scale.fill == RED) {
      if (RED != scalePrev) {
        redAuto += 2;
      }
      redAuto += 2;
    } else if (scale.fill == BLUE) {
      if (BLUE != scalePrev) {
        blueAuto += 2;
      }
      blueAuto += 2;
    }
    scalePrev = scale.fill;

    // Switches
    var r = redSwitchBars[i];
    if (r.fill == RED) {
      if (RED != rSwitchPrev) {
        redAuto += 2;
      }
      redAuto += 2;
    }
    rSwitchPrev = r;

    var b = blueSwitchBars[i];
    if (b.fill == BLUE) {
      if (BLUE != bSwitchPrev) {
        blueAuto += 2;
      }
      blueAuto += 2;
    }
    bSwitchPrev = b;
  }

  $("#score-blue-auto").text(blueAuto);
  $("#score-red-auto").text(redAuto);

  for (var i=15; i < TOTAL_TIME; i++) {
    var scale = scaleBars[i];
    if (scale.fill == RED) {
      if (RED != scalePrev) {
        redTeleop += 1 + seconds[i].redScaleBoost;
      }
      redTeleop += 1 + seconds[i].redScaleBoost;
    } else if (scale.fill == BLUE) {
      if (BLUE != scalePrev) {
        blueTeleop += 1 + seconds[i].blueScaleBoost;
      }
      blueTeleop += 1 + seconds[i].blueScaleBoost;
    }
    scalePrev = scale.fill;

    // Switches
    var r = redSwitchBars[i];
    if (r.fill == RED) {
      if (RED != rSwitchPrev) {
        redTeleop += 1 + seconds[i].redSwitchBoost;
      }
      redTeleop += 1 + seconds[i].redSwitchBoost;
    }
    rSwitchPrev = r;

    var b = blueSwitchBars[i];
    if (b.fill == BLUE) {
      if (BLUE != bSwitchPrev) {
        blueTeleop += 1 + seconds[i].blueSwitchBoost;
      }
      blueTeleop += 1 + seconds[i].blueSwitchBoost;
    }
    bSwitchPrev = b;
  }

  blueTeleop += blueHangs * 30;
  redTeleop += redHangs * 30;
  $("#score-blue-teleop").text(blueTeleop);
  $("#score-red-teleop").text(redTeleop);
}

function redrawBars() {
  scaleBarContext = scaleBar.getContext('2d');
  redSwitchBarContext = redSwitchBar.getContext('2d');
  blueSwitchBarContext = blueSwitchBar.getContext('2d');

  for (var i=0; i< TOTAL_TIME; i++) {
      oRec = scaleBars[i];
      scaleBarContext.fillStyle = oRec.fill;
      scaleBarContext.fillRect(oRec.x, oRec.y, oRec.w, oRec.h);

      oRec = redSwitchBars[i];
      redSwitchBarContext.fillStyle = oRec.fill;
      redSwitchBarContext.fillRect(oRec.x, oRec.y, oRec.w, oRec.h);

      oRec = blueSwitchBars[i];
      blueSwitchBarContext.fillStyle = oRec.fill;
      blueSwitchBarContext.fillRect(oRec.x, oRec.y, oRec.w, oRec.h);
  }
}

function getTime() {
  return parseInt($("#time").val());
}

$(".blue-scale").click(function() {
  var ud = seconds[getTime()].blueScale++;
  $("#scale-blue").text(seconds[getTime()].blueScale);
  calculateBars();
  redrawBars();
});

$(".red-scale").click(function() {
  seconds[getTime()].redScale++;
  $("#scale-red").text(seconds[getTime()].redScale);
  calculateBars();
  redrawBars();
});


$(".blue-blue-switch").click(function() {
  seconds[getTime()].blueBlueSwitch++;
  $("#switch-blue-blue").text(seconds[getTime()].blueBlueSwitch);
  calculateBars();
  redrawBars();
});

$(".blue-red-switch").click(function() {
  seconds[getTime()].blueRedSwitch++;
  $("#switch-blue-red").text(seconds[getTime()].blueRedSwitch);
  calculateBars();
  redrawBars();
});

$(".red-blue-switch").click(function() {
  seconds[getTime()].redBlueSwitch++;
  $("#switch-red-blue").text(seconds[getTime()].redBlueSwitch);
  calculateBars();
  redrawBars();
});

$(".red-red-switch").click(function() {
  seconds[getTime()].redRedSwitch++;
  $("#switch-red-red").text(seconds[getTime()].redRedSwitch);
  calculateBars();
  redrawBars();
});

$(".blk-blue-force").click(function() {
  blueForce++;
  $(".blue-force").text(blueForce);
});

$(".blk-blue-lev").click(function() {
  blueLev++;
  $(".blue-lev").text(blueLev);
});

$(".blk-red-boost").click(function() {
  redBoost++;
  $(".red-boost").text(redBoost);
});

$(".blk-red-force").click(function() {
  redForce++;
  $(".red-force").text(redForce);
});

$(".blk-red-lev").click(function() {
  redLev++;
  $(".red-lev").text(redLev);
});

$(".blk-blue-boost").click(function() {
  blueBoost++;
  $(".blue-boost").text(blueBoost);
});


$(".use-blue-boost").click(function() {
  var time = getTime();
  if (blueBoost == 1) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].blueSwitchBoost = 1;
    }
  }
  if (blueBoost == 2) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].blueScaleBoost = 1;
    }
  }

  if (blueBoost == 3) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].blueSwitchBoost = 1;
      seconds[time+i].blueScaleBoost = 1;
    }
  }
});

$(".use-blue-force").click(function() {
  var time = getTime();
  if (blueForce == 1) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].blueSwitchForce = 1;
    }
  }
  if (blueForce == 2) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].blueScaleForce = 1;
    }
  }

  if (blueForce == 3) {
    for (var i = 0; i < 10; i++) {
      console.log(time+i);
      seconds[time+i].blueSwitchForce = 1;
      seconds[time+i].blueScaleForce = 1;
    }
  }
  calculateBars();
  redrawBars();
});

$(".use-blue-lev").click(function() {
  if (blueBoost == 3) {
    blueHangs++;
  }
});

$(".use-red-boost").click(function() {
  var time = getTime();
  if (redBoost == 1) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].redSwitchBoost = 1;
    }
  }
  if (redBoost == 2) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].redScaleBoost = 1;
    }
  }

  if (redBoost == 3) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].redSwitchBoost = 1;
      seconds[time+i].redScaleBoost = 1;
    }
  }
});

$(".use-red-force").click(function() {
  var time = getTime();
  if (redForce == 1) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].redSwitchForce = 1;
    }
  }
  if (redForce == 2) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].redScaleForce = 1;
    }
  }

  if (redForce == 3) {
    for (var i = 0; i < 10; i++) {
      seconds[time+i].redSwitchForce = 1;
      seconds[time+i].redScaleForce = 1;
    }
  }
  calculateBars();
  redrawBars();
});

$(".use-red-lev").click(function() {
  if (redBoost == 3) {
    redHangs++;
  }
});

$("#update-score").click(function() {
  updateScore();
});


function hang(prob, isblue) {
  if (Math.random() <= prob) {
    if(isblue) {
      blueHangs++;
      $("#blue-hang").text(blueHangs);
      $("#blue-hang-result").text("Success");
    } else {
      redHangs++;
      $("#red-hang").text(redHangs);
      $("#red-hang-result").text("Success");
    }
  } else {
    if(isblue) {
      $("#blue-hang-result").text("Fail");
    } else {
      $("#red-hang-result").text("Fail");
    }
  }
}

function drive(fps) {
  $("#dist-time").text(parseInt($("#dist").val()) / fps);
}

initialize();

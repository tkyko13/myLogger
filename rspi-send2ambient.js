const fs = require("fs");
try {
  const config = JSON.parse(fs.readFileSync("config.json"));
} catch (e) {
  console.log("Not found 'config.json'");
  console.log("If you have not created a file please create 'config.json'");
}

//毎時00分に実行
const { CronJob } = require("cron");
new CronJob("0 0 * * * *", sendCpuTemp(), null, true);

// cpu info
function sendCpuTemp() {
  const exec = require("child_process").exec;
  exec("cat /sys/class/thermal/thermal_zone0/temp", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
    let temp = stdout / 1000;
    //console.log(temp);

    sendAmbient({ d1: temp });
  });
}

// ambient
function sendAmbient(data) {
  var ambient = require("ambient-lib");

  ambient.connect(config.AMBIENT_CHANNEL_ID, config.AMBIENT_WRITE_KEY);
  ambient.send(data, function(err, res, body) {
    if (err) {
      console.log("Ambint error -----");
      console.log(err);
    }
    //console.log(res.statusCode);
  });
}

var fs = require('fs')
var stopInfo = JSON.parse(fs.readFileSync('D:\\Luyu\\congestion_detector\\GTFS_sorted\\stops_sorted.json', 'utf8')) //stops


function getDistance(a, b, c, d, x, y) {
    var dis1 = Math.sqrt((a - x) * (a - x) + (b - y) * (b - y))
    var dis2 = Math.sqrt((c - x) * (c - x) + (d - y) * (d - y))
    var dis3 = Math.abs(((d - b) * x + (a - c) * y + b * c - a * d) / Math.sqrt((b - d) * (b - d) + (a - c) * (a - c)))
    //console.log(dis1,dis2,dis3)
    return Math.max(dis1, dis2, dis3)
}


function parseWaze(timestamp) {
    var delayLabel = {}
    var stopTimeSchedule = JSON.parse(fs.readFileSync('D:\\Luyu\\data\\roadnotifications\\rn' + timestamp + '.json', 'utf8')) //stop time schedules
    for (var i in stopInfo) {
        delayLabel[stopInfo[i].stop_id] = {}
        delayLabel[stopInfo[i].stop_id]["severity"] = 0
        delayLabel[stopInfo[i].stop_id]["flag"] = false
        delayLabel[stopInfo[i].stop_id]["distance"] = 10
        delayLabel[stopInfo[i].stop_id]["location"] = [stopInfo[i].stop_lat, stopInfo[i].stop_lon]
    }
    var jams = stopTimeSchedule.jams;
    for (var i in jams) {
        for (var j in stopInfo) {
            var dis = getDistance(jams[i].startLatitude, jams[i].startLongitude, jams[i].endLatitude, jams[i].endLongitude, stopInfo[j].stop_lat, stopInfo[j].stop_lon)
            if (dis < 0.001388 && dis < delayLabel[stopInfo[j].stop_id]["distance"]) {
                delayLabel[stopInfo[j].stop_id]["severity"] = jams[i].severity
                delayLabel[stopInfo[j].stop_id]["flag"] = true
                delayLabel[stopInfo[j].stop_id]["distance"] = dis
            }
        }

    }
    fs.writeFileSync('D:\\Luyu\\data\\roadnotificationslabel\\label_' + timestamp + '.json', JSON.stringify(delayLabel))
}

parseWaze(1511118600);
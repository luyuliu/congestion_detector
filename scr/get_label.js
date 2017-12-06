var fs = require('fs')
var csvWriter = require('csv-write-stream')
var stopInfo = JSON.parse(fs.readFileSync('D:\\Luyu\\congestion_detector\\GTFS_sorted\\stops_sorted.json', 'utf8')) //stops
const ratio = 144092.219;
const normalization = 200;
const buffer = 0.001388

function getDistance(a, b, c, d, x, y) {
    var dis1 = Math.sqrt((a - x) * (a - x) + (b - y) * (b - y))
    var dis2 = Math.sqrt((c - x) * (c - x) + (d - y) * (d - y))
    var dis3 = Math.abs(((d - b) * x + (a - c) * y + b * c - a * d) / Math.sqrt((b - d) * (b - d) + (a - c) * (a - c)))
    //console.log(dis1,dis2,dis3)
    return Math.max(dis1, dis2, dis3)
}

function justification(severity, distance) {
    var label_value = (severity + 1) * (buffer - distance) * ratio / normalization
    return label_value
}

function parseWaze(timestamp) {
    var label_list = []
    var delayLabel = []
    var stopTimeSchedule = JSON.parse(fs.readFileSync('D:\\Luyu\\data\\roadnotifications\\rn' + timestamp + '.json', 'utf8')) //stop time schedules
    for (var i in stopInfo) {
        delayLabel[stopInfo[i].stop_id] = {}
        delayLabel[stopInfo[i].stop_id]["severity"] = 0
        delayLabel[stopInfo[i].stop_id]["stop_code"] = stopInfo[i].stop_code
        delayLabel[stopInfo[i].stop_id]["flag"] = false
        delayLabel[stopInfo[i].stop_id]["distance"] = 10
        delayLabel[stopInfo[i].stop_id]["location"] = [stopInfo[i].stop_lat, stopInfo[i].stop_lon]
    }

    var jams = stopTimeSchedule.jams;
    for (var i in jams) {
        for (var j in stopInfo) {
            var dis = getDistance(jams[i].startLatitude, jams[i].startLongitude, jams[i].endLatitude, jams[i].endLongitude, stopInfo[j].stop_lat, stopInfo[j].stop_lon)
            console.log(dis)
            if (dis < buffer && dis < delayLabel[stopInfo[j].stop_id]["distance"]) { //0.001388=200m
                delayLabel[stopInfo[j].stop_id]["severity"] = jams[i].severity
                delayLabel[stopInfo[j].stop_id]["flag"] = true
                delayLabel[stopInfo[j].stop_id]["distance"] = dis
                delayLabel[stopInfo[j].stop_id]["label_value"] = justification(jams[i].severity, dis)
                //console.log(j)
            }
        }

    }

    delayLabel.sort(function (a, b) {
        var textA = a.stop_code;
        var textB = b.stop_code;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
    

    for (var i in delayLabel) {
        if (delayLabel[i].label_value == undefined) {
            delayLabel[i].label_value = 0
        }
        label_list.push(delayLabel[i].label_value)
    }
    //console.log(label_list)
    /*var writer = csvWriter({
        separator: ',',
        newline: '\n',
        headers: ['label'],
        sendHeaders: true
    })

    writer.pipe(fs.createWriteStream('D:/Luyu/data/labelcsv/label_' + timestamp + '.csv'))
    for (var i in label_list) {
        writer.write([label_list[i]])
    }
    writer.end()*/


    //fs.writeFileSync('D:\\Luyu\\data\\labeljson\\label_' + timestamp + '.json', JSON.stringify(delayLabel))
}


var a = new Array()
var end=1512074040;
var start=1511984220;

timestamp = start;
/*for (var i = 0; i < (end-start)/60; i++) {
    a.push(i)
}*/
a=[0,1,2,3,4,5,6,7]
a.forEach(function (item) {
    try {
        parseWaze(timestamp)
        //console.log(item)
        timestamp += 60
    } catch (err) {
        timestamp += 60
    }
})
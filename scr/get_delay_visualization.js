//exlusive for no.001
var fs = require('fs')
var csvWriter = require('csv-write-stream')

var cota = require('./cota_data_collector.js')
var waze = require('./waze_data_collector.js')

var stopTimeSchedule = JSON.parse(fs.readFileSync('D:\\Luyu\\congestion_detector\\GTFS_sorted\\stop_times_aggregated.json', 'utf8')) //stop time schedules
var stopInfo = JSON.parse(fs.readFileSync('D:\\Luyu\\congestion_detector\\GTFS_sorted\\stops_sorted.json', 'utf8')) //stops

function getSeconds(astring) { //parse the time in the stop_time schedule, return pure seconds from the start of the day
    if (typeof (astring) == 'string') {
        var timeElements = astring.split(":")
        var seconds = parseInt(timeElements[0]) * 60 * 60 + parseInt(timeElements[1]) * 60 + parseInt(timeElements[2])
        return seconds
    } else {
        return astring.getHours() * 60 * 60 + astring.getMinutes() * 60 + astring.getSeconds()
    }
}

function parseDelay(timestamp) {
    var tripFeed = JSON.parse(fs.readFileSync('D:\\Luyu\\data\\tripfeed\\tripfeed_' + timestamp + '.json', 'utf8')) //trip feed
    var tripFeedSorted = []
    var delay = []
    var delay_list = []
    var real_list = []
    var schedule_list = []
    var id=[]

    for (var i in stopInfo) {
        delay[stopInfo[i].stop_id] = {}
        delay[stopInfo[i].stop_id]["delay_value_raw"] = 0
        delay[stopInfo[i].stop_id]["stop_code"] = stopInfo[i].stop_code
        delay[stopInfo[i].stop_id]["flag"] = false
        delay[stopInfo[i].stop_id]["location"] = [stopInfo[i].stop_lat, stopInfo[i].stop_lon]
        delay[stopInfo[i].stop_id]["delay_value"] = 0
        delay[stopInfo[i].stop_id]["real_time"] = 0
        delay[stopInfo[i].stop_id]["scheduled_time"] = 0
        delay[stopInfo[i].stop_id]["stop_id"] = stopInfo[i].stop_id
    }

    for (var i in tripFeed.features) {
        if (tripFeed.features[i].trip_update.trip.route_id == '001') { //do something
            for (var j in tripFeed.features[i].trip_update.stop_time_update) {
                var currentStopId = tripFeed.features[i].trip_update.stop_time_update[j].stop_id
                var currentTripId = tripFeed.features[i].id
                var stopSequence = tripFeed.features[i].trip_update.stop_time_update[j].stop_sequence - 1 //the sequence of the current stop, minus one to snyc with the stopTimeSchedule
                var realTime = getSeconds(new Date(tripFeed.features[i].trip_update.stop_time_update[j].arrival.time.low * 1000))
                var scheduledTime = getSeconds(stopTimeSchedule[currentTripId][stopSequence].arrival_time)
                delay[currentStopId].delay_value_raw = realTime - scheduledTime
                delay[currentStopId].flag = true
                delay[currentStopId].delay_value = (realTime - scheduledTime) / 60
                delay[currentStopId].real_time = realTime
                delay[currentStopId].scheduled_time = scheduledTime

            }
        }
    }

    delay.sort(function (a, b) {
        var textA = a.stop_code;
        var textB = b.stop_code;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })

    //var a=0;
    for (var i in delay) {
        delay_list.push(delay[i].delay_value)
        real_list.push(delay[i].real_time)
        schedule_list.push(delay[i].scheduled_time)
        id.push(delay[i].stop_id)
        //a++
        //console.log(delay[i].delay_value, delay[i].stop_code,a)
    }

    var writer = csvWriter({
        separator: ',',
        newline: '\n',
        headers: ['id','delay','real',"schedule"],
        sendHeaders: true
    })

    writer.pipe(fs.createWriteStream('D:/Luyu/data/delay_' + timestamp + '.csv'))
    for (var i in delay_list) {
        if (delay_list[i] < 0) {
            writer.write([id[i],'0', real_list[i], schedule_list[i]])
            continue;
        }
        writer.write([id[i],delay_list[i], real_list[i], schedule_list[i]])
    }
    writer.end()

    //fs.writeFileSync('D:\\Luyu\\data\\tripfeeddelay\\delay_' + timestamp + '.json', JSON.stringify(delay))
}


//main_batch();
//var interval= setInterval(main_batch, 60000);
//parseDelay(1511118600)
//cota.collectTripFeed()


/*for (var i = 0; i < 32 * 5; i++) {
    parseDelay(timestamp)
    console.log(timestamp)
    timestamp += 60

}*/
/*
for (var i = 0; i < 32 * 5; i++) {　　
    (function (i) {
        parseDelay(timestamp)
        console.log(timestamp)
        timestamp += 60
    })(i);
}*/

timestamp = 1511118600
parseDelay(timestamp)
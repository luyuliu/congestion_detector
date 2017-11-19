//exlusive for no.001
var fs = require('fs')


var cota=require('./cota_data_collector.js')
var waze=require('./waze_data_collector.js')

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
    var delay = {}

    for (var i in stopInfo) {
        delay[stopInfo[i].stop_id] = {}
        delay[stopInfo[i].stop_id]["delay_value"] = 0
        delay[stopInfo[i].stop_id]["flag"] = false
        delay[stopInfo[i].stop_id]["location"] = [stopInfo[i].stop_lat, stopInfo[i].stop_lon]
    }

    for (var i in tripFeed.features) {
        if (tripFeed.features[i].trip_update.trip.route_id == '001') { //do something
            for (var j in tripFeed.features[i].trip_update.stop_time_update) {
                var currentStopId = tripFeed.features[i].trip_update.stop_time_update[j].stop_id
                var currentTripId = tripFeed.features[i].id
                var stopSequence = tripFeed.features[i].trip_update.stop_time_update[j].stop_sequence - 1 //the sequence of the current stop, minus one to snyc with the stopTimeSchedule
                var realTime = getSeconds(new Date(tripFeed.features[i].trip_update.stop_time_update[j].arrival.time.low * 1000))
                var scheduledTime = getSeconds(stopTimeSchedule[currentTripId][stopSequence].arrival_time)
                delay[currentStopId].delay_value = realTime - scheduledTime
                delay[currentStopId].flag = true

            }

        }
    }

    fs.writeFileSync('D:\\Luyu\\data\\tripfeeddelay\\delay_' + timestamp + '.json', JSON.stringify(delay))
}

function main_batch(){
    var now=cota.collectTripFeed()
    
    parseDelay(now)
}

//main_batch();
//var interval= setInterval(main_batch, 60000);
parseDelay(1511118600)
//cota.collectTripFeed()
var fs = require('fs')
var st = JSON.parse(fs.readFileSync('D:\\Luyu\\COTA\\GTFS_sorted\\stop_times_sorted.json', 'utf8'))
target = '604997'

sort_lists = {}
var sort_list=new Array()
for (var i in st) {
    if (st[i].trip_id != target) {
        sort_lists[target]=sort_list
        if(target=='604998'){
            console.log(sort_lists)
        }
        sort_list=new Array()
        target=st[i].trip_id
    }
    sort_list.push(st[i])
    
}
sort_lists[target]=sort_list

fs.writeFileSync('D:\\Luyu\\COTA\\GTFS_sorted\\stop_times_aggregated.json',JSON.stringify(sort_lists))


/*
fs.readFile('D:\\Luyu\\data\\tripfeed\\tripfeed_1508950380.json', 'utf8', function (err, data) {
    var tf_sorted=new Array()
    var tf=JSON.parse(data)
    for (var i in tf.features){
        if(tf.features[i].trip_update.trip.route_id=='001'){//do something
            tf_sorted.push(tf.feature[i])

        }
    }

})//end*/
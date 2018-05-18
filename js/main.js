var myLatLng = { lat: 0, lng: 0 };
var marker, map;
var astros = [];
var $lng = $('.lng');
var $lat = $('.lat');
var $dateCont = $('.date');
var $peopleList = $('.astros');
var $peopleAmount = $('.amount');
var monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Ocb", "Nov", "Dec"];
var daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"];	


function getPosition() {
    getCrd(initMap);
}

function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        zoom: 4,
        center: myLatLng
    });
    marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'ISS now'
    });
}

function updateMarker() {
    marker.setMap(null);
    marker = new google.maps.Marker({
        position: myLatLng,
        map: map
    })
    marker.setMap(map);
}

function getCrd(callback) {
    $.getJSON('http://api.open-notify.org/iss-now.json', function(data) {
        myLatLng.lat = parseFloat(data.iss_position.latitude);
        myLatLng.lng = parseFloat(data.iss_position.longitude);
        if (callback) {
            callback();
        }
        $lat.empty().html(myLatLng.lat);
        $lng.empty().html(myLatLng.lng);

        updateTime();

    });
}

function updateTime() {
    var dateObj = new Date();

    var year = dateObj.getUTCFullYear();
    var month = dateObj.getUTCMonth();
    var numDay = dateObj.getUTCDate();
    var day = dateObj.getUTCDay();
    var hour = dateObj.getUTCHours();
    var minute = dateObj.getUTCMinutes();

    if (minute < 10) minute = "0" + minute;

    var out = '<b>Current UTC time: ' + hour + ':' + minute + '</b><i>' + daysArr[day] + ',' + numDay + ' ' + monthsArr[month] + ' ' + year + '</i>'
    $dateCont.empty().append(out);
}

$(function() {
    $.getJSON('http://api.open-notify.org/astros.json', function(data) {
        var people = data.people;
        for (var i = 0; i < people.length; i++) {
            if (people[i].craft == "ISS") {
                astros.push(people[i].name);
            }
        }
        for (var i = 0; i < astros.length; i++) {
            $peopleList.append('<li><img src="img/noimg.png"><span>' + astros[i] + '</span></li>')
        }

        $peopleAmount.empty().append('Total amount: ' + astros.length + ' people on ISS')



    })
});

setInterval(function() {
    getCrd();
    updateMarker();
}, 5000)
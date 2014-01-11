
var cols = [    tinycolor("rgb(222,82,52)").toHexString(),
                tinycolor("rgb(223,143,58)").toHexString(),
                tinycolor("rgb(221,212,45)").toHexString(),
                tinycolor("rgb(68,181,39)").toHexString(),
                tinycolor("rgb(22,176,202)").toHexString() ];


function processHeader(){
    var str = $('h1').text().trim();
    $('h1').text('');
    for (var i = 0, len = str.length; i < len; i++) {
        (function() {
            var i2 = i;
            $("<span>" + str[i] + "</span>").appendTo('h1').hover(
              function(event) { // mouse in
                $(event.target).animate({color: cols[Math.floor(i2/2)]}, 200);
              },
              function(event) { // mouse out
                $(event.target).animate({color: "#ffffff"}, 200);
              });
        })();
    }


}

function runDiv(d) {
    $(d).children("div.bandBlock").each(function(i,e) {
        if (i < 5) 
            $(e).delay(Math.random() * 1000).animate({opacity: (6-i) / 7  }, 500, function() { $(this).animate({ opacity: 0 },500 )});//, function () { $(this).fadeOut(500) });
    });

}

var nums = [ "zero", "one", "two", "three", "four", "five" ];

$(document).ready(function(){

    processHeader();
    for (var i = 0, len = 5; i < len; i++) {
        var t = '#band' + (i + 1)
        $(t).css("background-color", cols[i]);
        $(t).mouseenter(function() { runDiv(this);} );
        for (var ii = 0; ii < 100; ii++) {
            $("<div />").appendTo(t).addClass(ii == 5 ? "bandRule" : "bandBlock").css("opacity",0);// Math.random() < ii ? 1 : 0);
        }
    }

    $('a').each(function() {
        var r = nums[Math.floor((Math.random()*5)+1)];

        $(this).addClass(r)
    })

    $('.post:before').each(function() {
        $(this).css("background-color: #fffff;")
    
    })


});

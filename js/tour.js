/** Navigation: */

$(document).ready(function () {
    $('#button-begin a').on('click', function () {
        $('#tour-start').hide();
        $('#tour-map').show();
        $('#tour-final').hide();
        resize();
    });

    $('#button-end a').on('click', function () {
        $('#tour-start').hide();
        $('#tour-map').hide();
        $('#tour-final').show();
    });
});

/** Markers and map: */

var defaultSize = 2500.;
var sizes = [
    { windowSize: 1710, bgSize: 2500. },
    { windowSize: 1539, bgSize: 2250. },
    { windowSize: 1385, bgSize: 2025. },
    { windowSize: 1246, bgSize: 1822. },
    { windowSize: 1120, bgSize: 1639. },
    { windowSize: 1008, bgSize: 1475. },
    { windowSize: 907, bgSize: 1327. },
    { windowSize: 816, bgSize: 1194. },
    { windowSize: 734, bgSize: 1074. },
    { windowSize: 660, bgSize: 966. }
];

var markers = null;
var bg = null;

var modal = null;
var image = null;
var modalTitle = null;
var modalText = null;
var modalClose = null;

function resize() {
    var h = parseFloat(bg.clientHeight);
    var w = parseFloat(bg.clientWidth);

    var dw = parseFloat(document.documentElement.clientWidth);

    var sizeIndex = 0;
    while (dw < sizes[sizeIndex].windowSize && sizeIndex < sizes.length - 1)
        ++sizeIndex;

    for (var i = 0; i < markers.length; ++i) {
        var marker = markers[i];

        // Get the markers offset from the original image's center
        var x = parseFloat(marker.getAttribute('data-x'));
        var y = parseFloat(marker.getAttribute('data-y'));

        // Scale positions to current background width
        x = x * (sizes[sizeIndex].bgSize / defaultSize)
        y = y * (sizes[sizeIndex].bgSize / defaultSize)
        // Calculate the real position of the marker
        var posX = w / 2.0 + x;
        var posY = h / 2.0 + y;

        marker.style.left = Math.round(posX) + "px";
        marker.style.top = Math.round(posY) + "px";
    }

}

function onResize() {
    resize();
}

/** Populate map: */

var markerTemplate = '<span id="marker" class="marker {class}" data-x="{x}" data-y="{y}" title="{name}" data-description="{description}" data-image="{image}"></span>';
var mobileSliderInitTemplate = '<section id="slide-first" class="map-panel active">    <div class="map-panel-content">        <span>Your Tour -</span>        <h1 class="{class}-header-f">{title}</h1>        <p class="description-mobile-tour">{description}</p>        <div class="map-panel-bottom">            <div class="left">                Start            </div>            <div class="right">                <a href="#" class="next-slide">                    <img src="/img/arrow-right.png" alt="Start">                </a>            </div>        </div>    </div></section>';
var mobileSliderPoiTemplate = '<section class="poi map-panel map-slider"><div class="map-panel-content">    <div class="map-panel-header">        <div class="paginate prev-slide"><img src="/img/left.png" height="30" width="30"></div>        <img src="{image}" alt="">        <div class="paginate next-slide"><img src="/img/right.png" height="30" width="30"></div>    </div>    <h2 class="{tour-class}-header">{name}</h2>    <p class="description-mobile">{description}</p>    <div class="map-panel-bottom">        <div class="left">            Finish here        </div>        <div class="right">            <a href="#" class="finish-tour">                <img src="/img/arrow-right.png" alt="Finish tour">            </a>        </div>    </div></div></section>';

function init() {
    var dataUrl = (window.location.href.replace('#', '').replace('index.html', '') + '/data.json').replace('//data.json', '/data.json');
    $.get(dataUrl, function (data) {
        $('.tour-point-tourname').html(data.title);
        $('.tour-title').html(data.title);
        $('.tour-title').addClass(data.id + '-header-f');
        $('.tour-description').html(data.description);
        for (var idx = data.markers.length - 1; idx >= 0; --idx) {
            if (!data.markers.hasOwnProperty(idx)) continue;
            var marker = markerTemplate;
            var mobileTemplate = mobileSliderPoiTemplate.replace('{tour-class}', data.id);
            for (var prop in data.markers[idx]) {
                if (!data.markers[idx].hasOwnProperty(prop)) continue;
                marker = marker.replace('{' + prop + '}', data.markers[idx][prop]);
                mobileTemplate = mobileTemplate.replace('{' + prop + '}', data.markers[idx][prop]);
            }
            $('#marker-container').prepend($(marker));
            $('.routes-mobile').prepend($(mobileTemplate));
        }
        $('.map-panel.poi:first').addClass('next');
        $('.routes-mobile').prepend($(mobileSliderInitTemplate.replace('{title}', data.title).replace('{description}', data.description).replace('{class}', data.id)));

        markers = document.getElementsByClassName('marker');
        for (var i = 0; i < markers.length; ++i) {
            var marker = markers[i];

            marker.onclick = function (e) {
                modalTitle.innerText = e.target.getAttribute('title');
                modalDescription.innerText = e.target.getAttribute('data-description');
                image.src = e.target.getAttribute('data-image');
                modalDescription.innerText = e.target.getAttribute('data-description');
                
                $('.right').off('click');
                $('.right').on('click', function(){
                    $(e.target).next().trigger('click');
                });

                $('.left').off('click');
                $('.left').on('click', function(){
                    $(e.target).prev().trigger('click');
                });
                
                $('.details-modal-container').css('display', '-webkit-box');
                $('.details-modal-container').css('display', 'flex');
                $('.details-modal').show();
                hide();
            }

            function hide() {    
                $("#arrow_box").fadeOut(500, function() {
                    $(document).unbind("click");
                    $("#arrow_box").data('shown', false);                
                });        
            }

        }
        resize();
    });
}

$(document).ready(function () {
    init();

    bg = document.getElementById('map-bg');

    modal = document.getElementById('details-modal');

    modalTitle = document.getElementById('marker-details-title');
    modalDescription = document.getElementById('marker-details-description');
    modalClose = document.getElementById('modal-close');
    image = document.getElementById('details-image');
    modalClose.onclick = function () {
        $('.details-modal-container').hide();
        $('.details-modal').hide();
    };
    window.onresize = onResize;
});

/** Facebook share: */

var facebookShare = document.querySelector('[data-js="facebook-share"]');

facebookShare.onclick = function (e) {
    e.preventDefault();
    var facebookWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=https://danurbtours.eu/', 'facebook-popup', 'height=350,width=600');
    if (facebookWindow.focus) { facebookWindow.focus(); }
    return false;
}



/** Mobile tour slider: */

$(document).ready(function() {

    $('.routes-mobile').on('click', '.next-slide', function() {
        var panel = $(this).closest('.map-panel');
        $('.map-panel.prev').removeClass('prev');
        panel.removeClass('active').addClass('prev');
        panel.next().removeClass('next').addClass('active');
        panel.next().next().addClass('next');
        $('.routes-mobile').scrollTop(0);    });

    $('.routes-mobile').on('click', '.prev-slide', function() {
        var panel = $(this).closest('.map-panel');
        $('.map-panel.next').removeClass('next');
        panel.removeClass('active').addClass('next');
        panel.prev().removeClass('prev').addClass('active');
        panel.prev().prev().addClass('prev');
        $('.routes-mobile').scrollTop(0);
    });

    $('.routes-mobile').on('click', '.finish-tour', function() {
        var panel = $(this).closest('.map-panel');
        $('.map-panel.next').removeClass('next');
        $('#slide-last').addClass('next');
        panel.removeClass('active').addClass('prev');
        setTimeout(function() { // HACK: Timeout needed, because the animation would not happen otherwise
            $('.map-panel.next').removeClass('next').addClass('active');
        }, 20);
        $('.routes-mobile').scrollTop(0);
    });


    $('#close').bind("click", ToggleDisplay);
    function ToggleDisplay() {
            hide();
    }
    function hide() {    
        $("#arrow_box").fadeOut(500, function() {
            $(document).unbind("click");
            $("#arrow_box").data('shown', false);                
        });
    }
});

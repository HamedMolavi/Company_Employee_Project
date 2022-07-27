
let animeInterval = setInterval(() => { $('#day-night').toggleClass('anime-day') }, 1500);
$('.nav-item').eq(0).addClass('active');

day = parseInt($('#info').attr('day'));
if (!day) {
    clearInterval(animeInterval);
    adjustDayNight();
    $('#switchDayNightBtn').prop('checked', true);
};



// ---------Responsive-navbar-active-animation-----------
function move() {
    const tabsNewAnim = $('#navbarSupportedContent');
    const activeItemNewAnim = tabsNewAnim.find('.active');
    const activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    const activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    const itemPosNewAnim = activeItemNewAnim.position();
    $(".hori-selector").css({
        "top": itemPosNewAnim.top + "px",
        "left": itemPosNewAnim.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
    });
};





$(document).ready(function () {
    setTimeout(function () { move(); }, 700);
});
$(window).on('resize', function () {
    setTimeout(function () { move(); }, 700);
});
$(".navbar-toggler").click(function () {
    $(".navbar-collapse").slideToggle(300);
    setTimeout(function () { move(); });
});


$("#inpt_search").on('focus', function () {
    $(this).parent('label').addClass('active');
});

$("#inpt_search").on('blur', function () {
    if ($(this).val().length == 0)
        $(this).parent('label').removeClass('active');
});

$("#inpt_search").on('keydown', function (e) {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        !!$('nav .active a').attr('href').match('company')
            ? load('company', 'searchBy=' + $(this).val())
            : !!$('nav .active a').attr('href').match('employee')
                ? load('employee', 'searchBy=' + $(this).val())
                : alert2('No search for this section yet', 'danger');
    };
    if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Escape') {
        $(this).val('');
        this.blur();
    };
});




$('#switchDayNightBtn').change(() => {
    clearInterval(animeInterval);
    day = day ? 0 : 1;
    adjustDayNight();
});


// $('a').hover(function () {
//     // over
//     this.css('color', 'white');
// }, function () {
//     // out
//     this.css('color', '');
// }
// );


// window.onbeforeunload = async function () {
//     await fetch(`/admin/changeDay?username=${username}&day=${day}&ticket=${new URLSearchParams(window.location.search).get('ticket')}`)
//         .then(() => console.log('day changed'));
// };



function adjustDayNight() {
    if (!day) {
        $('#day-night').removeClass('anime-day');
        animeInterval = setInterval(() => { $('#day-night').toggleClass('anime-night') }, 2000);
        $('.bg-light').addClass('bg-dark').removeClass('bg-light');
        $('.bg-glass-light').addClass('bg-glass-dark').removeClass('bg-glass-light');
        $('.bg-white').addClass('bg-black').removeClass('bg-white');
        $('.placeholder-black').addClass('placeholder-white').removeClass('placeholder-black');
        $('.bg-before-white').addClass('bg-before-black').removeClass('bg-before-white');
        return $('.text-dark').addClass('text-light').removeClass('text-dark');
    };
    $('#day-night').removeClass('anime-night');
    animeInterval = setInterval(() => { $('#day-night').toggleClass('anime-day') }, 2000);
    $('.bg-dark').addClass('bg-light').removeClass('bg-dark');
    $('.bg-before-black').addClass('bg-before-white').removeClass('bg-before-black');
    $('.bg-black').addClass('bg-white').removeClass('bg-black');
    $('.bg-glass-dark').addClass('bg-glass-light').removeClass('bg-glass-dark');
    $('.placeholder-white').addClass('placeholder-black').removeClass('placeholder-white');
    return $('.text-light').addClass('text-dark').removeClass('text-light');
}
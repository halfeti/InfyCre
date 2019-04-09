$(document).ready(function() {
    $('#btlogin').click(function () {
        $('#startpage').hide(400);
        $('#main-page').show();
        $('body').css('background-color', '#fff');
    })
});

$('.choose-image-option-item').click(function () {
    $('#choose-image-option').toggle();
});
$('#option-toolbar-button').click(function () {
    $('#choose-image-option').toggle();
});

$('#color').click(function () {
    $('#color-detail').toggle();   
})
$('.color-shadow').click(function () {
    $('#shadow-color-table').toggle();
    $('#highlight-color-table').hide();
});

$('.color-highlight').click(function () {
    $('#shadow-color-table').hide();
    $('#highlight-color-table').toggle();
});

$('.sub-sub-li').click(function (event) {
    //reset State
    if (!$(event.target).is(".color-detail")){
        $('#shadow-color-table').hide();
        $('#highlight-color-table').hide();
    }
});
//$('#crop').click(function () {
//    $('.slide-bar-wrapper').hide();
//    $('.scale-crop').show();
//})
$('.tools').click(function () {
    $('.filter-menu').hide();
    $('.tool-submenu').hide();
    $('.tool-submenu').toggle();
});
$('.filters').click(function () {
    $('.tool-submenu').hide();
    $('.filter-menu').hide();
    $('.filter-menu').toggle();
});
$('.btguide').click(function () {
    $('#guide').show();
});
$('.close-guide').click(function () {
    $('#guide').hide();
});
$('.btcontact').click(function () {
    $('#contact').show();
});
$('.close-contact').click(function () {
    $('#contact').hide();
});
$('.logo').click(function () {
    window.open("https://infycre.cloudinthe.space","_self")
})
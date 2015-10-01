$('document').ready(function(){
    (function(){
        var path = location.pathname,
            li = $('.nav li');

        if(path=="/") li.eq(0).addClass('active');
        else if(path=="/sign-up") li.eq(2).addClass('active');
        else if(path=="/sign-in") li.eq(4).addClass('active');
        else if(path=="/feed") li.eq(1).addClass('active');
        else if(path=="/post") li.eq(3).addClass('active');
        else if(path=="/register-company") li.eq(3).addClass('active');
        else if(path=="/subscribe") li.eq(3).addClass('active');
    })()

    $('#log-off').click(function(){
        $('<form method=POST action=/logout>').submit();
        return false
    })

    $('#search').click(function(e){
        e.preventDefault();

        var li = $('.nav li');
        li.removeClass('active');

        var data = $('#query').val()

        if(location.pathname != "/search-page"){
            localStorage.search = JSON.stringify(data);
            location.pathname = "/search-page"
        } else search(data, $(".container"))
    });
});



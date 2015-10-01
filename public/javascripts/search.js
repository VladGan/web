var Search = function(){
    function printUser(obj){
        var title = "<h4 class='list-group-item-heading'>"+obj.username+"</h4>",
            location = "<h6>City: "+obj.city+" University: "+obj.university+"</h6>",
            specialty = "<h5>"+obj.specialty+"</h5>",
            about = "<p class='list-group-item-text'>"+specialty+location+"</p>",
            img = "<img src='"+obj.img+"' class='search-img'>";

        var block = "<a href='/user-page?id="+obj._id+"' class='list-group-item'>"+img+title + about+"</a>"

        return block
    }

    function printCompany(obj){
        var title = "<h4 class='list-group-item-heading'>"+obj.companyName+"</h4>",
            about = "<p class='list-group-item-text'>"+obj.about+"</p>",
            img = "<img src='"+obj.img+"' class='search-img'>";

        var block = "<a href='/company-page?id="+obj._id+"' class='list-group-item'>"+img+title+about+"</a>"

        return block
    }

    function printPost(obj){
        var title = "<h4 class='list-group-item-heading'>"+obj.title+"</h4>",
            location = "<h6>City: "+obj.place+"</h6>",
            text = "<p class='list-group-item-text'>"+obj.text+"</p>",
            creator = "<h6>Created by: "+obj.companyName+"</h6>"

        var block = "<a href='/post-details?id="+obj._id+"' class='list-group-item'>"+title+location+text+creator+"</a>"

        return block
    }

    function printObj(obj){
        var isUser = obj.username !=undefined;
        var isCopmpany = obj.about !=undefined;

        if(isUser) return printUser(obj)
        else if(isCopmpany) return printCompany(obj)
        else return printPost(obj)
    }

    function output(array,el){

       el.html('')

        for(var i = 0; i<array.length;i++){
            el.append(printObj(array[i]));
        }
    }

    return {
        output: output
    }
}

$('document').ready(function() {
    (function(){
        if(location.pathname == "/search-page"){
            data = JSON.parse(localStorage.search)

            if(data != null){
                localStorage.search = JSON.stringify(null);
                $("#query").val(data);
                search(data);
            } else if($("#query").val().length){
                data = $("#query").val()
                search(data);
            }
        }

        if(location.pathname == "/post"){
            var socket = io.connect('', {
                reconnect: false
            });

            $(document.forms['login-form']).on('submit', function() {
                var form = $(this);
                var data = form.serializeArray();

                socket.emit('post', data);
                return false;
            })
        }
    })();
})

var search = function(data){
    var isSearchPost = data.indexOf("#")>=0;

    if(isSearchPost)
        var url = "/search-post?query=" + data.replace(/#/g, "");
    else
        var url = "/search-user?query=" + data;

    var el = $('.container');


    $.get(url,function(res){
        console.log(res);

        var search = new Search()

        if(res.length)
            search.output(res, el);
        else
            el.html('<h4>Sorry no data for this query.</h4>');
    });
}
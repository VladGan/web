$(document).ready(function(){
    $(".red").click(function() {
        var id = $(this).parent().parent().attr('id');
//        console.log(id);
        var data = {id:id};
        $(this).parent().parent().remove();
        $.ajax({
            url: "/delete-post",
            method: "POST",
            data: data,
            complete: function() {
                //$(":submit", form).button("reset");
            },
            statusCode: {
                200: function() {
                    $('.error').html("Welcome!").addClass('alert-success');
                },
                403: function(jqXHR) {
                    //var error = JSON.parse(jqXHR.responseText);
                    //$('.error', form).html(error.message);

                    //var error = $.parseXML(jqXHR.responseText)
                    //$xml = $( error );
                    //$title = $xml.find( "h1" ).html();

                    var $title = jqXHR.responseText.split("h1")[1].split("<")[0].split(">")[1];
                    $('.error').html($title).addClass('alert-danger');
                }
            }
        });
        return false;
    });

    $("#edit").click(function() {
        $.ajax({
            url: "/post",
            method: "POST",
            data: data,
            complete: function() {
                $(":submit", form).button("reset");
            },
            statusCode: {
                200: function() {
                    $('.error').html("Welcome!").addClass('alert-success');
                    window.location.href = "/feed";
                },
                403: function(jqXHR) {
                    //var error = JSON.parse(jqXHR.responseText);
                    //$('.error', form).html(error.message);

                    //var error = $.parseXML(jqXHR.responseText)
                    //$xml = $( error );
                    //$title = $xml.find( "h1" ).html();

                    var $title = jqXHR.responseText.split("h1")[1].split("<")[0].split(">")[1];
                    $('.error').html($title).addClass('alert-danger');
                }
            }
        });
        return false;
    });
});

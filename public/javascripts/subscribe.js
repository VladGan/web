$(document).ready(function(){
    $('#subscribe').click(function(){
        var data = {
            companyId: location.search.split('?id=')[1]
        }

        $.ajax({
            url: "/subscribe",
            method: "POST",
            data: data,
            statusCode: {
                200: function() {
                    $('.page-subscribe').html('<h6>You have already Subscribe.</h6>');
                },
                403: function(jqXHR) {
                    console.error("Error: Subscribe User")
                }
            }
        });

    })
})

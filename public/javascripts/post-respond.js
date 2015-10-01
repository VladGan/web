$(document).ready(function(){
    $('#send-user').click(function(e){
        e.preventDefault();

        var $test = $('.test-form'),
            test = []

        for(var i = 0;i<$test.length;i++) {
            test.push({
                id: $test.eq(i).attr('data-anachronism'),
                ans: $test.eq(i).find('input:checked').val()
            })
        }

        var $open = $('.open-form'),
            open = []

        for(var i = 0;i<$open.length;i++) {
            open.push({
                id: $open.eq(i).attr('data-anachronism'),
                ans: $open.eq(i).find('input').val()
            })
        }

        var data = {
            id: location.search.split("id=")[1],
            open: open,
            test: test
        }

        $.ajax({
            url: "/post-respond",
            method: "POST",
            data: data,
            statusCode: {
                200: function() {
                    window.location.href = "/feed";
                }
            }
        });
    })
})
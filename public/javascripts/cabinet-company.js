$(document).ready(function(){
    var result = "";

    $('#img').change(function(){
        var preview = $('img');
        var file = $(this)[0].files[0];
        var reader = new FileReader();

        reader.onloadend = function () {
            preview[0].src = reader.result;
            result = reader.result
        }

        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview[0].src = "";
        }
    });

    $(document.forms['edit-form']).on('submit', function(e) {
        var form = $(this);
        var arr = form.serializeArray();

        var isCorrect = checkData(arr);

        if(!isCorrect.bool){
            $('.error').html(isCorrect.message).addClass('alert-danger');
            e.preventDefault();
            return
        } else {
            var data = form.serializeArray().reduce(function(previousValue, currentValue, index, array){
                previousValue[currentValue.name] = currentValue.value
                return previousValue
            },{})
        }

        $('.error', form).html('');
        $(":submit", form).button("loading");
        $('.error').removeClass('alert-danger').html("");

        data.lastname=$('.navbar-link').html();
        result = result.length ? result : $('#img-pic')[0].src;
        data.img=result;

        $.ajax({
            url: "/cabinet-company",
            method: "POST",
            data: data,
            complete: function() {
                $(":submit", form).button("reset");
            },
            statusCode: {
                200: function() {
                    $('.error').html("User data was updated!").addClass('alert-success');
                    window.location.href = "/cabinet-company";
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

    $(document.forms['password-form']).on('submit', function(e) {
        e.preventDefault();
        var form = $(this);
        var data = form.serialize();

        var isCorrect = correctPassword(data);

        if(!isCorrect){
            $('.error').html("Wrond Password").addClass('alert-danger');
            e.preventDefault();
            return
        }

        $('.error', form).html('');
        $(":submit", form).button("loading");
        $('.error').removeClass('alert-danger').html("");

        data = data + "&companyName=" + $('.navbar-link').html()

        $.ajax({
            url: "/cabinet-company-password",
            method: "POST",
            data: data,
            complete: function() {
                $(":submit", form).button("reset");
            },
            statusCode: {
                200: function() {
                    $('.error').html("User data was updated!").addClass('alert-success');
                    window.location.href = "/cabinet-company";
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

    function correctPassword(data){
        var arr = data.split("&"),
            pas = arr[0].split("=")[1],
            conf = arr[1].split("=")[1]

        if(conf == pas) return true
        else return false
    }

    function checkData(arr) {
        var ans = {
            bool: true,
            message: "OK"
        };


        for(var i = 0; i<arr.length; i++){

            if(!arr[i].value.trim().length){
                ans.message = "Wrong " + arr[i].name + "."
                ans.bool = false;
                break;
            }
        }

        return ans;
    }
});

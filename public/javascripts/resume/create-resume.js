$(document).ready(function(){
    var block;

    function send_to_server(a){
        new_user = {};
        new_user.firstname = a[0].innerHTML;
        new_user.secondname = a[1].innerHTML;

        new_user.mail = a[2].innerHTML;
        new_user.website = a[3].innerHTML;
        new_user.mobile = a[4].innerHTML;
        new_user.personal_info = a[5].innerHTML;

        new_user.work_experience = {};
        new_user.work_experience.workingTime = {};
        new_user.work_experience.jobTitle = a[6].innerHTML;
        new_user.work_experience.company = a[7].innerHTML;
        new_user.work_experience.workingTime.start = a[8].innerHTML;
        new_user.work_experience.workingTime.end = a[9].innerHTML;
        new_user.work_experience.description = a[10].innerHTML;


        new_user.skills = [];
        var i;
        for (i = 11; a[i].localName == "li"; i++)
            new_user.skills[i-11] = a[i].innerHTML;

        new_user.university = a[i].innerHTML;
        new_user.specialty = a[i+1].innerHTML;
        new_user.university_desc = a[i+1].innerHTML;

//        new_user.work_experience:[{
//            JobTitle:{type: String},
//            Company:{type: String},
//            workingTime:{start:{type:Date},end:{type:Date}},
//            description:{type: String}
//        }],
//        new_user.personal_info:
        $.ajax({
            url: "/create-resume",
            method: "POST",
            data: new_user
//            complete: function() {
//                $(":submit", form).button("reset");
//            }
        });
        return false;
    }

    function setCursor(){
        var temp;
        temp=$('#textarea').val();
        $('#textarea').val('');
        $('#textarea').focus();
        $('#textarea').val(temp);
    }

    function a () {
        block = this;
        var block_text = this.innerHTML;
        var height = block.offsetHeight+4;
        var width = block.offsetWidth ;
        var font = $(block).css('font-size');

        var new_block = "<textarea id = 'textarea' class='form-control' style = 'width:"+width+"px;height:"+height+"px;font-size:"+font+";'>"+block_text+"</textarea>";
        new_block
        $(block).replaceWith(new_block);
        $(block).focus();
        setCursor(document.getElementById('textarea'));
        $('#textarea').off();
        $('#textarea').blur(function(){

            block.innerHTML = $('#textarea')[0].value;

            var th = this;
            $(th).replaceWith(block);
            $(th).ready(function(){
                $(".editable").click(a)
            });
            send_to_server(document.getElementsByClassName('editable'));
        });

    }

    $(".editable").click(a);

        $('#save').click(function() {
            send_to_server(document.getElementsByClassName('editable'));

            pdf = new jsPDF('p', 'pt', 'a4'),
                specialElementHandlers = {
                    '#editor': function (element, renderer) {
                        return true;
                    }
                };
            pdf.addHTML(document.getElementById('cv'), function () {
                pdf.save("pdf_name");

            });
        });
});

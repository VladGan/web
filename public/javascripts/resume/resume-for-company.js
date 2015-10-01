$(document).ready(function() {
    $('#preview').click(function () {
        pdf = new jsPDF('p', 'pt', 'a4'),
            specialElementHandlers = {
                '#editor': function (element, renderer) {
                    return true;
                }
            };
        pdf.addHTML(document.getElementById('cv'), function () {
            var string = pdf.output('datauristring');
            var x = window.open();
            x.document.open();
            x.document.location = string;
        });
    });
});



(function($) {
    appendCountryOptions('.country-option');
    $(document).on("change","#applyingThrough",function(){
        if($(this).val()=="S" || $(this).val()=="U"){

        }
        else if($(this).val()=="P"){

        }
    })
    
    number_of_tabs = 0
    function add_collapsible(){
        $(this).toggleClass('active');
        content = $(this).next();        
        if(content.css('max-height')!="0px")
            content.css('max-height',"0px")
        else
            content.css('max-height',content.prop('scrollHeight') + 'px')
    }
    $(document).on('click','#temp-part-header',add_collapsible)
    function appendTab(){
        if (number_of_tabs >= 5){
            alert("Can't have more than 5 participants");
            return false;
        }
        number_of_tabs++;
        var participant_header = $('#temp-part-header').clone();
        var participant_content = $('#temp-part-content').clone();
        participant_header.toggleClass('active',false);
        participant_content.css('max-height',null);
        participant_header.css('display','flex');
        participant_header.attr('id','');
        participant_content.css('display','block');
        participant_content.attr('id','');
        
        
        $('#part-group').append(participant_header);
        $(document).on('click','.collapsible',add_collapsible)
        
        $('#part-group').append(participant_content);
        return true;
    }
    function deleteTab(el){
        if(number_of_tabs <= 3){
            alert("Can't Be Less Than 3 Participants")
            return false;
        }
        
        if($(this).parent().attr('id')=='temp-part-header'){
            console.log('hii');
            $(this).parent().next().next().attr('id','temp-part-header')
            $(this).parent().next().next().next().attr('id','temp-part-content')
        }
        number_of_tabs--;

        $(this).parent().next().remove()
        $(this).parent().remove()
    }
    for(var i=0;i<3;i++){
        appendTab();
    }
    $(document).on('click', '#add-participants', appendTab );
    $(document).on('click', '.remove-button',deleteTab);
    var form = $("#signup-form");
    form.validate({
        errorPlacement: function errorPlacement(error, element) {
            element.before(error);
        },
        rules: {
            email: {
                email: true,
            },
            institPhone: {
                number:true,
            }
        },
        onfocusout: function(element) {
            $(element).valid();
        },
    });
    form.children("#tabs").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        enableAllSteps:true,
        
        transitionEffect: "fade",
        stepsOrientation: "vertical",
        titleTemplate: '<div class="title"><span class="step-number">#index#</span><span class="step-text">#title#</span></div>',
        labels: {
            previous: 'Previous',
            next: 'Next',
            finish: 'Finish',
            current: ''
        },
        onStepChanging: function(event, currentIndex, newIndex) {
            if (currentIndex === 0) {
                form.parent().parent().parent().append('<div class="footer footer-' + currentIndex + '"></div>');
            }
            if (currentIndex === 1) {
                form.parent().parent().parent().find('.footer').removeClass('footer-0').addClass('footer-' + currentIndex + '');
            }
            if (currentIndex === 2) {
                form.parent().parent().parent().find('.footer').removeClass('footer-1').addClass('footer-' + currentIndex + '');
            }
            if (currentIndex === 3) {
                form.parent().parent().parent().find('.footer').removeClass('footer-2').addClass('footer-' + currentIndex + '');
            }
            // if(currentIndex === 4) {
            //     form.parent().parent().parent().append('<div class="footer" style="height:752px;"></div>');
            // }
            form.validate().settings.ignore = ":disabled,:hidden";
            return form.valid();
        },
        onFinishing: function(event, currentIndex) {
            form.validate().settings.ignore = ":disabled";
            return form.valid();
        },
        onFinished: function(event, currentIndex) {
            alert('Submited');
        },
        onStepChanged: function(event, currentIndex, priorIndex) {

            return true;
        }
    });

    jQuery.extend(jQuery.validator.messages, {
        required: "",
        remote: "",
        email: "Incorrect Email",
        url: "",
        date: "",
        dateISO: "",
        number: "Incorrect Number",
        digits: "",
        creditcard: "",
        equalTo: ""
    });

    $.dobPicker({
        daySelector: '.birth_date',
        monthSelector: '.birth_month',
        yearSelector: '.birth_year',
        dayDefault: '',
        monthDefault: '',
        yearDefault: '',
        minimumAge: 0,
        maximumAge: 120
    });
    
    
})(jQuery);
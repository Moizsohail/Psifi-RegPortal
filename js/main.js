 (function($) {
    $(document).on('keypress','.wordCount',function(e){
        if($(this).val().length +2 > 150){
            e.preventDefault()
        }
        $(this).next().html($(this).val().length+1+'/150 words')
    })
    $(document).on('change','#noEvents',function(x){
        switch($(this).val()){
            case "2":
                $("#engrPref").parent().hide()
                $("#engrPref").parent().prev().hide()
                $("#engrPref").toggleClass('removed',true)
                break;
            case "3":
                $("#engrPref").parent().show()
                $("#engrPref").parent().prev().show()
                $("#engrPref").toggleClass('removed',false)
                break;
        }
    })
    function serialize(form){
        let payload  = {};
        
        $('form input,form select').not(`#temp-part-content input,
            #temp-part-content select, .removed`).serializeArray().forEach(function(a){
            //payload[a['name']] = a['value']     
            if(payload[a['name']] == undefined){
            payload[a['name']]=a['value']
            }
            else{
                
                if(typeof payload[a['name']]!='object')
                    payload[a['name']]=[].concat(payload[a['name']])
                
                payload[a['name']]=payload[a['name']].concat(a['value'])        
            }
        })
        console.log(payload['noEvents'])
        return JSON.stringify(payload)
    }
    $(document).on('click',"#regSubmit",function(){
        //let payload = serialize('#signup-form')
        let payload = {}
        $("#signup-form").serializeArray().forEach(function(a){
            payload[a['name']]=a['value']
        })
        console.log(payload)
        payload = JSON.stringify(payload)
        $.ajax({
            url:"http://spades.lums.edu.pk/api/register/submit",
            type: "POST",
            data: payload,
            contentType: "application/json",
            dataType: 'json',
            success:function(data, textStatus, jqXHR) {
                console.log(data)
                if(data['status']==200){
                    window.location.href='success.html'
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {alert("failure");}
        })
    })
    $(document).on('click',"#loginSubmit",function(){
        let payload  = {};
        $('#login-form').serializeArray().forEach(function(a){
            payload[a['name']] = a['value']     
            // (typeof a['name'])
            // if((typeof payload[a['name']]) ==undefined)
            //     payload[a['name']]=a['value']
            // else{
            //     if(typeof a['name']!='Object'){
            //         payload[a['name']]=[payload[a['name']]]
            //     }
            //     payload[a['name']]=payload[a['name']].concat(a['value'])
                
            // }
        })
        console.log(payload)
        payload = JSON.stringify(payload)
        $.ajax({
            url:"http://spades.lums.edu.pk/api/login/submit",
            type: "POST",
            data: payload,
            contentType: "application/json",
            dataType: 'json',
            success:function(data, textStatus, jqXHR) {
                console.log(data)
                if(data['status']==200){
                    sessionStorage['token'] = data['token'];
                    window.location.href="portal.html";

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {alert("failure");}
        })
    })  
    
    appendCountryOptions('.country-option',);
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
    var form = $("#portal-form");
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
            let payload  = serialize('#portal-form')
            console.log(payload)
            $.ajax({
                url:"http://spades.lums.edu.pk/api/login/submit",
                type: "POST",
                data: payload,
                contentType: "application/json",
                dataType: 'json',
                success:function(data, textStatus, jqXHR) {
                    console.log(data)
                    if(data['status']==200){
                        sessionStorage['token'] = data['token'];
                        window.location.href="portal.html";

                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {alert("failure");}
        })
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
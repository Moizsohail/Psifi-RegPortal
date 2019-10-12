 (function($) {
    // $(document).on("paste drop", '.wordCount', function (e) {
    //   if(e.type=="drop"){
    //     e.preventDefault()
    //   }
    //   else{
    //     console.log(150-$(this).val().length)
    //     if($(this).val().length > 150){
    //         e.preventDefault()
    //     }
    //     else
    //         $(this).val($(this).val()+e.originalEvent.clipboardData.getData('text').substring(0,150-$(this).val().length));
    //   }
    //   $(this).next().html($(this).val().length+'/150 words')
    // });

    var boolTabJumping = true;
    var _startIndex = 2;
    function debugMode(on){

        if(!on){
            $('form input').removeAttr('value')
            $('form select option').removeAttr('selected')
            $('form textarea').removeAttr('value')
            $('[type="checkbox"]').removeAttr('checked')
            boolTabJumping = false;
            _startIndex = 0
        }

    }
    debugMode(true)
    var uploadComplete = true;         
    $('[name=member-photo]').val('asdfasd')
    $(document).on('change','.fileButton',function(e){
        uploadComplete = false;
        $(this).next().next().html('Uploading')
        if(event.target.files.length === 0)
        {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = event => {
            const img  = new Image();
            img.src = event.target.result
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width
                canvas.height = img.height
                let ctx = canvas.getContext('2d')
                ctx.drawImage(img,0,0);
                var cimg    = canvas.toDataURL("image/jpeg",0.1);
                $(this).next().val(cimg);
                // document.write('<img src="'+cimg+'"/>');
            }
            
            
        }
        $(this).next().next().html('Done')
        uploadComplete = true;
        })
        // reader.readAsArrayBuffer(e.target.files[0]);
        // reader.onload = event => {
        //     console.log(event)
        //     const img = new Image();
        //     img.src = event.target.result;
        //     img.onload = () => {
        //             const myCanvas = document.getElementById('my-canvas');
                    
        //             const ctx = myCanvas.getContext('2d');
        //             // img.width and img.height will contain the original dimensions
                    // ctx.drawImage(img,0,0);
                    // ctx.canvas.toBlob((blob)=> {
                    //     const file = new File([blob], e.target.files[0]['name'], {
                    //         type: 'image/jpeg',
                    //         lastModified: Date.now()
                    //     });
                    // }, 'image/jpeg', 0.7);
        //         },
        //         reader.onerror = error => console.log(error);
    //};

    // })
    $(document).on('keypress','.wordCount',function(e){
        if($(this).val().length + 1> 150){
            e.preventDefault()
        }
        $(this).next().html($(this).val().length+1+'/150 words')
    })
    $(document).on('change','#noEvents',function(x){
        switch($(this).val()){
            case "2":
                $("#logicalPref").prop('required',false);
                $("#mysterPref").prop('required',false);
                $("#engrPref").prop('required',false);
            break;
            case "3":
                $("#logicalPref").prop('required',true);
                $("#mysterPref").prop('required',true);
                $("#engrPref").prop('required',true);
            break;
        }
    })
    function parseString(x){
        return x;
        // if (Number(x).isNaN()){
        //     if(x != '')
        //         return Number(x);
        // }
        // return x;
    }
    function serialize(form){
        let payload  = {};
        payload['inst'] = {};
        payload['member'] = [];
        payload['event'] = {};
        payload['headDelegate'] = {};
        let i = 0;
        $('form input,form select,form textarea').not(`#temp-part-content input,
            #temp-part-content select, .removed,[type="file"]`).serializeArray().forEach(function(a){
            let value = parseString(a['value'])
            let sec_name = a['name'].split('-')[0]
            let data_name = a['name'].split('-')[1]
            
            if(payload[sec_name].constructor != Array){
                payload[sec_name][data_name]=value
            }
            else{
                if(payload[sec_name][i] == undefined){
                    payload[sec_name][i] = {}
                }
                if(payload[sec_name][i][data_name] != undefined){
                    i++;
                }

                if(payload[sec_name][i] == undefined){
                    payload[sec_name][i] = {}
                }
                payload[sec_name][i][data_name] = value;
                // payload[a['name']]=payload[a['name']].concat(a['value'])        
            }
        })
        return JSON.stringify(payload)
    }
    var rform = $('#signup-form');
    rform.validate({
        errorPlacement: function errorPlacement(error, element) {
            element.before(error);
        },
        rules: {
            'email':{
                required: true,
                email: true
            },
            'name':{
                required: true,
                minlength: 3,
                maxlength: 50
            },
            'password':{
                required: true,
                minlength: 8,
                maxlength: 128
            },
        },
        onfocusout: function(element) {
            $(element).valid();
        },

        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            console.log(errors)
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } 
    });
    $(document).on('click',"#regSubmit",function(){
        //let payload = serialize('#signup-form')
        let payload = {}
        rform.validate();
        if (!rform.valid()){
            return false;
        }
        rform.serializeArray().forEach(function(a){
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
                else {
                    alert(data['message'])
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {alert("Unable to register. Please verify credentials and try again.");}
        })
    })
    var lform = $('#login-form');
    lform.validate({
        errorPlacement: function errorPlacement(error, element) {
            element.before(error);
        },
        rules: {
            'email':{
                required: true,
                email: true
            },
            'password':{
                required: true,
                minlength: 8,
                maxlength: 128
            },
        },
        onfocusout: function(element) {
            $(element).valid();
        },
    });
    $(document).on('click',"#loginSubmit",function(){
        let payload  = {}; 
        lform.validate();
        if (!lform.valid()){
            return false;
        }
        lform.serializeArray().forEach(function(a){
            payload[a['name']] = a['value']     
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
                    window.location.href = "region.html"
                    //window.location.href="portal.html?token="+ sessionStorage['token'];
                }
                else{
                    alert(data['message'])
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {alert("Unable to register. Please verify credentials and try again.");}
        })
    })  
    // $(document).on('change','[name=member-firstName]',function(){
    //     $('#headDelegate')'<option>'+$(this).val()+'</option>'
    // })
    function togglePrivate(name,show,select,dummy){
        if(show && select){
            $("[name="+name+"] option:first-child").html('')
            $("[name="+name+"]").parent().show()
            $("[name="+name+"]").parent().prev().show()
        
        }
        else if(!show && select){
            $("[name="+name+"] option:first-child").html(dummy)
            // $("[name="+name+"] option:first-child").attr("selected")
            $("[name="+name+"] option").removeAttr("selected")
            $("[name="+name+"] option:first-child").attr("selected")
            $("[name="+name+"]").parent().prev().hide()
            $("[name="+name+"]").parent().hide()
        
        }
        
        else if(show){
            $("[name="+name+"]").val('')
            $("[name="+name+"]").parent().show()
            $("[name="+name+"]").parent().prev().show()
        }
        else{
            $("[name="+name+"]").val(dummy)
            $("[name="+name+"]").parent().prev().hide()
            $("[name="+name+"]").parent().hide()
        }

    }
    appendCountryOptions('.country-option',);
    $(document).on("change","#applyingThrough",function(){
        if($(this).val()=="School" || $(this).val()=="University"){
            //togglePrivate("inst-advisor",true,true,"empty")
            //togglePrivate("inst-name",true,false,"empty")
            togglePrivate("inst-email",true,false,"empty@empty.com")
            togglePrivate("inst-phone",true,false,"00000000000")
            togglePrivate("inst-principalEmail",true,false,"empty@empty.com")
            //togglePrivate("inst-address",true,false,"NNNNNNNNNNNNNNNNN")
            //togglePrivate("inst-city",true,false,"empty")
            //togglePrivate("inst-country",true,true,"empty")
        }
        else if($(this).val()=="Privately_Uni"|| $(this).val()=="Privately_Sch"){
            //togglePrivate("inst-advisor",false,true,"empty")
            //togglePrivate("inst-name",false,false,"empty")
            togglePrivate("inst-email",false,false,"empty@empty.com")
            togglePrivate("inst-phone",false,false,"00000000000")
            togglePrivate("inst-principalEmail",false,false,"empty@empty.com")
            // togglePrivate("inst-address",false,false,"NNNNNNNNNNNNNNNNN")
            // togglePrivate("inst-city",false,false,"empty")
            // togglePrivate("inst-country",false,true,"empty")
        }

        if ($(this).val()=="University"||$(this).val()=="Privately_Uni"){ //must also limit events for UNI
            $("#logicalPref").empty();
            $("#mysterPref").empty();
            $("#engrPref").empty();

            $('#logicalPref').append('<option></option>');
            $('#logicalPref').append('<option value="TechWars">Tech Wars</option>');

            $('#mysterPref').append('<option></option>');
            $('#mysterPref').append('<option value="Galactica">Galactica</option>');

            $('#engrPref').append('<option></option>');
            $('#engrPref').append('<option value="RoboWars">Robo Wars</option>');
            
        }
        else{
            $("#logicalPref").empty();
            $("#mysterPref").empty();
            $("#engrPref").empty();

            $('#logicalPref').append('<option></option>');
            $('#logicalPref').append('<option value="TechWars">Tech Wars</option>');
            $('#logicalPref').append('<option value="ScifinityWars">Scifinity Wars</option>');
            $('#logicalPref').append('<option value="MathGauge">Math Gauge</option>');
            $('#logicalPref').append('<option value="TDM">Tour De Mind</option>');

            $('#mysterPref').append('<option></option>');
            $('#mysterPref').append('<option value="Galactica">Galactica</option>');
            $('#mysterPref').append('<option value="SCB">Science Crime Busters</option>');
            $('#mysterPref').append('<option value="DD">Diagnosis Dilemma</option>');

            $('#engrPref').append('<option></option>');
            $('#engrPref').append('<option value="RoboWars">Robo Wars</option>');
            
            $('#engrPref').append('<option value="GearUp">Gear Up</option>');
            $('#engrPref').append('<option value="Seige">Seige</option>');
        }
    })
    $(document).on("click","#event-CArefer",function(){
        if($(this).val()==1){
            togglePrivate("event-ambassadorName",true,true)
            togglePrivate("event-ambassadorPhone",true,true)
        }
        else{
            $("[name=event-ambassadorName]").parent().hide()
            $("[name=event-ambassadorPhone]").parent().hide()
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
        number_of_tabs++; //added a new member/tab
        var participant_header = $('#temp-part-header').clone();
        var participant_content = $('#temp-part-content').clone();
        participant_header.toggleClass('active',false);
        participant_content.css('max-height',null);
        participant_header.css('display','flex');
        participant_header.attr('id','');
        participant_content.css('display','block');
        participant_content.attr('id','');
        $("#headDelegate-id").append('<option value="' +  number_of_tabs +'">Team Member '+ number_of_tabs +'</option>');
        
        
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

        console.log(number_of_tabs);
        $("#headDelegate-id").find('[value="' + number_of_tabs + '"]').remove();
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
            'inst-type':{ //length restricted to options
                required: true,
            },
            'inst-name':{
                required: true,
                minlength: 3,
                maxlength:50
            },
            'inst-city':{
                required: true,
                minlength: 3,
                maxlength:50
            },
            'inst-email': {
                required: true,
                email: true,
            },
            'inst-phone': {
               number:true,
               minlength: 11,
               maxlength: 13
            },
            'inst-principalEmail': {
                required: true,
                email: true
            },
            'inst-address':{
                required:true,
                minlength:10,
                maxlength:150,
            },
            'inst-country':{ //length restricted by options
                required:true,
            },
            'inst-advisor':{ 
                required: true
            },
            'headDelegate-id':{
                required: true,
                number: true,
                min: 1,
                max: 5
            },
            'member-firstName':{
                required: true,
                minlength: 3,
                maxlength:50
            },
            'member-lastName':{
                required: true,
                minlength: 3,
                maxlength:50
            },
            'member-birthDate':{
                required: true,
                date: true
            },
            'member-email':{
                required: true,
                email: true
            },
            'member-phone':{
                required: true,
                number: true,
                minlength: 11,
                maxlength: 13
            },
            {
                'member-photo':{
                    required:true,
                },
            },
            'member-gender':{
                required: true
            },
            'member-accomodation':{
                required: true
            },
            'member-address':{
                required: true,
                minlength: 10,
                maxlength: 150
            },
            'member-city':{ //length restricted by options
                required: true
            },
            'member-country':{ //length restricted by options
                required: true
            },
            'member-cnic':{
                required: true,
                minlength: 13,
                maxlength: 15
            },
            'member-firstNameGaurdian':{
                required: true,
                minlength: 3,
                maxlength:50
            },
            'member-lastNameGaurdian':{
                required: true,
                minlength: 3,
                maxlength:50
            },
            'member-phoneGaurdian':{
                required: true,
                number: true,
                minlength: 11,
                maxlength: 13
            },
            'event-number':{
                required: true,
                number: true
            },
            'event-logical':{  //length restricted by options
            },
            'event-mystery':{  //length restricted by options
            },
            'event-engineering':{  //length restricted by options
            },
            'event-explain':{
                required:true,
                maxlength: 150
            },
            'event-CArefer':{
                required: true
            },
            'event-ambassadorName':{
                required:{
                    depends: function(element){
                        return $("#event-CArefer").val() == 1;
                    }
                },
                minlength: 3,
                maxlength: 50
            },
            'event-ambassadorPhone':{
                required:{
                    depends: function(element){
                        return $("#event-CArefer").val() == 1;
                    }
                },
                number: true,
                minlength: 11,
                maxlength: 13
            },
        },
        onfocusout: function(element) {
            $(element).valid();
        },
    });
    form.children("#tabs").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        enableAllSteps:boolTabJumping,
        startIndex:_startIndex,
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
            if(!uploadComplete){
                alert('Please wait for the upload to complete')
            }
            return (form.valid() || uploadComplete);
        },
        onFinishing: function(event, currentIndex) {
            var prefs = [$("#logicalPref"),$("#mysterPref"),$("#engrPref"),$("#drogPref")]
            // if ($("#noEvents").val() == "2"){
            console.log('hi')
            var noSelected = 0

            for (i = 0; i < prefs.length; i++) {
                if (prefs[i].val() != ""){ //some value is selected
                    noSelected++
                }
            }
            if (noSelected != parseInt($("#noEvents").val()) ){
                alert("Please select " + parseInt($("#noEvents").val()) + " events.")
                $("#noEvents").focus()
                return false
            }
            
            form.validate().settings.ignore = ":disabled";
            return form.valid();
        },
        onFinished: function(event, currentIndex) {
            let payload  = serialize('#portal-form')
            console.log(payload)
            console.log("http://spades.lums.edu.pk/portal/submit?token="+sessionStorage['token'])
            $.ajax({
                url:"http://spades.lums.edu.pk/portal/submit?token="+sessionStorage['token'],
                type: "POST",
                data: payload,
                contentType: "application/json",
                dataType: 'json',
                success:function(data, textStatus, jqXHR) {
                    console.log(data)
                    if(data['status']==200){
                        window.location.href="voucher.html"
                        console.log(data)
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
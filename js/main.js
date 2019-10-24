 (function($) {

    /*issues
        function for storing portal data
        funciton for retrieving portal data
        funciton for deleting portal data
        portal -> submit-button 
            if invalid token send to login page + store portal data
            else if successful delete portal data from storage
        button on portal page
            restores portal data



    */
    
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
    
    debugMode(false)
    var uploadComplete = true;         

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
                var cimg = canvas.toDataURL("image/jpeg",0.1);
                $(this).next().val(cimg);
                // document.write('<img src="'+cimg+'"/>');
            }
            
            
        }
        $(this).next().next().html('Done')
        uploadComplete = true;
    });

        
    $(document).on('keypress','.wordCount',function(e){
        if($(this).val().length + 1> 500){
            e.preventDefault()
        }
        $(this).next().html($(this).val().length+1+'/500 words')
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
    var fform = $('#forgotpass-form');
    fform.validate({
        errorPlacement: function errorPlacement(error, element) {
            element.before(error);
        },
        rules: {
            'email':{
                required: true,
                email: true
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
    $(document).on('click',"#forgotpassSubmit",function(){
        //let payload = serialize('#signup-form')
        let payload = {}
        fform.validate();
        if (!fform.valid()){
            return false;
        }
        fform.serializeArray().forEach(function(a){
            payload[a['name']]=a['value']
        })
        console.log(payload)
        payload = JSON.stringify(payload)
        $.ajax({
            url:"http://spades.lums.edu.pk/api/forgotpassword",
            type: "POST",
            data: payload,
            contentType: "application/json",
            dataType: 'json',
            success:function(data, textStatus, jqXHR) {
                console.log(data)
                if(data['status']==200){
                    window.location.href='forgotpass-success.html'
                }
                else {
                    alert(data['message'])
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {alert("Invalid email.");}
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
                    // sessionStorage.removeItem('token')
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
    
    appendCountryOptions('.country-option',);
    
    
    
    
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
            // 'photoo':{
            //     required:true,
            // },
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
                maxlength: 500
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
            next: 'Save And Next',
            finish: 'Finish',
            current: ''
        },
        onStepChanging: function(event, currentIndex, newIndex) {
            if (currentIndex === 0) {
                form.parent().parent().parent().append('<div class="footer footer-' + currentIndex + '"></div>');
            }
            if (currentIndex === 1) {
                form.parent().parent().parent().find('.footer').removeClass('footer-0').addClass('footer-' + currentIndex + '');
                fields = $('[name="member-photo"]')
                for(var i = 1;i<fields.length;i++){
                    if(fields[i].value == ""){
                        alert("You may have forgotten to upload the image")
                        return false;
                    }
                }
            }
            if (currentIndex === 2) {
                form.parent().parent().parent().find('.footer').removeClass('footer-1').addClass('footer-' + currentIndex + '');
                
                
            }
            if (currentIndex === 3) {
                form.parent().parent().parent().find('.footer').removeClass('footer-2').addClass('footer-' + currentIndex + '');
            }
            // store();
            form.validate().settings.ignore = ":disabled,:hidden";
            if(!uploadComplete){
                alert('Please wait for the upload to complete')
                return false;
            }
            booll = form.valid()
            if (booll) store()
            return booll;
            
        },
        onFinishing: function(event, currentIndex) {
            var prefs = [$("#logicalPref"),$("#mysterPref"),$("#engrPref"),$("#drogPref")]

            var noSelected = 0

            for (i = 0; i < prefs.length; i++) {
                if (prefs[i].val() != ""){ //some value is selected
                    noSelected++
                }
            }
            if (noSelected != parseInt($("#noEvents").val()) ){
                $("#errorMsg").html("Please select " + parseInt($("#noEvents").val()) + " events.");
                $("#errorMsg").attr("style", "color: red; display: block;")
                return false
            }
            $("#errorMsg").attr("style", "color: red; display: none;")
                

            if (!document.getElementById('event-explainid').checkValidity()){
                $("#errorMsg").html("Please fill the events explanation field correctly.");
                $("#errorMsg").attr("style", "color: red; display: block;")
                return false;
            }

            $("#errorMsg").attr("style", "color: red; display: none;")
                
            
            return true;
        },
        onFinished: function(event, currentIndex) {
            var finishBtn = $("a[href$='#finish']");
            finishBtn.removeAttr("href");
            finishBtn.attr("style", "background-color: #999 !important;");
            
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

                    alert(data['message'])
                    if(data['message']=="Invalid Token!"){
                        window.location.href = "login.html"
                    }
                    finishBtn.attr("href","#finish");
                    finishBtn.removeAttr("style");
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("failure");
                    finishBtn.attr("href","#finish");
                    finishBtn.removeAttr("style");
                }
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


function store(){
	let data = $('form input,form select,form textarea').not(`#temp-part-content input,
            #temp-part-content select, .removed,[type="file"]`).serializeArray()
	data = JSON.stringify(data)
	localStorage['form_datas'] = data

}
/*
	if it encounters first-name then insert the value at 
*/
function count(datae){
	let counter = 0
	for(let i=0;i<datae.length;i++){
		if(datae[i]['name'] == 'member-firstName'){
			
			counter++;
		}
	}
	return counter;
}
function findVal(name,data,skips){
	for(i=0;i<data.length;i++){
		if(data[i]['name']==name){
			if(skips!=undefined && skips==0)
				return data[i]['value']
			else if(skips!=undefined && skips)
				skips--;
			else{
				return data[i]['value']
			}
		}
	}
	
}
function reset(){
	localStorage.removeItem('form_datas');
	window.location.reload()
}
function retrieve(){

	if(localStorage['form_datas']!=undefined){
		data = JSON.parse(localStorage['form_datas'])
		noOfExMembers = count(data)-3
		
		for(let i =0;i<noOfExMembers;i++){
			appendTab()
		}
		let x = -1;
		$('form input,form select,form textarea').not(`#temp-part-content input,
            #temp-part-content select, .removed,[type="file"]`).serializeArray().forEach(function(obj){
            	
            	
            	
        		if(obj['name']=="member-firstName") x++;
        		
        		if (obj['name'].split('-')[0]=="member"){
        			val = findVal(obj['name'],data,x)
        	// 		if($('[name="'+obj['name']+'"]').prop('tagName')=="SELECT"){
    					// // console.log($('[name="'+obj['name']+'"]:nth-child('+x+') option[value="'+val+'"]').html())
        	// 			$('[name="'+obj['name']+'"]:nth-child('+x+') option[value="'+val+'"]').attr('selected')
        	// 		}
        	// 		else	
    				$('[name='+obj['name']+']')[x+1].value = val
        		}
        		else{
        			val = findVal(obj['name'],data)
        			
        			
        				$('[name='+obj['name']+']')[0].value = val
        		}
            	
            })
     	applyingThrough()
	}
	else{
		console.log("No saved data")
	}
}
$(document).on('click','.store-btn',function(){
	store();
	alert("Saved")
})
$(document).on('click','.reset-btn',function(){
	reset();
})
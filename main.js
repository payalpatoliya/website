


$('select.select-club-services').each(function() {

  var dropdown = $('<div />').addClass('select-club-services selectDropdown');
  $(this).wrap(dropdown);

  var label = $('<div />').text($(this).attr('placeholder')).insertAfter($(this));
  var list = $('<ul />');

  $(this).find('option').each(function() {
    list.append($('<li />').append($('<a />').text($(this).text())));
  });

  list.insertAfter($(this));

  if($(this).find('option:selected').length) {
    label.text($(this).find('option:selected').text());
    list.find('li:contains(' + $(this).find('option:selected').text() + ')').addClass('active');
    $(this).parent().addClass('filled');
  }
});
$(document).on('click touch', '.selectDropdown ul li a', function (e) {
  e.preventDefault();

  // Get the dropdown and other relevant elements
  var dropdown = $(this).closest('.selectDropdown');
  var selectElement = dropdown.find('select');
  var active = $(this).parent().hasClass('active');
  var label = active ? selectElement.attr('placeholder') : $(this).text();

  // Check for 'reason-select' dropdown
  if (selectElement.attr('id') === 'reason-select') {
    const otherReasonSection = document.getElementById('other-reason-section');
    if (label === "Others") {
      otherReasonSection.classList.remove('hidden'); // Show the input field
    } else if (!active) {
      otherReasonSection.classList.add('hidden'); // Hide when another option is selected
    }
  }

  // Check for 'main_select_services' dropdown
  if (selectElement.attr('id') === 'main_select_services' && selectElement.attr('name') !== 'entity') {
    const otherReasonSectiona = document.getElementById('btm-other');
    if (label === "Others") {
      otherReasonSectiona.classList.remove('hidden'); // Show the input field
    } else if (!active) {
      otherReasonSectiona.classList.add('hidden'); // Hide when another option is selected
    }
  }

  if (dropdown.find('select').attr('name') === 'entity') {
    let list = $('select[name="department"]').next();
    list.empty();

    $('select[name="department"]').find('option').prop('selected', false);
    list.find('li').removeClass('active');

    $('select[name="department"]').parent().toggleClass('filled', !active);
    $('select[name="department"]').parent().children('div').text("Choose");

    $('select[name="department"]').find('option').each(function() {
      if (label === "NETS") {
        if($(this).text().includes("(NETS)")){
          list.append($('<li />').append($('<a />').text($(this).text())));
        } 
      }else{
        if(!$(this).text().includes("(NETS)")){
          list.append($('<li />').append($('<a />').text($(this).text())));
        }
      }
      
    });
  }


  dropdown.find('option').prop('selected', false);
  dropdown.find('ul li').removeClass('active');

  dropdown.toggleClass('filled', !active);
  dropdown.children('div').text(label);

  if(!active) {
    dropdown.find('option:contains(' + $(this).text() + ')').prop('selected', true);
      $(this).parent().addClass('active');
  }

  dropdown.removeClass('open');
});


$('.select-club-services > div').on('click touch', function(e) {
  var self = $(this).parent();
  self.toggleClass('open');
});

$(document).on('click touch', function(e) {
  var dropdown = $('.select-club-services');
  if(dropdown !== e.target && !dropdown.has(e.target).length) {
    dropdown.removeClass('open');
  }
});

$("#toggle-home").on('click',()=>{
 // toggleView("main")
 window.location.reload()
})

$("#rsvp-form").on('submit', (e)=>{
  e.preventDefault();

  let fullName = $('input[name="fullName"]').val();
  let email = $('input[name="email"]').val();
  let suppl_email = $('input[name="suppl_email"]').val();
  let dietary_restrictions = $('select[name="dietary_restrictions"]').val();
  let entity = $('select[name="entity"]').val();
  let department = $('select[name="department"]').val();
  let rsvp = "Yes"
  let noRsvpReason = ""

  if(email == "" && suppl_email == ""){
    loadError("Please provide your work email or your personal email.")
    return;
  }

  if(!$("#no-checkbox").is(":checked") && !$("#yes-checkbox").is(":checked")){
    loadError("Pleaseselect if you will be attending or not.")
    return;
  }

  if($("#no-checkbox").is(":checked")){
    if($('select[name="no-rsvp"]').val() == ""){
      loadError("Please select a reason why you wont be attending.")
      return
    }else if($('select[name="no-rsvp"]').val() == "Others"){
      console.log($('input[name="no-rsvp-others"]').val());
      if($('input[name="no-rsvp-others"]').val() == ""){
        loadError("Please provide a reason why you wont be attending.")
        return
      }else{
        rsvp = "No";
        noRsvpReason = $('select[name="no-rsvp"]').val() == "Others" ? "Others - " + $('input[name="no-rsvp-others"]').val() : $('select[name="no-rsvp"]').val(); 
      }
    }else{
      rsvp = "No";
      noRsvpReason = $('select[name="no-rsvp"]').val() == "Others" ? $('input[name="no-rsvp-others"]').val() : $('select[name="no-rsvp"]').val(); 
    } 
  }

  if($('select[name="dietary_restrictions"]').val() == "Others"){
    if($('input[name="dietary_restrictions_others"]').val() == ""){
      loadError("Please indicate your dietary restrictions.")
      return
    }else{
      dietary_restrictions =  "Others - " + $('input[name="dietary_restrictions_others"]').val() 
    }
  }

  showLoading("Submitting form, please wait...")
  $.ajax({
    url: "https://ev.netstownhall2025.com/api/rsvp", 
    type: "POST",                          
    headers: {                             
      "Accept": "application/json"
    },
    data: { 
      fullName: fullName,
      email : email,
      suppl_email : suppl_email,
      dietary_restrictions : dietary_restrictions,
      companyName : entity,
      department : department,
      rsvp : rsvp,
      noRsvpReason : noRsvpReason
    },    
    success: function(response) {   
      Swal.close();        
      toggleView("thanks")
    },
    error: function(xhr, status, error) {   
      Swal.close();
      if (xhr.responseJSON) {
        loadError(xhr.responseJSON.error ?? "An error occured please try again.");
        console.log(xhr.responseJSON.message)
      } else {
        loadError(xhr.responseText); // Fallback for non-JSON responses
      }
    }
  });
})

function showLoading(msg){
  Swal.fire({ 
    title: msg,
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

function loadSuccess(msg){
  Swal.fire({ 
    title: msg,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });
}

function loadError(msg){
  Swal.fire({ 
    title: msg,
    icon: 'error',
    timer: 2000,
    showConfirmButton: true
  })
}

function toggleView(page) {
  const main = document.getElementById('main');
  const thanks = document.getElementById('thanks');
  
  if(page == "main"){
    thanks.classList.add('hidden');
    main.classList.remove('hidden');
  }else{
    main.classList.add('hidden');
    thanks.classList.remove('hidden');
  }
}
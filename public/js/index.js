jQuery(function($){

  $('body').css('display','block');

  // index.html  
  $('#submit').on('click', function(){

    if($('#uname').val() !== ''){

      var uname = $('#uname').val(); 

      window.location.href="/result?uname="+uname;      

    };

  });  


})

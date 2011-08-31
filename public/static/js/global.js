$(document).ready(function() {

  now.room_id = "shit_show";

  chat_messages = $('#chat_messages');

  now.receiveBroadcast = function(user, message){
		chat_messages.append('<li class="clearfix"><span class="user"><a href="#">'+user.name + '</a>: </span>' + message + '</li>');
		$('.chat_box').scrollTop(999999999);
  };
	
	now.renderComeOnline = function(user) {
		id = 'user_on_'+user.name;
		if (!$('#' + id).is('*')) {
			$('#online_users').append('<li id="'+id+'"><img src="'+user.avatar+'" /></li>');
		}
	};
	
	now.renderGoOffline = function(user) {
		$('#user_on_'+user.name).remove();
	};
	
	now.userIsTyping = function(user) {
	};
	
	now.renderUserPosition = function(user, scrollY) {
		
		id = 'browsing_'+user.name;
		
		if ($('#' + id).is('*')) {
			$('#' + id).stop().animate({
					top: scrollY
			}, 1000,'easeInOutExpo');
		} else {
			$('#users_browsing_now').append('<div class="user_browsing" id="'+id+'"><div class="browsing_line"></div><div class="user"><img src="'+user.avatar+'"/><a href="#'+id+'" class="username">'+user.name+'</a></div></div>');
		}
	
	};

  sendComment = function(id) {
    var line = $(id);
    pull_id = $('#pull_id').attr('pull_id');
    now.sendComment(pull_id, line.attr('file'), line.attr('line'), $('#comment').val());
    hideComment();    
  };

  hideComment = function() {
    $('#comment_box').remove();
    $('#comment_spacer').remove();
  }

  $('.line').click(function(){
    var id = $(this).attr('id');
    hideComment();
    $(this).after([
      "<div id='comment_box'>",
      "<input type='text' id='comment' style='width:80%'></input>",
      "<button onclick='sendComment(" + id + ")'>Comment</button>",
      "<button onclick='hideComment()'>X</button>",
      "</div>"].join(''));
    $('#num_col_' + id).after("<button id='comment_spacer' style='display: hidden'>&nbsp</button>");
  });

  now.ready(function() {
    $.get('/users/current', function(data) {
      if(data && data != "") {
        now.updateUserInfo(data);
        console.log();
      }
    });
  });

	setInterval(function(){
		now.sendPosition($(window).scrollTop());
	}, 1000);
	
	/*token functions */
	$('.num').click(function(){
	
		$('#tokens').append('<div class="token"><a class="file" href="#line_'+$(this).attr('data-diffLine')+'">'+$(this).attr('data-file')+'</a> <span class="line">'+$(this).attr('data-line')+'<a href="#" data-diffLine="'+$(this).attr('data-diffLine')+'" class="remove">X</a></span></div>');
		
		$('#line_'+$(this).attr('data-diffLine')).addClass('highlight');

	});
  
	$('.token .remove').live('click', function(e){
		e.preventDefault();
		// lol
		select = $('#line_' + $(this).attr('data-diffLine'));
		select.removeClass('highlight');
		$(this).parent().parent().remove();
	});
	
	/* smooth scrolling */
	$('.file').live('click',function(e){
			e.preventDefault();
			var $anchor = $(this);
			$('html, body').stop().animate({
					scrollTop: $($anchor.attr('href')).offset().top
			}, 1000,'easeInOutExpo');
			$($anchor.attr('href')).addClass('highlight');
	});
	
	/* chat functions */
  $('.chat_text').keypress(function(e){
    if(e.which == 13){
			if($(this).val() !== ""){
				now.sendBroadcast('<div class="tokens">' + $('#tokens').html() + '</div>' + $(this).val());
				$(this).val("");
				$('#tokens').html("");
			}
      e.preventDefault();
      return false;
    }
  });
	
});

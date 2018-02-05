$(function(){

	$('.main-column').scroll(function(){
		$('.table-view-info').css({ top: $('.main-column').scrollTop() });
	});
});
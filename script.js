$(document).ready(function () {
	console.log('Ready');
	$('table:first').kTablesorter({
		animatePadding: 30,
		defaultPadding: 10
	});
});
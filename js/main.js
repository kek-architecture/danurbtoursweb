
function calculateError(arr1, arr2) {
	if (!arr1 || !arr2 || arr1.length != arr2.length)
		throw "Invalid inputs!";
	
	var sum = 0;

	for (var j = 0; j < arr1.length; ++j) {
		sum += Math.pow(arr1[j] - arr2[j], 2);
		console.log(j, arr1[j], arr2[j]);
	}
	return sum;
}

$(document).ready(function () {

	$.scrollify({
		easing: "easeOutExpo",
		section: ".panel:visible",
		sectionName: "section-name",
		scrollSpeed: 700,
		after: function (i) {
		}
	});

	$(".scroll,.scroll-btn").click(function (e) {
		e.preventDefault();
		$.scrollify.next();
	});

	$('.submit-personalization').on('click', function () {
		var values = [
			parseInt($(this).closest('.card-e2').find("#slider1").val()),
			parseInt($(this).closest('.card-e2').find("#slider2").val()),
			parseInt($(this).closest('.card-e2').find("#slider3").val()),
			parseInt($(this).closest('.card-e2').find("#slider4").val()),
		]

		var targets = [
			{
				name: 'combat',
				values : [ 1, 2, 5, 5 ]
			},
			{
				name: 'conspiracy',
				values : [ 5, 3, 4, 4]
			},
			{
				name: 'futurism',
				values : [ 3, 5, 3, 5 ]
			},
			{
				name: 'deeptime',
				values : [ 4, 1, 2, 2 ]
			},
			{
				name: 'greendeal',
				values : [ 2, 4, 1, 1 ]
			},
		];

		var min = 0;
		var minVal = calculateError(values, targets[0].values);
		for (var i = 0; i < targets.length; ++i) {
			var currentVal = calculateError(values, targets[i].values);
			console.log(currentVal);
			if (currentVal < minVal) {
				min = i;
				minVal = currentVal;
			}
		}
		
		window.location.href = '/tours/' + targets[min].name + '/';
	});
});
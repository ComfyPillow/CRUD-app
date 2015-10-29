/*  George Ng
  INFO 343 C

  This is the javascript file that implements the functions used to 
  create functioning reviews with ratings and delete buttons.*/

// Initialize Parse app
Parse.initialize("VKshCPLhjjvhxfT6Rf043MSPDtFUcJU1AAwIaHG3", "JJujqatCsbx0wMp9b85jnMJ8Jtxm0wEC7AtIRCG4");

// Create a new sub-class of the Parse.Object, with name "Review"
var Review = Parse.Object.extend('Review');
var total = 0; 												// Total number of stars
var reviewCount = 0; 										// Number of reviews counted so far

window.onload = function() {
	$('#inputStar').raty({
    score: 0,                                               //default score
    starOn: "raty-2.7.0/lib/images/star-on.png",
    starOff: "raty-2.7.0/lib/images/star-off.png",
	}) 
};

// Click event when form is submitted
$('form').submit(function() {

	// New Instance of Review class
	var review = new Review();
	
	$(this).find('input').each(function(){
		review.set($(this).attr('id'), $(this).val());
		$(this).val('');
	})

	//Initializes with 0 upvotes, downvotes, and a rating
	if ($('#inputStar').raty('score') != null ) {
		review.set('rating', $('#inputStar').raty('score'));
	} else {
		review.set('rating', 0);
	}
	review.set('upvote', 0);
	review.set('downvote', 0);

	//Resets this to default
	$('#inputStar').raty({
    score: 0,   
    starOn: "raty-2.7.0/lib/images/star-on.png",
    starOff: "raty-2.7.0/lib/images/star-off.png",                                                
	}) 

	// Saving new instance back to database
	review.save(null, {
		success:getData
	})
	return false
})



// function for getting data
var getData = function() {
	
	// Set up a new query for Review class
	var query = new Parse.Query(Review)

	query.notEqualTo('website', '')

	// finding data and sending it to build function
	query.find({
		success:function(results) {
			build(results)
		} 
	})
}

// A function to build the review section
var build = function(data) {
	// Emptys the review area
	$('#reviewDiv').empty()

	// Loops through data and adds reviews
	data.forEach(function(dat){
		reviewCount++;
		addReview(dat);
	})

	$('#stars').raty({
    score: Math.round(total/reviewCount),                       //Current Average rounded to nearest integer
    starOn: "raty-2.7.0/lib/images/star-on.png",
    starOff: "raty-2.7.0/lib/images/star-off.png",
    readOnly: true                                               
	}) 

	// Resets global variables back to 0
	reviewCount = 0; 
	total = 0;
}


// This function takes in a review, adds it to the screen
var addReview = function(item) {
	// Get parameters (title, opinion, star count, upvotes, and downvotes) from the data item passed to the function
	var title = item.get('title')
	var opinion = item.get('opinion')
	var stars = item.get('rating')
	var upvote = item.get('upvote')
	var downvote = item.get('downvote')
	total += stars;

	// Append div that includes data from review
	var div = $('<div class="reviews"> <div class="rating"> <div class="reviewStars" id="star' + reviewCount + '"></div> <h4> ' + title + 
		'</h4><div id="topic" class="upvote"> <a class="upvote" id="up' + reviewCount +'"></a> <a class="downvote" id="down' + reviewCount +
		'"></a> </div> </div> <h5> ' + opinion + '</h5> <p class="reviewOp"> ' + upvote + ' out of ' + (upvote + downvote) + 
		' found this review helpful </p> <button class="btn-danger btn-xs" id="btn-danger' + reviewCount + '"><span class="glyphicon glyphicon-remove"></span></button> </div>')
	

	// Appending the review to the div
	$('#reviewDiv').append(div)
	div = null;

	// Catches upvotes and updates the info
	$('#up' + reviewCount).click(function() {
		item.increment('upvote');
		item.save();
		getData()
	})

	// Catches downvotes and updates the info
	$('#down' + reviewCount).click(function() {
		item.increment('downvote');
		item.save();
		getData()
	})

	// Button to destroy the item, then re-call getData
	$('#btn-danger' + reviewCount).click(function() {
		item.destroy({
			success:getData
		})
	})

	// Builds star rating out of data
	$('#star' + reviewCount).raty({
    score: stars,                                               
    starOn: "raty-2.7.0/lib/images/star-on.png",
    starOff: "raty-2.7.0/lib/images/star-off.png",
    readOnly: true                                               
	}) 

}

// Calls getData at page load
getData()


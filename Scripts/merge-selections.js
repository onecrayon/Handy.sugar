/**
 * merge-selections.js
 * 
 * Takes all of the selections in the document, and transforms them into
 * a single selection. Optionally only selects the text between the first
 * and last selection.
 * 
 * setup:
 * - bookends (string): 'true' or 'false' (default); if true, will
 *   select only text between the first and last selections
 */

action.canPerformWithContext= function(context, outError) {
	return context.selectedRanges.length > 1;
};

action.performWithContext= function(context, outError) {
	var bookends = (typeof action.setup.bookends !== 'undefined' ? action.setup.bookends.toLowerCase() === 'true' : false);
	var firstRange = context.selectedRanges[0],
		secondRange = context.selectedRanges[context.selectedRanges.length - 1],
		targetRange;
	if (bookends) {
		// Only select the text in between the first and last range (because they are bookends)
		targetRange = new Range(firstRange.location + firstRange.length, secondRange.location - (firstRange.location + firstRange.length));
	} else {
		// Select everything including our bookends
		targetRange = new Range(firstRange.location, secondRange.location + secondRange.length - firstRange.location);
	}
	
	// Set our selection!
	context.selectedRanges = [targetRange];
};

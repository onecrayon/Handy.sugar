/**
 * select-column.js
 * 
 * Extends selections in columns using the keyboard, skipping
 * lines with nothing but whitespace (or lines that end too early).
 * 
 * setup:
 * - direction (string): 'up' or 'down'
 * 
 * FIXME: currently, this does not take into account the fact that tab
 * characters visually consume extra space, so if you run it along lines
 * that have different amounts of tab indentation, you get odd-looking
 * results. Need to figure out a way to deal with this, but JS API does
 * not currently have access to preference information about how many
 * spaces a tab represents, so it's a bit of a quandary unless I convert
 * it to Objective-C.
 */

action.canPerformWithContext= function(context, outError) {
	return action.setup.direction && context.selectedRanges[0].length > 0;
};

action.performWithContext= function(context, outError) {
	// Determine which direction we are going and setup initial variables
	var dir = (action.setup.direction.toLowerCase() === 'up' ? -1 : 1),
		whitespaceRE = /^\s+$/,
		startRange = (dir === 1 ? context.selectedRanges[context.selectedRanges.length - 1] : context.selectedRanges[0]),
		selectWhitespace = whitespaceRE.test(context.substringWithRange(startRange)),
		startLineNumber = context.lineStorage.lineNumberForIndex(startRange.location),
		startLineRange = context.lineStorage.lineRangeForLineNumber(startLineNumber),
		startLineOffset = startRange.location - startLineRange.location,
		targetLineNumber = startLineNumber + dir,
		targetLineRange, nextSelectionRange = null;
	// Don't bother trying to process if our target selection spans more than one line
	if (startRange.location + startRange.length > startLineRange.location + startLineRange.length) {
		return false;
	}
	// Parse through the lines to look for the first one that we can select
	while (targetLineNumber > 0 && targetLineNumber <= context.lineStorage.numberOfLines) {
		targetLineRange = context.lineStorage.lineRangeForLineNumber(targetLineNumber);
		// Skip ahead if the line is nothing but whitespace (unless our original selection was nothing but whitespace) or if it isn't long enough
		if ((!selectWhitespace && whitespaceRE.test(context.substringWithRange(targetLineRange))) || targetLineRange.location + targetLineRange.length < startLineOffset + startRange.length || (!selectWhitespace && whitespaceRE.test(context.substringWithRange(new Range(targetLineRange.location + startLineOffset, startRange.length))))) {
			targetLineNumber += dir;
			continue;
		} else {
			nextSelectionRange = new Range(targetLineRange.location + startLineOffset, startRange.length);
			break;
		}
	}
	// Add our selection to the array, if we have one
	if (nextSelectionRange !== null) {
		// selectedRanges does not appear to support JS array methods push/unshift, so we have to copy it
		var sels = [].concat(context.selectedRanges);
		if (dir === 1) {
			sels.push(nextSelectionRange);
		} else {
			sels.unshift(nextSelectionRange);
		}
		context.selectedRanges = sels;
		return true;
	} else {
		return false;
	}
};

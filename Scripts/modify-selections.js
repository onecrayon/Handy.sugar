/**
 * Modifies multiple selections in-place using snippets
 *
 * setup:
 * - method (string): replace (default), prepend, append
 */

var escSnippetChars = loadLibrary('handy-lib').escSnippetChars;

action.canPerformWithContext = function(context, outError) {
	return context.selectedRanges.length > 1;
};

action.performWithContext = function(context, outError) {
	// Figure out if we are editing, appending, or prepending
	var method = (action.setup.method ? action.setup.method.toLowerCase() : 'replace');
	
	// Grab our first range and initial snippet
	var firstRange = context.selectedRanges[0];
	var snippet = '';
	if (method === 'prepend') {
		snippet = '$1' + escSnippetChars(context.substringWithRange(firstRange));
	} else if (method === 'append') {
		snippet = escSnippetChars(context.substringWithRange(firstRange)) + '$1';
	} else {
		snippet = '${1:' + escSnippetChars(context.substringWithRange(firstRange)) + '}';
	}
	
	// Grab our basic variables we will need while looping through ranges
	var prevRange, lastRange, interimIndex;
	for (var i = 1, count = context.selectedRanges.length; i < count; i++) {
		prevRange = context.selectedRanges[i-1];
		interimIndex = prevRange.location + prevRange.length;
		lastRange = context.selectedRanges[i];
		snippet += escSnippetChars(context.substringWithRange(new Range(interimIndex, lastRange.location - interimIndex)));
		if (method === 'prepend') {
			snippet += '$1' + context.substringWithRange(lastRange);
		} else if (method === 'append') {
			snippet += context.substringWithRange(lastRange) + '$1';
		} else {
			snippet += '$1';
		}
	}
	
	// Figure out full range we are replacing and do the deed
	var target = new Range(firstRange.location, lastRange.location + lastRange.length - firstRange.location);
	context.selectedRanges = [target];
	return context.insertTextSnippet(new CETextSnippet(snippet), CETextOptionVerbatim);
};

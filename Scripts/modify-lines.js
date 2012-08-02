/**
 * modify-lines.js
 * 
 * Allows prepending or appending to each line in a selection, and
 * ignores lines that are nothing but whitespace.
 * 
 * setup:
 * - target (string): where to insert the new characters; 'start', 'end', or 'both'
 */

var escSnippetChars = loadLibrary('handy-lib').escSnippetChars;

action.canPerformWithContext = function(context, outError) {
	// Only perform the action if we have a selection
	return context.selectedRanges.length === 1 && context.selectedRanges[0].length > 0;
};

action.performWithContext = function(context, outError) {
	// Grab our basic variables
	var target = action.setup.target.toLowerCase(),
		prefixLines = (target === 'start' || target === 'both' ? true : false),
		suffixLines = (target === 'end' || target === 'both' ? true : false),
		lineRange = context.lineStorage.lineRangeForRange(context.selectedRanges[0]),
		snippet = escSnippetChars(context.substringWithRange(lineRange));
	
	// This function does the actual parsing
	var insertSnippetVariables = function(match, leadingWS, content, trailingWS) {
		var returnStr = leadingWS;
		if (prefixLines) {
			returnStr += '${1}';
		}
		returnStr += content;
		if (suffixLines) {
			returnStr += '${1}';
		}
		returnStr += trailingWS;
		return returnStr;
	};
	// Run our snippet through the parsing function
	snippet = snippet.replace(/^(\s*)(\S.*?)([ \t]*$[\n\r]*)/gm, insertSnippetVariables);
	console.log(snippet);
	// And insert it, making sure not to re-indent things
	context.selectedRanges = [lineRange];
	context.insertTextSnippet(new CETextSnippet(snippet), CETextOptionVerbatim);
};

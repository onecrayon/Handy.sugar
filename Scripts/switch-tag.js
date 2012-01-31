/**
 * Inserts a snippet that allows to automatically change active tag
 *
 * Also allows jumping back to previous cursor position afterward,
 * if it doesn't overlap the open or close tag
 */

var escSnippetChars = loadLibrary('handy-lib').escSnippetChars;

action.canPerformWithContext = function(context, outError) {
	// Only support single selections
	return context.selectedRanges.length === 1;
};

action.performWithContext = function(context, outError) {
	var range = context.selectedRanges[0];
	var item = context.itemizer.smallestItemContainingCharacterRange(range);
	// Make sure our item is actually a tag
	var isTag = new SXSelector('built-in.tag:not(processing-instruction)');
	if (!isTag.matches(item)) {
		return false;
	}
	// Save our base text
	var text = context.substringWithRange(item.range);
	// Pull out our opening and closing tags
	var openTag = text.replace(/^(<[\w:-]+)[\s\S]*?$/, '$1');
	var closeTag = text.replace(/^[\s\S]*?(<\/[\w:-]+>)$/, '$1');
	var snippet;
	// If old selection occurs outside start and end tags, we can add it to snippet
	var newRangeStart = range.location - item.range.location;
	if (newRangeStart >= openTag.length && (newRangeStart + range.length < text.length - closeTag.length - 1)) {
		// Split the text around the current selection
		var startText = escSnippetChars(text.substr(0, newRangeStart));
		var endText = escSnippetChars(text.substr(newRangeStart + range.length));
		var midText = text.substr(newRangeStart, range.length);
		if (midText.length > 0) {
			midText = '${0:' + escSnippetChars(midText) + '}';
		} else {
			midText = '$0';
		}
		snippet = startText + midText + endText;
	} else {
		snippet = escSnippetChars(text);
	}
	// Insert placeholders
	snippet = '<${1:' + openTag.substr(1) + '}' + snippet.substr(openTag.length, snippet.length - openTag.length - closeTag.length) + '</${1/\\s.*//}>';
	
	// Apply the changes!
	context.selectedRanges = [item.range];
	return context.insertTextSnippet(new CETextSnippet(snippet), CETextOptionVerbatim);
};

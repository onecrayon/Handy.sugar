/**
 * auto-indent-braces.js
 * 
 * Automatically indents the cursor on enter if inside braces.
 */

action.canPerformWithContext = function(context, outError) {
	var sel = context.selectedRanges[0],
		prevChar = '',
		nextChar = '',
		nextIsBoundary = false;
	if (sel.location > 0) {
		prevChar = context.substringWithRange(new Range(sel.location - 1, 1));
	}
	if (sel.location + sel.length < context.string.length) {
		nextChar = context.substringWithRange(new Range(sel.location + sel.length, 1));
		nextIsBoundary = /^(?:\r\n|\r|\n)?$/.test(nextChar);
	}
	return (prevChar === '[' && (nextIsBoundary || nextChar === ']')) || (prevChar === '{' && (nextIsBoundary || nextChar === '}')) || (prevChar === '(' && (nextIsBoundary || nextChar === ')'));
};

action.performWithContext = function(context, outError) {
	var sel = context.selectedRanges[0],
		nextChar = '',
		nextIsBoundary = false;
	if (sel.location + sel.length < context.string.length) {
		nextChar = context.substringWithRange(new Range(sel.location + sel.length, 1));
		nextIsBoundary = /^(?:\r\n|\r|\n)?$/.test(nextChar);
	}
	return context.insertTextSnippet(new CETextSnippet('\n\t$0' + (nextIsBoundary ? '' : '\n')), CETextOptionNormalizeIndentationLevel | CETextOptionNormalizeLineEndingCharacters | CETextOptionNormalizeIndentationCharacters);
};
/**
 * grid-based-tabs.js
 * 
 * Automatically inserts space characters to align text to the next
 * tab grid marker (as opposed to default functionality, which always
 * inserts a tab, regardless of grid position)
 */

action.canPerformWithContext = function(context, outError) {
	// Only run this if we are using spaces instead of tabs and do not have a selection
	return context.selectedRanges[0].length === 0 && /^ +$/.test(context.textPreferences.tabString);
};

action.performWithContext = function(context, outError) {
	// Grab the variables we need
	var range = context.selectedRanges[0],
		tabString = context.textPreferences.tabString,
		// Grab the text before our cursor
		lineRange = context.lineStorage.lineRangeForIndex(range.location),
		text = context.substringWithRange(new Range(lineRange.location, range.location - lineRange.location)),
		textLength = text.length,
		recipe = new CETextRecipe(),
		insertStr = tabString,
		// Replace any tab characters in our indentation to spaces (just in case, to avoid weirdness)
		indentation = text.replace(/^([ \t]*)[\s\S]*$/, '$1'),
		newIndentation = indentation.replace(/\t/g, tabString),
		rewroteIndentation = false;
	if (indentation !== newIndentation) {
		text = text.replace(/^[ \t]*([\s\S]*)$/, newIndentation + '$1');
		rewroteIndentation = true;
	}
	// Check if our indentation is even
	var numIndents = text.length / tabString.length;
	// Rebuild the insertStr if we are not at an even grid line
	while (numIndents !== parseInt(numIndents, 10)) {
		if (insertStr === tabString) {
			// We're on our first rotation, so set to a single space
			insertStr = ' ';
		} else {
			// Not the first rotation, add a space
			insertStr += ' ';
		}
		// Recalculate our indents
		numIndents = (text.length + insertStr.length) / tabString.length;
	}
	
	// Replace the indentation if there were tabs we rewrote
	if (rewroteIndentation) {
		recipe.replaceRange(new Range(lineRange.location, textLength), text + insertStr);
	} else {
		// Otherwise, just insert at the end of the indentation
		recipe.insertAtIndex(lineRange.location + textLength, insertStr);
	}
	
	// Apply our recipe
	return context.applyTextRecipe(recipe);
};

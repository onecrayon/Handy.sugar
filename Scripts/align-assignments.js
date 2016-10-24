/**
 * align-assignments.js
 * 
 * Automatically inserts space characters to align multiple assigments
 * vertically based on the longest line. Automatically skips lines
 * that do not have an obvious assignment.
 * 
 * For example, this:
 * 
 * 'stuff' => 'things,
 * 'foofoo' => 'barbar',
 * 'fibbles' => 'mcgee',
 * 
 * Is transformed into this:
 * 'stuff'   => 'things,
 * 'foofoo'  => 'barbar',
 * 'fibbles' => 'mcgee',
 * 
 */

action.canPerformWithContext = function(context, outError) {
	// Only run if something is selected
	return 1 <= context.selectedRanges.length && 0 < context.selectedRanges[0].length;
};

action.performWithContext = function(context, outError) {
	// Find our longest range, operator, and track lines that need parsing
	var longestRange = 0,
		longestOperator = 0,
		validLines = {},
		tabsToSpaces = ' '.repeat(context.textPreferences.numberOfSpacesForTab),
		commentSelector = new SXSelector('comment'),
		// Capture group 1 => start characters; group 2 => space prior to operator; group 3 => operator
		assignRegex = /^([\t ]*(?:[^\/]|\/(?!\/|\*))*?(?:'(?:[^']|\\')*'|"(?:[^"]|\\")*")*)([\t ]*)(:|=>|=|(?:\.|\+|-|\*\*?|\/\/?|%|&|\|\|?|\^|<<|>>)=)/;
	// Loop through all selected ranges and parse their lines
	for (var i = 0; i < context.selectedRanges.length; i++) {
		// Grab our selection, and parse into lines
		var lineRange = context.lineStorage.lineRangeForRange(context.selectedRanges[i]),
			firstLine = context.lineStorage.lineNumberForIndex(lineRange.location),
			lastLine = context.lineStorage.lineNumberForIndex(lineRange.location + lineRange.length - 1);
		for (var line = firstLine; line <= lastLine; line++) {
			var thisLineRange = context.lineStorage.lineRangeForLineNumber(line);
			// Only proceed if the line is not in a comment
			if (!commentSelector.matches(context.syntaxTree.zoneAtCharacterIndex(thisLineRange.location))) {
				var text = context.substringWithRange(thisLineRange),
					// Parse the start of the line for a possible assignment
					match = assignRegex.exec(text);
				if (match) {
					var initialChars = match[1].replace(/\t/g, tabsToSpaces);
					if (longestRange < initialChars.length) {
						longestRange = initialChars.length;
					}
					if (longestOperator < match[3].length) {
						longestOperator = match[3].length;
					}
					validLines[line] = {
						'adjustedLength': initialChars.length,
						'actualLength': match[1].length,
						'whitespaceLength': match[2].length,
						'operatorLength': match[3].length
					};
				}
			}
		}
	}
	
	// Go through our matched lines and construct a recipe with replacements
	var recipe = new CETextRecipe();
	for (var lineNum in validLines) {
		var lineObj = validLines[lineNum],
			numSpaces = (longestRange - lineObj.adjustedLength) + (longestOperator - lineObj.operatorLength) + 1,
			replaceString = ' ',
			lineRange = context.lineStorage.lineRangeForLineNumber(parseInt(lineNum));
		// Add extra spaces, if necessary
		if (1 < numSpaces) {
			replaceString = ' '.repeat(numSpaces);
		}
		var replaceRange = new Range(lineRange.location + lineObj.actualLength, lineObj.whitespaceLength);
		recipe.replaceRange(replaceRange, replaceString);
	}
	
	// Execute our recipe
	return context.applyTextRecipe(recipe, CETextOptionVerbatim);
};
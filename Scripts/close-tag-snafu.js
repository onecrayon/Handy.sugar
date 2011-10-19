/**
 * Automatically corrects closing tag snafus caused by typing out entire tag
 */

action.performWithContext = function(context, outError) {
	var cursor = context.selectedRanges[0];
	var index = cursor.location - 1;
	var prevStr = '';
	// Default to just entering the > they typed
	var noGo = true;
	if (index > 0) {
		var c = context.substringWithRange(new Range(index, 1));
		var validChar = /^[a-zA-Z0-9:]$/;
		// Parse backwards to figure out if they closed a tag by hand after already closing a tag
		while (index > 0 && c.match(validChar)) {
			prevStr = c + prevStr;
			index--;
			c = context.substringWithRange(new Range(index, 1));
		}
		// If we have a string, check behind it for the closing tag
		if (prevStr.length) {
			var checkStr = '</' + prevStr + '>';
			// Index got moved one character beyond our last append, so add one
			var startIndex = index + 1 - checkStr.length;
			if (startIndex >= 0) {
				var checkRange = new Range(startIndex, checkStr.length);
				if (checkStr === context.substringWithRange(checkRange)) {
					// We indeed have a close tag like: </body>body>
					noGo = false;
				}
			}
		}
	}
	
	// Do our final processing
	var recipe = new CETextRecipe();
	if (noGo) {
		// Just insert the character they entered (>)
		recipe.insertAtIndex(cursor.location, '>');
		recipe.undoActionName = "Typing";
	} else {
		// Remove the duplicate tag-name string that they just typed
		recipe.deleteRange(new Range(cursor.location - prevStr.length, prevStr.length));
	}
	return context.applyTextRecipe(recipe);
};

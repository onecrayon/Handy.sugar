/**
 * This action prevents a duplicate character from being
 * entered in certain contexts
 */

action.canPerformWithContext = function(context, outError) {
	// Require a character to be specified in the XML <setup> tag
	return !!action.setup.character;
};

action.performWithContext = function(context, outError) {
	// Grab the current cursor range
	var range = context.selectedRanges[0];
	// Check to see what the next character is
	var nextChar = context.substringWithRange(new Range(range.location, 1));
	// If the next character is our target character, advance the cursor
	if (nextChar === action.setup.character) {
		context.selectedRanges = [new Range(range.location + 1, 0)];
	} else {
		// Next character is not target character, so insert target character
		var recipe = new CETextRecipe();
		recipe.insertAtIndex(range.location, action.setup.character);
		context.applyTextRecipe(recipe);
	}
	return true;
};
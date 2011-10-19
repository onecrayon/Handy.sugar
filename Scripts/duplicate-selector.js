/**
 * Duplicates the CSS selector underneath the cursor (a la CSSEdit)
 */

action.canPerformWithContext = function(context, outError) {
	var item = context.itemizer.smallestItemContainingCharacterRange(context.selectedRanges[0]);
	return item !== null && new SXSelector('built-in.css.style').matches(item);
};

action.performWithContext = function(context, outError) {
	var range = context.selectedRanges[0];
	// Grab our item and create our inserted text
	var item = context.itemizer.smallestItemContainingCharacterRange(range);
	var br = context.textPreferences.lineEndingString;
	var insert = br + br + context.substringWithRange(item.range);
	// Insert the new text
	var recipe = new CETextRecipe();
	recipe.insertAtIndex(item.range.location + item.range.length, insert);
	context.applyTextRecipe(recipe);
	// Select just the selector
	var selector = context.syntaxTree.zoneAtCharacterIndex(item.range.location + item.range.length + (br.length * 2));
	var target = new SXSelector('selector.css');
	// Climb up the tree if necessary (shouldn't be necessary, but you never know)
	while (!target.matches(selector)) {
		selector = selector.parent;
	}
	// Selectors sometimes contain whitespace at the end before the curly brace, so strip that off if so
	var targetRange = selector.range;
	var selectorText = context.substringWithRange(targetRange);
	var stripped = selectorText.replace(/^(.*?)\s*$/, '$1');
	if (stripped.length < selectorText.length) {
		targetRange = new Range(targetRange.location, stripped.length);
	}
	context.selectedRanges = [targetRange];
	return true;
};

/**
 * Increments or decrements the numeric value beneath the cursor
 * 
 * setup:
 * - amount: integer (ex: 1, -1, 10, -10)
 */

// Action logic

action.canPerformWithContext = function(context, outError) {
	var range = context.selectedRanges[0];
	if (range.length > 0) {
		// If there is a digit anywhere in the first selection, return true
		return /-?\d/.test(context.substringWithRange(range));
	} else {
		var digit = /\d/;
		// If there is a character after the range and it is a digit, return true
		// Or if there is a character before the range and it is a digit, return true
		return (range.location < context.string.length - 1 && digit.test(context.substringWithRange(new Range(range.location, 1)))) || (range.location > 0 && digit.test(context.substringWithRange(new Range(range.location - 1, 1))));
	}
};

action.performWithContext = function(context, outError) {
	// Grab our amount of increase from the setup tag
	if (typeof action.setup.amount === undefined) {
		console.log('bump-numeric script requires an amount to change!');
		return false;
	}
	
	// Setup our recipe
	var recipe = new CETextRecipe();
	
	// Loop over all selections, and update any numeric zones inside
	var range, text = '', replacement = '', target;
	for (var i = 0, count = context.selectedRanges.length; i < count; i++) {
		range = context.selectedRanges[i];
		if (range.length) {
			// We have a selection, so bump numeric zones within it
			text = context.substringWithRange(range);
			replacement = text.replace(/-?\d+(?:\.?[\deE]*)?/g, bumpIntForNumber);
		} else {
			// Grab the number around the cursor and its range
			target = getNumberAndRange(context, range);
			text = target.number;
			range = target.range;
			replacement = bumpIntForNumber(text);
		}
		// Replace if necessary!
		if (replacement !== text) {
			recipe.replaceRange(range, replacement);
		}
	}
	
	// Apply the changes!
	return context.applyTextRecipe(recipe);
};

var amount = (typeof action.setup.amount !== 'undefined' ? parseInt(action.setup.amount, 10) : 0);

// Shared utility variables and functions
var bumpIntForNumber = function(numberStr) {
	// Trim excess characters, since we only want the int
	var match = /^([^\d-]*)(-?\d+)(.*?)$/.exec(numberStr),
		prefix = (match !== null ? match[1] : ''),
		number = (match !== null ? match[2] : numberStr),
		suffix = (match !== null ? match[3] : '');
	return prefix + (parseInt(number, 10) + amount) + suffix;
};

var getNumberAndRange = function(context, range) {
	var re_numberChar = /^[\deE.-]$/;
	
	// Setup basic variables
	var cursor = range.location, number = '', character = '', inNum = false, lastIndex, firstIndex;
	var index = cursor;
	var maxIndex = context.string.length - 1;
	
	// Make sure the cursor isn't at the end of the document
	if (index < maxIndex) {
		// Check if the cursor is mid-word
		character = context.substringWithRange(new Range(index, 1));
		if (re_numberChar.test(character)) {
			inNum = true;
			// Parse forward until we hit the end of the number or document
			while (inNum) {
				character = context.substringWithRange(new Range(index, 1));
				if (re_numberChar.test(character)) {
					number += character;
				} else {
					inNum = false;
				}
				index++;
				if (index > maxIndex) {
					inNum = false;
				}
			}
		} else {
			// The lastIndex logic assumes we've been incrementing as we go, so bump up one to compensate for not going anywhere
			index++;
		}
	}
	// Set our last index for the word
	lastIndex = (index < maxIndex ? index - 1 : index);
	
	// Reset the index to one less than the cursor
	index = cursor - 1;
	// Only walk left if we aren't at the beginning of the text
	if (index >= 0) {
		// Parse backward to get the word ahead of the cursor
		inNum = true;
		while (inNum) {
			character = context.substringWithRange(new Range(index, 1));
			if (re_numberChar.test(character)) {
				number = character + number;
				index--;
			} else {
				inNum = false;
			}
			if (index < 0) {
				inNum = false;
			}
		}
	}
	// Since index is left-aligned and we've overcompensated, need to increase +1
	firstIndex = index + 1;
	
	// Trim excess characters, since we only want the number
	var length = number.length;
	// First trim the beginning
	number = number.replace(/^[^\d-]*(-?\d+.*?)$/, '$1');
	if (number.length !== length) {
		// Lengths differ, so update firstIndex
		firstIndex = firstIndex + (length - number.length);
	}
	// No need to trim the end because the bumpIntForNumber method does that automatically
	
	return {
		"number": number,
		"range": new Range(firstIndex, lastIndex - firstIndex)
	};
};
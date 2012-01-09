/**
 * Automatically adjusts the indentation level when entering close braces
 * 
 * setup:
 * - character (string): the character the user is trying to insert; allows ], }, or )
 */

action.canPerformWithContext = function(context, outError) {
	// Only allow things to proceed if they passed in an approved character
	return action.setup.character === ']' || action.setup.character === '}' || action.setup.character === ')';
};

action.performWithContext = function(context, outError) {
	var range = context.selectedRanges[0],
		lineStartIndex = context.lineStorage.lineStartIndexLessThanIndex(range.location),
		startChar = '',
		endChar = action.setup.character,
		replaceRange = range,
		replaceString = endChar,
		recipe = new CETextRecipe();
	
	// Figure out our starting character to balance the ending one
	switch (endChar) {
		case ']':
			startChar = '[';
			break;
		case '}':
			startChar = '{';
			break;
		case ')':
			startChar = '(';
			break;
	}
	
	// Test if we need to balance the indentation level
	if (range.location !== lineStartIndex && whitespaceRegex.test(context.substringWithRange(new Range(lineStartIndex, range.location - lineStartIndex)))) {
		// The character will be on its own line, so verify the amount of whitespace is correct
		
		// Figure out if we are in a string or not since we will either discount or only count items in strings then
		var zone = context.syntaxTree.zoneAtCharacterIndex(range.location),
			stringSelector = new SXSelector('string, string *'),
			searchStrings = stringSelector.matches(zone),
			// Setup our variables for looping through the file
			curIndex = lineStartIndex - 1, // Tracks the index in the document we are inspecting
			curChar = '',                  // The current character at curIndex
			openItems = 1,                 // The number of open paired characters we have found
			endIndex = null,               // Our final index where the paired character lives
			remainingZones = [],           // Used if we need to skip over syntax zones
			arrIndex = 0,                  // Index when looping over remainingZones array
			arrCount = 0;                  // Length of remainingZones for looping
		
		// Begin our loop to look for the opening brace
		while (endIndex === null && curIndex >= 0) {
			// Make sure we are in a string if we want to be
			zone = context.syntaxTree.zoneAtCharacterIndex(curIndex);
			if ((stringSelector.matches(zone) && searchStrings) || (!stringSelector.matches(zone) && !searchStrings)) {
				// Check to see if our current character is one of the ones we are looking for
				curChar = context.string.substr(curIndex, 1);
				// Increment our start or open items if necessary
				if (curChar === endChar) {
					openItems++;
				} else if (curChar === startChar) {
					openItems--;
				}
				// If openItems is 0 it means we have found our balancing character
				if (openItems === 0) {
					endIndex = curIndex;
				}
				// Prep for our next loop iteration
				curIndex--;
			} else {
				// Need to jump to start of current string, or to the previous string (depending on if we started in a string or not)
				if (stringSelector.matches(zone) && !searchStrings) {
					// Parsing backward, so jump to index before string
					curIndex = zone.range.location - 1;
				} else if (!stringSelector.matches(zone) && searchStrings) {
					// We are outside a string, but are only searching inside of strings; we need to jump to the next string
					// The zones we parse depend on the direction we are moving
					// We are moving backwards, so grab all zones from the beginning of the document to our index
					remainingZones = context.syntaxTree.zonesInCharacterRange(new Range(0, curIndex));
					arrIndex = remainingZones.length;
					// Loop over the array until we find the next string zone
					for (arrCount = remainingZones.length; arrIndex >= 0; arrIndex--) {
						zone = remainingZones[arrIndex];
						// If we have a string, set the index to the start or end depending on which direction we are moving
						if (stringSelector.matches(zone)) {
							curIndex = zone.range.location + zone.range.length - 1;
							// Kill the loop now that we have our string
							break;
						}
					}
				}
			}
		}
		
		// If we have an endIndex, then determine its indentation
		if (endIndex !== null) {
			var startLineRange = context.lineStorage.lineRangeForIndex(endIndex),
				startLine = context.substringWithRange(startLineRange),
				startIndent = startRegex.exec(startLine)[1];
			replaceRange = new Range(lineStartIndex, range.location - lineStartIndex);
			replaceString = startIndent + endChar;
		}
	}
	
	// Perform our insertion!
	recipe.replaceRange(replaceRange, replaceString);
	return context.applyTextRecipe(recipe);
};

var whitespaceRegex = /^\s*$/;
var startRegex = /^(\s*?)\S[\s\S]*$/;

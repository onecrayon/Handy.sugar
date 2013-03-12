/**
 * select-column.js
 * 
 * Extends selections in columns using the keyboard, skipping
 * lines with nothing but whitespace (or lines that end too early).
 * 
 * setup:
 * - direction (string): 'up' or 'down'
 */

action.canPerformWithContext = function(context, outError) {
	return action.setup.direction && context.selectedRanges[0].length > 0;
};

action.performWithContext = function(context, outError) {
	// Determine which direction we are going and setup initial variables
	var dir = (action.setup.direction.toLowerCase() === 'up' ? -1 : 1),
		whitespaceRE = /^\s+$/,
		startRange = (dir === 1 ? context.selectedRanges[context.selectedRanges.length - 1] : context.selectedRanges[0]),
		selectWhitespace = whitespaceRE.test(context.substringWithRange(startRange)),
		startLineNumber = context.lineStorage.lineNumberForIndex(startRange.location),
		startLineRange = context.lineStorage.lineRangeForLineNumber(startLineNumber);
	// Don't bother trying to process if our target selection spans more than one line
	if (startRange.location + startRange.length > startLineRange.location + startLineRange.length) {
		return false;
	}
	
	// Figure out our offsets, adjusted for tab characters
	var spacesPerTab = context.textPreferences.numberOfSpacesForTab,
		startLineParts = context.substringWithRange(startLineRange).split('\t'),
		startLineStart = null, startLineEnd = null, curString = '', curAdjustedIndex = 0, curSegment = '';
	for (var i = 0, count = startLineParts.length; i < count; i++) {
		if (i > 0) {
			curString += '\t';
			// Tabs consume enough spaces to bring them up to the next grid space, so we use the remainder to figure out how many spaces they actually take up
			curAdjustedIndex += spacesPerTab - (curAdjustedIndex % spacesPerTab);
		}
		curSegment = startLineParts[i];
		if (startLineStart === null) {
			if (curString.length === startRange.location - startLineRange.location) {
				// Start index falls on a tab
				startLineStart = curAdjustedIndex;
			} else if (startRange.location - startLineRange.location <= curString.length + curSegment.length) {
				// Start index falls within the upcoming segment
				startLineStart = curAdjustedIndex + (startRange.location - startLineRange.location - curString.length);
			}
		}
		if (startLineEnd === null) {
			if (curString.length === startRange.location + startRange.length) {
				// End index falls at the end of this tab
				startLineEnd = curAdjustedIndex;
			} else if ((startRange.location + startRange.length) - startLineRange.location <= curString.length + curSegment.length) {
				// End index falls in the upcoming segment somewhere
				startLineEnd = curAdjustedIndex + ((startRange.location + startRange.length) - startLineRange.location - curString.length);
			}
		}
		if (startLineStart === null || startLineEnd === null) {
			curString += curSegment;
			curAdjustedIndex += curSegment.length;
		} else {
			break;
		}
	}
	
	var targetLineNumber = startLineNumber + dir,
		targetLineRange, nextSelectionRange = null, targetLineParts = [], targetLineConverted = '';
	// Parse through the lines to look for the first one that we can select
	while (targetLineNumber > 0 && targetLineNumber <= context.lineStorage.numberOfLines) {
		targetLineRange = context.lineStorage.lineRangeForLineNumber(targetLineNumber);
		targetLineParts = context.substringWithRange(targetLineRange).split('\t');
		targetLineConverted = targetLineParts.join(new Array(spacesPerTab + 1).join(' '));
		// Skip ahead if the line is nothing but whitespace (unless our original selection was nothing but whitespace) or if it isn't long enough
		if ((!selectWhitespace && whitespaceRE.test(targetLineConverted)) || targetLineConverted.length < startLineEnd || (!selectWhitespace && whitespaceRE.test(targetLineConverted.substring(startLineStart, startLineEnd)))) {
			targetLineNumber += dir;
			continue;
		} else {
			var targetStart = null, targetEnd = null;
			curAdjustedIndex = 0;
			curString = '';
			curSegment = '';
			for (i = 0, count = targetLineParts.length; i < count; i++) {
				if (i > 0) {
					curString += '\t';
					// Tabs consume enough spaces to bring them up to the next grid space, so we use the remainder to figure out how many spaces they actually take up
					curAdjustedIndex += spacesPerTab - (curAdjustedIndex % spacesPerTab);
				}
				curSegment = targetLineParts[i];
				if (targetStart === null) {
					if (curAdjustedIndex >= startLineStart) {
						// The start offset fell somewhere in the middle of a tab, so adjust to the end of the tab
						targetStart = curString.length;
					} else if (startLineStart <= curAdjustedIndex + curSegment.length) {
						// Start index falls somewhere in our current segment
						targetStart = curString.length + (startLineStart - curAdjustedIndex);
					}
				}
				if (targetEnd === null) {
					if (curAdjustedIndex >= startLineEnd) {
						// End index falls in the middle of a tab; wrap the tab
						targetEnd = curString.length - targetStart;
					} else if (startLineEnd <= curAdjustedIndex + curSegment.length) {
						// End index falls somewhere in our current segment
						targetEnd = curString.length + (startLineEnd - curAdjustedIndex);
					}
				}
				if (targetStart === null || targetEnd === null) {
					curString += curSegment;
					curAdjustedIndex += curSegment.length;
				} else {
					break;
				}
			}
			if (targetEnd === null) {
				targetEnd = curString.length;
			}
			nextSelectionRange = new Range(targetLineRange.location + targetStart, targetEnd - targetStart);
			break;
		}
	}
	// Add our selection to the array, if we have one
	if (nextSelectionRange !== null) {
		// selectedRanges does not appear to support JS array methods push/unshift, so we have to copy it
		var sels = [].concat(context.selectedRanges);
		if (dir === 1) {
			sels.push(nextSelectionRange);
		} else {
			sels.unshift(nextSelectionRange);
		}
		context.selectedRanges = sels;
		return true;
	} else {
		return false;
	}
};

/**
 * select-column.js
 * 
 * Extends selections in columns using the keyboard, skipping
 * lines with nothing but whitespace (or lines that end too early).
 * 
 * setup:
 * - direction (string): 'up' or 'down'
 */

action.performWithContext = function(context, outError) {
	// Determine which direction we are going and setup initial variables
	var dir = (action.setup.direction.toLowerCase() === 'up' ? -1 : 1),
		startRange = (dir === 1 ? context.selectedRanges[context.selectedRanges.length - 1] : context.selectedRanges[0]),
		startLineNumber = context.lineStorage.lineNumberForIndex(startRange.location),
		startLineRange = context.lineStorage.lineRangeForLineNumber(startLineNumber);
	// Don't bother trying to process if our anchor selection spans more than one line
	if (startRange.location + startRange.length > startLineRange.location + startLineRange.length) {
		return false;
	}
	
	/**
	 * We need to determine whether to consider whitespace-only lines/selections
	 * as valid targets. If we have a selection, we simply test the selection.
	 * If we have a cursor, though, we need to test the characters to either side.
	 * 
	 * We also need to test the range on the opposite end of our range set
	 * (otherwise successive uses of select-column may result in changing whitespace
	 * values).
	 * 
	 * This can still result in bad behavior if the user moves in both directions,
	 * but unless we test every single range there isn't any way around this.
	 * 
	 * FIXME: should we test every range? It would guarantee the right behavior, but
	 * starting with whitespace and then moving in both directions while wanting to
	 * still select whitespace seems like such an edge scenario that I'm not sure it's
	 * worth the extra processing.
	 */
	var testRange = startRange;
	if (context.selectedRanges.length > 1) {
		testRange = (dir === 1 ? context.selectedRanges[0] : context.selectedRanges[context.selectedRanges.length - 1]);
	}
	var whitespaceTestLocation = testRange.location,
		whitespaceTestLength = testRange.length;
	if (!whitespaceTestLength) {
		if (whitespaceTestLocation > 0) {
			whitespaceTestLocation -= 1;
			whitespaceTestLength += 1;
		}
		if (whitespaceTestLocation + whitespaceTestLength + 1 < context.string.length) {
			whitespaceTestLength += 1;
		}
	}
	// Check if we should skip whitespace or not
	var whitespaceRE = /^\s*$/,
		whitespaceTestRange = new Range(whitespaceTestLocation, whitespaceTestLength),
		skipWhitespace = !whitespaceRE.test(context.substringWithRange(whitespaceTestRange));
	
	/**
	 * True vertical movement is complicated by the fact that tabs take up a variable
	 * amount of horizontal space if they are mixed with spaces or other characters.
	 * 
	 * To compensate for this, we need to parse through our current line and determine
	 * what the adjusted character offset is for our selection. The end goal is to
	 * figure out the adjusted start and end indices (relative to the line).
	 */
	var spacesPerTab = context.textPreferences.numberOfSpacesForTab,
		startLineParts = context.substringWithRange(startLineRange).split('\t'),
		startLineStart = null, startLineEnd = null,
		curString = '', curAdjustedIndex = 0, curSegment = '';
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
		
		// Similar to before, we need to test adjacent characters if we have a cursor
		var adjustedStartLocation = startLineStart,
			adjustedEndLocation = startLineEnd;
		if (startLineStart === startLineEnd) {
			if (adjustedStartLocation > 0) {
				adjustedStartLocation -= 1;
			}
			if (adjustedEndLocation + 1 < targetLineConverted.length) {
				adjustedEndLocation += 1;
			}
		}
		// Skip ahead if the line is nothing but whitespace (unless our original selection was nothing but whitespace) or if it isn't long enough
		if ((skipWhitespace && whitespaceRE.test(targetLineConverted))
			|| targetLineConverted.length < startLineEnd
			|| (skipWhitespace && whitespaceRE.test(targetLineConverted.substring(adjustedStartLocation, adjustedEndLocation)))) {
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
					if (startLineEnd <= curAdjustedIndex) {
						// End index falls in a tab; bump to the end of the tab character
						targetEnd = curString.length;
					} else if (startLineEnd <= curAdjustedIndex + curSegment.length) {
						// End index falls somewhere in our current segment
						targetEnd = curString.length + (startLineEnd - curAdjustedIndex);
					}
				}
				if (targetStart === null || targetEnd === null) {
					curString += curSegment;
					curAdjustedIndex += curSegment.length;
				} else {
					// Ensure that we maintain our selection length
					if (targetStart === targetEnd) {
						targetEnd += startLineEnd - startLineStart;
					}
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

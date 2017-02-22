/**
 * modify-lines.js
 * 
 * Allows prepending or appending to each line in a selection, and
 * ignores lines that are nothing but whitespace.
 * 
 * setup:
 * - target (string): where to insert the new characters; 'start', 'end', or 'both'
 */

action.titleWithContext = function(context, outError) {
	var fullRange = context.selectedRanges[0];
	if (context.selectedRanges.length > 1) {
		var finalRange = context.selectedRanges[context.selectedRanges.length - 1];
		fullRange = new Range(fullRange.location, finalRange.location + finalRange.length - fullRange.location)
	}
	var linebreaks = context.substringWithRange(fullRange).split(/[\r\n]+/).length - 1;
	return (linebreaks > 1 ? "@multiple" : null);
};

action.performWithContext = function(context, outError) {
	// Grab our basic variables
	var target = action.setup.target.toLowerCase(),
		prefixLines = (target === 'start' || target === 'both' ? true : false),
		suffixLines = (target === 'end' || target === 'both' ? true : false),
		lineRange, lines, line, result, curLocation,
		cursors = [];
	
	for (var i = 0, count = context.selectedRanges.length; i < count; i++) {
		lineRange = context.lineStorage.lineRangeForRange(context.selectedRanges[i]);
		curLocation = lineRange.location;
		lines = context.substringWithRange(lineRange).match(/^.*?([\n\r]+|$)/gm);
		
		if (!lines) return false;
		
		for (var j = 0, lineCount = lines.length; j < lineCount; j++) {
			line = lines[j];
			result = /^(\s*)(\S.*?)(\s*)$/.exec(line);
			if (result) {
				if (prefixLines) {
					cursors.push(new Range(curLocation + result[1].length, 0))
				}
				if (suffixLines) {
					cursors.push(new Range(curLocation + result[1].length + result[2].length, 0))
				}
			}
			curLocation += line.length;
		}
	}
	context.selectedRanges = cursors;
	return true;
};

library.escSnippetChars = function(text) {
	return text.replace(/([${}`])/g, '\\$1');
};
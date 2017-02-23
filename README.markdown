# Handy.sugar

A collection of text actions for [Espresso](http://macrabbit.com/espresso/) that keep your hands on the keyboard, written in Javascript.

## Breaking changes in Handy 2.0

* **Requires Espresso 3.0**
* **Selection editing actions are gone.** Espresso 3 has native support for editing multiple cursors or selections, making these actions redundant.
* **"Edit selected lines" actions now use the old "edit selection" shortcuts**; they also utilize multiple cursors instead of snippets.
* **Select All Copies shortcut now moves upward through the Item hierarchy with each successive use**; a new shortcut is available for selecting all copies of a word in the document.

## Installation

**Requires Espresso 3.0**; use [Handy v1.8.0](https://github.com/onecrayon/Handy.sugar/releases/tag/v1.8.0) for Espresso 2.

1. [Download Handy.sugar](http://onecrayon.com/downloads/Handy.sugar.zip)
2. Decompress the zip file (your browser might do this for you)
3. Double click the Sugar to install it

Optionally, you can clone it from GitHub for easier updating:

    cd ~/Library/Application\ Support/Espresso/Sugars
    git clone git://github.com/onecrayon/Handy.sugar.git

Relaunch Espresso, and a new Handy submenu will be available in your Actions menu. You can then update the Sugar when necessary by running the following command:

    cd ~/Library/Application\ Support/Espresso/Sugars/Handy.sugar
    git pull

## Available actions

Handy.sugar currently includes the following actions:

* **Align Assignments**: vertically aligns all assignment operators in the selected lines
    
        // So this:
        foo = 'bar';
        blag = 'blarg';
        fibbles = 'McGee';
        // Gets transformed into this:
        foo     = 'bar';
        blag    = 'blarg';
        fibbles = 'McGee';

* **Increment/Decrement** by 1 or 10: increase or decrease the numeric value under the cursor, in the current selection, or across multiple selections
* **Quick Switch Tag**: quickly rename the nearest wrapping HTML or XML tag, and then hit tab to jump straight back to what you were editing

### Selection and cursor actions

* **Select Nearby Copies of Word/Text** and **Select All Copies of Word/Text**: selects all instances of the word under the cursor. If you have a selection, all instances of the selected text will be selected instead. When selecting "nearby", selections will be constrained to the nearest parent Item block (this is what is shown in the Navigator). Invoking the "nearby" action multiple times will expand the context upward through the hierarchy; for instance, this allows you to easily select all instances of a variable within a particular function or class.
* **Select Column Up/Down**: when you have a selection that is contained within a single line, these two actions allow you to select text in a column vertically across nearby lines. The selection skips empty lines, lines that have nothing but whitespace (unless your selection is nothing but whitespace), and lines that do not extend far enough to contain the whole selection. _Please note_: a soft-wrapped line is still counted as a single line.
* **Cursor To Line Start/End** and **Bookend Line With Cursors**: modify the cursors for all selected lines (this includes lines with a cursor/selection inside them as well as multiple lines within a larger selection, but excludes lines composed of nothing but whitespace). Cursors will hug line contents (so Cursor To Line Start will place the cursor after the leading whitespace but before the actual content of the line).
* **Combine Selected Ranges**: inclusively select everything from the first selection to the last selection in the document
* **Select Text Between Selected Ranges**: select everything between the first and last selection in the document (excludes the selections themselves)

### Hidden actions

* _Prevent duplicate semicolons_: typing a semicolon at the end of a CSS property will not result in duplicate semicolons anymore if there is already one there (will instead move your cursor outside the property)
* _Documentation comments_: creating a linebreak inside of a documentation comment in PHP or JavaScript will automatically add a leading asterisk to the next line. Documentation comments are formatted like so:

        /**
         * My documentation comment
         */
  
  Additionally, typing `/**` will automatically insert a documentation comment snippet.

* _Auto-indent within braces_: hitting enter next to an opening brace character (`(`, `[`, or `{`), will increase the level of indentation on the next line. For balanced braces, it will also move the closing brace to its own line.
* _Auto-indent closing braces_: typing a closing brace alone on a line will automatically adjust its indentation level to the same as its matching opening brace; this applies to `)`, `]`, and `}`
* _Close tag mistakes_: if you accidentally type a full closing tag in HTML or XML, the extra characters will be automatically removed. For instance, if you type `</div>` in an HTML document, you will end up with `</div>/div>` because of the automatic tag closing in Espresso. With Handy.sugar installed, the extra "/div>" will be automatically removed as soon as you type the `>` character
* _Grid-based tabs_ (currently disabled): if your preferences are set to use spaces instead of tabs, hitting the tab key without a selection will insert the number of spaces to bring your cursor to the next tab grid line. So for instance, if you are using four spaces per tab and there are 6 characters before your cursor in the line, hitting `tab` will insert two spaces (to bring your cursor to the 8 character point). Any tab characters in the line's indentation will be automatically converted to spaces when you hit `tab` to make sure that the grid calculations are accurate.

## Development

Handy.sugar is written entirely in XML and JavaScript using Espresso's [JavaScript API](http://wiki.macrabbit.com/JavaScriptActions/)! To discover how I'm doing things or tweak its behavior to fit your own needs, right click the Sugar in the Finder and choose Show Package Contents or fork this project and go to town.

You can also [email me](http://onecrayon.com/about/contact/) if you have any feedback, requests, or run across any problems.

## Changelog

**2.0**:

* **Requires Espresso 3.0**
* **Breaking change:** selection editing actions have been removed in favor of Espresso 3's native multiple selection and cursor handling, and their shortcuts have been reassigned to cursor placement actions
* **Breaking change:** Select All Copies now restricts selections to the nearest Item block and invoking the action multiple times will expand the search context upward through the document.
* New cursor/selection actions: Cursor To Line Start/End, Bookend Line With Cursors.
* New Select Nearby Copies of Word action that restricts selections to the nearest Item block
* Select All Copies now has a new keyboard shortcut
* CSS Duplicate command has been removed in favor of native Espresso 3 behavior

**1.8**:

* New Align Assignments action: add spaces to vertically align assignment operators across lines

**1.7**:

* **Requires Espresso 2.1**
* New hidden action: auto-indent new line when hitting enter after a brace (or within balanced braces, if you are using [Autopair.sugar](https://github.com/onecrayon/Autopair-sugar))
* Select Column Up/Down now selects text based on visual columns instead of character counts (auto-corrects for mixed tabs and spaces)
* Select All Copies can now act on the current line as well as the document
* Grid Based Tabs is currently disabled (as it interferes with native Espresso tab-stops in Espresso 2.1+)

**1.6**:

* New Select All Copies action that selects all instances of the active word or selection in the document
* New Select Column Up/Down actions for creating columnar selections via the keyboard
* Reshuffled the Handy actions menu around to better organize the growing number of selection-oriented actions

**1.5**:

* New actions for adding characters around all selected line(s) content. Lines with nothing but whitespace are ignored, and characters are automatically placed immediately next to the line content (not before leading whitespace or after trailing whitespace).

**1.4**:

* New hidden action: grid-based tab insertion when using spaces instead of tabs

**1.3**:

* New actions for combining multiple selected ranges into a single selected range, or for selecting the text in between the first and last selected ranges

**1.2**:

* New hidden action: typing a closing brace will automatically indent it based on the indentation of the opening brace (if the closing brace is alone on a line)

**1.1**:

* New Duplicate CSS Rule action
* New actions for editing, prepending to, and appending to multiple selections
* Hitting enter inside of a documentation comment in JS or PHP will automatically insert leading asterisk on next line
* Typing `/**` will trigger an automatic documentation snippet
* Typing out a complete closing tag will strip out the extra junk that results from Espresso's automatic tag closing behavior

**1.0**:

* Initial release
* Includes increment/decrement actions, Quick Switch Tag, and duplicate semicolon prevention in CSS

## MIT License

Copyright (c) 2011-2017 Ian Beck

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

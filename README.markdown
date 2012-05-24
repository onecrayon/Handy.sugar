# Handy.sugar

A handy collection of text actions for Espresso. Currently includes:

* **Increment/Decrement** by 1 or 10: increase or decrease the numeric value under the cursor (or select multiple numeric values to change all of them at once!)
* **Quick Switch Tag**: quickly rename the nearest wrapping HTML or XML tag, and then hit tab to jump straight back to what you were editing
* **Duplicate CSS Rule**: when your cursor is inside of an existing CSS rule, use `command D` to duplicate it (much like you could in CSSEdit, but smarter)
* **Prepend To Selections**, **Edit Selections**, and **Append To Selections**: modify multiple selections in a single document at once. To create multiple selections either hold down option and drag to create multiple selections in a column, or hold down command and drag to create multiple discontiguous selections anywhere
* **Combine Selected Ranges**: select everything from the first selection to the last selection in the document
* **Select Text Between Selected Ranges**: select everything between the first and last selection in the document
* _Prevent duplicate semicolons_ (hidden): typing a semicolon at the end of a CSS property will not result in duplicate semicolons anymore if there is already one there (will instead move your cursor outside the property)
* _Documentation comments_ (hidden): creating a linebreak inside of a documentation comment in PHP or JavaScript will automatically add a leading asterisk to the next line. Documentation comments are formatted like so:

        /**
         * My documentation comment
         */
  
  Additionally, typing `/**` will automatically insert a documentation comment snippet.

* _Auto-indent closing braces_ (hidden): typing a closing brace alone on a line will automatically adjust its indentation level to the same as its matching opening brace; this applies to `)`, `]`, and `}`
* _Grid-based tabs_ (hidden): if your preferences are set to use spaces instead of tabs, hitting the tab key without a selection will insert the number of spaces to bring your cursor to the next tab grid line. So for instance, if you are using four spaces per tab and there are 6 characters before your cursor in the line, hitting `tab` will insert two spaces (to bring your cursor to the 8 character point). Any tab characters in the line's indentation will be automatically converted to spaces when you hit `tab` to make sure that the grid calculations are accurate.
* (hidden): if you accidentally type a full closing tag in HTML or XML, the extra characters will be automatically removed. For instance, if you type `</div>` in an HTML document, you will end up with `</div>/div>` because of the automatic tag closing in Espresso. With Handy.sugar installed, the extra "/div>" will be automatically removed as soon as you type the `>` character

## Installation

**Requires Espresso 2.0**

The easiest way to install Handy.sugar currently is directly from GitHub:

    cd ~/Library/Application\ Support/Espresso/Sugars
    git clone git://github.com/onecrayon/Handy.sugar.git

Relaunch Espresso, and a new Handy submenu will be available in your Actions menu. You can then update the Sugar when necessary by running the following command:

    cd ~/Library/Application\ Support/Espresso/Sugars/Handy.sugar
    git pull

## Development

Handy.sugar is written entirely in XML and JavaScript using Espresso's [JavaScript API](http://wiki.macrabbit.com/index/JavaScriptActions/)! To discover how I'm doing things or tweak its behavior to fit your own needs, right click the Sugar in the Finder and choose Show Package Contents or fork this project and go to town.

You can also [let me know](http://onecrayon.com/about/contact/) if you have any feedback, requests, or run across any problems.

## Changelog

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

Copyright (c) 2011 Ian Beck

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Handy.sugar

A handy collection of text actions for Espresso. Currently includes:

* Increment/Decrement by 1 or 10: increase or decrease the numeric value under the cursor (or select multiple numeric values to change all of them at once!)
* Quick Switch Tag: quickly rename the nearest wrapping HTML or XML tag, and then hit tab to jump straight back to what you were editing
* (hidden): typing a semicolon at the end of a CSS property will not result in duplicate semicolons anymore if there is already one there (will instead move your cursor outside the property)

## Installation

**Requires Espresso 2.0**

The easiest way to install Handy.sugar currently is directly from GitHub:

    cd ~/Library/Application\ Support/Espresso/Sugars
    git clone git://github.com/onecrayon/Handy.sugar.git

Relaunch Espresso, and a new Handy submenu will be available in your Actions menu.

## Development

Handy.sugar is written entirely in XML and JavaScript using Espresso [JavaScript API](http://wiki.macrabbit.com/index/JavaScriptActions/)! To discover how I'm doing things or tweak its behavior to fit your own needs, right click the Sugar in the Finder and choose Show Package Contents.

You can also [let me know](http://onecrayon.com/about/contact/) if you have any feedback, requests, or run across any problems.

## MIT License

Copyright (c) 2011 Ian Beck

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

position:static
body{
    position: static;
        default position value of an element
        sits on top of next one. You cannot use top right bottom left to offset these.
    position: relative;
        adjust relative positioned elements with offset properties such as top, bottom , left right, so,
        left:200px; means it would be pushed out 200px to the right
    position: absolute;
    position: fixed;
    position: inherit;
    border: <width> <style> <color>;
    box-sizing: border-box; if you want width and height to stay the same when adding padding and borders.
}

Since we want to keep the padding the same without adding more space to the content overall box width and height, we are going to be used border-box to keep everything neat. so it has a consistent ratio for both small & large screens.

Responsive web dev means that the user applies styles that allow the website to look good and function well in variying screen dimensions.

Use of symbol that represents the universal selector
-*, it selects all elements on a page and applies styles to them. In bloc jams, all elements are sized using border-box.

What does CSS pseudo-elements ::before  & ::after do? Why is it important?
-they are usually written with one colon, they create pseudo-elements that are teh first(::before) & last (::after) child of the     matched element respectively.

What are the benefits of multiple CSS files for a single app
-because as we add pages to the website, it's difficult to navigate through one css file, since different styles are applied to differnt elements with classes and ID's. Usually global style changes are set on main.css that apply to many pages.

What is a media querie and why is it used in a CSS file?
A common method of applying styles based on device breakpoints.

What are the benefits of a grid system and why is it used?
-A responsive grid separates elements into cloumns & rows that collapse & expand based on device breakpoints. Breakpoint is a measurement that correspononds to the width of a device screen. It marks when certain mobile/desktop styles should be enabled/disabled.

/*Medium & small screen (640px)*/
@media (min-width:640px) {
}
/*Large screen(1024px)*/
@media (min-width:1024px) {
}
These @media queries corresponds to the `root em` mesasurements for medium & large desktop devices. Root em is relative to the default browser font-size which is 16, is 16px is small, so we set it above 100%. Browser sets a default text-size(basis for root ems), it sets the size on the html element.

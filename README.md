# Ractive Menu

A dropdown menu component built on [Ractive](https://github.com/ractivejs/ractive).

## Where to get it?

Ractive Menu is available as a [giblet](https://github.com/evs-chris/gobble-giblet), a [component](https://github.com/componentjs/component), and a pre-assembled UMD module. Each flavor does not declare an explicit dependency on Ractive, but it is expected to be available as a global.

All of the pre-built files live in tags on the build branch.

### Development

Ractive Menu uses [gobble](https://github.com/gobblejs/gobble) as its build tool, which makes it easy to build and play around with. The default mode in the gobble file is `development`, which will automatically pull in the edge version of Ractive and make it available along with the sandbox. There is an example file provided along with the source, which you can access by running gobble and pointing you browser at http://localhost:4567/sandbox/example.html.

## Usage

To use Menu, add a component reference to your template.

### Attributes

* `children` - parameter - the tree of menu items. Items are objects that may have:
  * `type` - string - type of menu item (currently `'item'` or `'separator'` - default is `'item'`)
  * `label` - string - what to display
  * `children` - array - sub-menu items
  * `action` - function | truthy value - an action to execute when the item is selected
    If a function, the function will be executed.
    Otherwise, the value will be passed to the `otherAction` function if one is available.
  * `position` - string - defaults to `'left'`, but may also be specified as `'right'`. This really only affect top-level items.
* `otherAction` - parameter - for actionable menu items that don't have a function action, this function will be called with their action value.

### Client

The default menu UI is a horizontal dropdown desktop-style menu. Menu items with sub-menus automatically expand on mouseover or when their arrow is touched. Items that are actionable are bold by default.

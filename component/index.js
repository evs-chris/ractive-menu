(function () {

  'use strict';

  "use strict";
  
  /* global Ractive */
  /* jshint esnext: true */
  
  var index__windowOffset = function index__windowOffset(which, el) {
    var total = el["offset" + which];
    return !!el.offsetParent ? index__windowOffset(which, el.offsetParent) + total : total;
  };
  
  function index__positionLiChild(e) {
    var li = e.node;
    var ul = li.querySelector("ul");
    if (!!ul) {
      if (li.parentNode.parentNode.tagName !== "LI") {
        // hey... it's a top-level...
        ul.style.top = li.clientHeight + "px";
        if (ul.clientWidth + li.offsetLeft > window.innerWidth) ul.style.left = (li.clientWidth - ul.clientWidth - 3) + "px";else ul.style.left = "0px";
      } else {
        // farther down
        ul.style.top = "0px";
        if (ul.clientWidth + index__windowOffset("Left", li) + li.clientWidth > window.innerWidth) ul.style.left = -(ul.offsetWidth) + "px";else ul.style.left = li.clientWidth + "px";
      }
    }
  }
  
  function index__parents(el, arr) {
    arr = arr || [];
    if (el.tagName === "LI") arr.push(el);else if (el.tagName === "UL" && el.className.indexOf("ractive-menu") !== -1) return arr;
    return index__parents(el.parentNode, arr);
  }
  
  function index__removeClass(el, cls) {
    if (el.classList) {
      el.classList.remove(cls);
    } else {
      el.setAttribute("class", el.className.replace(new RegExp("\\b" + cls + "\\b ?"), ""));
    }
  }
  
  function index__addClass(el, cls) {
    if (el.classList) {
      el.classList.add(cls);
    } else {
      el.setAttribute("class", el.className + " " + cls);
    }
  }
  
  function index__closeExcept(except) {
    var cls = this.get("openClass") || "rm-open";
    var opened = this.findAll("li." + cls);
    for (var i = 0; i < opened.length; i++) if (except.indexOf(opened[i]) === -1) index__removeClass(opened[i], cls);
    return cls;
  }
  
  var index__Menu = Ractive.extend({
    template: "<ul class=\"ractive-menu{{#horizontal}} horizontal{{/}}{{#dropdown}} dropdown{{/}}\">{{#children}}{{>menu}}{{/}}</ul>",
    partials: {
      menu: "{{>(.type || 'item')}}",
      item: "<li on-mouseover='enter' on-mouseout='leave' class='{{#(.children.length > 0)}}with-children{{/}}{{#.position}} {{position}}{{/}}{{#(!!.action)}} actionable{{/}}'><a href='#' on-click='clicked'>{{.label}}</a>{{#(.children.length > 0)}}<ul>{{#.children}}{{>menu}}{{/}}</ul>{{/}}</li>",
      separator: "<li class='separator'></li>"
    },
    data: {
      openClass: "",
      horizontal: true,
      dropdown: true,
      closeOnClick: true
    },
    onrender: function () {
      var menu = this;
      menu.on("clicked", function (e) {
        var close = menu.get("closeOnClick");
        var fn = e.context.action;
        if (!!fn && typeof fn === "function") {
          if (close) index__closeExcept.call(menu, []);
          fn();
        } else if (!!fn) {
          var other = menu.get("otherAction");
          if (!!other && typeof other === "function") {
            if (close) index__closeExcept.call(menu, []);
            other(fn);
          }
        }
        e.original.preventDefault();
      });
      menu.on("enter", function (e) {
        var cls = index__closeExcept.call(menu, index__parents(e.original.target));
        index__positionLiChild(e);
        if (!!e.node.querySelector("ul")) {
          index__addClass(e.node, cls);
          if (!!e.node.timeout) {
            clearTimeout(e.node.timeout);
            delete e.node.timeout;
          }
        }
      });
      menu.on("leave", function (e) {
        if (!!e.node.timeout) {
          clearTimeout(e.node.timeout);
        }
        e.node.timeout = setTimeout(function () {
          var cls = menu.get("openClass") || "rm-open";
          index__removeClass(e.node, cls);
          var ul = e.node.querySelector("ul");
          if (!!ul) {
            ul.style.top = ul.style.left = "";
          }
        }, menu.get("timeout") || 300);
      });
    }
  });
  
  var index__default = index__Menu;
  //# sourceMappingURL=01-_6to5-index.js.map

  exports.default = index__default;

}).call(global);
//# sourceMappingURL=./index.js.map
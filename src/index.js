/* global Ractive */

var windowOffset = function windowOffset(which, el) {
  var total = el['offset' + which];
  return !!el.offsetParent ? windowOffset(which, el.offsetParent) + total : total;
};

function positionLiChild(e) {
  var li = e.node;
  var ul = li.querySelector('ul');
  if (!!ul) {
    if (li.parentNode.parentNode.tagName !== 'LI') { // hey... it's a top-level...
      ul.style.top = li.clientHeight + 'px';
      if (ul.clientWidth + li.offsetLeft > window.innerWidth) ul.style.left = (li.clientWidth - ul.clientWidth) + 'px';
      else ul.style.left = '0px';
    } else { // farther down
      ul.style.top = '0px';
      if (ul.clientWidth + windowOffset('Left', li) + li.clientWidth > window.innerWidth) ul.style.left = -(ul.offsetWidth) + 'px';
      else ul.style.left = li.clientWidth + 'px';
    }
  }
}

function parents(el, arr) {
  arr = arr || [];
  if (el.tagName === 'LI') arr.push(el);
  else if (el.tagName === 'UL' && el.classList.contains('ractive-menu')) return arr;
  return parents(el.parentNode, arr);
}

function closeExcept(except) {
  var cls = this.get('openClass') || 'rm-open';
  var opened = this.findAll('li.' + cls);
  for (var i = 0; i < opened.length; i++) if (except.indexOf(opened[i]) === -1) opened[i].classList.remove(cls);
  return cls;
}

var Menu = Ractive.extend({
  template: '<ul class="ractive-menu{{#horizontal}} horizontal{{/}}{{#dropdown}} dropdown{{/}}">{{#children}}{{>menu}}{{/}}</ul>',
  partials: {
    menu: "{{>(.type || 'item')}}",
    item: "<li on-mouseover='enter' on-mouseout='leave' class='{{#(.children.length > 0)}}with-children{{/}}{{#.position}} {{position}}{{/}}{{#(!!.action)}} actionable{{/}}'><a href='#' on-click='clicked'>{{.label}}</a>{{#(.children.length > 0)}}<ul>{{#.children}}{{>menu}}{{/}}</ul>{{/}}</li>",
    separator: "<li class='separator'></li>"
  },
  data: {
    openClass: '',
    horizontal: true,
    dropdown: true,
    closeOnClick: true
  },
  onrender() {
    var menu = this;
    menu.on('clicked', function(e) {
      var close = menu.get('closeOnClick');
      var fn = e.context.action;
      if (!!fn && typeof fn === 'function') {
        if (close) closeExcept.call(menu, []);
        fn();
      }
      else if (!!fn) {
        var other = menu.get('otherAction');
        if (!!other && typeof other === 'function') {
          if (close) closeExcept.call(menu, []);
          other(fn);
        }
      }
      e.original.preventDefault();
    });
    menu.on('enter', function(e) {
      var cls = closeExcept.call(menu, parents(e.original.target));
      positionLiChild(e);
      if (!!e.node.querySelector('ul')) {
        e.node.classList.add(cls);
        if (!!e.node.timeout) {
          clearTimeout(e.node.timeout);
          delete e.node.timeout;
        }
      }
    });
    menu.on('leave', function(e) {
      if (!!e.node.timeout) {
        clearTimeout(e.node.timeout);
      }
      e.node.timeout = setTimeout(function() {
        var cls = menu.get('openClass') || 'rm-open';
        e.node.classList.remove(cls);
        var ul = e.node.querySelector('ul');
        if (!!ul) {
          ul.style.top = ul.style.left = '';
        }
      }, menu.get('timeout') || 300);
    });
  }
});

export default Menu;

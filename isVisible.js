function isVisible(node) {
  if (!node) {
    return false;
  }

  //-- Cross browser method to get style properties:
  function _getStyle(el, property) {
    if (window.getComputedStyle) {
      return document.defaultView.getComputedStyle(el, null)[property];
    }
    if (el.currentStyle) {
      return el.currentStyle[property];
    }
  }

  function _elementInDocument(element) {
    element = element.parentNode;

    while (element) {
      if (element === document) {
        return true;
      }
      element = element.parentNode;
    }
    return false;
  }

  /**
   * Checks if a DOM element is visible. Takes into
   * consideration its parents and overflow.
   *
   * @param (el)      the DOM element to check if is visible
   *
   * These params are optional that are sent in recursively,
   * you typically won't use these:
   *
   * @param (t)       Top corner position number
   * @param (r)       Right corner position number
   * @param (b)       Bottom corner position number
   * @param (l)       Left corner position number
   * @param (w)       Element width number
   * @param (h)       Element height number
   */
  function _isVisible(el, t, r, b, l, w, h) {
    var p = el.parentNode,
      VISIBLE_PADDING = 1; // has to be visible at least one px of the element

    if (!_elementInDocument(el)) {
      return false;
    }

    //-- Return true for document node
    if (9 === p.nodeType) {
      return true;
    }

    //-- Return false if our element is invisible
    if (
      "0" === _getStyle(el, "opacity") ||
      "none" === _getStyle(el, "display") ||
      "hidden" === _getStyle(el, "visibility")
    ) {
      return false;
    }

    if (
      !isDefined(t) ||
      !isDefined(r) ||
      !isDefined(b) ||
      !isDefined(l) ||
      !isDefined(w) ||
      !isDefined(h)
    ) {
      t = el.offsetTop;
      l = el.offsetLeft;
      b = t + el.offsetHeight;
      r = l + el.offsetWidth;
      w = el.offsetWidth;
      h = el.offsetHeight;
    }

    if (
      node === el &&
      (0 === h || 0 === w) &&
      "hidden" === _getStyle(el, "overflow")
    ) {
      return false;
    }

    //-- If we have a parent, let's continue:
    if (p) {
      //-- Check if the parent can hide its children.
      if (
        "hidden" === _getStyle(p, "overflow") ||
        "scroll" === _getStyle(p, "overflow")
      ) {
        //-- Only check if the offset is different for the parent
        if (
          //-- If the target element is to the right of the parent elm
          l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
          //-- If the target element is to the left of the parent elm
          l + w - VISIBLE_PADDING < p.scrollLeft ||
          //-- If the target element is under the parent elm
          t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
          //-- If the target element is above the parent elm
          t + h - VISIBLE_PADDING < p.scrollTop
        ) {
          //-- Our target element is out of bounds:
          return false;
        }
      }
      //-- Add the offset parent's left/top coords to our element's offset:
      if (el.offsetParent === p) {
        l += p.offsetLeft;
        t += p.offsetTop;
      }
      //-- Let's recursively check upwards:
      return _isVisible(p, t, r, b, l, w, h);
    }
    return true;
  }

  return _isVisible(node);
}

function isDefined(property) {
  // workaround https://github.com/douglascrockford/JSLint/commit/24f63ada2f9d7ad65afc90e6d949f631935c2480
  var propertyType = typeof property;

  return propertyType !== "undefined";
}

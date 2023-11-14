const iframeElement = document.getElementById("recordingPlayer");
let modalEle = [];
let domHeight = 0;

function hideElement() {
  modalEle = [];
  const elements =
    iframeElement.contentWindow.document.body.querySelectorAll("body *");

  const iframeDocument =
    iframeElement.contentDocument || iframeElement.contentWindow.document;
  const iframeRect = iframeDocument.documentElement.getBoundingClientRect();

  for (let i = 0; i < elements.length; i++) {
    let ele = elements[i];
    // let ret = ele.getBoundingClientRect();
    let computedStyle = window.getComputedStyle(ele);

    const opacity = parseFloat(computedStyle.getPropertyValue("opacity"));
    const visibility = computedStyle.getPropertyValue("visibility");
    const display = computedStyle.getPropertyValue("display");
    const zIndex = parseInt(computedStyle.getPropertyValue("z-index"), 10);
    const position = computedStyle.getPropertyValue("position");

    if (
      zIndex > 0 &&
      display !== "none" &&
      visibility !== "hidden" &&
      opacity > 0 &&
      !["button", "a"].includes(ele.tagName.toLowerCase()) &&
      position === "fixed"
    ) {
      modalEle.push(ele);
    }
  }

  if (modalEle) {
    elements.forEach((element) => {
      modalEle.forEach((mod) => {
        if (element !== mod && !mod.contains(element)) {
          element.classList.add("heatmap-com__hidden-element"); // set visibility to hidden here when testing on actual websites
        }
      });
    });
  }

  elements.forEach((ele) => {
    if (
      ele.classList.contains("heatmap-com__hidden-element") &&
      !modChild(ele)
    ) {
      ele.style.visibility = "hidden";
    }
  });

  modalEle.forEach((ele) => {
    let height = +ele.style.height.replace("px", "");
    if (height > domHeight) domHeight = height;
    const allChildren = getAllChildren(ele);
    for (let i = 0; i < allChildren.length; i++) {
      allChildren[i].style.visibility = "visible";
    }
  });

  // Get the visible width and height
  const visibleWidth = iframeRect.width;
  const visibleHeight = domHeight;
  console.log("Visible Width:", visibleWidth);
  console.log("Visible Height:", visibleHeight);

  for (let i = 0; i < elements.length; i++) {
    console.log(isElementVisible(elements[i]));
    if (!isElementVisible(elements[i])) {
      // elements[i].style.visibility = "visible";
    }
  }

  function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = visibleHeight;
    const windowWidth = visibleWidth;

    // Check if the element is fully visible
    const isVisible =
      rect.top >= 0 &&
      rect.bottom <= windowHeight &&
      rect.left >= 0 &&
      rect.right <= windowWidth;

    return isVisible;
  }

  function modChild(child) {
    modalEle.forEach((ele) => {
      if (ele === child || ele.contains(child)) return true;
      return false;
    });
  }

  function getAllChildren(element) {
    let children = [];
    children.push(element);
    for (let i = 0; i < element.children.length; i++) {
      children = children.concat(getAllChildren(element.children[i]));
    }
    return children;
  }
}

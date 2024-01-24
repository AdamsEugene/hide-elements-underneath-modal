function hideElementsIfLargeModal() {
  console.log("showing only modals.....");
  const modalEle = [];
  const onScreenModal = [];

  const elements = document.body.querySelectorAll("body *");
  document.body.style.overflowY = "scroll";

  const iframeRect = document.documentElement.getBoundingClientRect();

  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];
    const computedStyle = window.getComputedStyle(element);

    const opacity = parseFloat(computedStyle.getPropertyValue("opacity"));
    const visibility = computedStyle.getPropertyValue("visibility");
    const display = computedStyle.getPropertyValue("display");
    const zIndex = parseInt(computedStyle.getPropertyValue("z-index"), 10);
    const position = computedStyle.getPropertyValue("position");
    let height = computedStyle.getPropertyValue("height");

    if (element.shadowRoot) {
      detectShadowDomElements(element);
    }

    if (element.tagName.toLowerCase() === "iframe") {
      detectIframe(element, element.parentNode);
    }

    if (height.includes("px")) {
      height = +height.split("px")[0];
    }

    if (
      zIndex > 0 &&
      display !== "none" &&
      visibility !== "hidden" &&
      opacity > 0 &&
      position === "fixed" &&
      isHeightOkay(height)
    ) {
      modalEle.push(element);
    }
  }

  if (modalEle) {
    modalEle.forEach((element) => {
      if (
        !importantModals(element) &&
        !isSmallHeader(element) &&
        !isLeftModal(element)
      ) {
        onScreenModal.push(element);
      }
    });

    if (onScreenModal.length) {
      onScreenModal.forEach((modal) => {
        modal.style.setProperty("display", "none", "important");
      });
    }
  }

  function isLeftModal(element) {
    const ele = element.getBoundingClientRect();
    if (
      ele.left < 100 &&
      ele.width <= 400 &&
      ele.height >= window.innerHeight / 2
    ) {
      return true;
    }
    return false;
  }

  function importantModals(element) {
    const ele = element.getBoundingClientRect();
    if (
      ele.top < 100 &&
      ele.width === iframeRect.width &&
      ele.height <= window.innerHeight / 3
    ) {
      return true;
    }
    return false;
  }

  function isSmallHeader(element) {
    const ele = element.getBoundingClientRect();
    if (ele.top < 100 && ele.height <= 50) {
      return true;
    }
    return false;
  }

  function isHeightOkay(height) {
    if (typeof height === "string") return true;
    return height > 5;
  }
}

function detectShadowDomElements(element) {
  const shadowRoot = element.shadowRoot;
  const hostElement = shadowRoot.host;

  const subChildren = getAllChildren(shadowRoot);

  subChildren.forEach((child) => {
    if (child instanceof Element) {
      const computedStyle = window.getComputedStyle(child);
      const opacity = parseFloat(computedStyle.getPropertyValue("opacity"));
      const visibility = computedStyle.getPropertyValue("visibility");
      const display = computedStyle.getPropertyValue("display");
      const zIndex = parseInt(computedStyle.getPropertyValue("z-index"), 10);
      const position = computedStyle.getPropertyValue("position");
      let height = parseInt(computedStyle.getPropertyValue("height"), 10);
      if (
        zIndex > 0 &&
        display !== "none" &&
        visibility !== "hidden" &&
        opacity > 0 &&
        position === "fixed" &&
        height > 20
      ) {
        hostElement.style.setProperty("display", "none", "important");
      }
    }
  });
}

function detectIframe(element, parentNode) {
  if (element.contentDocument) {
    const parentElement = element;
    const iframeChildren = element.contentDocument.body.children;
    const iframeNoOfChildren = iframeChildren?.length;
    const subChildren = getAllChildren(element.contentDocument.body);

    subChildren.forEach((child) => {
      const computedStyle = window.getComputedStyle(child);
      const opacity = parseFloat(computedStyle.getPropertyValue("opacity"));
      const visibility = computedStyle.getPropertyValue("visibility");
      const display = computedStyle.getPropertyValue("display");
      const zIndex = parseInt(computedStyle.getPropertyValue("z-index"), 10);
      const position = computedStyle.getPropertyValue("position");
      let height = parseInt(computedStyle.getPropertyValue("height"), 10);
      if (
        (zIndex > 0 || isNaN(zIndex)) &&
        display !== "none" &&
        visibility !== "hidden" &&
        opacity > 0 &&
        position === "fixed" &&
        height > 20
      ) {
        if (iframeNoOfChildren === 1 && parentNode) {
          parentNode?.style.setProperty("display", "none", "important");
        }
        parentElement?.style.setProperty("display", "none", "important");
      }
    });
  }
}

function getAllChildren(element) {
  let children = [];
  children.push(element);
  for (let i = 0; i < element.children.length; i += 1) {
    children = children.concat(getAllChildren(element.children[i]));
  }
  return children;
}

hideElementsIfLargeModal();

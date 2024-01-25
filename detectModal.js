function hideElementsIfLargeModal() {
  console.log("showing only modals.....");
  const modalEle = [];
  const onScreenModal = [];

  const elements = document.body.querySelectorAll("body *");
  document.body.style.overflowY = "scroll";

  const iframeRect = document.documentElement.getBoundingClientRect();
  const documentHeight = document.documentElement.scrollHeight;
  console.log("====================================");
  console.log(iframeRect, documentHeight);
  console.log("====================================");

  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];
    const computedStyle = window.getComputedStyle(element);

    const opacity = parseFloat(computedStyle.getPropertyValue("opacity"));
    const visibility = computedStyle.getPropertyValue("visibility");
    const display = computedStyle.getPropertyValue("display");
    const zIndex = parseInt(computedStyle.getPropertyValue("z-index"), 10);
    const position = computedStyle.getPropertyValue("position");

    if (element.shadowRoot) {
      detectShadowDomElements(element, iframeRect, documentHeight);
    }

    // if (element.tagName.toLowerCase() === "iframe") {
    //   detectIframe(element, element.parentNode);
    // }

    function conditions(
      opacity,
      visibility,
      display,
      zIndex,
      position,
      element
    ) {
      return (
        zIndex > 0 &&
        display !== "none" &&
        visibility !== "hidden" &&
        opacity > 0 &&
        !["button"].includes(element.tagName.toLowerCase()) &&
        position === "fixed"
      );
    }

    if (conditions(opacity, visibility, display, zIndex, position, element)) {
      modalEle.push(element);
    }
  }

  if (modalEle) {
    modalEle.forEach((element) => {
      if (
        !importantModals(element) &&
        !isSmallHeader(element) &&
        !isLeftModal(element, iframeRect?.width / 3) &&
        !smallModalIsOkay(element) &&
        !hasNoChild(element) &&
        isInRange(element, (iframeRect?.width || 0) + 10, documentHeight) &&
        heightMustBeMore(element)
      ) {
        onScreenModal.push(element);
      }
    });

    if (onScreenModal.length) {
      onScreenModal.forEach((modal) => {
        nextElementSiblingIsOverlay(modal);
        console.log("====================================");
        console.log("hideElementsIfLargeModal ", modal);
        console.log("====================================");
        modal.style.setProperty("display", "none", "important");
      });
    }
  }

  function nextElementSiblingIsOverlay(element) {
    const overlay = element.nextElementSibling;
    if (overlay instanceof Element) {
      const computedStyle = window.getComputedStyle(overlay);

      const opacity = parseFloat(computedStyle.getPropertyValue("opacity"));
      const visibility = computedStyle.getPropertyValue("visibility");
      const display = computedStyle.getPropertyValue("display");
      const zIndex = parseInt(computedStyle.getPropertyValue("z-index"), 10);
      const position = computedStyle.getPropertyValue("position");
      console.log("====================================");
      console.log("nextElementSiblingIsOverlay up ", overlay);
      console.log("====================================");
      console.log({
        opacity,
        visibility,
        display,
        zIndex,
        position,
        overlay: overlay.tagName.toLowerCase(),
      });
      if (conditions(opacity, visibility, display, zIndex, position, overlay)) {
        console.log("====================================");
        console.log("nextElementSiblingIsOverlay ", overlay);
        console.log("====================================");
        overlay.style.setProperty("display", "none", "important");
      }
    }
  }

  function hasNoChild(element) {
    console.log("====================================");
    console.log(element.childElementCount);
    console.log("====================================");
    return element.childElementCount === 0;
  }

  function smallModalIsOkay(element) {
    const ele = element.getBoundingClientRect();
    if (ele.width <= 100 && ele.height <= 100) {
      return true;
    }
    return false;
  }

  function isLeftModal(element, width) {
    const ele = element.getBoundingClientRect();
    if (
      ele.left < 100 &&
      ele.width <= width &&
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
      ele.width <= iframeRect.width + 5 &&
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
}

function heightMustBeMore(element) {
  const ele = element.getBoundingClientRect();
  return ele.height > 5;
}

function isInRange(element, width, height) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -5 &&
    rect.left >= -10 &&
    rect.right <= width &&
    rect.height <= height + 10
  );
}

function detectShadowDomElements(element, iframeRect, documentHeight) {
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
        height > 20 &&
        !["button"].includes(child.tagName.toLowerCase()) &&
        isInRange(child, iframeRect.width, documentHeight) &&
        heightMustBeMore(child)
      ) {
        console.log({
          opacity,
          visibility,
          display,
          zIndex,
          position,
          overlay: child.tagName.toLowerCase(),
        });
        console.log("====================================");
        console.log("detectShadowDomElements ", hostElement);
        console.log("====================================");
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
          console.log("====================================");
          console.log("detectIframe ", parentNode);
          console.log("====================================");
          parentNode?.style.setProperty("display", "none", "important");
        }
        console.log("====================================");
        console.log("detectIframe ", parentElement);
        console.log("====================================");
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

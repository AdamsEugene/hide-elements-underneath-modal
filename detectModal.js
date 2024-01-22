function hideElementsIfLargeModal() {
  console.log("showing only modals.....");
  const modalEle = [];
  const onScreenModal = [];

  const elements = document.body.querySelectorAll("body *");

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
      detectShadowDomElements(
        element,
        opacity,
        visibility,
        display,
        zIndex,
        position
      );
    }
    if (height.includes("px")) {
      height = +height.split("px")[0];
    }

    if (
      zIndex > 0 &&
      display !== "none" &&
      visibility !== "hidden" &&
      opacity > 0 &&
      !["button", "a"].includes(element.tagName.toLowerCase()) &&
      position === "fixed" &&
      isHeightOkay(height)
    ) {
      modalEle.push(element);
    }
  }

  // if (modalEle) {
  //   modalEle.forEach((element) => {
  //     const ele = element.getBoundingClientRect();
  //     const height = ele.height;
  //     const width = ele.width;
  //     // if (
  //     // isInRange(element) &&
  //     // height > 0 &&
  //     // width > 0 &&
  //     // !importantModals(element)
  //     // ) {
  //     console.log(element);
  //     onScreenModal.push(element);
  //     // console.log({ modalH: height, modalW: width, iframe: iframeRect, ele });
  //     // }
  //   });

  //   // console.log({ onScreenModal });
  // }

  if (modalEle.length) {
    modalEle.forEach((modal) => {
      modal.style.setProperty("display", "none", "important");
    });
  }

  function importantModals(element) {
    const ele = element.getBoundingClientRect();
    if (
      ele.top < 5 &&
      ele.width === iframeRect.width &&
      ele.height <= window.innerHeight / 3
    ) {
      return true;
    }
    return false;
  }

  function isInRange(element) {
    const rect = element.getBoundingClientRect();
    const isVisible =
      rect.top >= 0 &&
      // rect.bottom <= iframeRect.height &&
      rect.left >= 0 &&
      rect.right <= iframeRect.width;
    return isVisible;
  }

  function isHeightOkay(height) {
    if (typeof height === "string") return true;
    return height > 5;
  }
}

const detectShadowDomElements = (
  element,
  opacity,
  visibility,
  display,
  zIndex,
  position
) => {
  const shadowRoot = element.shadowRoot;
  const hostElement = shadowRoot.host;
  hostElement.remove();
  const shadowChildren = Array.from(shadowRoot.children);
  console.log({ shadowChildren });

  for (let i = 0; i < shadowChildren.length; i++) {
    console.log("hostElement in", { hostElement }, i);
    console.log("some ", shadowChildren[i]);

    if (
      (zIndex > 0 || isNaN(zIndex)) &&
      display !== "none" &&
      visibility !== "hidden" &&
      opacity > 0 &&
      position === "fixed"
    ) {
      console.log("Child element:", shadowChildren);
      console.log(shadowChildren[i], {
        opacity,
        visibility,
        display,
        zIndex: isNaN(zIndex),
        position,
      });
      console.log("hostElement out", { hostElement }, i);
      shadowChildren[i].style.setProperty("display", "none", "important");
    }
  }
  console.log(`Removed shadowRoot for element with id ${element.id}`);
};

hideElementsIfLargeModal();

let elements;
function hideElement() {
  // const iframeElement = document.getElementById("recordingPlayer");
  let modalEle = [];
  const onScreenModal = [];
  const onScreenAndTopModals = [];

  elements = document.querySelectorAll("body *");
  // elements =
  //   iframeElement.contentWindow?.document.body.querySelectorAll("body *");
  // const iframeDocument =
  //   iframeElement.contentDocument || iframeElement.contentWindow?.document;
  // const iframeRect = iframeDocument.documentElement.getBoundingClientRect();
  const iframeRect = document.documentElement.getBoundingClientRect();

  detectModals(elements);

  if (modalEle) {
    modalEle.forEach((element) => {
      const ele = element.getBoundingClientRect();
      let height = ele.height;
      let width = ele.width;
      if (isInRange(ele) && height > 0 && width > 0) {
        // console.log({
        //   modalH: height,
        //   modalW: width,
        //   iframe: iframeRect,
        //   ele,
        //   element,
        // });
        onScreenModal.push(element);
      }
    });

    console.log({ onScreenModal, modalEle });

    // const n = onScreenModal.length;

    // for (let i = 0; i < n - 1; i++) {
    //   const element1 = onScreenModal[i];
    //   const ret1 = element1.getBoundingClientRect();
    //   const computedStyle1 = window.getComputedStyle(element1);
    //   const zIndex1 = parseInt(computedStyle1.getPropertyValue("z-index"), 10);

    //   for (let j = i + 1; j < n; j++) {
    //     const element2 = onScreenModal[j];
    //     const ret2 = element2.getBoundingClientRect();
    //     const computedStyle2 = window.getComputedStyle(element2);
    //     const zIndex2 = parseInt(
    //       computedStyle2.getPropertyValue("z-index"),
    //       10
    //     );

    //     // Compare elements and perform your desired logic
    //     console.log({ ret1, ret2, zIndex1, zIndex2, element1, element2 });
    //   }
    // }

    onScreenModal.forEach((modal) => {
      const modalRect = modal.getBoundingClientRect();
      const computedStyleOfModal = window.getComputedStyle(modal);
      const zIndexOfModal = parseInt(
        computedStyleOfModal.getPropertyValue("z-index"),
        10
      );
      elements.forEach((element) => {
        const computedStyleOfElement = window.getComputedStyle(element);
        const zIndexOfElement = parseInt(
          computedStyleOfElement.getPropertyValue("z-index"),
          10
        );
        // console.log({ zIndexOfModal, zIndexOfElement, element });
        if (
          element !== modal &&
          !modal.contains(element) &&
          isElementUnderModal(element, modalRect) &&
          zIndexOfModal >= zIndexOfElement
        ) {
          // console.log(element);
          element.classList.add("heatmap-com__hidden-element");
        }
      });
    });

    onScreenModal.forEach((modal) => {
      modal.style.setProperty("display", "none", "important");
      modal.style.visibility = "visible";
      const allChildren = getAllChildren(modal);
      for (let i = 0; i < allChildren.length; i += 1) {
        allChildren[i].classList.remove("heatmap-com__hidden-element");
      }
    });
  }

  function isElementUnderModal(element, modalRect) {
    const rect = element.getBoundingClientRect();
    // console.log(modalRect, rect);
    const isVisible =
      rect.top >= modalRect.top &&
      rect.bottom <= modalRect.bottom &&
      rect.left >= 0 &&
      rect.right <= iframeRect.width;
    return isVisible;
  }

  function getAllChildren(element) {
    let children = [];
    children.push(element);
    for (let i = 0; i < element.children.length; i += 1) {
      children = children.concat(getAllChildren(element.children[i]));
    }
    return children;
  }

  function isInRange(rect) {
    const isVisible =
      rect.top >= 0 &&
      rect.height <= (iframeRect?.height || 0) &&
      rect.left >= 0 &&
      rect.right <= (iframeRect?.width || 0);
    return isVisible;
  }

  function isHeightOkay(height) {
    if (typeof height === "string") return true;
    return height > 5;
  }

  elements = document.querySelectorAll("body *");
  elements.forEach((ele) => {
    if (ele.classList.contains("heatmap-com__hidden-element")) {
      ele.style.display = "none";
      // console.log(ele);
    }
  });
}

const detectModals = (elements) => {
  for (let i = 0; i < elements.length; i += 1) {
    let element = elements[i];
    let computedStyle = window.getComputedStyle(element);

    const opacity = parseFloat(computedStyle.getPropertyValue("opacity"));
    const visibility = computedStyle.getPropertyValue("visibility");
    const display = computedStyle.getPropertyValue("display");
    const zIndex = parseInt(computedStyle.getPropertyValue("z-index"), 10);
    const position = computedStyle.getPropertyValue("position");
    let height = computedStyle.getPropertyValue("height");
    if (height.includes("px")) {
      height = +height.split("px")[0];
    }

    if (
      zIndex > 0 &&
      display !== "none" &&
      visibility !== "hidden" &&
      opacity >= 0.8 &&
      !["button", "a", "svg", "span"].includes(element.tagName.toLowerCase()) &&
      position === "fixed" &&
      // || position === "absolute"
      isHeightOkay(height)
    ) {
      modalEle.push(element);
    }
  }
};

const detectShadowDomElements = (element) => {
  if (element.shadowRoot) {
    const shadowRoot = element.shadowRoot;
    const hostElement = shadowRoot.host;
    hostElement.remove();
    console.log(`Removed shadowRoot for element with id ${element.id}`);
  }
};

hideElement();

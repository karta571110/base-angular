/**
 * 解決SetAttribute造成的CSP問題
 */
export function styleInlineCsp(): void {
  const elPrototype = Element.prototype;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const setAttribute = elPrototype.setAttribute;

  elPrototype.setAttribute = function replaceSetAttribute(
    qualifiedName: string,
    value: string
  ) {
    const setAttributeBind = setAttribute.bind(this);

    if (qualifiedName === 'style') {
      (this as HTMLElement).style.cssText = value;
    } else {
      setAttributeBind(qualifiedName, value);
    }
  };
}

/**
 * 解決createElement造成的CSP問題
 * @param nonce - 亂碼
 */
export function styleElementCsp(nonce: string): void {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const createElement = document.createElement;

  document.createElement = function replaceCreateElement(
    qualifiedName: string
  ) {
    const createElementBind = createElement.bind(this);

    if (qualifiedName === 'style') {
      const styleElement: HTMLStyleElement = createElementBind(qualifiedName);

      styleElement.setAttribute('nonce', nonce);

      return styleElement;
    }

    return createElementBind(qualifiedName);
  };
}

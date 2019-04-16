export const findFirstParent = (element, criteria) => {
    if (criteria(element)) return element;
  
    if (!element.parentElement) return null;
  
    return findFirstParent(element.parentElement, criteria);
};
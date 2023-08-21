export const shopifyPageDetails = () => {
  const pageType = window?.meta?.pageType;
  const productName = pageType === 'product' ? window?.meta?.product?.variants?.[0]?.name : null;
  return {
    pageType: pageType,
    productName: productName
  }
}
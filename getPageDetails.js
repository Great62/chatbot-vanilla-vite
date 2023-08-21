export const shopifyPageDetails = () => {
  const pageType = window?.meta?.page?.pageType;
  const productName = pageType === 'product' ? window?.meta?.product?.variants?.[0]?.name : null;
  return {
    pageType: pageType,
    productName: productName
  }
}
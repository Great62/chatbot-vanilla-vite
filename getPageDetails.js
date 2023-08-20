const shopifyPageDetails = () => {
  return {
    pageType: window?.meta?.pageType,
    productName: window?.meta?.product?.variants[0].name,
  }
}
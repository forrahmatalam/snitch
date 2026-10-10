import { apiRequest } from './api'

export const getProducts = async () => {
  const result = await apiRequest('/product')
  return result.data.products
}

export const getSellerProducts = async (sellerId) => {
  const result = await apiRequest(`/product/seller/${sellerId}`)
  // Current seller endpoint returns its full collection, so keep this view scoped to this seller.
  return result.data.products.filter((product) => {
    const productSeller = product.seller?._id || product.seller
    return String(productSeller) === String(sellerId)
  })
}

export const updateProductListing = async (productId, published) => {
  const action = published ? 'list' : 'unlist'
  return apiRequest(`/product/${action}/${productId}`, { method: 'PATCH' })
}

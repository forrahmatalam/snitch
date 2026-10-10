import { useCallback, useEffect, useState } from 'react'
import { getSellerProducts, updateProductListing } from '../services/product.service'

const SellerProductList = ({ sellerId, refreshKey, onMessage, onError }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyProduct, setBusyProduct] = useState('')

  const loadProducts = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      setProducts(await getSellerProducts(sellerId))
    } catch (error) {
      onError(error.details || error.message)
    } finally {
      setLoading(false)
    }
  }, [sellerId, onError])

  useEffect(() => {
    let active = true
    getSellerProducts(sellerId).then((sellerProducts) => {
      if (active) setProducts(sellerProducts)
    }).catch((error) => {
      if (active) onError(error.details || error.message)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [sellerId, refreshKey, onError])

  const changeListing = async (product) => {
    setBusyProduct(product._id)
    onError('')
    onMessage('')
    try {
      const result = await updateProductListing(product._id, !product.published)
      onMessage(result.message)
      await loadProducts()
    } catch (error) {
      onError(error.details || error.message)
    } finally {
      setBusyProduct('')
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Seller tools</p><h2 className="mt-2 text-2xl font-bold">Your products</h2></div>
        <button onClick={loadProducts} disabled={loading} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-stone-100">{loading ? 'Loading…' : 'Refresh'}</button>
      </div>
      {loading ? <p className="py-8 text-sm text-stone-500">Loading your products…</p> : products.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-stone-300 p-7 text-center text-sm text-stone-600">You have not created any products yet.</div>
      ) : (
        <div className="mt-5 divide-y divide-stone-200">
          {products.map((product) => (
            <article key={product._id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {product.images?.[0] ? <img src={product.images[0]} alt="" className="h-16 w-16 rounded-lg object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-400">No image</div>}
                <div className="min-w-0"><h3 className="truncate font-semibold">{product.title}</h3><p className="mt-1 text-sm text-stone-600">{product.price.currency} {product.price.amount} · {product.sizes.length} sizes</p></div>
              </div>
              <div className="flex items-center gap-3 sm:shrink-0">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.published ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-600'}`}>{product.published ? 'Listed' : 'Unlisted'}</span>
                <button disabled={busyProduct === product._id} onClick={() => changeListing(product)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold hover:bg-stone-100">{busyProduct === product._id ? 'Saving…' : product.published ? 'Unlist' : 'List product'}</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SellerProductList

import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import { getProducts } from '../services/product.service'
import { createPaymentOrder, getPaymentKey, verifyPayment } from '../services/payment.service'

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true)
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

const ProductCatalog = ({ onMessage, onError }) => {
  const [products, setProducts] = useState([])
  const [sizes, setSizes] = useState({})
  const [quantities, setQuantities] = useState({})
  const [loading, setLoading] = useState(true)
  const [busyProduct, setBusyProduct] = useState('')
  const [buyingProduct, setBuyingProduct] = useState('')

  useEffect(() => {
    let active = true
    getProducts().then((products) => {
      if (!active) return
      setProducts(products)
      setSizes(Object.fromEntries(products.map((product) => [product._id, product.sizes[0]?.size || ''])))
    }).catch((error) => {
      if (active) onError(error.details || error.message)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [onError])

  const loadProducts = async () => {
    setLoading(true)
    onError('')
    try {
      const products = await getProducts()
      setProducts(products)
      setSizes(Object.fromEntries(products.map((product) => [product._id, product.sizes[0]?.size || ''])))
    } catch (error) {
      onError(error.details || error.message)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product) => {
    setBusyProduct(product._id)
    onError('')
    onMessage('')
    try {
      const result = await apiRequest('/cart/addToCart', {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id,
          size: sizes[product._id],
          quantity: Number(quantities[product._id] || 1),
        }),
      })
      onMessage(result.message)
    } catch (error) {
      onError(error.details || error.message)
    } finally {
      setBusyProduct('')
    }
  }

  const buyNow = async (product) => {
    const selectedSize = product.sizes.find((item) => item.size === sizes[product._id])
    const quantity = Number(quantities[product._id] || 1)
    const total = Number(product.price.amount) * quantity
    if (!selectedSize || quantity < 1 || quantity > selectedSize.stock) {
      onError('Selected size ke liye requested quantity stock mein available nahi hai.')
      return
    }
    if (product.price.currency !== 'INR') {
      onError('Online checkout abhi sirf INR products ke liye enabled hai.')
      return
    }

    setBuyingProduct(product._id)
    onError('')
    onMessage('')
    try {
      if (!await loadRazorpay()) throw new Error('Razorpay Checkout load nahi hua. Internet connection check karein.')
      const amount = Math.round(total * 100)
      const [keyData, orderData] = await Promise.all([
        getPaymentKey(),
        createPaymentOrder(amount),
      ])
      if (!keyData.key || !orderData.order_id) throw new Error('Server se payment setup details nahi mile.')

      const checkout = new window.Razorpay({
        key: keyData.key,
        amount,
        currency: 'INR',
        name: 'Snitch',
        description: `${product.title} · Size ${selectedSize.size} · Qty ${quantity}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            const result = await verifyPayment(response)
            if (!result.success) throw new Error(result.message || 'Payment verify nahi hua.')
            onMessage(`Payment verified for ${product.title}.`)
          } catch (error) {
            onError(error.message || 'Payment verification fail hui.')
          } finally {
            setBuyingProduct('')
          }
        },
        modal: { ondismiss: () => setBuyingProduct('') },
        theme: { color: '#c2410c' },
      })
      checkout.open()
    } catch (error) {
      onError(error.message || 'Payment start nahi ho paya.')
      setBuyingProduct('')
    }
  }

  return (
    <section className="mt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Shop</p><h2 className="mt-2 text-2xl font-bold">Products</h2></div>
        <button onClick={() => { setLoading(true); loadProducts() }} disabled={loading} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-stone-100">{loading ? 'Loading…' : 'Refresh'}</button>
      </div>
      {loading ? <p className="py-8 text-sm text-stone-500">Loading products…</p> : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-600">No products yet. Seller products will appear here.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const selectedSize = product.sizes.find((item) => item.size === sizes[product._id])
            return <article key={product._id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              {product.images?.[0] ? <img src={product.images[0]} alt={product.title} className="h-52 w-full object-cover" /> : <div className="flex h-52 items-center justify-center bg-stone-100 text-sm text-stone-400">No product image</div>}
              <div className="p-5">
                <h3 className="text-lg font-bold">{product.title}</h3>
                <p className="mt-2 line-clamp-3 min-h-12 text-sm leading-5 text-stone-600">{product.description}</p>
                <p className="mt-3 font-semibold">{product.price.currency} {product.price.amount}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <label className="field">Size<select value={sizes[product._id] || ''} onChange={(event) => setSizes({ ...sizes, [product._id]: event.target.value })}>{product.sizes.map((item) => <option key={item.size} value={item.size}>{item.size} · {item.stock} left</option>)}</select></label>
                  <label className="field">Quantity<input type="number" min="1" max={selectedSize?.stock || 1} value={quantities[product._id] || 1} onChange={(event) => setQuantities({ ...quantities, [product._id]: event.target.value })} /></label>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button disabled={busyProduct === product._id || buyingProduct === product._id || !selectedSize?.stock} onClick={() => addToCart(product)} className="rounded-[.65rem] border border-stone-300 bg-white px-3 py-3 text-sm font-semibold hover:bg-stone-100">{busyProduct === product._id ? 'Adding…' : 'Add to cart'}</button>
                  <button disabled={busyProduct === product._id || buyingProduct === product._id || !selectedSize?.stock || product.price.currency !== 'INR'} onClick={() => buyNow(product)} className="primary-button px-3 py-3 text-sm">{buyingProduct === product._id ? 'Opening checkout…' : 'Buy now'}</button>
                </div>
              </div>
            </article>
          })}
        </div>
      )}
    </section>
  )
}

export default ProductCatalog

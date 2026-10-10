import { useState } from 'react'
import { apiRequest } from '../services/api'

const ProductForm = ({ onMessage, onError, onProductCreated }) => {
  const [busy, setBusy] = useState(false)
  const [product, setProduct] = useState({ title: '', description: '', amount: '', currency: 'INR', size: 'M', stock: '0' })

  const submitProduct = async (event) => {
    event.preventDefault(); setBusy(true); onError(''); onMessage('')
    const formElement = event.currentTarget
    const form = new FormData()
    form.append('title', product.title)
    form.append('description', product.description)
    form.append('price', JSON.stringify({ amount: Number(product.amount), currency: product.currency }))
    form.append('sizes', JSON.stringify([{ size: product.size, stock: Number(product.stock) }]))
    for (const file of formElement.images.files) form.append('images', file)
    try {
      const result = await apiRequest('/product/create', { method: 'POST', body: form })
      onMessage(result.message)
      onProductCreated()
      setProduct({ title: '', description: '', amount: '', currency: 'INR', size: 'M', stock: '0' })
      formElement.reset()
    } catch (error) { onError(error.details || error.message) }
    finally { setBusy(false) }
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Seller API</p>
      <h2 className="mt-2 text-2xl font-bold">Create a product</h2>
      <form onSubmit={submitProduct} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="field sm:col-span-2">Title<input required minLength="2" maxLength="50" value={product.title} onChange={(e) => setProduct({ ...product, title: e.target.value })} /></label>
        <label className="field sm:col-span-2">Description<textarea required minLength="2" maxLength="500" rows="3" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} /></label>
        <label className="field">Price<input required type="number" min="0" step="0.01" value={product.amount} onChange={(e) => setProduct({ ...product, amount: e.target.value })} /></label>
        <label className="field">Currency<select value={product.currency} onChange={(e) => setProduct({ ...product, currency: e.target.value })}><option>INR</option><option>USD</option></select></label>
        <label className="field">Size<select value={product.size} onChange={(e) => setProduct({ ...product, size: e.target.value })}>{['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => <option key={size}>{size}</option>)}</select></label>
        <label className="field">Stock<input required type="number" min="0" step="1" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} /></label>
        <label className="field sm:col-span-2">Images (up to 5)<input name="images" type="file" accept="image/*" multiple className="file-input" /></label>
        <button disabled={busy} className="primary-button sm:col-span-2">{busy ? 'Saving…' : 'Create product'}</button>
        <p className="sm:col-span-2 text-xs leading-5 text-stone-500">Product images are uploaded to image storage when you create the product.</p>
      </form>
    </section>
  )
}

export default ProductForm

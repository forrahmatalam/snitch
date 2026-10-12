import { useState } from 'react'
import { createPaymentOrder, getPaymentKey, verifyPayment } from '../../services/payment.service'

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true)
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

export default function PaymentPage() {
  const [amount, setAmount] = useState('1')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [paid, setPaid] = useState(false)

  const startPayment = async (event) => {
    event.preventDefault()
    setMessage('')
    setPaid(false)
    const rupees = Number(amount)
    if (!Number.isFinite(rupees) || rupees <= 0 || rupees > 100000) {
      setMessage('Amount ₹1 se ₹1,00,000 ke beech daalein.')
      return
    }

    setBusy(true)
    try {
      const ready = await loadRazorpay()
      if (!ready) throw new Error('Razorpay Checkout load nahi hua. Internet connection check karein.')
      const [keyData, orderData] = await Promise.all([
        getPaymentKey(),
        createPaymentOrder(Math.round(rupees * 100)),
      ])
      if (!keyData.key || !orderData.order_id) throw new Error('Server se payment setup details nahi mile.')

      const checkout = new window.Razorpay({
        key: keyData.key,
        amount: Math.round(rupees * 100),
        currency: 'INR',
        name: 'Snitch',
        description: 'Test mode payment',
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            const result = await verifyPayment(response)
            if (!result.success) throw new Error(result.message || 'Payment verify nahi hua.')
            setPaid(true)
            setMessage('Payment successful aur server par verified hai.')
          } catch (error) {
            setMessage(error.message || 'Payment verification fail hui.')
          }
        },
        modal: { ondismiss: () => setMessage('Payment checkout band kar diya gaya.') },
        theme: { color: '#c2410c' },
      })
      checkout.open()
    } catch (error) {
      setMessage(error.message || 'Payment start nahi ho paya. Server aur API settings check karein.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
    <div className="bg-stone-900 px-7 py-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-orange-300">Razorpay integration</p>
      <h1 className="mt-2 text-2xl font-bold">Test payment</h1>
      <p className="mt-1 text-sm text-stone-300">Checkout open karke test mode payment flow check karein.</p>
    </div>
    <form className="space-y-5 p-7" onSubmit={startPayment}>
      <label className="field">Amount (INR)
        <input type="number" min="1" max="100000" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </label>
      <p className="text-sm text-stone-500">Backend ko amount paise mein bheja jayega. Test keys ke saath hi payment karein.</p>
      <button className="primary-button w-full" type="submit" disabled={busy}>{busy ? 'Checkout tayyar ho raha hai…' : `Pay ₹${Number(amount || 0).toFixed(2)}`}</button>
      {message && <p role="status" className={`rounded-lg px-4 py-3 text-sm ${paid ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-900'}`}>{message}</p>}
    </form>
  </section>
}

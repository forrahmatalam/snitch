import { apiRequest } from './api'

export const createPaymentOrder = (amount) => apiRequest('/payment/process', {
  method: 'POST',
  body: JSON.stringify({ amount }),
})

export const getPaymentKey = () => apiRequest('/payment/key')

export const verifyPayment = (paymentResponse) => apiRequest('/payment/verification', {
  method: 'POST',
  body: JSON.stringify(paymentResponse),
})

import { useEffect, useRef, useState } from 'react'

const GOOGLE_SCRIPT_ID = 'google-identity-services'

const GoogleLoginButton = ({ onCode, onError, disabled = false }) => {
  const clientRef = useRef(null)
  const [ready, setReady] = useState(Boolean(window.google?.accounts?.oauth2))
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId || window.google?.accounts?.oauth2) {
      setReady(Boolean(window.google?.accounts?.oauth2))
      return
    }

    let script = document.getElementById(GOOGLE_SCRIPT_ID)
    const handleLoad = () => setReady(Boolean(window.google?.accounts?.oauth2))
    if (!script) {
      script = document.createElement('script')
      script.id = GOOGLE_SCRIPT_ID
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = handleLoad
      script.onerror = () => onError('Google sign-in could not be loaded.')
      document.head.appendChild(script)
    } else {
      script.addEventListener('load', handleLoad)
      if (window.google?.accounts?.oauth2) handleLoad()
    }
    return () => script?.removeEventListener('load', handleLoad)
  }, [clientId, onError])

  const startGoogleLogin = () => {
    if (!clientId) {
      onError('Google login is not configured. Set VITE_GOOGLE_CLIENT_ID in the frontend environment.')
      return
    }
    if (!ready || !window.google?.accounts?.oauth2) {
      onError('Google sign-in is still loading. Please try again.')
      return
    }

    clientRef.current = window.google.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: 'openid email profile',
      ux_mode: 'popup',
      callback: (response) => {
        if (response.error || !response.code) {
          onError(response.error_description || 'Google sign-in was cancelled.')
          return
        }
        onCode(response.code)
      },
      error_callback: (error) => onError(error.message || 'Google sign-in failed.'),
    })
    clientRef.current.requestCode()
  }

  return (
    <button type="button" onClick={startGoogleLogin} disabled={disabled} className="google-button w-full">
      <span aria-hidden="true" className="google-mark">G</span>
      Continue with Google
    </button>
  )
}

export default GoogleLoginButton

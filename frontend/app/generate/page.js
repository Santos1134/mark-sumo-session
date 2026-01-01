'use client'

import { useState, useEffect } from 'react'
import { initSocket, disconnectSocket } from '../../lib/socket'
import toast from 'react-hot-toast'
import QRDisplay from '../../components/QRDisplay'
import PairingCodeDisplay from '../../components/PairingCodeDisplay'
import SessionOutput from '../../components/SessionOutput'
import styles from './page.module.css'

export default function GeneratePage() {
  const [method, setMethod] = useState(null) // null, 'qr', 'pairing'
  const [status, setStatus] = useState('disconnected') // disconnected, connecting, waiting-qr, waiting-pairing, connected, completed
  const [qrCode, setQRCode] = useState(null)
  const [pairingCode, setPairingCode] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const socket = initSocket()

    // Listen for events
    socket.on('session-created', (data) => {
      console.log('Session created:', data.sessionId)
      if (method === 'qr') {
        setStatus('waiting-qr')
        toast.success('Session created! Waiting for QR code...')
      } else if (method === 'pairing') {
        setStatus('waiting-pairing')
        toast.success('Generating pairing code...')
      }
    })

    socket.on('qr-update', (data) => {
      console.log('QR code received')
      setQRCode(data.qr)
      setStatus('waiting-qr')
    })

    socket.on('pairing-code', (data) => {
      console.log('Pairing code received:', data.code)
      setPairingCode(data.code)
      setStatus('waiting-pairing')
      toast.success('Pairing code generated!')
    })

    socket.on('session-generated', (data) => {
      console.log('Session generated!')
      setSessionId(data.sessionId)
      setStatus('completed')
      toast.success('Session ID generated successfully!')
    })

    socket.on('error', (data) => {
      console.error('Error:', data.message)
      setError(data.message)
      setStatus('disconnected')
      setMethod(null)
      toast.error(data.message)
    })

    // Cleanup on unmount
    return () => {
      disconnectSocket()
    }
  }, [method])

  const handleQRMethod = () => {
    setMethod('qr')
    setStatus('connecting')
    setError(null)
    setQRCode(null)
    setPairingCode(null)
    setSessionId(null)

    const socket = initSocket()
    socket.emit('create-session')
    toast.loading('Creating session...', { duration: 2000 })
  }

  const handlePairingMethod = () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error('Please enter your phone number')
      return
    }

    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '')

    // Validate phone number length (should be at least 10 digits)
    if (cleanNumber.length < 10) {
      toast.error('Phone number too short. Include country code (e.g., 2347012345678)')
      return
    }

    if (cleanNumber.length > 15) {
      toast.error('Phone number too long')
      return
    }

    setMethod('pairing')
    setStatus('connecting')
    setError(null)
    setQRCode(null)
    setPairingCode(null)
    setSessionId(null)

    const socket = initSocket()
    socket.emit('create-pairing-session', { phoneNumber: cleanNumber })
    toast.loading('Generating pairing code...', { duration: 2000 })
  }

  const resetForm = () => {
    setMethod(null)
    setStatus('disconnected')
    setError(null)
    setQRCode(null)
    setPairingCode(null)
    setPhoneNumber('')
    setSessionId(null)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Generate Session ID</h1>

        {!method && status === 'disconnected' && (
          <div className={styles.card}>
            <p className={styles.instruction}>
              Choose your preferred method to generate session ID:
            </p>

            <div className={styles.methodSelector}>
              <div className={styles.methodCard}>
                <div className={styles.methodIcon}>📱</div>
                <h3>QR Code</h3>
                <p>Scan QR code with your phone</p>
                <button onClick={handleQRMethod} className={styles.button}>
                  Use QR Code
                </button>
              </div>

              <div className={styles.methodCard}>
                <div className={styles.methodIcon}>🔢</div>
                <h3>Pairing Code</h3>
                <p>Enter phone number with country code</p>
                <input
                  type="tel"
                  placeholder="2347012345678 (with country code)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={styles.input}
                />
                <p className={styles.hint}>Include country code (e.g., 234 for Nigeria, 1 for US)</p>
                <button onClick={handlePairingMethod} className={styles.button}>
                  Generate Code
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'connecting' && (
          <div className={styles.card}>
            <div className={styles.loader}></div>
            <p className={styles.instruction}>Connecting to session service...</p>
          </div>
        )}

        {status === 'waiting-qr' && qrCode && (
          <div className={styles.card}>
            <QRDisplay qrCode={qrCode} />
            <div className={styles.instructions}>
              <h3>Scan with WhatsApp</h3>
              <ol>
                <li>Open WhatsApp on your phone</li>
                <li>Tap <strong>Menu</strong> or <strong>Settings</strong></li>
                <li>Tap <strong>Linked Devices</strong></li>
                <li>Tap <strong>Link a Device</strong></li>
                <li>Point your phone at this screen to scan the QR code</li>
              </ol>
            </div>
            <button onClick={resetForm} className={styles.buttonSecondary}>
              Cancel
            </button>
          </div>
        )}

        {status === 'waiting-pairing' && pairingCode && (
          <div className={styles.card}>
            <PairingCodeDisplay pairingCode={pairingCode} />
            <div className={styles.instructions}>
              <h3>Enter Code in WhatsApp</h3>
              <ol>
                <li>Open WhatsApp on your phone</li>
                <li>Tap <strong>Menu</strong> or <strong>Settings</strong></li>
                <li>Tap <strong>Linked Devices</strong></li>
                <li>Tap <strong>Link a Device</strong></li>
                <li>Tap <strong>Link with phone number instead</strong></li>
                <li>Enter the pairing code shown above</li>
              </ol>
            </div>
            <button onClick={resetForm} className={styles.buttonSecondary}>
              Cancel
            </button>
          </div>
        )}

        {status === 'completed' && sessionId && (
          <div className={styles.card}>
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h2>Session ID Generated!</h2>
              <p>Your session ID has been generated successfully.</p>
            </div>
            <SessionOutput sessionId={sessionId} />
            <button onClick={resetForm} className={styles.buttonSecondary}>
              Generate Another
            </button>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={resetForm} className={styles.buttonSecondary}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

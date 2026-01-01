'use client'

import { useState, useEffect } from 'react'
import { initSocket, disconnectSocket } from '../../lib/socket'
import toast from 'react-hot-toast'
import QRDisplay from '../../components/QRDisplay'
import SessionOutput from '../../components/SessionOutput'
import styles from './page.module.css'

export default function GeneratePage() {
  const [status, setStatus] = useState('disconnected') // disconnected, connecting, waiting-qr, connected, completed
  const [qrCode, setQRCode] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const socket = initSocket()

    // Listen for events
    socket.on('session-created', (data) => {
      console.log('Session created:', data.sessionId)
      setStatus('waiting-qr')
      toast.success('Session created! Waiting for QR code...')
    })

    socket.on('qr-update', (data) => {
      console.log('QR code received')
      setQRCode(data.qr)
      setStatus('waiting-qr')
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
      toast.error(data.message)
    })

    // Cleanup on unmount
    return () => {
      disconnectSocket()
    }
  }, [])

  const handleGenerateSession = () => {
    setStatus('connecting')
    setError(null)
    setQRCode(null)
    setSessionId(null)

    const socket = initSocket()
    socket.emit('create-session')
    toast.loading('Creating session...', { duration: 2000 })
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Generate Session ID</h1>

        {status === 'disconnected' && (
          <div className={styles.card}>
            <p className={styles.instruction}>
              Click the button below to start generating your WhatsApp session ID.
            </p>
            <button
              onClick={handleGenerateSession}
              className={styles.button}
            >
              Start Generation
            </button>
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
            <button
              onClick={handleGenerateSession}
              className={styles.buttonSecondary}
            >
              Generate Another
            </button>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}
      </div>
    </main>
  )
}

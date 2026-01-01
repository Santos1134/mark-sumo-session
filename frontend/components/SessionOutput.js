import { useState } from 'react'
import toast from 'react-hot-toast'
import styles from './SessionOutput.module.css'

export default function SessionOutput({ sessionId }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionId)
    setCopied(true)
    toast.success('Session ID copied to clipboard!')
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className={styles.container}>
      <h3>Your Session ID</h3>
      <div className={styles.sessionBox}>
        <code className={styles.sessionText}>{sessionId.substring(0, 50)}...</code>
        <button onClick={copyToClipboard} className={styles.copyButton}>
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      <p className={styles.note}>
        Copy this session ID and use it to deploy your Mark Sumo Bot.
        Keep it secure and do not share it publicly.
      </p>
    </div>
  )
}

'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Mark Sumo Bot
            <span className={styles.subtitle}>Session Generator</span>
          </h1>
          <p className={styles.description}>
            Generate your WhatsApp session ID to connect Mark Sumo Bot to your WhatsApp account.
            Quick, secure, and easy.
          </p>
          <Link href="/generate" className={styles.button}>
            Generate Session ID
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure</h3>
            <p>Your session is generated securely and never stored</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Fast</h3>
            <p>Get your session ID in seconds with QR code scanning</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🤖</div>
            <h3>Easy</h3>
            <p>Simple 3-step process to connect your WhatsApp</p>
          </div>
        </div>

        <div className={styles.steps}>
          <h2>How It Works</h2>
          <div className={styles.stepList}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Click Generate</h4>
                <p>Start the session generation process</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Scan QR Code</h4>
                <p>Open WhatsApp and scan the QR code</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Copy Session ID</h4>
                <p>Copy your session ID and paste it in your bot deployment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

import styles from './PairingCodeDisplay.module.css'

export default function PairingCodeDisplay({ pairingCode }) {
  if (!pairingCode) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}></div>
        <p>Generating pairing code...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.codeBox}>
        <div className={styles.codeDisplay}>
          {pairingCode.split('').map((digit, index) => (
            <span key={index} className={styles.digit}>
              {digit}
            </span>
          ))}
        </div>
      </div>
      <p className={styles.note}>Enter this code in WhatsApp</p>
    </div>
  )
}

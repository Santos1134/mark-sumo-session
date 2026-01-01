import styles from './QRDisplay.module.css'

export default function QRDisplay({ qrCode }) {
  if (!qrCode) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}></div>
        <p>Generating QR code...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.qrBox}>
        <img src={qrCode} alt="QR Code" className={styles.qrImage} />
      </div>
      <p className={styles.note}>Scan this QR code with WhatsApp</p>
    </div>
  )
}

/**
 * QR Code Service
 * Generates QR codes as data URLs for frontend display
 */

const QRCode = require('qrcode');

class QRCodeService {
    /**
     * Generate QR code as data URL
     * @param {string} text - Text to encode in QR code
     * @returns {Promise<string>} Data URL
     */
    async generateQRDataURL(text) {
        try {
            const dataURL = await QRCode.toDataURL(text, {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                quality: 0.95,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 300
            });
            return dataURL;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }

    /**
     * Generate QR code as buffer
     * @param {string} text - Text to encode
     * @returns {Promise<Buffer>}
     */
    async generateQRBuffer(text) {
        try {
            const buffer = await QRCode.toBuffer(text, {
                errorCorrectionLevel: 'M',
                type: 'png',
                quality: 0.95,
                margin: 1,
                width: 300
            });
            return buffer;
        } catch (error) {
            console.error('Error generating QR buffer:', error);
            throw error;
        }
    }
}

// Export singleton instance
module.exports = new QRCodeService();

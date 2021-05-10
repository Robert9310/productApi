import AWS from 'aws-sdk'
import crypto from 'crypto'
import * as dotenv from "dotenv";

dotenv.config();

const {
    CLIENT_ID,
    CLIENT_SECRET,
    USER_POOL_ID
} = process.env

const getHastSecretByUsername = (username: string) => {
    return crypto.createHmac('SHA256', CLIENT_SECRET)
    .update(username + CLIENT_ID)
    .digest('base64')
}

export const login = async (req, res) => {
    try {
        const USERNAME = req.body.username
        const PASSWORD = req.body.password

        if (!USERNAME || !PASSWORD) {
            res.status(400).send('BadCredentials')
        }
        const SECRET_HASH =  getHastSecretByUsername(USERNAME)
        const params = {
            AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
            ClientId: CLIENT_ID,
            UserPoolId: USER_POOL_ID,
            AuthParameters: {
                USERNAME,
                PASSWORD,
                SECRET_HASH
            },
        }

        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()
        const { AuthenticationResult } = await cognitoidentityserviceprovider.adminInitiateAuth(params).promise()
        const { AccessToken, ExpiresIn, TokenType, RefreshToken } = AuthenticationResult

        res.send({AccessToken, ExpiresIn, TokenType, RefreshToken })

    } catch (error) {
        console.log(error)
        res.status(500).end()
    }
}

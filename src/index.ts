import cors from 'cors';
import express from 'express';
import * as dotenv from "dotenv";
import mongoose from 'mongoose';
import helmet from "helmet";
//import * as productCRUD from './product-crud';
import * as productCRUD from './product-crud-mongo';
import authRouter from './router/authRouter'

const CognitoExpress = require("cognito-express");

dotenv.config();

if(!process.env.PORT){
    console.log(`Error to get ports`);
    process.exit(1);
}

// Uncoment to connect MongoDB
// const uri: string = "mongodb://127.0.0.1:27017/codeindepth";
// mongoose.connect(uri, (err:any)=>{
//     if(err){
//         console.log(err.message);
//     }else{
//         console.log(`Connecting to MONGO`);
//     }
// })

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


const authorizedRoute = express.Router();
const AuthRouter = express.Router();

const cognitoExpress = new CognitoExpress({
    region: "us-east-1",
    cognitoUserPoolId: "us-east-1_9btadRLWs",
    tokenUse : "access",
    tokenExpiration: 3600,
});

authorizedRoute.use((req,res,next)=>{

    res.setHeader(
        `Access-Control-Allow-Methods`,
        `GET,POST,PUT,DELETE,OPTIONS`
    );
    res.header(`Access-Control-Allow-Origin`,'*');
    res.header(
        `Access-Control-Allow-Headers`,
        `Origin,X-Requested-With,Content-Type,Accept,Authorization`
    );
    res.header(`Access-Controll-Allow-Credentials`,"true");

    if (req.method !== 'OPTIONS')
    {
        let accessTokenFromClient = req.headers['authorization'];
        if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");
        cognitoExpress.validate(accessTokenFromClient, function (err:any, response:any) {
            if (err) {
                console.log(err);
                return res.status(401).send(err)
            } else {
                next()
            }
        });
    } 

});

authorizedRoute.get('/',(req,res) => res.send('Welcome to NodeJs App Using Typescript'));
authorizedRoute.get('/products', productCRUD.getProductList);
authorizedRoute.post('/products',productCRUD.createProduct);
authorizedRoute.post('/updateproduct',productCRUD.updateroduct);
authorizedRoute.post('/deleteproduct',productCRUD.deleteproduct);

app.use("/api/product",authorizedRoute)
app.use('/api/auth', authRouter)


const PORT: number = parseInt(process.env.PORT as string, 10);
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

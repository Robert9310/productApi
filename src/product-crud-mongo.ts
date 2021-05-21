import { Product } from './product';
import products from './product-schema';

export const getProductList = async (req:any, res:any) => {
    res.send({Hola: 'mundo'})
    return;
    products.find((err: any, result: any) => {
        if (err) {
          res.send("Error!");
        } else {
        console.log(JSON.stringify(result))
          res.send(result);
        }
      });
  };

  export const createProduct = async (req:any, res:any) => {
    const request: Product = req.body;
    console.log(JSON.stringify(request))
    let prod = new products(request);
    prod.save((err:any, result:any) => {
        if (err) {
            res.send("Error!");
            console.log(err);
          } else {
          console.log(JSON.stringify(result))
            res.send(result);
          }
    });
  };

export const updateProduct = async (req:any, res:any) => {
    const product: Product = req.body;
    products.findByIdAndUpdate(product.id,product,(err,updateData)=>{
      if(err){
        res.send(err);
      }else{
        res.send("item successfully updated");
      }
    });
  };

  export const deleteproduct = async (req:any, res:any) => {
    const productID: number = req.body['id'];
    products.findByIdAndRemove(productID).then(() => {
        res.status(200).json('Intern Deleted');
      })
      .catch(err => res.status(400).json('Error deleting Intern' + err))
  };
import {useContext,useState,useEffect} from "react"
import Layout from "../components/Layout"
import client from "../utils/client"
import {CircularProgress,Grid,Alert,Typography} from "@mui/material"
import ProductItem from "../components/ProductItem.js";
import {useRouter} from "next/router"
import {Store} from "../utils/store"
import { urlForThumbnail } from '../utils/image';
import axios from "axios"
export default function Home() {
  const router = useRouter();
  const {state:{cart},dispatch} = useContext(Store)
  const [state,setState] = useState({
    loading:true,
    error:'',
    products:[{name:"new"},{name:"new1"}]
  })

  const {loading,error,products} = state;

  useEffect(()=>{
    const fetchdata = async () =>{
      try{
        const products = await client.fetch(`*[_type== "product"]`);
        setState({loading:false,products});
        console.log()
      }catch(error){
        console.log(error)
        setState({error:error.message,loading:false})
      }
    }
    fetchdata()
   },[])

  const addToCartHandler = async (product)=>{
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    console.log(cart,existItem)
      const quantity = existItem ? existItem.quantity + 1 : 1;
        const res = await axios.get(`/api/products/${product._id}`);
        console.log({existItem,quantity,...res.data})
      if(res.data.countInStock < quantity){
      // enqueueSnackbar('Sorry Product is out of stock',{variant:"error"});
      console.log("Out of stock product")
      return;
    }
    
    dispatch({
      type:'CART_ADD_ITEM',
      payload:{
        _key:product._id,
        name: product.name,
        countInStock:product.countInStock,
        slug:product.slug.current,
        price:product.price,
        image:urlForThumbnail(product.image),
        quantity,
      }
    })
    // enqueueSnackbar(`product ${product.name} add to cart`,{variant:'success'});
    router.push("/cart")
  }

  return <Layout>
    {loading ?(<CircularProgress/>) : error ? (
      <Alert variant="danger">{error}</Alert>
    ):(
      <Grid container spacing={2}>
        {products.map((product,i)=>(
          <Grid item md={4} xs={6} key={`${product.slug} ${i}`}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />    
          </Grid>
      ))}
      </Grid>
    )}
  </Layout>
}
   


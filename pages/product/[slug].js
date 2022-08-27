import {useContext,useState,useEffect} from "react"
import classes from "../../utils/classes.js"
import {urlFor} from "../../utils/image"
import Layout from "../../components/Layout.js"
import client from "../../utils/client"
import NextLink from "next/link"
import Image from 'next/image';
import {Store} from "../../utils/store"
import {urlForThumbnail} from "../../utils/image"

import {useRouter} from "next/router";

import {
	Box,
	Grid,
	Typography,
	Link,
	CircularProgress,
	List,
	ListItem,
	Rating,
	Alert,
	Card,
	Button
} from "@mui/material"


import {useSnackbar} from "notistack"
import axios from "axios";


const ProductScreen = (props)=>{
	  // const { enqueueSnackbar } = useSnackbar();
	 // const pushed = useState("/cart")
	const router = useRouter();
	const [state,setState] = useState({
		loading:true,
		product:null,
		error:''
	})
	const {slug} = props
	const {
		state:{cart},
		dispatch
	} = useContext(Store);
	
	const {loading,product,error} = state
	useEffect(()=>{
		const fetchdata = async ()=>{
			try{
				let product = await client.fetch(`
					 *[_type == "product" && slug.current == $slug][0]`,{slug});
				setState({...state,loading:false,product});
			}catch(err){
				setState({...state,loading:false,err:err.message})
			}
		}
		fetchdata()
	},[])
 
	const addToCartHandler = async ()=>{
		const existItem = state.cart?.cartItems.find((x) => x._id === product._id);
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


	return(
		<Layout title={product?.title}>
			{loading ? <CircularProgress/> : 
				error ? (<Alert variant="error">{error}</Alert>) :(
				<Box>
					<Box sx={classes.section}>
						<NextLink href="/" passHref>
							<Link>
								<Typography>back to store</Typography>
							</Link>
						</NextLink>						
					</Box>
					<Grid container spacing={1}>
						<Grid item md={6} xs={12}>
							<Image src={urlFor(product?.image)} alt={product?.name} layout="responsive" width={640} height={640}/>
						</Grid>
						<Grid item md={3} xs={12}>
							<List>
								<ListItem>
									<Typography variant="h1" component="h1">{product?.name}</Typography>
								</ListItem>
								<ListItem>Category:{product?.category}</ListItem>
								<ListItem>Brand:{product?.brand}</ListItem>
								<ListItem>
									<Rating value={product?.rating} readOnly/>
									<Typography sx={classes.smallText}>({product?.numReviews} Reviews)</Typography>
								</ListItem>
							</List>
						</Grid>
						<Grid item md={3} xs={12}>
							<Card m={2}>
								<List>
									<ListItem>
										<Grid container>
											<Grid item xs={6}><Typography>Price</Typography></Grid>
											<Grid item xs={6}><Typography>{product.price}</Typography></Grid>
										</Grid>
									</ListItem>
									<ListItem>
										<Grid container>
											<Grid item xs={6}><Typography>status</Typography></Grid>
											<Grid item xs={6}><Typography>{product.countInStock >= 0? "Available":"Out of stock"}</Typography></Grid>
										</Grid>
									</ListItem>
									<ListItem>
										<Button
											onClick={addToCartHandler}
											fullWidth
											variant="contained"
										>
											Add to Cart
										</Button>
									</ListItem>
								</List>
							</Card>
						</Grid>
					</Grid>
				</Box>
			)}
		</Layout>
	)
}


export default ProductScreen

export function getServerSideProps(context){
	return {
		props:{slug:context.params.slug}
	}
}


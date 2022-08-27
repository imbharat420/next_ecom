import {
  Box,
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import dynamic from "next/dynamic"
import Image from "next/image"
import NextLink from "next/link"
import {useContext} from "react"
import {Store} from "../utils/store"
import Layout from "../components/Layout"

const CartScreen = ()=>{
	const {
		state:{
			cart:{cartItems}
		},
		dispatch
	} =  useContext(Store);
	
	const updateCartHandler = async (item,quantity)=>{
		const {data}= await axios.get(`/api/products${item._key}`);
		console.log(cartItems)
		if(data.counterInStock < quantity){
			console.log("Out of stock quantity")
			return
		}

		dispatch({
			type:"CART_ADD_ITEM",
			payload:{
				_key:item._key,
				name:item.name,
				countInStock:item.countInStock,
				slug:item.slug,
				price:item.price,
				image:item.image,
				quantity
			}
		})
		console.log("Updated Cart")
	}

	const removeItemHandler = (item)=>{
		dispatch({type:"CART_REMOVE_ITEM",payload:item});
	}

	return (
		<Layout title="Shopping Cart">
		  <Typography  variant="h1" component="h1">Shopping Cart</Typography>
		  {cartItems && cartItems.length === 0 ?(
		  		<Box>
		  			<Typography>Cart is Empty
		  				<NextLink href="/" passHref>
		  					<Link>Go Shopping cart</Link>
		  				</NextLink>
		  			</Typography>
		  		</Box>
		  	) :(
		  		<Grid container spacing={1}>
	          <Grid item md={9} xs={12}>
	            <TableContainer>
	              <Table>
	                <TableHead>
	                  <TableRow>
	                    <TableCell>Image</TableCell>
	                    <TableCell>Name</TableCell>
	                    <TableCell align="right">Qauntity</TableCell>
	                    <TableCell align="right">Price</TableCell>
	                    <TableCell align="right">Action</TableCell>
	                  </TableRow>
	                </TableHead>
	                <TableBody>
	                {cartItems && cartItems.map((item) => (
                    <TableRow key={item._key}>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell align="right">
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1??""}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>${item.price}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItemHandler(item)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

	                </TableBody>
	               </Table>
	            </TableContainer>
	           </Grid>
	          </Grid> 
		  	)
		  }


		</Layout>
	)
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });

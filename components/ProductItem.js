import NextLink from "next/link"
import {
	CardMedia,
	Card,
	CardActionArea,
	CardContent,
	CardActions,
	Button,
	Typography,
	Rating,
	Stack
} from '@mui/material'
import {urlForThumbnail} from "../utils/image"

const ProductItem = ({product,addToCartHandler})=>{
	return(
		<Card m={1}>
			<NextLink href={`/product/${product.slug.current}`} passHref>
				<CardActionArea>
					<CardMedia
						component="img"
						height="300"
						image={urlForThumbnail(product.image)}
						alt={product.slug.current}
						title={product.name}
					/>
					<CardContent>
						<Typography>{product.name} reviews</Typography>
						<Rating value={product.rating} readOnly></Rating>
					</CardContent>
				</CardActionArea>
			</NextLink>
			<CardActions>
				<Stack direction="row" spacing={2}>
					<Typography component="p">${product.price}</Typography>
					<Button spacing={2} size="small" variant="contained" color="primary" onClick={()=>addToCartHandler(product)}>
						Add To Cart
					</Button>
				</Stack>			
			</CardActions>
		</Card>
	)
}

export default ProductItem
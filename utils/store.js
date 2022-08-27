import Cookies from "js-cookie"
import {useReducer,createContext} from "react"

export const Store = createContext(null);

const initalState ={
	darkMode: Cookies.get("darkMode") == 'ON' ? true : false,
	cart:{
		cartItems: Cookies.get("cartItems") ? JSON.parse(Cookies.get("cartItems")): [],
	},
	userInfo: Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")) : []
}


const reducer = (state,action)=>{
	const {payload,type} = action
	switch(type){
		case "DARK_MODE_ON":
		 return {...state,darkMode:true};
		case 'DARK_MODE_OFF':
		 return {...state,darkMode:false};
		case 'CART_ADD_ITEM':
		 const newItem = payload;
		 const existItem = state.cart?.cartItems.find((item)=>item._key===newItem._key)
		 const cartItems = existItem ? state.cart.cartItems.map(item=>item._key === existItem._key ? newItem : item ) 
		 				   : [...state.cart.cartItems,newItem];
		 Cookies.set('cartItems',JSON.stringify(cartItems));
		 // let cok = JSON.parse(Cookies.get('cartItems'));
		 console.log({existItem,newItem,cartItems})
		 return {...state, cart:{...state.cart.cartItems}}
		case 'CART_REMOVE_ITEM':
		 const cartItem = state.cart.cartItems.filter((item)=> item._key === payload._key);
		 console.log(cartItem);
		 Cookies.set('cartItems',JSON.stringify(cartItem));
		 return {...state, cart:{...state.cart.cartItem}}
		case "USER_LOGIN":
		 return {...state,userInfo: action.payload};
		default:
		 console.log(state);
		 return state;
	}
}

const StoreProvider = ({children})=>{
	const [state,dispatch] = useReducer(reducer,initalState)
	const value = {state,dispatch};
	return <Store.Provider value={value}>{children}</Store.Provider>
} 

export default StoreProvider
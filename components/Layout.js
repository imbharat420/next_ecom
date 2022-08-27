import {useContext} from "react"
import Head from 'next/head'
import Image from 'next/image'
import NextLink from 'next/link'
import jsCookie from "js-cookie"

import { createTheme } from '@mui/material/styles';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';import classes from "../utils/classes"
import {SnackbarProvider} from "notistack";

import {Store} from "../utils/store"




export default function Layout({title,description,children}){
    const {state,dispatch,userInfo} = useContext(Store);
    const {darkMode,cart} = state;

    const theme = createTheme({
        components:{
            MuiLink:{
                defaultProps:{
                    underline:"hover",
                },
            },
        },
        typography: {
          h1: {
            fontSize: '2rem',
            fontWeight: 400,
            margin: '0.8rem 0',
          },
          h2: {
            fontSize: '1.4rem',
            fontWeight: 400,
            margin: '1rem 0',
          },
        },
        palette:{
            mode:darkMode?'light':'dark',
            primary:{
                main:'#f0c000'
            },
            secondary:{
                main:'#208080'
            }
        }
    })


    const darkModeHandler = ()=>{
        dispatch({
            type: !darkMode ? "DARK_MODE_ON" : "DARK_MODE_OFF"
        })

        const newDArk = !darkMode;
        jsCookie.set('darkMode',newDArk?'ON':'OFF');
    }
    return(
        <>
        <Head>
            <title>{title?`${title}- Ecommerce`:"Ecommerce"}</title>
            {description && <meta name="description" content={description}/>}
        </Head>
        <SnackbarProvider
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
        >
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar position="static" sx={classes.appbar}>
                <Toolbar sx={classes.toolbar}>
                    <Box>
                        <NextLink href="/" passHref>
                            <Link>
                                <Typography component="h4" variant="h4" >Web Commerce</Typography>
                            </Link>
                        </NextLink>
                    </Box>
                    <Box>
                        <Switch 
                            checked={darkMode}
                            onChange={darkModeHandler}
                        />
                          <NextLink href="/cart" passHref>
                            <Link>
                              <Typography component="span">
                                {cart.cartItems && cart.cartItems.length > 0 ? (
                                  <Badge
                                    color="secondary"
                                    badgeContent={cart.cartItems.length}
                                  >
                                    Cart
                                  </Badge>
                                ) : (
                                  'Cart'
                                )}
                              </Typography>
                            </Link>
                          </NextLink>
                       
                          {userInfo ? (
                            <NextLink href="/profile" passHref>
                              <Link>{userInfo.name}</Link>
                            </NextLink>
                          ) : (
                            <NextLink href="/login" passHref>
                              <Link>Login</Link>
                            </NextLink>
                          )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container component="main" sx={classes.main}>
                {children}
            </Container>
            <Box compnonet="footer" sx={classes.footer}>
                <Typography>All Right Reserved</Typography>
            </Box>
        </ThemeProvider>
        </SnackbarProvider>
       </>
    )
}

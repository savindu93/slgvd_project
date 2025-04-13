import * as React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, Drawer, IconButton, Link, Typography,  AppBar, Box, Toolbar, Button, styled} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const ButtonNavbar = styled(Button)({

    '&:hover':{
        boxShadow: 'none',
        borderColor: 'primary.main',
        borderBottom: '2px solid',
        backgroundColor: 'white',
        borderRadius: 0
    }
})



export default function Navbar(){

    const navigate = useNavigate();

    const[open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    }

    const submitdata = () => {
        navigate('/submit-data')
    }

    const goToAPI = () => {
        window.open("http://127.0.0.1:8000/swagger/", "_blank", "noopener,noreferrer");
    }

    const goToDoc = () => {
        navigate('/documentation')
    }
    
    return(
        <Box sx = {{flexGrow: 1}}>

            <AppBar position = 'static' color = "transparent">
                <Toolbar>
                    <Typography variant = 'h4'
                            sx = 
                            {
                                {
                                    fontSize: '2rem',
                                    fontWeight: 500,
                                    flexGrow: 1,
                                    color: 'text.primary'
                                }
                            }
                        >
                            <Link
                                component = 'button'
                                underline = 'none'
                                onClick = {() => {
                                    navigate('/');
                                }}
                            >

                                SLGVD
                            </Link>

                    </Typography>
                    
                    <Box sx = {{display: {xs:'none', md: 'flex'}, gap:1}}>

                        <ButtonNavbar variant = "text" sx = {{fontSize: '1rem'}} onClick = {submitdata}>
                            Submit Data
                        </ButtonNavbar>
                        <ButtonNavbar variant = "text" sx = {{fontSize: '1rem'}}
                        onClick = {goToAPI}>
                            API
                        </ButtonNavbar>
                        <ButtonNavbar variant = "text" sx = {{fontSize: '1rem'}} onClick = {goToDoc}>
                            Documentation
                        </ButtonNavbar>

                    </Box>

                    {/* Dropdown Menu */}
                    <Box 
                        sx = {{display: {xs:'flex', md: 'none'}, gap:1}}
                    
                    >
                        <IconButton onClick = {toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor = 'top'
                            open = {open}
                            onClose = {toggleDrawer(false)}
                        >
                            <Box>
                                <Box 
                                    sx = {{
                                        display:'flex',
                                        justifyContent:'flex-end',
                                        pt:1, pr:1
                                    }}
                                >
                                    <IconButton onClick = {toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>

                                </Box>

                                <MenuItem sx = {{pl:2, pb: 2}} onClick = {submitdata}> 
                                        Submit Data
                                </MenuItem>
                                <MenuItem sx = {{pl:2, pb: 2}} onClick = {goToAPI}>
                                        API
                                </MenuItem>
                                <MenuItem sx = {{pl:2, pb: 2}} onClick = {goToDoc}>
                                        Documentation  
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}





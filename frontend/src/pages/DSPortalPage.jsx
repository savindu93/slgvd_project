import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UserPortal from '../components/UserPortal'
import {USER} from '../constants'
import {useLocation} from 'react-router-dom';
import {Container, Grid2, Typography, Box} from '@mui/material'
import dnaImg from '../assets/landing page _ DNA _ 1-Photoroom.png';

export default function DSPortalPage(){

    const location = useLocation();
    let user = location.state?.results;
    
    // Retrieving user data from localStorage if user haven't logged out of profile
    if (user == null){
        user = JSON.parse(localStorage.getItem(USER))
        //console.log(user)
    }

    return (

        <Grid2 container size = {12}>

            <Grid2 size = {12}>
                <Navbar />
            </Grid2>
            {/* Background Image and Page Title @ the top of page */}
            <Grid2 size = {12}>
                <Box 
                    sx ={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        backgroundColor: 'primary.main'
                    }}

                >
                    {/* Background Image */}
                    <Box
                        sx = {{
                            position: 'absolute',
                            width: '100%',
                            height: '150%',
                            backgroundImage: `url(${dnaImg})`,
                            backgroundPosition: 'left center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'contain',
                            transform: 'rotate(-20deg)',
                            transformOrigin: 'left center',
                            zIndex: 0,
                            m: '10px 0 0 150px',
                            opacity: '40%',
                        }}
                    > 

                    </Box>
                    
                    {/* Page Title */}
                    <Container
                        sx = {{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 2,
                            pt: 10,
                            pb: 10
                            
                        }}    
                    >
                        <Typography variant = 'subtitle1' color = 'white'>
                            Data Submission Portal
                        </Typography>

                    </Container>

                </Box>
            </Grid2>
            <Grid2 size = {12}>
                <UserPortal results = {user} />
            </Grid2>
            <Grid2 size = {12} align = 'center'>
                <Footer />
            </Grid2> 

        </Grid2>
    )
}
import DbSummary from '../components/DbSummary'
import HomeSearchBar from '../components/HomeSearchBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {Grid2} from '@mui/material'

export default function Home(){

    return (

        <Grid2 container size = {12}>

            <Grid2 size = {12}>
                <Navbar />
            </Grid2>
            <Grid2 size = {12}>
                <HomeSearchBar />
            </Grid2>
            <Grid2 size = {12}>
                <DbSummary />
            </Grid2>
            <Grid2 size = {12} align = 'center'>
                <Footer />
            </Grid2> 

        </Grid2>

    )
}


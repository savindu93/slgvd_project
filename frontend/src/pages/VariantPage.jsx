import GenSearchBar from '../components/GenSearchBar'
import VariantInfo from '../components/VariantInfo'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {Grid2} from '@mui/material'
import {useLocation} from 'react-router-dom';

export default function VariantPage(){

    // Getting results passed to router in 
    // HomeSearchPage(retrieveData()) 
    const location = useLocation();
    const variant_data = location.state?.results;
    const tot_individuals = location.state?.tot_individuals;

    console.log(tot_individuals)
    console.log(variant_data)

    return (

        <Grid2 container size = {12}>

            <Grid2 size = {12}>
                <Navbar />
            </Grid2>
            <Grid2 size = {12}>
                <GenSearchBar />
            </Grid2>
            <Grid2 size = {12}>
                <VariantInfo results = {variant_data} no = {tot_individuals}/>
            </Grid2>
            <Grid2 size = {12} align = 'center'>
                <Footer />
            </Grid2> 

        </Grid2>

    )
}




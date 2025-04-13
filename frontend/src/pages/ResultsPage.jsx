import GenSearchBar from '../components/GenSearchBar'
import ResultsTable  from '../components/ResultsTable'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {Grid2} from '@mui/material'
import {useLocation} from 'react-router-dom';

export default function ResultsPage(){

    // Getting results passed to router in HomeSearchPage(retrieveData()) 
    const location = useLocation();
    const data = location.state?.results;
    const db = location.state?.db_type;
    const userPort = false;

    console.log(db)
    console.log(data)


    return (

        <Grid2 container size = {12}>

            <Grid2 size = {12}>
                <Navbar />
            </Grid2>
            <Grid2 size = {12}>
                <GenSearchBar />
            </Grid2>
            <Grid2 size = {12}>
                <ResultsTable results = {{data,userPort,db}}/>
            </Grid2>
            <Grid2 size = {12} align = 'center'>
                <Footer />
            </Grid2> 

        </Grid2>

    )
}


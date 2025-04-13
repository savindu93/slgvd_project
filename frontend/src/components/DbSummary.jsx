import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {Grid2, List, Card, CardContent, CardMedia, CardActions, Stack, Link, Typography, AppBar, Box, Toolbar, Button, styled, Container, TextField, colors, ListItem} from '@mui/material';
import HomeSearchBar from './HomeSearchBar';
import {Pie} from 'react-chartjs-2';
import {Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);



export default function DbSummary(){

    const navigate = useNavigate();
    const [var_counts, setVC] = useState({});

    
    const retrieveDBSum = async () => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'}
        }

        try{

            const res = await api.post('/api/retrieve-db-sum/', requestOptions)

            console.log(res)

            if (res.status == 200){
                setVC(res.data['var_counts'])
            }

            console.log(var_counts)
        }
        catch(error){

            console.error("Error fetching DB summary data", error)

        }

    }

    // Method defined to retrieved data based on the example queries given in the 
    // example search queries for the users try out
    const retrieveData = async (query) => {

        // console.log("In Retrieve data");

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                query: query,
                db_type: "ssv"
            })
        }

        console.log(requestOptions)

        try{
            const response = await api.post('/api/retrieve/',requestOptions);

            console.log(response)

            if(response.status == 200){
                const data = await response.data;
                console.log(data);

                navigate('/results', {state: {results: data, db_type: "ssv"}});

            } 

        } catch (error){
               
            console.error("Error fetching variant details", error)
        }

    }


    useEffect(() => {

        retrieveDBSum()
    }, [])

    // Pie chart data and options
    const variantCount = {
        labels: ['Germline CNVs','Variants < 50 bp'],
        datasets: [
            {
                data: [var_counts['cnv_count'], var_counts['ssv_count']],
                backgroundColor: ['#121E31','#7DD3FC'],
                hoverOffset: 4,
            },
        ],
    };

    const variantData = {
        labels: ['Exonic Variants','Intronic Variants','Intergenic Variants','Regulatory Site Variants',
            'Splice Variants','Intragenic Variants'
        ],
        datasets: [
            {
                data: [
                    var_counts['exo_count'],
                    var_counts['intro_count'],
                    var_counts['inter_count'],
                    var_counts['reg_count'],
                    var_counts['spli_count'],
                    var_counts['intra_count']
                ],
                backgroundColor: ['#99d98c','#76c893', '#52b69a', '#34a0a4','#168aad', '#1a759f'],
                hoverOffset: 4,
            },
        ],
    }

    const options = {
        plugins: {
            legend: {
                labels:{
                    padding: 5
                    
                }
            }
        }
    }

    const options1 = {
        plugins: {
            legend: {
                labels:{
                    padding: 15
                    
                }
            }
        }
    }

    // Examples for the example search queries
    const examples = {
         data_1:[
            {'1p894573rGaA' : 'by SLGVD specific variant ID'},
            {'NOC2L' : 'by gene'},
            {'Missense' : 'by consequence'},
        ],
    }
    

    return (

        <Grid2 container  
            sx = {{
                p:5,
                margin: '0 50px 0 50px',
            }}
        >

            {/* Example search queries & About section */}
            
            <Grid2 container size = {{sm: 12, md: 6}}
                sx = {{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Grid2 size = {12} alignItems= 'center'>

                    <Card 
                        sx ={{
                            display: 'flex',
                            p: 2,
                            mt: 4,
                            borderRadius: 4,
                            boxShadow: 'none',
                            border: '6px solid',
                            borderColor: '#1E3248',
                            // minWidth: '450px'
                        }}
                    >
                        <CardContent >
                            <Typography textAlign = 'justify'>
                                Example search queries,
                            </Typography>
                            <List sx = {{pl:2}}>
                                {examples.data_1.map((example, index) => ( 

                                    <ListItem key = {index}>
                                        <Typography variant = "body1">
                                            <Link
                                                sx = {{
                                                    fontWeight: 600,
                                                    '&:hover':{
                                                        color: '#7DD3FC'
                                                    }
                                                }}
                                                component = 'button'
                                                underline = 'none'
                                                onClick = {() => {
                                                    retrieveData(Object.keys(example)[0].toLowerCase());          
                                                }}
                                            >


                                                {Object.keys(example)[0]}
                                            
                                            </Link>
                                            - {Object.values(example)[0]}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                            <Typography textAlign = 'justify'>
                                For more search features refer the documentation.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size = {12} alignItems= 'center'>

                    <Card 
                        sx ={{
                            display: 'flex',
                            p: 2,
                            mt: 4,
                            borderRadius: 4,
                            boxShadow: '0 0 20px 1px #B0C6DD'
                        }}
                    >
                        <CardContent >
                            <Typography 
                                variant = 'subtitle1'
                                textAlign = 'center'
                            >
                                About
                            </Typography>
                            <br />
                            <Typography textAlign = 'justify'>
                                The Sri Lankan Genetic Variation Database was developed primarily for the archival of genetic variants identified within the Sri Lankan populace. Thereby, it takes on the responsibility of acting as a reference of genetic variants unique to Sri Lankans.
                                <br />
                                <br />
                                SLGVD was implemented by the collaborative effort between the Human Genetics Unit at the Faculty of Medicine and Faculty of Science of the University of Colombo. The current iteration of SLGVD was deployed in 2025 and mainly host SNVs, short indels and CNVs. 
                                <br />
                                <br />
 
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>

            {/* SLGVD variant data summarized in 2 pie charts*/}

            <Grid2 size = {{xs:12, sm: 12, md: 6}} alignItems= 'center'
                sx = {{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Card align = 'center'
                    sx = {{
                        display: 'flex',
                        boxShadow: 'none',
                        mt: 2
                    }}
                >
                    <CardContent >
                        <Typography
                            variant = 'subtitle1'
                            textAlign= 'center'
                            sx = {{
                                pb: 4
                            }}    
                        >

                            SLGVD <br /> Summary

                        </Typography>
                        <Pie data = {variantCount} options={options1}/> <br /><br />
                        <Pie data = {variantData} options={options}/>
                    </CardContent>
                </Card>
            </Grid2>

        </Grid2>

    )
}



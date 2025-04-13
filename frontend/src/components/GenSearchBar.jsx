import * as React from 'react';
import {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Stack, Select, Typography, MenuItem, Box, Button, Container, TextField, Collapse, Alert} from '@mui/material';
import api from '../api';
import SearchIcon from '@mui/icons-material/Search';
import dnaImg from '../assets/landing page _ DNA _ 1-Photoroom.png';

export default function GenSearchBar(){

    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [db, setDb] = useState("ssv")
    const [errorMsg, setErrorMsg] = useState("");

    const retrieveData = async () => {

        console.log("In Retrieve data");

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                query: query,
                db_type: db
            })
        }

        console.log(requestOptions)

        
        try{
            const response = await api.post('/api/retrieve/',requestOptions);

            console.log(response)

            if(response.status == 200){
                const data = await response.data;
                console.log(data);

                navigate('/results', {state: {results: data, db_type: db}});

            } 

        } catch (error){
            
            setErrorMsg("Data Not Found")                
            console.error("Error fetching variant details", error)
        }

    }

    const handleInput = (e) => {
        setQuery(e.target.value);
    }

    const handleDb = (e) => {
        setDb(e.target.value)
    }

    return (

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

            {/* Search Bar */}
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
                <Stack
                    sx = {{
                        flexDirection: 'row',
                        width: '50%',
                                                
                    }}
                >
                    
                    <TextField 
                        type = 'text'
                        size = 'small'
                        variant = 'outlined'
                        placeholder= 'Search variant'
                        fullWidth

                        sx = {{

                            '& .MuiOutlinedInput-root':{

                                borderRadius: '12px 0 0 12px',
                                backgroundColor: 'white',
                                
                                '& fieldset':{
                                    borderColor: 'white',
                                    color: 'primary.dark'
                                },
    
                                '&:hover fieldset':{
                                    border: '1px',
                                    boxShadow: '0 0 8px 1px #0F1929',
                                    transition: '0.5s ease'

                                },

                                '&.Mui-focused fieldset':{
                                    border: '1px',
                                    boxShadow: '0 0 8px 1px #0F1929'
                                },
                            },

                            '& .MuiInputLabel-root':{
                                color: 'primary.dark'
                            },
 
                            '& .MuiInputLabel-root.Mui-focused':{
                                color: 'primary.dark'
                            },

                        }}

                        onChange = {handleInput}
                    />

                    <Button 
                        variant = 'contained'
                        startIcon = {<SearchIcon color = 'primary'/>}

                        sx = {{
                            backgroundColor: 'white',
                            borderRadius: '0 12px 12px 0',
                            boxShadow: '#0F1929',
                        }}

                        onClick ={retrieveData}
                    >

                    </Button>


                </Stack>

                <Select
                    onChange = {handleDb}
                    value = {db}
                    size = 'small'
                    sx = {{
                        backgroundColor: 'white', 
                        width: '50%',
                        borderRadius: '12px',
                        mt: 1,
                        boxShadow: '#0F1929',
                        color: 'primary.dark',

                        '& fieldset':{
                            border: 0,
                        },

                        '&:hover fieldset' : {
                            border: 0,
                            boxShadow: '0 0 8px 1px #0F1929',
                            transition: '0.5s ease'
                        },

                        '&.Mui-focused fieldset': {
                            border: '1px',
                            boxShadow: '0 0 8px 1px #0F1929'
                        }

                        

                    }}
                >

                    <MenuItem value = 'ssv'> SLGVD Short Variants
                    </MenuItem>
                    <MenuItem value = 'gcnv'> SLGVD Germline CNVs
                    </MenuItem>

                </Select>

                <Collapse 
                    in = {errorMsg != ""}
                    sx = {{mt:1}}>
                    <Alert 
                        severity = 'error'
                        onClose = {() => {
                            setErrorMsg("")
                        }}
                    > 
                        {errorMsg}
                    </Alert>

                </Collapse>

            </Container>


        </Box>



    );


}
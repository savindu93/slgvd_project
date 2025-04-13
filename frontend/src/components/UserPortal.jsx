import {TextField, List, Box, Grid2, Button, Typography, Card, CardContent, Collapse, Alert, ListItem, Link, InputLabel, styled, Container, Stack, Accordion, AccordionActions, AccordionSummary, AccordionDetails, FormGroup, FormControl, Select, MenuItem,IconButton, useMediaQuery, useTheme, ButtonGroup, FormLabel, OutlinedInput} from '@mui/material';
import api from '../api';
import ResultsTable from './ResultsTable';
import ProgressBar from './ProgressBar';
import { DATA, DB } from '../constants';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate, Navigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

const VisuallyHiddenInput = styled('input')({

    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whitespace: 'nowrap',
    width: 1,

})


export default function UserPortal({results}){

    const navigate = useNavigate();
    const user = results;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    // For the user's query
    const [query, setQuery] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [data, setData] = useState(null);
    const [userPort, setUserPort] = useState(false); // Indicates whether the results come from the UserPortal or not

    // Gives the total count of variants submitted by the user and the last date of submission
    const [count,setCount] = useState(null);
    const [lastSub, setLastSub] = useState(null);

    // Variant search and editor
    // Open search and editor
    const [open, setOpen] = useState(false);
    const [dbS, setDbS] = useState("ssv");
    const [db, setDb] = useState("ssv");

    const handleDb = (e) => {
        setDbS(e.target.value)
    }

    // Opens variant search and editor
    function handleEditor(){

        if (open == false){
            setOpen(true)
        } else{
            setOpen(false)
        }
            

    }

    // Selecting fields to edit
    const [fields, setFields] = useState([]);
    const [varId, setVarId] = useState({});
    const [fieldVal, setFieldVal] = useState({});
    const [dbE, setDbE] = useState("ssv");
    const [errors, setErrors] = useState({});

    // Select variation database specific to the variant you want to edit
    const handleDbE = (event) => {
        setDbE(event.target.value)
    } 

    // Assigns specified variation ids to the varId dictionary
    const handleVarId = (event) => {

        const varIds = event.target.value 
        setVarId(

            // If more than one variation id is given, a comma separated list is created
            {variation_id__in : typeof varIds === 'string' ? varIds.split(',') : varIds}
        )
    }

    // Assigns selected fields to value list
    const handleFieldSelect = (event) => {

        const field = event.target.value

        console.log(field)
        
        setFields(
            // If more than one field is given they are a comma separated list created
            typeof field === 'string' ? field.split(',') : field
        );
    }

     // Assigns specified new field values to fieldVal dictionary
    const handleFieldValues = (event) => {

        console.log(fields);

        // If the user wants to update multiple fields at once, the corresponding field values will be comma separated
        const fieldVals = event.target.value.split(',')

        console.log(fieldVals)

        const tempFieldVal = {}

        // Iterating through the fields in value list and assigning the new value to the respective field (the user needs to specify the new values in the same order the fields were selected from the drop-down menu) 
        fields.some((field,index) => {
            console.log(field) 
            tempFieldVal[field] = fieldVals[index]
        })

        setFieldVal(tempFieldVal)
        console.log(fieldVal)
    }

    const handleUpdate = async () => {

        console.log(varId)

        // Check for errors in the Text fields
        if (varId == '' && !Object.keys(fieldVal).includes('submission_id')){
            setErrors((prevState) => ({
                ...prevState,
                variant_id : 'Variant Id Required'
            }))
        }
        else{

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({data: [fieldVal,varId,dbE]})
            }
    
            try{
    
                const response = await api.post('/api/update/',requestOptions);
                console.log(response)
    
                if (response.status == 200){
                    alert("Update Successful")
                }
                else{
                    alert("An error occurred\n\n"+response.error)
                }
            }
            catch(error){
                alert(error)
            }

        }

    }

    const handleRemove = async () => {

        const requestOptions = {
            method : 'POST',
            header: {'Content-Type':'application/json'},
            body: JSON.stringify({data: [fieldVal,varId,dbE]})
        }

        try{

            const response = await api.post('/api/remove/',requestOptions)
            console.log(response)

            if(response.status == 200){

                alert("Entries deleted successfully")
            }
            else{

                alert("An error occurred")
            }

        }
        catch(error){
            alert(error.response.data.message)
            console.log(error)
        }
    }

    useEffect(() => {
        console.log(fieldVal)
        //console.log(Object.keys(fieldVal))
    },[fieldVal])
    
    // Open data submission dialog
    const [openD, setOpenD] = useState(false);

    // For the uploaded files
    const [fileType, setFileType] = useState('');
    const [files, setFiles] = useState([]);
    const [res, setRes] = useState(null);
    const [log, setLog] = useState(null);
    

    const handleFileType = (event) => {
        setFileType(event.target.value)
    };

    const handleFileChange = (event) => {
        setLog(null)
        setFiles(event.target.files)
    };

    const handleUpload = async () => {

        if(!files.length){
            alert('Please select files to upload')
            return;
        }

        setOpenD(true);

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('files', file);
        });

        formData.append('file-type', fileType)

        console.log(formData)

        try{
            const response = await api.post('/api/upload/', formData,
                {headers: {'Content-Type':'multipart/form-data'}}
            );

            if (response.status == 200){

                setRes(response.status)
                setLog(response.data.log)

            }
            
            console.log('Response', response.data)

        } catch (error){

            alert('Error uploading files');
            console.error('Upload error', error)
        }
    }

    // Close data submission dialog
    const handleClose = () => {
        setOpenD(false);
    }

    function logout(){

        localStorage.clear();
        navigate('/login');

    }

    // To retrieve a summary of the data submitted by user
    const retrieveDataSumByUser = async() => {

        console.log("In Retrieve data");

        try{
            const response = await api.post('/api/retrieve-by-user/');

            console.log(response)

            if(response.status == 200){
                const data = await response.data;
                setCount(data.count)
                setLastSub(data.last_sub_date)
            } 

        } catch (error){
            setErrorMsg("Data Not Found")                
            console.error("Error fetching variant details", error)
        }
    }

    // To retrieve data queried by the user
    const retrieveData = async () => {

        console.log("In Retrieve data");

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                query: query,
                db_type:dbS
            })
        }

        console.log(requestOptions)
        
        try{
            const response = await api.post('/api/retrieve/',requestOptions);

            console.log(response)

            if(response.status == 200){
                const data = await response.data;
                setData(data);
                setUserPort(true);
                setDb(dbS)

                // Save data in local storage to be retrieved when
                // user moves to another page and returns to user 
                // portal
                localStorage.setItem(DATA, JSON.stringify(data))
                localStorage.setItem(DB, dbS)

                console.log(data);
            } 

        } catch (error){
            
            setErrorMsg("Data Not Found")                
            console.error("Error fetching variant details", error)
        }

    }

    const handleInput = (e) => {
        setQuery(e.target.value);
    }

    // Download log file
    const handleDownload = async () => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({data:log, type: 'txt/plain'}),
            responseType: 'blob'
        }

        try{
            const response = await api.post('/api/download/', requestOptions);
            console.log(response)

            if (response.status == 200){

                const blob = new Blob([response.data], {type: 'text/plain'})
                const url = window.URL.createObjectURL(blob)

                const a = document.createElement('a')
                a.style.display = 'none';
                a.href = url;
                a.download = 'Submission_Log.txt';

                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

            } else{
                console.error("Failed to create a download file");
            }

        }
        catch(error){

            alert(error)
        }

    }

    useEffect(() => {

        retrieveDataSumByUser();

        if(localStorage.getItem(DATA)){
            setUserPort(true);

            // In the event the user doesn't logout but moves to another page and returns the user data in localStorage is re-assigned
            console.log(JSON.parse(localStorage.getItem(DATA)));
            setData(JSON.parse(localStorage.getItem(DATA)));
            setDb(localStorage.getItem(DB))
        }
        

    }, [])

    return(

        <Grid2 container spacing = {1}
            sx = {{
                p:5,
                margin: '0 50px 0 50px', 
            }}    
        >
            {/* Logout button */}
            <Button 
                variant = 'outlined' 
                startIcon = {<KeyboardBackspaceIcon />}
                onClick = {() => {logout()}}
                sx = {{
                    '&:hover': {
                        backgroundColor: 'primary.light'
                    }
                }}
            >
                Logout
            </Button>

            {/* Top Content */}
            <Grid2 container size = {12} >

                {/* Left */}
                <Grid2 
                    size = {{xs:12, sm:12, md: 12, lg:7}}
                    sx = {{
                        m: 3, 
                        display:'flex',
                        flexDirection:'column',
                        gap: 2
                    }}
                    
                >
                    {/* Personal Info */}
                    <Card 
                        sx = {{
                            borderRadius: 4, 
                            p:3,
                            minWidth: '470px',
                            display:'flex',
                            flexGrow:1  
                        }}
                    >
                        <CardContent>
                            <Box sx = {{
                                    mt: 2, mb: 2,
                                    pl: 1,
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}
                            >
                                <List>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Institution E-mail: 
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            User Name: 
                                        </Typography>
                                    </ListItem>
                                </List>
                                <List sx = {{pl: 4}}>
                                    <ListItem>
                                        <Typography>
                                            {user.email}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {`${user.first_name} ${user.last_name}`}
                                        </Typography>
                                    </ListItem>
                                </List>
                                
                            </Box>
                        </CardContent> 
                    </Card>

                    {/* Data submission */}
                    <Card 
                        sx = {{
                            borderRadius: 4, 
                            p: 1,
                            minWidth: '470px',
                            display:'flex',
                            flexGrow: 1  
                        }}
                    
                    >
                        <CardContent
                            sx = {{
                                width: '100%',
                                alignItems: 'center',
                                pr: 5
                            }}
                        >
                            
                            <Typography variant = 'subtitle1' sx = {{pt:2, pl:2, pb:1}}>
                                Submit Data
                            </Typography>
                            <Box sx = {{pl:3}}>
                                <List sx = {{display:'flex', flexDirection:'row'}}>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600, pr:1}}>
                                            Upload data from 
                                        </Typography>
                                        <Select
                                            onChange = {handleFileType}
                                            value = {fileType}
                                            size = 'small'
                                        >

                                            <MenuItem value = 'tsv'> TSVs on Short Variants
                                            </MenuItem>
                                            <MenuItem value = 'gcnv'> GATK-gCNV VCF
                                            </MenuItem>

                                        </Select>
                                    </ListItem>
                                    <ListItem sx = {{pr:20}}>
                                        <Button
                                            component = 'label'
                                            variant = 'outlined'
                                            startIcon = {<CloudUploadIcon />}
                                            sx = {{
                                                '&:hover':{
                                                    backgroundColor:'primary.light'
                                                }
                                            }}
                                        >
                                            Upload Files
                                            <VisuallyHiddenInput 
                                                type = 'file'
                                                onChange = {handleFileChange}
                                                multiple
                                            />
                                        </Button>
                                    </ListItem>
                                </List>
                                <List sx = {{pl:3}}> 
                                        {files ? 
                                            
                                            Array.from(files).map((file) => 

                                                <ListItem>
                                                    <Typography>
                                                        {file.name}
                                                    </Typography>
                                                </ListItem>

                                            ):null
                                    
                                        }
                                </List>
                                <ProgressBar />
                                <ButtonGroup variant = 'contained' color = 'primary'>
                                    <Button
                                        onClick = {handleUpload}
                                        disabled = {!files.length}
                                        size = 'small'
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        disabled = {!log}
                                        onClick = {handleDownload}
                                        size = 'small'
                                    >
                                        Download Submission Logs
                                    </Button>
                                </ButtonGroup>
                                
                            </Box>
                            
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Right: Summary of variants submitted by user  */}
                <Grid2 size = 'grow' sx = {{m: 3,maxHeight:'max-content', display:'flex'}}>
                    <Card 
                        sx = {{
                            borderRadius: 4, 
                            p:1,
                            display:'flex',
                            flexGrow:1
                        }}
                    >
                        <CardContent
                            sx = {{display:"flex", width:'100%'}}
                        >

                            <Box
                                sx = {{
                                    display:'flex',
                                    flexDirection:'column',
                                    flexGrow:1,
                                    height: '100%'
                                }}
                            
                            >
                                {count?
                                    <List sx = {{pl: 4}}>
                                        <ListItem>
                                            <Typography sx = {{fontWeight: 600}}>
                                                Total variants submitted
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography>
                                                {count}
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography sx = {{fontWeight: 600}}>
                                                Last submission
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography>
                                                {lastSub}
                                            </Typography>
                                        </ListItem>
                                    </List>:null
                                }
                                <Box
                                    sx = {{
                                        display:'flex',
                                        justifyContent:'center',
                                        alignItems: 'center',
                                        flexGrow: 1

                                    }}
                                
                                >
                                    <Button
                                        variant = 'outlined'
                                        color = 'primary'
                                        onClick = {handleEditor}
                                        sx = {{
                                            '&:hover':{
                                                backgroundColor:'primary.light'
                                            }
                                        }}

                                    >
                                        View & Edit <br /> Variant Data
                                    </Button>
                                </Box>
                                
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
            
            {/* Variant Search and Edit Section */}
            {open ?                 
                <Grid2 size = {12} 
                    sx = {{
                        m: 3,
                    }}
                    
                >

                        {/* Search Variants */}
                        <Box 
                            sx ={{
                                width: '100%',
                                //height: '100%',
                                overflow: 'hidden',
                                backgroundColor: 'primary.main',
                                borderRadius: 4,
                            }}

                        >

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
                                    value = {dbS}
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

                        {/* Update Entries */}
                        <Accordion 
                            sx ={{
                                display: 'flex',
                                flexDirection: 'column',
                                p: 2, pl: 3,
                                mt: 4,
                                borderRadius: 4,
                            }}
                        >
                            <AccordionSummary expandIcon = {<ArrowDownwardIcon />}>
                                <Typography 
                                    textAlign = 'justify'
                                    sx = {{
                                        fontWeight: 600,
                                    }}
                                >
                                    Update Entries
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                
                                <Stack
                                    sx = {{
                                        flexDirection: "row",
                                        gap : 2
                                    }}
                                >

                                    <FormControl
                                        sx = {{pl: 2, mb: 2}}    
                                    >
                                        
                                        <TextField 
                                            required
                                            label = 'Variant ID'
                                            name = 'variant_id'
                                            variant = 'standard'
                                            size = 'small' 
                                            onChange = {handleVarId}
                                            error = {!!errors.variant_id} 
                                            helperText = {errors.variant_id}                               
                                        />


                                    </FormControl>
                                    <Select
                                        onChange = {handleDbE}
                                        value = {dbE}
                                        size = 'small'
                                        sx = {{
                                            backgroundColor: 'white',
                                            width: '30%',
                                            borderRadius: '12px',
                                            mt: 1,
                                            boxShadow: '#0F1929',
                                            color: 'primary.dark',
                    
                                            '& fieldset':{
                                                border: 0,
                                            },
                    
                                            '&:hover fieldset' : {
                                                border: 0,
                                                boxShadow: '0 0 1px 1px #1E3248',
                                                transition: '0.5s ease'
                                            },
                    
                                            '&.Mui-focused fieldset': {
                                                border: '1px',
                                                boxShadow: '0 0 1px 1px #1E3248'
                                            }
                                        }}
                                    >
                    
                                        <MenuItem value = 'ssv'> SLGVD Short Variants
                                        </MenuItem>
                                        <MenuItem value = 'gcnv'> SLGVD Germline CNVs
                                        </MenuItem>
                    
                                    </Select>

                                </Stack>
                                
                                <FormControl 
                                    sx = {{
                                        pl: 2, mb: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 3
                                    }}
                                    
                                >
                                    
                                    <TextField 
                                        variant = 'standard'
                                        label = 'Field Value'
                                        name = 'field_val'
                                        onChange = {handleFieldValues}
                                        size = 'small'    
                                        error = {!!errors.field_val}
                                        helperText = {errors.field_val}                                
                                    /> 

                                    <Select
                                        onChange = {handleFieldSelect}
                                        value = {fields}
                                        size = 'small'
                                        multiple
                                    >

                                        <MenuItem value = 'gene_name'> Gene
                                        </MenuItem>
                                        <MenuItem value = 'consequence'> Consequence
                                        </MenuItem>
                                        <MenuItem value = 'submission_id'> Submission ID
                                        </MenuItem>

                                    </Select>

                                </FormControl>

                                <ButtonGroup 
                                    variant = 'contained' 
                                    size = 'small'
                                    sx = {{mt: 2}}    
                                >

                                    <Button onClick = {handleUpdate}> Update </Button>
                                    <Button onClick = {handleRemove}> Remove </Button>

                                </ButtonGroup>
                                    
                            </AccordionDetails>

                        </Accordion>
                    

                    
                </Grid2>:null
            }

            {/* Renders the ResultsTable.jsx */}
            <Grid2  size = {12} >
                
                
                {data ? 
                    
                    <ResultsTable results = {{data, userPort, db}}/>
                    : null 
                
                }


            </Grid2>
                        
        </Grid2>

    )

                
}
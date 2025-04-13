import {Grid2, Box, Container, Typography, Card, CardContent, Stack, Button, styled, List, ListItem, ListItemIcon, TablePagination, IconButton, Grid, CardMedia} from '@mui/material';
import {useState} from 'react';
import ArrowIcon from '@mui/icons-material/East';
import NArrowIcon from '@mui/icons-material/North';
import table_results from '../assets/table_results.png';
import vip_1 from '../assets/vip_1.png';
import vip_2 from '../assets/vip_2.png';
import vip_3 from '../assets/vip_3.png';
import upData from '../assets/upData.png';
import selFile from '../assets/upData1.png';
import upFile from '../assets/upData2.png';
import subFile from '../assets/upData3.png';
import edData from '../assets/edData.png';
import entVar from '../assets/edData1.png';
import selField from '../assets/edData2.png';
import entFieVal from '../assets/edData3.png';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const CButton = styled(Button)(({theme}) => ({

    fontSize: '13px',
    textTransform:'none',
    height: '25px',
    justifyContent:'flex-start',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    '&:hover' : {
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.primary.light
    },

    '& .MuiButton-root-active':{
        backgroundColor: theme.palette.primary.light
    }


}))

const CodeBlock = ({code}) => {
    return (

        <Box
            sx = {{
                my: 3,
                overflow:'auto',
                borderRadius: 4

            }}
        >
            <SyntaxHighlighter 
                language = 'python'
                wrapLines = {true}
                showLineNumbers = {true}
                style = {atomOneDark}
            >   
                {code}
                
            </SyntaxHighlighter>

        </Box>


    );
}

const Example = styled(Box)(({theme}) => ({

    backgroundColor: theme.palette.primary.light,
    padding: 20,
    margin: 20,
    maxWidth: '40rem',
    borderRadius: 4

}))

// Python code for API to retrieve data from SLGVD DB
const apiCode1 = 
`

import requests
# For data 
# API 
url = "http://127.0.0.1:8000/api/retrieve/"

# Request payload
payload = {
    "body": "{\\"query\\":\\"hes4\\"}"
}

# Make the POST request
response = requests.post(url, json=payload)

# Check the response
if response.status_code == 200:
    data = response.json()
    print("Response:", data)
else:
    print("Error:", response.status_code, response.text)
    
`

// Python code for API to upload data to SLGVD DB
const apiCode2 = 
`

# For data upload
login_url = "http://127.0.0.1:8000/api/token/"
login_data = {
    "email": "stevie@gen.cmb.ac.lk",
    "password": "123456" 
}

response = requests.post(login_url, data = login_data)
print(response)
print(response.json())
token = response.json()['access']

print(token)

upload_url = "http://127.0.0.1:8000/api/upload/"
headers = {
    'Authorization': f"Bearer {token}"
}

files = {
    'files': ('test_17.tsv', open('E:/Uni/Lvl 4/Res/Pipeline Results/test_17.tsv', 'rb'))
}

res = requests.post(upload_url, headers = headers, files = files)

print(res.status_code)
print(res.json())

`

export default function DocContent(){

    const [content, setContent] = useState('search');

    const handleClick = (e) => {
        setContent(e.target.value);
    }

    return(

        <Grid2 container size = {12}
            id = 'content'
            sx = {{
                p: 4
            }}
        >
            <Grid2  size = {{xs:12, sm:12, md:12, lg:3}} sx = {{minWidth: '279px'}}
            >
                <Card >
                    <CardContent>
                        <Stack direction = 'column'>
                            <CButton value = 'search' onClick = {handleClick}> Searching for Variants </CButton>
                            <CButton value = 'varInfo' onClick = {handleClick}> Understanding Variant Information </CButton>
                            <CButton value = 'upData' onClick = {handleClick}> Uploading Data </CButton>
                            <CButton value = 'edInfo' onClick = {handleClick}> Editing Variant Data </CButton>
                            <CButton value = 'api' onClick = {handleClick}> Programmetic Access with API </CButton>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid2>
            {content == 'search' ? 
            
                <Grid2 size = {{xs: 12, sm: 12, md:12, lg: 9}}
                    sx = {{pl:5, pt:5, color:'primary.dark'}}
                >

                    <Typography variant = 'subtitle1' color = 'primary.dark'> Searching for Variants </Typography>
                    <Typography variant='body1' sx = {{py: 3}}>

                        Variants in the database can be searched through the following fields,

                        <List>
                            <ListItem> <ListItemIcon> <ArrowIcon  sx = {{fontSize: '20px',color: 'primary.main'}}/> </ListItemIcon>  Chromosome number </ListItem>
                            <ListItem> <ListItemIcon> <ArrowIcon sx = {{fontSize: '20px', color: 'primary.main'}}/> </ListItemIcon>Gene name </ListItem>
                            <ListItem> <ListItemIcon> <ArrowIcon sx = {{fontSize: '20px', color: 'primary.main'}}/> </ListItemIcon> Variant position in the Chromosome </ListItem>
                            <ListItem> <ListItemIcon> <ArrowIcon sx = {{fontSize: '20px', color: 'primary.main'}}/> </ListItemIcon> Consequence </ListItem>
                        </List>

                        Queries don't require to be case sensitive i.e., values specified by the user for different fields can be either in lower or uppercase. However, SLGVD defined field names must be exactly as it is. <br /><br />

                        When searching for CNVs specify the variant region with the chromosome number as shown in the example 10 under Advance Search.



                    </Typography>
                    <Typography variant = 'subtitle2'> General Search </Typography>
                    <Typography variant = 'body1' sx = {{py: 3}}> 

                        A general search involve searching for a variant using a query where the fields are unspecified. For example,

                        <List>
                            <ListItem> 1. Searching by consequence </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> Missense </Typography>
                                <Typography variant = 'caption'> Searches for all variants whose consequence is missense </Typography> 
                            </Example>
                            <ListItem> 2. Searching by gene name </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> NOC2L </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the gene region NOC2L </Typography> 
                            </Example>
                            <ListItem> 3. Searching by variant position </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> 1007432 </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the genomic position 183456 </Typography> 
                            </Example>
                            <ListItem> 4. Searching by chromosome number </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> 1 </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the chromosome 1 </Typography> 
                            </Example>

                        </List>

                        



                    </Typography>
                    <Typography variant = 'subtitle2'> Advance Search </Typography>
                    <Typography variant = 'body1' sx = {{py: 3}}> 

                        Advance search features allows users to search for variants using more complex search queries. It involves specifying the field name (defined by SLGVD) and the corresponding value that the user wishes to search the variant. Users can search using one or more fields with "AND/OR" like key words simultaneously to narrow down the results. For example,

                        <List>
                            <ListItem> 1. Searching by consequence </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> Missense[consequence] </Typography>
                                <Typography variant = 'caption'> Searches for all variants whose consequence is missense. </Typography> 
                            </Example>
                            <ListItem> 2. Searching by gene name and consequence </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> NOC2L[gene] AND synonymous[consequence] </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the gene region NOC2L and whose consequence is synonymous. </Typography> 
                            </Example>
                            <ListItem> 3. Searching by variant position </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> 1007432[pos] </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the genomic position 183456 </Typography> 
                            </Example>
                            <ListItem> 4. Searching by chromosome number and consequence </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> 1[chr] AND intronic[consequence] </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the chromosome 1 </Typography> 
                            </Example>

                        </List>

                        <Typography variant = 'caption' fontWeight={600}>
                            Note: Leave no space between the last field value and field name within the square brackets.
                        </Typography><br /><br />

                        Users can also use multiple field values seperated by "," when searching. For example,

                        <List>
                            <ListItem> 5. Searching by consequence </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> missense,synonymous[consequence] </Typography>
                                <Typography variant = 'caption'> Searches for all variants whose consequence is missense. </Typography> 
                            </Example>
                            <ListItem> 6. Searching by gene name and consequence </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> NOC2L,samd11[gene] </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the gene region NOC2L and SAMD11. </Typography> 
                            </Example>
                            <ListItem> 7. Searching by variant position </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> 1007432,1019175,876499[pos] </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the genomic position 183456 </Typography> 
                            </Example>
                            <ListItem> 8. Searching by chromosome number and consequence </ListItem>
                            <Example> 
                                <Typography fontWeight={500}> 1,3[chr] AND missense,intronic[consequence] </Typography>
                                <Typography variant = 'caption'> Searches for all variants found in the chromosome 1 and 3 which are either splice or intronic variants.</Typography> 
                            </Example>
                            <ListItem> 9. Searching by consequence and gene name</ListItem>
                            <Example> 
                                <Typography fontWeight={500}> missense,synonymous[consequence] AND samd11,scnn1d[gene]</Typography>
                                <Typography variant = 'caption'> Searches for all variants whose consequence is missense. </Typography> 
                            </Example>
                        </List>

                        Advance search also permits users to search for variants in a given chromosomal region.

                        <List>
                            <ListItem> 10. Searching by specifying a chromosomal region</ListItem>
                            <Example> 
                                <Typography fontWeight={500}> 1:870000:1000000</Typography>
                                <Typography variant = 'caption'> Searches for all variants within the sequence region 870000 and 1000000 of chromosome 1. </Typography> 
                            </Example>
                        </List>


                        



                    </Typography>


                </Grid2>: null
            
            }

            {content == 'varInfo' ? 
            
                <Grid2 size = {{xs: 12, sm: 12, md:12, lg: 9}}
                    sx = {{pl:5, pt:5, color:'primary.dark'}}
                >

                    <Typography variant = 'subtitle1' color = 'primary.dark'> Understanding Variant Information </Typography>
                    <Typography variant='body1' sx = {{py: 3}}>

                        Once the user search for variants in SLGVD, they will be displayed in the form of a table as shown in the image below,

                        <Box 
                            component = 'img'
                            src = {table_results}
                            sx = {{
                                my: 3,
                                width: '100%',
                                minWidth: 'auto',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        The table shows entries related to each variant as its,

                        <List>
                            <ListItem> <ListItemIcon> <ArrowIcon  sx = {{fontSize: '20px',color: 'primary.main'}}/> </ListItemIcon>  Variant Id </ListItem>
                            <ListItem> <ListItemIcon> <ArrowIcon sx = {{fontSize: '20px', color: 'primary.main'}}/> </ListItemIcon> Chromosome Number </ListItem>
                            <ListItem> <ListItemIcon> <ArrowIcon sx = {{fontSize: '20px', color: 'primary.main'}}/> </ListItemIcon> Allele/ Site Frequency </ListItem>
                            <ListItem> <ListItemIcon> <ArrowIcon sx = {{fontSize: '20px', color: 'primary.main'}}/> </ListItemIcon> Consequence </ListItem>
                            <ListItem> <ListItemIcon> <ArrowIcon sx = {{fontSize: '20px', color: 'primary.main'}}/> </ListItemIcon> Gene </ListItem>
                        </List>

                        <Typography fontWeight = {600}>It is important to note that the position and information retrieved from external database sources of the variants are based on the GRch37/ hg19 assembly.</Typography>

                        <br />
                        
                        A CSV file of the information of retrieved variants given in the table can be downloaded by clicking on the Download Results button. Results can be further filtered from within the Filter Results tab. 

                        <br /><br />

                        <Typography fontWeight= {600}><i>The user can find more details relevant to each variant by clicking on the relevant Variant Id in the table. Not applicable for CNVs. </i></Typography>

                    </Typography>
                    

                    <Typography variant = 'subtitle2'> Variant Information Page (VIP) </Typography>
                    <Typography variant = 'body1' sx = {{py: 3}}> 

                        The variant information page is the page where the user is directed to by clicking on any Variant Id in the table. It provides more details on the variant. Variant information is sourced from both data in the SLGVD as well as other databases such as dbSNP. In the event dbSNP doesn't contain any information on it, "N/A" will be seen in front of the field. 

                        <br /><br />

                        The VIP has 3 sections,

                        <List>
                            <Example> 
                                <Typography fontWeight={500}> General information on the variant </Typography>
                                <Typography variant = 'caption'> 
                                    Includes details on the chromosome, position, type, reference and alternate allele, and consequence. The type of the variant is taken from dbSNP. Consequence of the variant is based on the data in the SLGVD but in the event it is absent, any information on it will be taken from the dbSNP.
                                </Typography><br />
                                <Box 
                                    component = 'img'
                                    src = {vip_1}
                                    sx = {{
                                        my: 3,
                                        width: '70%',
                                        minWidth: 'auto',
                                        height: 'auto',
                                        borderRadius: 4,
                                        boxShadow: '0 0 20px 1px #B0C6DD',
                                        transition: 'transform 0.3s ease',
                                        '&:hover':{
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                />
                            </Example>
                            <Example> 
                                <Typography fontWeight={500}> Information on the variant allele </Typography>
                                <Typography variant = 'caption'> 
                                    Includes details on the allele count, homozygous and heterozygous count, local allele frequency (LAF), and global allele frequency (GAF). GAFs are taken from the dbSNP while LAF are calculated using the data in SLGVD.
                                </Typography><br />
                                <Box 
                                    component = 'img'
                                    src = {vip_2}
                                    sx = {{
                                        my: 3,
                                        width: '70%',
                                        minWidth: 'auto',
                                        height: 'auto',
                                        borderRadius: 4,
                                        boxShadow: '0 0 20px 1px #B0C6DD',
                                        transition: 'transform 0.3s ease',
                                        '&:hover':{
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                /> 
                            </Example>
                            <Example> 
                            <Typography fontWeight={500}> Other identifiers </Typography>
                                <Typography variant = 'caption'> 
                                    Includes details on other identifiers of the variant i.e., both the canonical SPDI and HGVS nomenclatures. It also includes cross links to the dbSNP entry for that variant.
                                </Typography><br />
                                <Box 
                                    component = 'img'
                                    src = {vip_3}
                                    sx = {{
                                        my: 3,
                                        width: '70%',
                                        minWidth: 'auto',
                                        height: 'auto',
                                        borderRadius: 4,
                                        boxShadow: '0 0 20px 1px #B0C6DD',
                                        transition: 'transform 0.3s ease',
                                        '&:hover':{
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                />  
                            </Example>

                        </List>

            
                    </Typography>
                

                </Grid2>: null
        
            }

            {content == 'upData' ? 
                        
                <Grid2 size = {{xs: 12, sm: 12, md:12, lg: 9}}
                    sx = {{pl:5, pt:5, color:'primary.dark'}}
                >

                    <Typography variant = 'subtitle1' color = 'primary.dark'> Uploading Data to the SLGVD </Typography>
                    <Typography variant='body1' sx = {{py: 3}}>

                        Uploading variant data to the SLGVD can only be done by authenticated users. The user can upload one or more files at a time. For short sequence variants (SSVs) i.e., variants with length &lt; 50 bp, annotated TSV files and for germline CNVs VCF files are accepted.<br />
                        
                        <Box 
                            component = 'img'
                            src = {upData}
                            sx = {{
                                my: 3,
                                width: '70%',
                                minWidth: '500px',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        <br/>
                        To upload data to the database follow the steps described below,<br /><br />

                        1. Select the type of file from the dropdown menu.
                        
                        <Box 
                            component = 'img'
                            src = {selFile}
                            sx = {{
                                my: 3,
                                width: '70%',
                                minWidth: '500px',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        <br /><br />

                        2. Click upload files to upload files from local storage.

                        <Box 
                            component = 'img'
                            src = {upFile}
                            sx = {{
                                my: 3,
                                width: '70%',
                                minWidth: '500px',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        <br /><br />

                        3. Click submit to upload the data to the SLGVD SQL database.

                        <Box 
                            component = 'img'
                            src = {subFile}
                            sx = {{
                                my: 3,
                                width: '70%',
                                minWidth: '500px',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        <br /><br />

                        The user will be able to see the completion of data submission once the progress bar reaches 100% and the "Download Submission Logs" button is active.

                        <br /><br />

                        The dowload submission log gives details related to the submission such as the number of new variants submitted, number of existing variant entries updated as well as their variant ids, the submission id and date.
            
                    </Typography>
                

                </Grid2>: null
        
            }

            {content == 'edInfo' ? 
                                    
                <Grid2 size = {{xs: 12, sm: 12, md:12, lg: 9}}
                    sx = {{pl:5, pt:5, color:'primary.dark'}}
                >

                    <Typography variant = 'subtitle1' color = 'primary.dark'> Editing Data in the SLGVD </Typography>
                    <Typography variant='body1' sx = {{py: 3}}>

                        Editing variant data in the SLGVD can only be done by authenticated users. The user can edit specific variant entries using its unique variant id.<br />
                        
                        <Box 
                            component = 'img'
                            src = {edData}
                            sx = {{
                                my: 3,
                                width: '70%',
                                minWidth: '500px',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        <br/>
                        To edit data in the database follow the steps described below,<br /><br />

                        1. Select the type of variant from the dropwdown menu you want to edit.
                        <br />
                        
                        <Box 
                            component = 'img'
                            src = {entVar}
                            sx = {{
                                my: 3,
                                width: '70%',
                                minWidth: '500px',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        <br /><br />

                        2. Enter the exact variant id in the Variant ID field and select the field/s that needs to be editted. A user can select one or more fields to edit. To deselect a field, click on it again. After selecting the field/s, write the new value in the same order you selected the fields. 
                        
                        <br/>
                        <Box 
                            component = 'img'
                            src = {selField}
                            sx = {{
                                my: 3,
                                width: '70%',
                                minWidth: '500px',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        <br /><br />

                        3. Click update to change the old entries to the new entries that is specified in the Field Value field.

                        <Box 
                            component = 'img'
                            src = {entFieVal}
                            sx = {{
                                my: 3,
                                width: '70%',
                                minWidth: '500px',
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 0 20px 1px #B0C6DD',
                                transition: 'transform 0.3s ease',
                                '&:hover':{
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />

                        <br /><br />

                        <b> If the update is successful, a pop up window will appear with the message "Entries Updated Successfully".
                        </b>

                        <br /><br />

                        If the user wants to remove an entry, they can enter the relevant variant id or specify the submission id and click remove. When a submission id is specified, the relevant submission entry together with all the variants that were submitted by that submission will be permanently removed from the database.

                        <b> If the removal is successful, a pop up window will appear with the message "Entries Removed Successfully".
                        </b>

                    </Typography>
                

                </Grid2>: null

            }

            {content == 'api' ? 

                <Grid2 size = {{xs:12, sm:12, md:12, lg:9}}
                    sx = {{pl:5, pt:5, color:'primary.dark'}}
                >

                    <Typography variant = 'subtitle1' color = 'primary.dark'> Programmetic Access with API </Typography>
                    <Typography variant='body1' sx = {{py: 3}}>

                        The SLGVD REST API is developed using the Django Rest Framework. Using this REST API users can,

                        <List>
                            <ListItem> <ListItemIcon> <ArrowIcon  sx = {{fontSize: '20px',color: 'primary.main'}}/> </ListItemIcon>  Retrieve variant data based on a given query </ListItem>
                            <ListItem> <ListItemIcon> <ArrowIcon sx = {{fontSize: '20px', color: 'primary.main'}}/> </ListItemIcon> Upload data to the database (only available for authenticated users) </ListItem>
                        </List>


                    </Typography>

                    <Typography variant = 'subtitle2'> Retrieving Data with The REST API </Typography>
                    
                    <CodeBlock code = {apiCode1} />

                    <Typography variant = 'subtitle2'> Uploading Data to The SLGVD with The REST API </Typography>
                    
                    <CodeBlock code = {apiCode2} />

                    

                </Grid2>:null
        
            }

            {/* Go back to the top icon */}
            <Grid2 sx = {{pt:3}}>
                <IconButton
                    href = '#content'
                    sx = {{ '&:hover': {backgroundColor: 'primary.light'}}}
                >
                    <NArrowIcon
                        sx = {{color: 'primary.main'}}
                    />
                </IconButton>
            </Grid2>
            
        </Grid2>
    )


}
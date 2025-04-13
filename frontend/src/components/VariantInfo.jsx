import {List, Box, Grid2, Button, Typography, Card, CardContent, ListItem, CircularProgress, Link} from '@mui/material';
import api from '../api';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';




export default function VariantInfo({results,no}){

    const navigate = useNavigate();
    
    const data = results[0]
    const tot_no = no

    const [variant, setVariant] = useState(null);
    const [resStatus, setResStatus] = useState(null);

    // Allele counts and Allele frequency
    let allele_count = null
    let allele_freq = null
    if (data.het_count || data.homo_count){
        allele_count = data.het_count + data.homo_count;
        allele_freq = ((data.het_count  + data.homo_count * 2) / (tot_no * 2)).toPrecision(4)
    }

    // Method for retrieving data from external databases by calling on the RetrieveExtData view in the back-end 
    const retrieveExtData = async (data) => {


        // Query for Eutils - NCBI 
        const queryEutil = `${data.chromosome}[chr]+AND+${data.position}[position_grch37]`

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                query_eutil: queryEutil,
                //query_vep: queryVep
            })
        }

        console.log(requestOptions);

        // Function to filter reference and alternate alleles based on which the correct variant is selected 
        function filterRefAlt(item){

            const regex = /SEQ=\[([a-zA-Z-\/]*)\]/;
            const ref = item.DOCSUM.match(regex)[1].split('/',);

            console.log(ref)

            // If the variant type is a deletion
            const del = ref[1] == "-" && data.ref_allele.length > data.alt_allele.length
            
            console.log(data.alt_allele)

            if (ref[0] == data.ref_allele && 
                (ref.slice(1, ref.length).some(item => item === data.alt_allele) || del)){
                
                setVariant(item)
                return true;
            }

        }

        try{

            const response = await api.post('/api/retrieve-ext/', requestOptions)

            console.log(response);

            if (response.status == 200){

                const data_eutil =  await JSON.parse(response.data.data_eutil).variant.DocumentSummary
                console.log(data_eutil);

                if (Array.isArray(data_eutil)){

                    // Selecting the correct dbSNP entry based on the reference allele
                    data_eutil.some(item => {
                        console.log(item)
                        filterRefAlt(item)
                    })

                    if (!variant){
                        setResStatus(400)}

                } else{
                    filterRefAlt(data_eutil)
                    if (!variant){
                        setResStatus(400)
                    }
                }
            } else{
                console.log("Data not found")}
        }
        catch(error){
            setResStatus(error.status);
            console.log(`An error occurred: ${error.status}`)
        }
    }

    useEffect(() => {

        retrieveExtData(data)

    }, [])


    console.log(variant)

    // Contains the MUI components to render when there's no information on the variant in dbSNP 
    if (!variant){

        if(!variant && resStatus == 400){

            return(

                <Grid2 container spacing = {1}
                    sx = {{
                        p:5,
                        margin: '0 50px 0 50px', 
                    }}    
                >
                    {/* Back button */}
                    <Button 
                        variant = 'outlined' 
                        startIcon = {<KeyboardBackspaceIcon />}
                        onClick = {() => {
        
                            if (history.length > 1){
                                navigate(-1);
                            } else{
                                navigate('/');
                            }
                        }
        
                        }
                        sx = {{
                            '&:hover': {
                                backgroundColor: 'primary.light'
                            }
                        }}
                    >
                        Back
                    </Button>
        
                    {/* Top Content */}
                    <Grid2 container size = {12} >
        
                        {/* Left */}
                        <Grid2 
                            size = {{sm: 12, md: 12, lg:7}}
                            sx = {{m: 3, display:'flex'}}
                            
                        >
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
                                    <Typography variant = 'subtitle1' sx = {{pt:2, pl:2, pb:1}}>
                                        {data.variation_id}
                                    </Typography>
                                    <Box sx = {{
                                            mt: 2, mb: 2,
                                            pl: 6,
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <List>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Chromosome: 
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Position: 
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Type: 
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Reference Allele: 
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Alternate Allele: 
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Consequence: 
                                                </Typography>
                                            </ListItem>
                                        </List>
                                        <List sx = {{pl: 4}}>
                                            <ListItem>
                                                <Typography>
                                                    {data.chromosome}
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    {data.position}
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    N/A
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    {data.ref_allele}
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    {data.alt_allele}
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    {data.consequence? data.consequence : "N/A"}
                                                </Typography>
                                            </ListItem>
                                        </List>
                                        
                                    </Box>
                                </CardContent> 
                            </Card>
                        </Grid2>
        
                        {/* Right */}
                        <Grid2 size = 'grow' sx = {{m: 3,maxHeight:'max-content'}}>
                            <Card 
                                sx = {{
                                    borderRadius: 4, 
                                    p:1,
                                }}
                            >
                                <CardContent>
                                    <Box>
                                        <List sx = {{pl: 4}}>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Allele Count
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    {allele_count ? allele_count:"N/A"}
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Homozygous Count
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    {data.homo_count}
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Heterozygous Count
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    {data.het_count}
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Local Allele Frequency (AF)
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    {allele_freq ? allele_freq : "N/A"}
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Global AF
                                                </Typography>
                                            </ListItem>
                                            
                                            <ListItem>
                                                <Typography>
                                                    N/A
                                                </Typography>
                                            </ListItem>
                                            
                                        </List> 
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid2>
                    </Grid2>
        
                    {/* Bottom Content */}
                    <Grid2 size = {12} sx = {{m: 3}}>
                        <Card 
                            sx = {{
                                borderRadius: 4, 
                                p:3,
                                overFlowX: 'auto'
                            }}
                        >
                            <CardContent>
                                <Typography variant = 'subtitle1' sx = {{pt:2, pl:2, pb:1}}>
                                    Other Identifiers
                                </Typography>
                                <Grid2 size = {12}
                                    sx ={{
                                        mt: 2, mb: 2,
                                        pl: 6,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        overflowX: 'auto'
        
                                    }}
                                >
                                    {/* HGVS & SPDI */}
                                    <Grid2 
                                        sx = {{
                                            minWidth: 'fit-content'
                                            
                                        }}
        
                                        size = {{xs:12}}
                                    >
                                        
                                        <List>
                                                                                         
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Canonical SPDI
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    N/A
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    HGVS Nomenclature
                                                </Typography>
                                            </ListItem>
                                            
                                            <ListItem>
                                                <Typography>
                                                    N/A          
                                                </Typography>
                                            </ListItem>
                                        </List> 
                                    </Grid2>
        
                                    {/* Cross Ref */}
                                    <Grid2
                                        sx = {{
                                            minWidth: 'fit-content'
                                        }}
        
                                        size = {{xs:12}}
                                    >
                                        <List >
                                            <ListItem>
                                                <Typography sx = {{fontWeight: 600}}>
                                                    Cross References
                                                </Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography>
                                                    N/A 
                                                </Typography>
                                            </ListItem>
                                        </List>
                                    </Grid2>
                                </Grid2>     
                            </CardContent>
                        </Card>                   
                    </Grid2>
                </Grid2>
        
        
            )

        }

        else if (!variant) {

            return (
                <Box sx={{ textAlign: 'center', marginTop: 5 }}>
                    <Grid2 container justifyContent="center" alignItems="center" style={{ minHeight: '50vh' }}>
                        <CircularProgress /> {/* Show a loader while fetching data */}
                    </Grid2>
                    <Typography variant="h6">Loading variant information...</Typography>
                </Box>
            );
 
        }

    }

    // Extract HGVS identifiers
    const regex = /(?=)([a-zA-Z0-9:.>,_\*]*)(?=\|)/;
    const hgvs = variant.DOCSUM.match(regex)[0].split(',',)

    // Extract global MAFs
    const freq_re = /(?=)([\d+.]*)(?=\/)/;
    const gMAFs = {}

    if (variant.GLOBAL_MAFS != null){
        variant.GLOBAL_MAFS.MAF.map((item) => {

            if (item.STUDY == "GnomAD"){
    
                gMAFs['GnomAD'] = item.FREQ.match(freq_re)[0]
    
            } else if (item.STUDY == "GnomAD_exomes"){
    
                gMAFs['GnomAD_exomes'] = item.FREQ.match(freq_re)[0]
            }
    
        })
    }


    // Extract consequence
    const variant_con = variant.FXN_CLASS.split(',')

    
    return(

        <Grid2 container spacing = {1}
            sx = {{
                p:5,
                margin: '0 50px 0 50px', 
            }}    
        >
            {/* Back button */}
            <Button 
                variant = 'outlined' 
                startIcon = {<KeyboardBackspaceIcon />}
                onClick = {() => {

                    if (history.length > 1){
                        navigate(-1);
                    } else{
                        navigate('/');
                    }
                }

                }
                sx = {{
                    '&:hover': {
                        backgroundColor: 'primary.light'
                    }
                }}
            >
                Back
            </Button>

            {/* Top Content */}
            <Grid2 container size = {12} >

                {/* Left: General Information on variant */}
                <Grid2 
                    size = {{sm: 12, md: 12, lg:7}}
                    sx = {{m: 3, display:'flex'}}
                    
                >
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
                            <Typography variant = 'subtitle1' sx = {{pt:2, pl:2, pb:1}}>
                                {data.variation_id}
                            </Typography>
                            <Box sx = {{
                                    mt: 2, mb: 2,
                                    pl: 6,
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}
                            >
                                <List>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Chromosome: 
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Position: 
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Type: 
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Reference Allele: 
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Alternate Allele: 
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Consequence: 
                                        </Typography>
                                    </ListItem>
                                </List>
                                <List sx = {{pl: 4}}>
                                    <ListItem>
                                        <Typography>
                                            {data.chromosome}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {data.position}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {variant.SNP_CLASS? variant.SNP_CLASS:"N/A"}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {data.ref_allele}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {data.alt_allele}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {data.consequence ??
                                                (variant_con? variant_con.map((con) => {
                                                    return(
                                                        <Typography>
                                                            {con}
                                                        </Typography>
                                                    )}): "N/A")
                                            }
                                        </Typography>
                                    </ListItem>
                                </List>
                                
                            </Box>
                        </CardContent> 
                    </Card>
                </Grid2>

                {/* Right: Genotype counts and 
                allele frequency information */}
                <Grid2 size = 'grow' sx = {{m: 3,maxHeight:'max-content', display:'flex'}}>
                    <Card 
                        sx = {{
                            borderRadius: 4, 
                            p:1,
                            display:'flex',
                            flexGrow:1
                        }}
                    >
                        <CardContent>
                            <Box>
                                <List sx = {{pl: 4}}>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Allele Count
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {allele_count ? allele_count:"N/A"}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Homozygous Count
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {data.homo_count !== undefined &&  data.homo_count !== null ? data.homo_count:"N/A"}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Heterozygous Count
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {data.het_count !== null && data.homo_count !== undefined ? data.het_count:"N/A"}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Local Allele Frequency (AF)
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            {allele_freq ? allele_freq : "N/A"}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Global AF
                                        </Typography>
                                    </ListItem>
                                    {Object.entries(gMAFs).length !== 0 ? Object.entries(gMAFs).map(([study,freq]) => {

                                        return(

                                            <ListItem>
                                                <Typography>
                                                    {`${study} : ${freq}`}
                                                </Typography>
                                            </ListItem>
                                        )

                                    }) :  (
                                            <ListItem>
                                                <Typography>
                                                    N/A
                                                </Typography>
                                            </ListItem>
                                        )

                                    }
                                </List> 
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>

            {/* Bottom Content: HGVS and SPDI Identifiers
            and Cross reference links to dbSNP database*/}
            <Grid2 size = {12} sx = {{m: 3}}>
                <Card 
                    sx = {{
                        borderRadius: 4, 
                        p:3,
                        overFlowX: 'auto',
                        overflowY:'scroll',
                        maxHeight:'500px'
                    }}
                >
                    <CardContent>
                        <Typography variant = 'subtitle1' sx = {{pt:2, pl:2, pb:1}}>
                            Other Identifiers
                        </Typography>
                        <Grid2 size = {12}
                            sx ={{
                                mt: 2, mb: 2,
                                pl: 6,
                                display: 'flex',
                                flexDirection: 'row',
                                overflowX: 'auto',


                            }}
                        >
                            {/* HGVS & SPDI */}
                            <Grid2 
                                sx = {{
                                    minWidth: 'fit-content'
                                    
                                }}

                                size = {{xs:12}}
                            >
                                
                                <List>
                                    
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Canonical SPDI
                                        </Typography>
                                    </ListItem>
                                    
                                        {variant.SPDI ? 
                                        
                                            variant.SPDI.split(",").map((item,index) => {
                                                
                                                return(
                                                    <ListItem>
                                                        <Typography key = {index}>
                                                            {item}
                                                        </Typography>
                                                    </ListItem>
                                                )
                                                

                                            }):"N/A"
                                        }
                                    
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            HGVS Nomenclature
                                        </Typography>
                                    </ListItem>
                                    <Box sx = {{display:'', overFlowY: 'auto'}}>

                                        {hgvs?.length > 0 ? hgvs.map((item, index) => {
                                                
                                                return(
                                                    <ListItem>
                                                        <Typography key={index}>
                                                            {item}           
                                                        </Typography>
                                                    </ListItem>
                                                    
                                                )
                                                
                                            }) : "N/A"}

                                    </Box>
                                        
                                        
                                    
                                </List> 
                            </Grid2>

                            {/* Cross Ref */}
                            <Grid2
                                sx = {{
                                    minWidth: 'fit-content'
                                }}

                                size = {{xs:12}}
                            >
                                <List >
                                    <ListItem>
                                        <Typography sx = {{fontWeight: 600}}>
                                            Cross References
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            <Link
                                                component = 'button'
                                                underline = 'none'

                                                sx = {{
                                                    fontWeight: 500,
                                                    color: 'primary.main',

                                                    '&:hover': {
                                                        color: '#7DD3FC'
                                                    }

                                                }}

                                                onClick = {() =>{

                                                    window.open(`https://www.ncbi.nlm.nih.gov/snp/rs${variant.SNP_ID}`, '_blank')

                                                }}
                                            
                                            >
                                                {`rs${variant.SNP_ID}`}

                                            </Link>
                                            
                                        </Typography>
                                    </ListItem>
                                </List>
                            </Grid2>
                        </Grid2>     
                    </CardContent>
                </Card>                   
            </Grid2>
        </Grid2>

    )
             
}
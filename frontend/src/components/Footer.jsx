import {Grid2, Typography} from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function Footer(){

    return(

        <Grid2 
            size = {12}
            sx = {{
                mb: 2,
                mt: 2
            }}
        >
            <Typography 
                variant = 'caption'

            >
                Copyright <CopyrightIcon fontSize = 'inherit'/> 2024 SLGVD. All rights reserved.
            </Typography>
        </Grid2>
    )
}
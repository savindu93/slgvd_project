import React, {useEffect, useState} from 'react';
import {Box, Typography, LinearProgress, Button} from '@mui/material';

const ProgressBar = () => {

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");

   
    useEffect(() => {

        const socket = new WebSocket('ws://127.0.0.1:8001/ws/progress/');

        socket.onopen = () => {
            console.log("Connection successful");
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            
            setProgress(data.progress)
            setStatus(data.status)
        }

        socket.onerror = (event) => {
            console.log("websocket error", event)
        }

        socket.onclose = () => {

            console.log("Connection closed");
        }

        return () => {
            socket.close()
        }

    }, [])


    return (
        
        <Box sx = {{width:'100%', ml:2}}>

            <Box 
                sx = {{
                    width:'100%', 
                    mb:2, 
                    display:'flex', 
                    flexDirection:'row'
                }}
            >
                {
                status && 
                <Typography variant = 'caption' sx = {{mr:2}}>
                    {status}
                </Typography>
            
                }
                {progress ?
                <LinearProgress 
                    variant = 'determinate' 
                    value = {progress} 
                    sx = {{width: '100%', my:'auto'}}
                /> : null
                }
                {progress? 
                <Typography  sx ={{px:1, pr:4}}>
                    {progress}%
                </Typography>:null
                }
            </Box>

            

        </Box>


    )

}

export default ProgressBar;
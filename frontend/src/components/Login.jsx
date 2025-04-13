import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '../constants';
import { Card, CardContent, TextField, Button, FormControl, FormLabel, Typography, Box } from '@mui/material';

export default function Login({route, method}){

    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({

        email: false,
        password: false

    });

    const name = method === 'login' ? 'Login': 'Register'

    const handleSubmit = async (e) => {

        e.preventDefault();
        const newErrors = {
            email: !email,
            password: !password
        };

        setErrors(newErrors);
        console.log({email, password})

        try{

            const res = await api.post(route, {email, password})
            const user = res.data.user;

            console.log({
                "user":res.data.user,
                "access": res.data.access,
                "refresh": res.data.refresh})

            //console.log(JSON.stringify(user));

            if(method === 'login'){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem(USER, JSON.stringify(user));

                navigate("/submit-data", {state : {results:user}})
                
            } else {
                navigate("/login")
            }

        } catch (error){
            
            alert(error)
        }
    }

    return (

        <Box 
            component = 'form'
            onSubmit = {handleSubmit}
            sx = {{
                display : 'flex',
                gap: 2,
                maxwidth: '500',
                mx:'auto',
                mt:4,
                p:2,
                justifyContent:'center'
                
            }}

        >
            {/* Textfields to enter login credentials */}
            <Card
                sx = {{
                    borderRadius:4,
                    width: '500px',
                    mx:'auto',
                    p:3
                }}
            
            >
                <CardContent 
                    sx = {{
                        display: 'flex',
                        flexDirection: 'column',
                        gap:4
                    }}
                >

                <Typography variant = 'subtitle1' textAlign = 'center' sx = {{color:'primary.dark'}}> Login </Typography>

                    <FormControl>
                        <FormLabel> Email </FormLabel>
                        <TextField
                            type = 'email'
                            value = {FormData.email}
                            onChange = {(e) => setEmail(e.target.value)}
                            error = {errors.email}
                            helperText = {errors.email ? "Email is required" : ""}
                            placeholder='Enter institution email'
                            required
                        >
                        </TextField>
                    </FormControl>
                    <FormControl >
                        <FormLabel> Password </FormLabel>
                        <TextField
                            type = 'password'
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            error = {errors.password}
                            helperText = {errors.password ? "Password is required" : ""}
                            placeholder='Enter password'
                            required
                        >

                        </TextField>

                    </FormControl>

                    <Button
                        type = 'submit'
                        variant = 'contained'
                        color = 'primary'
                    >
                        Login
                    </Button>

                </CardContent>
            </Card>
        </Box>


    )

}
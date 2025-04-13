

const retrieveData = async () => {

    console.log("In Retrieve data");

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: query
        })
    }

    console.log(requestOptions)

    try{
        const response = await api.post('/api/retrieve/',requestOptions);

        console.log(response)

        if(response.status == 200){
            const data = await response.data;
            console.log(data);

            navigate('/results', {state: {results: data}});

        } 

    } catch (error){
        
        setErrorMsg("Data Not Found")                
        console.error("Error fetching variant details", error)
    }

}

export default retrieveData;
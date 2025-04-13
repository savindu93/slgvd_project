import * as React from 'react';
import { useState, useMemo , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {Link, Box, Grid2, List, Card, CardContent, Typography, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
TablePagination, TableSortLabel, styled,
tableCellClasses, FormGroup, FormControlLabel,
Checkbox, Accordion, AccordionSummary, AccordionDetails, Button,
Alert} from '@mui/material';
import PropTypes from 'prop-types';
import api from '../api';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const CustomTableCell =  styled(TableCell)(({theme}) => ({

    [`&.${tableCellClasses.head}`]:{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
    },


}))

const CustomTableSortLabel = styled(TableSortLabel)(({theme}) => ({

    '&.Mui-active':{
        color: theme.palette.primary.light,
    },

    '&:hover':{
        color: theme.palette.primary.light
    },

    '&.Mui-active .MuiTableSortLabel-icon':{
        color: theme.palette.primary.light
    }
}))


export default function ResultsTable({results}){

    console.log(results)

    const navigate = useNavigate();
    const userPort = results.userPort;
    const db = results.db;
    console.log(db)


    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('variation_id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Handling table changes such as sorting data, changing page number and number of rows displayed per page.
    const handleSortRequest = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    const handleChangePage = (event, newPage) => {

        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    function descendingComparator(a, b, orderBy){

        let aVal = a[orderBy]
        let bVal = b[orderBy]

        if (orderBy == 'chromosome'){
            if (aVal == 'X' || aVal == 'Y') aVal = aVal.charCodeAt(0);
            if (bVal == 'Y' || bVal == 'X') bVal = bVal.charCodeAt(0);   
        }

        if(bVal < aVal) return -1;
        if(bVal > aVal) return 1;
        return 0;
    }

    function getComparator(order, orderBy){
        return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    // Create entries for the table
    function createEntries(results){

        const varData = results.data.var_data;
        const subData = results.data.sub_data;
        const tot_individuals = results.data.tot_individuals;
      

        // Creating rows for the results table
        const rows = []
        let combinedData = []

        if (db == 'ssv'){
            const freqData = results.data.freq_data;

            // Combining data retrieved from db
            combinedData = varData.map(varItem => {
    
                const correspondingFreq = freqData.find(freqItem => freqItem.variation_id === varItem.variation_id);

                const correspondingSub = subData.find(subItem => subItem.submission_id === varItem.submission_id)

                return {
                        ...varItem,
                        ...correspondingFreq,
                        ...correspondingSub
                    };
            });

            combinedData.forEach(
                ({variation_id, chromosome, homo_count, het_count, consequence, gene_name, submission_date}) => {

                rows.push({
                    variation_id, 
                    chromosome: (chromosome == 'X' || chromosome == 'Y') ? chromosome : parseInt(chromosome,10),
                    allele_freq : ((homo_count * 2 + het_count)/ (tot_individuals * 2)).toPrecision(4),
                    consequence,
                    gene_name,
                    submission_date
                });
            })

        }

        if (db == 'gcnv'){

            console.log("in GNCV")

            // Combining data retrieved from db
            combinedData = varData.map(varItem => {
    
                const correspondingSub = subData.find(subItem => subItem.submission_id === varItem.submission_id)

                return {
                        ...varItem,
                        ...correspondingSub
                    };
            });

            combinedData.forEach(
                ({variation_id, chromosome, start_pos, end_pos, site_count, consequence, submission_date}) => {

                rows.push({
                    variation_id, 
                    chromosome: (chromosome == 'X' || chromosome == 'Y') ? chromosome : parseInt(chromosome,10),
                    start_pos,
                    end_pos,
                    site_count,
                    site_freq: (site_count / tot_individuals).toPrecision(4),
                    consequence,
                    submission_date
                });
            })
            
        }
            

        return [rows, combinedData,tot_individuals]

    }

    const [tableRows, combinedData,tot_individuals] = useMemo(() => createEntries(results), [results]);
    const [rows, setRows] = useState(tableRows);
    console.log(rows)

    // Contains the consequence and true/ false value pairs
    const consequences = [] 

    // Contains the names of the consequences that will be rendered in the filter search section in the UI
    const con_filter = []

    // Extracts the consequence types and create consequence and false value pairs to initialize the checkState
    tableRows.forEach((row) => {

        if(row.consequence != null){

            if (!consequences.some(con => con[0] === row.consequence.toLowerCase())){
                consequences.push([row.consequence.toLowerCase(),false])
                con_filter.push(row.consequence)
            }
            
        }
       
    })

    console.log(consequences)
    console.log(con_filter)

    // checkState contains a set of consequence and true/false value pairs that changes as the user checks the boxes in the filter search section in UI beside the table.
    const [checkState, setCheckState] = useState(

        Object.fromEntries(consequences)

    )

    // Filters the table rows based on the truth values in the checkState
    function filterRows(rows, checked){

        const filtered_rows = []
        //console.log(rows)

        if (checked.length > 0){

            let condition = checked.map(value => `item.includes("${value}")`).join("||");
            console.log(condition)

            // Create a new function to check whether the checked consequences are included in the row.consequence
            const checkCondition = new Function("item",`return ${condition};`);
    
            rows.forEach((row) => {
                
                if (row.consequence != null){
                    if (checkCondition(row.consequence.toLowerCase())){
                        filtered_rows.push(row);
                    }
                }
            })

        }

        console.log(filtered_rows)

        return filtered_rows
    }

    // handle check events each time a user checks a consequence checkbox in the filter search column
    const handleCheck = (event,rows) => {
        console.log(event)
        //console.log(rows)

        setCheckState(prevState => {

            const updatedState = {
                ...prevState,
                [event.target.name]: event.target.checked
            }

            // Identify checked states
           
            return updatedState;

        }) 
    }

    // The table is re-rendered each time the user filters data (the checkState is changed) and new data is rendered (tableRows are changed) 
    useEffect(() => {

        const checked = Object.entries(checkState)
        .filter(([key,value]) => value === true)
        .map(([key,value]) => key);

        console.log(checked)

        const filteredRows = filterRows(tableRows, checked)

        console.log(filteredRows);

        if(filteredRows.length != 0){
            setRows(filteredRows)
        }else{
            setRows(tableRows)
        }

    }, [checkState, tableRows])

    
    // Or when data is sorted.
    const visibleRows = useMemo(
        () => 
            [...rows]
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
            [order, orderBy, page, rowsPerPage, rows]
    )

    // Columns for the table when Short Sequence Variants (SSVs) are rendered
    const headerColumns = [
        {
            id:'variation_id',
            label:'Variant Id',

        },
        {
            id:'chromosome',
            label:'Chromosome',
        },
        {
            id:'allele_freq',
            label:'Allele Frequency',
        },
        {
            id:'consequence',
            label:'Consequence',
        },
        {
            id:'gene_name',
            label:'Gene',
        },
    ]

    // Columns for the table when CNVs are rendered
    const headerCNVColumns = [
        {
            id:'variation_id',
            label:'Variant Id',

        },
        {
            id:'chromosome',
            label:'Chr',
        },
        {
            id:'start_pos',
            label:'Start Pos',
        },
        {
            id:'end_pos',
            label:'End Pos',
        },
        {
            id:'site_freq',
            label:'Site Frequency',
        },
        {
            id:'consequence',
            label:'Con',
        },
    ]

    // If the table is rendered in the user portal page an additional column is added in rendering both SSVs and CNVs
    if (userPort){
        headerColumns.push(
            {
                id:'submission_date',
                label:'Submission Date'      
            }
        )

        headerCNVColumns.push(
            {
                id:'submission_date',
                label:'Submission Date'
            }
        )
    }

    function CustomTableHead(props){

        const {order, orderBy, rowCount, onRequestSort} = props;
    
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };
    
        return (
    
            <TableHead>
                <TableRow>
                    {db == 'ssv' ? 
                    
                        headerColumns.map((header) => (
                            
                            <CustomTableCell
                                key = {header.id}
                                sortDirection = {orderBy === header.id ? order : false}
                            >
                                <CustomTableSortLabel 
                                    active = {orderBy === header.id}
                                    direction = {orderBy === header.id ? order : 'asc'}
                                    onClick = {createSortHandler(header.id)}
                                >

                                    {header.label}

                                </CustomTableSortLabel>

                            </CustomTableCell>
                        )):

                        headerCNVColumns.map((header) => (
                            
                            <CustomTableCell
                                key = {header.id}
                                sortDirection = {orderBy === header.id ? order : false}
                            >
                                <CustomTableSortLabel 
                                    active = {orderBy === header.id}
                                    direction = {orderBy === header.id ? order : 'asc'}
                                    onClick = {createSortHandler(header.id)}
                                >

                                    {header.label}

                                </CustomTableSortLabel>

                            </CustomTableCell>
                        ))
                    
                    }
                </TableRow>
            </TableHead>
        )
    
    }

    CustomTableHead.propTypes = {

        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc','desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired

    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    // Downloading results 
    const handleDownload = async (rows) => {

        console.log(rows);

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({data: rows, type: "csv"}),
            responseType: 'blob',
        }

        try{

            const response = await api.post('/api/download/',requestOptions);

            console.log(response)

            if(response.status == 200){
                
                const blob = new Blob([response.data], {type: 'text/csv'})
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a')
                a.style.display = 'none';
                a.href = url;
                a.download = 'results.csv';

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
    
    return (

        <Grid2 container
            sx = {{
                p:3,
                //margin: '0 50px 0 50px',       
            }}
        >
            {/* Results Filter & Download Button */}
            <Grid2 container size = "grow"
                        sx = {{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 'min-content'
                        }}
                    >

                <Accordion 
                    sx ={{
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2, pl: 3,
                        mt: 4,
                        borderRadius: 4,
                        boxShadow: '0 0 20px 1px #B0C6DD'
                    }}
                >
                    <AccordionSummary expandIcon = {<ArrowDownwardIcon />}>
                        <Typography 
                            textAlign = 'justify'
                            sx = {{
                                fontWeight: 600,
                            }}
                        >
                            Filter Results
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        <FormGroup
                            sx = {{pl: 2}}    
                        >
                            {
                                
                                con_filter.map((con) => {

                                    return(
                                        <FormControlLabel
                                            control = {
                                            <Checkbox 
                                                checked = {checkState[con.toLowerCase()]}
                                                onChange = {() => {
                                                    handleCheck(event, tableRows)
                                                }}
                                                name = {`${con.toLowerCase()}`}
                                            />
                                            }
                                            label = {`${con}`}
                                        />
                                    )
                                })

                            }
                        
                        </FormGroup>
                            
                    </AccordionDetails>

                </Accordion>
                {rows ? 

                    <Button
                        variant = 'contained'
                        sx = {{mt:2}}
                        onClick = {() => handleDownload(rows)}
                    >
                        Download Results

                    </Button>:null

                }

                           
            </Grid2>

            {/* Results Table */}
            <Grid2 size = {{sm: 12, md: 12, lg:9}} alignItems= 'center'
                sx = {{
                    p: '0 10px 0 10px',
                }}
            >

                <Box>

                    <TableContainer
                        component = {Paper}
                        sx = {{ 
                            mt: 4                 
                        }}

                    >
                        <Table>

                            <CustomTableHead
                                order = {order}
                                orderBy = {orderBy}
                                onRequestSort = {handleSortRequest}
                                rowCount = {rows.length}
                            />

                            <TableBody>
                                {db == 'ssv' ?
                                
                                    visibleRows.map((row) => {

                                        return(
                                            <TableRow  
                                                hover
                                                sx = {{
                                                    cursor: 'pointer',
                                                    '& td, & th': {
                                                        borderColor: 'primary.main'
                                                    },
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0
                                                    }    
                                                }}
                                            >
                                                <TableCell
                                                    component= 'th'
                                                    scope = 'row'
                                                >
                                                    <Link
                                                        component = 'button'
                                                        underline = 'none'
                                                        sx = {{
                                                            fontWeight: 600,
                                                            color: 'primary.main',

                                                            '&:hover': {
                                                                color: '#7DD3FC'
                                                            }
        
                                                        }}
                                                        onClick = {() => {

                                                            const variant_data = combinedData.filter(item => item.variation_id == row.variation_id)
                                                            navigate(`/${row.variation_id}`, {state: {results: variant_data, tot_individuals: tot_individuals}})
                                                        }}
                                                    
                                                    
                                                    >
                                                        {row.variation_id}
                                                    </Link>
                                                    

                                                </TableCell>
                                                <TableCell> {row.chromosome} </TableCell>
                                                <TableCell> {row.allele_freq} </TableCell>
                                                <TableCell> {row.consequence} </TableCell>
                                                <TableCell> {row.gene_name} </TableCell>
                                                {userPort? <TableCell> {row.submission_date} </TableCell> : null}
                                            </TableRow>
                                        );
                                    }):

                                    visibleRows.map((row) => {

                                        return(
                                            <TableRow  
                                                hover
                                                sx = {{
                                                    cursor: 'pointer',
                                                    '& td, & th': {
                                                        borderColor: 'primary.main'
                                                    },
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0
                                                    }    
                                                }}
                                            >
                                                <TableCell scope = 'row'
                                                    sx = {{
                                                        fontWeight: 600,
                                                        color: 'primary.main',
    
                                                    }}
                                                >
                                                    {row.variation_id}
                                                
                                                </TableCell>
                                                <TableCell> {row.chromosome} </TableCell>
                                                <TableCell> {row.start_pos} </TableCell>
                                                <TableCell> {row.end_pos} </TableCell>
                                                <TableCell> {row.site_freq} </TableCell>
                                                <TableCell> {row.consequence} </TableCell>
                                                {userPort? <TableCell> {row.submission_date} </TableCell> : null}
                                            </TableRow>
                                        );
                                    })
                                
                                }
                                {emptyRows > 0 && (
                                    <TableRow
                                        sx = {{
                                            height: 53 * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan = {5} />
                                    </TableRow>
                                )}


                            </TableBody>


                        </Table>

                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component = "div"
                        count = {rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />          


                </Box>
                
            </Grid2>

        </Grid2>

    )

}
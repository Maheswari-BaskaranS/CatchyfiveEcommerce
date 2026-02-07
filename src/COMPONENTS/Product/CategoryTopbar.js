// import React from 'react'
// import noimage from '../../ASSETS/noimage.png'
// import './CategoryTopbar.css'
// import { Link, useNavigate } from 'react-router-dom'

// const CategoryTopbar = ({ categories }) => {

//     categories = [
//         {
//             category: {
//                 "Code": "all",
//                 "Name": "All Products",
//                 "CategoryImageFilePath": noimage,
//                 "Categoryshorturl":"all",
//                 "subcategories": []
//             }
//         },
//         ...categories
//     ]

//     const navigate = useNavigate()

//     return (
//         <select className='categorytopbar'
//         //  onChange={(e) => {
//         //     window.location.href = `/searchbycategory/${e.target.value.Code}/${e.target.value.Name}/all`
//         //     // navigate(`/searchbycategory/${e.target.value.Code}/${e.target.value.Name}/all`)
//         //  }}
//         onChange={(e) => {
//             console.log(JSON.parse(e.target.value))
//             navigate(`/searchbycategory/${JSON.parse(e.target.value).Code}/${JSON.parse(e.target.value).Name}/all`)
//             // navigate(`${JSON.parse(e.target.value).Categoryshorturl}`)
//         }}
//         >
//             <option value='' disabled>Select Category</option>
//             {
//                 categories && categories.length > 0 && categories.map((item) => {
//                     return (
//                         <option value={JSON.stringify(item.category)}

//                             onClick={(e) => {
//                                 console.log(e.target.value)
//                                 // window.location.href = `/searchbycategory/${e.target.value.Code}/${e.target.value.Name}/all`
//                                 // navigate(`/searchbycategory/${e.target.value.Code}/${e.target.value.Name}/all`)
//                             }}
//                         >

//                             {item.category.Name}

//                         </option>
//                     )
//                 })
//             }
//         </select>
//     )
// }

// export default CategoryTopbar


import React from 'react';
import noimage from '../../ASSETS/noimage.png';
import './CategoryTopbar.css';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Grid, Paper, Typography, Button } from '@mui/material';

const CategoryTopbar = ({ categories }) => {
    // Ensure "all products" category is added at the beginning
    const updatedCategories = [
        {
            category: {
                "Code": "all",
                "Name": "All Products",
                "CategoryImageFilePath": noimage,
                "Categoryshorturl": "all",
                "subcategories": []
            }
        },
        ...categories
    ];


    const navigate = useNavigate();

    const handleCategoryChange = (e) => {
        const selectedCategory = JSON.parse(e.target.value).category;
        if (selectedCategory && selectedCategory.Categoryshorturl) {
            navigate(`/home/${selectedCategory.Categoryshorturl}/all`);
        }
    };


    const [selected, setCategory] = React.useState('');

    const handleChange = (event) => {
    setCategory(event.target.value);
      const selectedCategory = JSON.parse(event.target.value).category;
      if (selectedCategory && selectedCategory.Categoryshorturl) {
          navigate(`/home/${selectedCategory.Categoryshorturl}/all`);
      }
    };



    return (
        // <select
        //     className='categorytopbar'
        //     onChange={handleCategoryChange}
        // >
        //     <option value='' disabled>Select Category</option>
        //     {updatedCategories && updatedCategories.length > 0 && updatedCategories.map((item) => (
        //         <option
        //             key={item.category.Code}
        //             value={JSON.stringify(item)}
        //         >
        //             {item.category.Name}
        //         </option>
        //     ))}
        // </select>
        <>

            <Grid className='CategorySelector' p={2} container justifyContent='center'>
                <FormControl sx={{ m: 1, minWidth: 270 }} size="small" >
                    <InputLabel id="demo-simple-select-autowidth-label">Select Category</InputLabel>
                    <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={selected}
                    onChange={handleChange}
                    autoWidth
                    label="Select Category"
                    fullWidth
                    >
                    {updatedCategories && updatedCategories.length > 0 && updatedCategories.map((item) => (
                        <MenuItem  sx={{zIndex:'9999'}}  key={item.category.Code} value={JSON.stringify(item)}>{item.category.Name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>

        </>
    );
};

export default CategoryTopbar;

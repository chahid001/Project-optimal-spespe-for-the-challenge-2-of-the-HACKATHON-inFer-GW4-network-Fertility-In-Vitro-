import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Checkbox, TextField, FormControlLabel, Grid, ListItem, Select, MenuItem } from '@mui/material';
import { CloudUpload, CloudSync, CheckBoxOutlineBlankOutlined, CheckBoxOutlined } from '@mui/icons-material';

// Function to generate sperms
const generateSperms = () => {
  const numberOfSperms = 180;
  const newSperms = [];

  for (let i = 0; i < numberOfSperms; i++) {
    const style = {
      left: `${Math.random() * (window.innerWidth - 43)}px`,
      top: `${Math.random() * (window.innerHeight - 205.42)}px`,
      transform: `rotate(${Math.random() * 360}deg)`
    };
    newSperms.push(<div className="sperm" style={style} key={i}></div>);
  }

  return newSperms;
};

function App() { 
  const [selectedFile, setSelectedFile] = useState(null);
  const [options, setOptions] = useState({
    Graph: false,
    Report: false,
    Result: false,
    customX: '',
    customY: false,
    showCustom: false // New state to handle showing custom X and Y options
  });
  const [canUpload, setCanUpload] = useState(false); // New state to track whether file upload is allowed
  const [sperms, setSperms] = useState(() => generateSperms()); // Generate sperms only once
  const [hasSelectedOption, setHasSelectedOption] = useState(false); // Track if at least one option is selected

  useEffect(() => {
    // Check if at least one option is selected
    const hasSelectedOption = Object.values(options).some(option => option);
    setCanUpload(hasSelectedOption);
    setHasSelectedOption(hasSelectedOption);
  }, [options]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleOptionChange = (option) => {
    if (option === 'Graph' && !options[option]) {
      // If Graph option is unchecked, also uncheck Custom
      setOptions({ ...options, [option]: !options[option], showCustom: false });
    } else {
      setOptions({ ...options, [option]: !options[option] });
    }
  };

  const handleCustomChange = (event) => {
    setOptions({ ...options, showCustom: event.target.checked });
  };

  const handleCustomX = (event) => {
    const value = event.target.value.trim(); // Trim whitespace from the input value

    // Check if the input is empty
    if (value === '') {
      // If input is empty, set customX to empty string
      setOptions({ ...options, customX: '' });
      return; // Exit the function early
    }

    // Parse the input value to an integer
    const intValue = parseInt(value);

    if (intValue === 0) {
      alert("Tau can't be 0 please choose Uncheck the cutom options.")
    }
    // Check if the input is a valid integer value
    if (!isNaN(intValue) && intValue != 0) {
      // If it's a valid integer, update the state
      setOptions({ ...options, customX: intValue });
    } else {
      // If it's not a valid integer, display an error message
      alert('Please enter a valid integer value for X.');
    }
  };

  const handleCustomY = (event) => {
    const value = event.target.value
    setOptions({ ...options, customY: value });
  };

  const handleUpload = () => {
    // Check if any option is selected
    const hasSelectedOption = Object.values(options).some(option => option);

    if (selectedFile && canUpload && hasSelectedOption) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Handle additional options
      const selectedOptions = [];
      if (options.Graph) {
        selectedOptions.push('Graph');
        if (options.showCustom) {
          if (options.customX === "0" || options.customX === '') {
            alert('Please enter a valid integer value for X.');
          }
          if (options.customY === false) {
            alert('Please enter a valid integer value for Y.');
          }
          else {
            selectedOptions.push(options.customX);
            selectedOptions.push(options.customY);
          }
        } else {
          selectedOptions.push('Standard');
        }
      }
      if (options.Report) {
        selectedOptions.push('Report');
      }
      if (options.Result) {
        selectedOptions.push('Result');
      }

      // Send data to the backend
      axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        params: {
          options: selectedOptions
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log('File uploaded successfully:', response.data);
          // Handle success
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          // Handle error
        });
    } else {
      // Display a message if no option is selected
      alert('Please choose a file.');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="options">
          <h2>Upload a file and select options:</h2>
          <input 
            id="file-upload" 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            style={{ display: '' }} // hide the default file input
          />
          <label htmlFor="file-upload" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="contained" component="span" startIcon={<CloudUpload />}>
              Upload File
            </Button>
          </label>
          <Grid container spacing={5}>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckBoxOutlineBlankOutlined />}
                    checkedIcon={<CheckBoxOutlined />}
                    checked={options.Graph}
                    onChange={() => handleOptionChange('Graph')}
                  />
                }
                label="Graph"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckBoxOutlineBlankOutlined />}
                    checkedIcon={<CheckBoxOutlined />}
                    checked={options.Report}
                    onChange={() => handleOptionChange('Report')}
                  />
                }
                label="Report"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckBoxOutlineBlankOutlined />}
                    checkedIcon={<CheckBoxOutlined />}
                    checked={options.Result}
                    onChange={() => handleOptionChange('Result')}
                  />
                }
                label="Result"
              />
            </Grid>
            {options.Graph && (
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.showCustom}
                      onChange={handleCustomChange}
                    />
                  }
                  label="Custom"
                />
              </Grid>
            )}
          </Grid>
          {options.showCustom && options.Graph && (
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <TextField
                  label="Tau"
                  variant="outlined"
                  value={options.customX}
                  onChange={handleCustomX}
                />
                <Select
                  labelId="Polair"
                  variant="outlined"
                  value={options.customY}
                  onChange={handleCustomY}
                >
                  <MenuItem value={1}>True</MenuItem>
                  <MenuItem value={2}>False</MenuItem>

                </Select>
              </Grid>
            </Grid>
          )}
          {!hasSelectedOption && (
            <p style={{ color: 'red' }}>Please select at least one option.</p>
          )}
        </div>
        <Grid container justifyContent="center">
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<CloudSync />} 
              onClick={handleUpload} 
              disabled={!canUpload || (!options.Graph && options.showCustom) || !hasSelectedOption}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </div>
      <div className="sperms-container">
        <div className='sperms'>
          {sperms}
        </div>
      </div>
    </div>
  );
}

export default App;

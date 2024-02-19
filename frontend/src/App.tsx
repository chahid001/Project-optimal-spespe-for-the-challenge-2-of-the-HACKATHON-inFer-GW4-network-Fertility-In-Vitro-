import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, FormControlLabel, Grid, Slider, Switch, Typography } from '@mui/material';
import { CloudUpload, CloudSync, CheckCircle } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const theme = createTheme({
  palette: {
    primary: {
      main: '#7d7d7d', // Change primary color
    },
    secondary: {
      main: '#7d7d7d', // Change secondary color
    },
  },
});
const themes = createTheme({
  palette: {
    primary: {
      main: '#3d3939', // Change primary color
    },
    secondary: {
      main: '#7d7d7d', // Change secondary color
    },
  },
});

const slideee = createTheme({
  palette: {
    primary: {
      main: '#ffffff', // Change primary color
    },
    secondary: {
      main: '#5a6670', // Change secondary color
    },
  },
});

function App() { 
  const [selectedFile, setSelectedFile] = useState(null);
  const [options, setOptions] = useState({
    customX: 1,
    showCustom: false // Only Custom option is shown initially
  });
  const [canUpload, setCanUpload] = useState(false); // Track whether file upload is allowed
  const [filePath, setFilePath] = useState([]);
  const [sperms, setSperms] = useState(() => generateSperms()); // Generate sperms only once
  const [loading, setLoading] = useState(false); // Track loading state
  const [fileSelected, setFileSelected] = useState(false); // Track whether a file is selected

  useEffect(() => {
    // Check if customX is not empty
    setCanUpload(!!options.customX);
  }, [options.customX]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileSelected(true); // Set fileSelected to true when a file is selected
  };

  const handleCustomChange = () => {
    setOptions({ ...options, showCustom: !options.showCustom });
  };

  const handleCustomXChange = (event, newValue) => {
    setOptions({ ...options, customX: newValue });
  };

  const handleUpload = () => {
    setLoading(true); // Set loading to true when upload begins

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const selectedOptions = [];

      if (options.showCustom) {
        selectedOptions.push('Custom');
        selectedOptions.push(options.customX);
      } else {
        selectedOptions.push('Standard');
      }

      axios.post('http://52.224.237.242:8001/api/upload/', formData, {
        params: { options: selectedOptions },
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          console.log('File uploaded successfully:', response.data);
          setFilePath([response.data.path]);
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false after upload completes
        });
    } else {
      alert('Please choose a file.');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="options">
	  <h1 className="ooo" style={{ fontFamily: 'Inter, system-ui', color: 'white'}}>Project optimal-spespe</h1>
	<div>
	  <h4 className="ooo" style={{ fontFamily: 'Inter, system-ui', color: 'grey'}}>for the challenge #2 of</h4>
	  <h4 className="ooo" style={{ fontFamily: 'Inter, system-ui', color: 'grey'}}>the HACKATHON inFer GW4 network</h4>
	  <h4 className="ooo" style={{ fontFamily: 'Inter, system-ui', color: 'grey'}}>"Fertility: In Vitro, In Silico, In Clinico"</h4>
	</div>
          <h2 className="ooo" style={{ fontFamily: 'Inter, system-ui', color: 'white'}}>Upload the file</h2>
          <input 
            id="file-upload" 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <label htmlFor="file-upload" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <ThemeProvider theme={theme}>
            <Button variant="contained"
              component="span" 
              startIcon={<CloudUpload />}
              >
              Upload 
            </Button>
            {fileSelected && <CheckCircle style={{ color: 'grey', fontSize: 35, paddingLeft: '5' }} />} 
          </ThemeProvider>

          </label>
          <Grid container spacing={2} alignItems="center" paddingTop={5} justifyContent="center" display="flex">
            <Grid item>
              <Typography style={{ fontFamily: 'Inter, system-ui', color: 'white' }}>Default</Typography>
            </Grid>
            <Grid item>
              <ThemeProvider theme={theme}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={options.showCustom}
                      onChange={handleCustomChange}
                    />
                  }
                  label=""
                />
              </ThemeProvider>
            </Grid>
            <Grid item >
              <Typography  style={{ marginLeft: '-30px', fontFamily: 'Inter, system-ui', color: 'white' }}>Custom</Typography>
            </Grid>
          </Grid>
          {options.showCustom && (
            <Grid container spacing={2} alignItems="center" justifyContent="center" display={'flex'}>
              <Grid item xs>
              <ThemeProvider theme={slideee}>
                <Slider
                  value={options.customX}
                  min={1}
                  max={100}
                  onChange={handleCustomXChange}
                  aria-labelledby="discrete-slider-custom"
                  valueLabelDisplay="auto"
                  step={1}
                />
              </ThemeProvider>
              </Grid>
            </Grid>
          )}
        </div>
        <Grid container justifyContent="center" paddingTop={5} paddingBottom={5}>
          <Grid item>
          <ThemeProvider theme={themes}>
              <Button 
                variant="contained" 
                startIcon={<CloudSync />} 
                onClick={handleUpload} 
                disabled={!selectedFile || loading} // Disable button during loading
              >
                Generate 
              </Button>
            </ThemeProvider>
            {loading && <div className="loader"></div>} {/* Show loader when loading */}
          </Grid>
        </Grid>
        <div className="file-path">
          {filePath.map((path, index) => (
            <div key={index}>
              <img src={path} alt={`Uploaded Image ${path}`} />
            </div>
          ))}
        </div>
	<h4 className="ooo" style={{ fontFamily: 'Inter, system-ui', color: 'grey'}}>------------------------------------------------------------</h4>
	<h5 className="ooo" style={{ fontFamily: 'Inter, system-ui', color: 'grey'}}>Project Optimal-Spespe, developed for Hackathon inFer GW4 Network's Fertility Challenge, employs two machine learning models to classify and visualize bovine spermatozoa flagella. The user-friendly Graphical User Interface facilitates easy data manipulation, accepting TRACKMATE-generated files in Excel or CSV formats. Users can choose default or customized results, specifying sample type and waveform range. Notably, the program operates from 8:00 am to 12:00 pm, offering immediate graphic illustrations of beat patterns with classification parameters (optimal, minimal, or Blebbed). Outputs can be downloaded as image files or comprehensive PDF reports, making Optimal-Spespe a versatile and accessible tool for sperm analysis.</h5>
      	<h5 className="ooo" style={{ fontFamily: 'Inter, system-ui', color: 'grey'}}>For more information check the documentation&nbsp;<a href="https://github.com/chahid001/Project-optimal-spespe-for-the-challenge-2-of-the-HACKATHON-inFer-GW4-network-Fertility-In-Vitro-" target="_blank">here</a></h5>
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

import React, { useEffect } from "react";

import Lottie from 'react-lottie';
import successData from './lottie/success';
import failedData from './lottie/failed';
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Paper from "@mui/material/Paper";
import Axios from "axios";
import BOSCH from "../src/img/bosch.png";
import random from 'random-key-generator';


import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
} from "@mui/material";



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      zIndex: 3,
    },
  },
};

const items = [
  "Bluetooth",
  "USB",
  "BLE",
  "Lora",
  "CAN",
  "RF",
  "3G",
  "GSM",
  "5G",
  "UART",
];

function getStyles(name, interfaces, theme) {
  return {
    fontWeight:
      interfaces.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Main() {
  const theme = useTheme();
  const [interfaces, setInterfaces] = React.useState([]);
  // const classes = useStyles();


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInterfaces(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialog1, setOpenDialog1] = React.useState(false);
  const [successDialog, setSuccessDialog] = React.useState(false);
  const [drop, setDrop] = React.useState(false);
  const [data, setData] = React.useState(null);




  // useEffect(() => {
  //   return () => {
  //     Axios.get('http://localhost:8080/checkStatus')
  //       .then(
  //         res => {

  //           console.log(res.data)
  //           if (res.data === "Completed") {
  //             setSuccessDialog(true)
  //             console.log("completed")
  //             setDrop(false)
  //             alert("completed")
  //           }
  //           else if (res.data === "processing") {
  //             setDrop(!drop)
  //             console.log("processed")
  //           }
  //           setData(res.data)

  //           console.log(sessionStorage.getItem("sessionId"))
  //         })
  //   }
  // }, [data])

  const successDefault = {
    loop: true,
    autoplay: true,
    animationData: successData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const failedDefault = {
    loop: true,
    autoplay: true,
    animationData: failedData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  function handleOpen() {
    Axios.post("http://localhost:8080/interfaces", {
      "interfaces": interfaces,
      "sessionId": random.getRandom(20, 'TARA', '@', 'front')
    }, { headers: { 'Content-Type': 'application/json' } })
    sessionStorage.setItem("sessionId", "Hello")

    setDrop(true)

    var timer = setInterval(function () {
      getStatus(timer)
    }, 1000);



  }

  function getStatus(timer) {
    Axios.get('http://localhost:8080/checkStatus')
      .then(
        res => {
          if (res.data === "Completed") {
            setSuccessDialog(true)
            console.log("completed")
            setDrop(false)
            clearInterval(timer)
            setData(res.data)
          }
        })
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };

  const handleClickOpenDialog1 = () => {
    setOpenDialog1(true);
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialog(false);
    setInterfaces([]);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <h3 style={{ float: "left" }}>TARA Master Sheet Creator</h3>
           
          
        </Toolbar>
      </AppBar>

      <Stack direction="column" alignItems="center">
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-name-label">
            Select Interfaces and Protocols
          </InputLabel>
          <Select
            style={{ zIndex: 2 }}
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={interfaces}
            onChange={handleChange}
            input={<OutlinedInput label="Select Interfaces and Protocols" />}
            MenuProps={MenuProps}
          >
            {items.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, interfaces, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>

        </FormControl>
        <Button
          disabled={interfaces.length <= 0}
          variant="contained"
          onClick={() => { handleClickOpenDialog() }}
        >
          Generate TARA
        </Button>
      </Stack>
      {/* {data ? data : "loading"} */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-title">
          {"TARA Sheet Will be Generated for"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>{interfaces.join(", ")}</div>
            <div>
              <strong>Do You Wish to Continue?</strong>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseDialog();
              setInterfaces([]);
              handleClickOpenDialog1();
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              handleCloseDialog();
              handleOpen();

            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog1}
        onClose={handleCloseDialog1}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-title">
          {"Operation Aborted!"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseDialog1();

            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={successDialog}
        onClose={handleCloseSuccessDialog}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-title">
          {data === "Completed" ? `Tara Sheet Created for ${interfaces.join(", ")}` : `Tara Sheet Cannot be Created for ${interfaces.join(", ")}`}
        </DialogTitle>
        <DialogContent>
          {data === "Completed" ? <Lottie options={successDefault} height={200} width={200} /> : <Lottie options={failedDefault} height={200} width={200} />}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseSuccessDialog();
              setInterfaces([]);
              // resetFileInput();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={drop}
      >
        <Stack direction="column" alignItems="center" display="absolute" >
          <CircularProgress style={{ color: "white" }} />
          <div className="circular-text" style={{ marginTop: "15px", color: "white" }}>
            TARA Sheet is Being Created Please Wait....
          </div>
        </Stack>
      </Backdrop>

      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "#1976d2",
        }}
        elevation={3}
      ><img src={BOSCH} style={{ height: "50px", maxWidth: "50%", float: "right", marginRight: "10px", marginTop: "5px" }} /></Paper>
    </div >

  );
}

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
import { io } from "socket.io-client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [file, setFile] = React.useState([])

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
  const timerRef = React.useRef();
  const inputRef = React.useRef(null);
  const backDrop = React.useRef(null);
  const [messages, setMessages] = React.useState([])

  let socket;

  useEffect(() => {
    socket = io('http://localhost:5000');
    // socket.on('connect', ()=>console.log(socket.id))
    // socket.on("message", (data) => {
    //   // socket.emit("interfaces", { user: "user.username", msg: "chatInput" });
    //   // console.log(JSON.stringify(json))
    //   console.log(data)
      
    // });

  })

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

  function handleOpen(interfaces) {
    setDrop(!drop);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setDrop(false);
      if (!drop.valueOf()) {
        // Axios.get('http://localhost:5000/checkStatus')
        //   .then(res => setData(res.data))
        // socket.emit("status", )
        socket.on('checkStatus', (status) => {
          setData(status)
        })
        setSuccessDialog(true);
      }
      // Axios.post("http://localhost:5000", {
      //   "interfaces": interfaces
      // }, { headers: { 'Content-Type': 'application/json' } })
      socket.emit("interfaces", interfaces)

    }, 3000);

    // Axios.post("http://localhost:5000/interfaces", {
    //   "interfaces": interfaces
    // }, { headers: { 'Content-Type': 'application/json' } })
  }
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
    

  };

  // async function py(){
  //   let pyodide = await loadPyodide();
  //   console.log(pyodide.runPython(`
  //   python db_access.py
  // `));
  // }

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

  // const changeHandler = (event) => {

  //   const files = event.target.files
  //   let file;

  //   for (let i = 0; i < files.length; i++) {
  //     file = files.item(i);
  //     console.log(file.name)
  //     setFile(file.name)
  //     socket.emit("filepath", file.name)
  //   }
  //   console.log(event.target.value);
  // };

  // const resetFileInput = () => {
  //   // ðŸ‘‡ï¸ reset input value
  //   inputRef.current.value = null;
  // };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <AppBar position="fixed">
        <Toolbar>
          <div style={{ width: "100vw", alignItems: "center" }}>
            <h3 style={{ float: "left", marginTop: "25px" }}>TARA Master Sheet Creator</h3>
            <img src={BOSCH} style={{ maxHeight: "70px", maxWidth: "50%", float: "right" }} />
          </div>
        </Toolbar>
      </AppBar>
      <Stack direction="column" alignItems="center">
        <Stack direction="column" alignItems="center" display="flex">
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-name-label">
              Select Interfaces and Protocols
            </InputLabel>
            <Select
              style={{ zIndex: 3 }}
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
          {/* <div style={{ marginTop: "20px", marginBottom: "20px", alignItems: "center" }}>
            {interfaces.length <= 0 ? <p>Select TARA Template Path: <input type="file" style={{color:"transparent", width:"70px"}} onChange={changeHandler} multiple disabled={true} /></p> : <p>Select TARA Template Path: <input style={{color:"transparent", width:"70px"}} ref={inputRef} type="file" onChange={changeHandler} multiple /></p>}
          </div> */}
          <Button
            disabled={interfaces.length <= 0}
            variant="contained"
            onClick={()=>{handleClickOpenDialog()}}
          >
            Generate TARA
          </Button>
        </Stack>

      </Stack>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
              // setInterfaces([]);
              handleOpen(interfaces);

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
      >
        <DialogTitle id="alert-dialog-title">
          {data === "SUCCESS" ? `Tara Sheet Created for ${interfaces.join(", ")}` : "Tara Sheet Cannot be created"}
        </DialogTitle>
        <DialogContent>
          {data === "SUCCESS" ? <Lottie options={successDefault} height={200} width={200} /> : <Lottie options={failedDefault} height={200} width={200} />}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseSuccessDialog();
              setInterfaces([]);
              setFile([])
              // resetFileInput();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={drop}
          ref={backDrop}
        >
          <Stack direction="column" alignItems="center" display="absolute">
            <CircularProgress color="inherit" />
            <div style={{ marginTop: "15px" }}>
              TARA Sheet Creating Please Wait....
            </div>
          </Stack>
        </Backdrop>
      </div>

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
      ></Paper>
    </div>
  );
}

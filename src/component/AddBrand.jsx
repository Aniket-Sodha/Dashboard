import React, { useEffect, useState } from "react";
import {app} from "./firebase";
import { addDoc, collection, getFirestore, getDocs } from "firebase/firestore";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AddBrand = ({ open, handleClose }) => {

    const db = getFirestore(app);
    const [brand,setBrand] = useState("");

    const handleAddBrand = async () => {
      
      if (!brand.trim()) {
        toast.warning("Brand name is required.");
        return;
      }

      try {
        await addDoc(collection(db, "brands"), {
          brandName: brand,
        });

        toast.success("Brand added!");  
        setTimeout(() => {
          setBrand(""); // Reset input
          handleClose(); // Close modal
        }, 1000);
      } catch (error) {
        console.error("Error adding brand:", error);
        toast.error("Failed to add brand.");
      }
    };




  return (
    <>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Brand
        </Typography>
        <Typography id="modal-Textfield" sx={{ mt: 2 }}>
          <TextField
            id="outlined-basic"
            label="Brand"
            variant="outlined"
            className="w-full"
            value={brand}
            onChange={(e)=> {setBrand(e.target.value)}}
          />
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          className="flex justify-end "
          sx={{ mt: 2 }}
        >
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddBrand}>Add</Button>
        </Stack>
      </Box>

    </Modal>
    <ToastContainer position="bottom-right" />
    </>
  );
};

export default AddBrand;

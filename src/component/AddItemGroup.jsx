import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { app } from "./firebase";
import { addDoc, collection, getFirestore,getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

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

const AddItemGroup = ({ open, handleClose }) => {
  const [itemGroup, setItemGroup] = useState("");
  const db = getFirestore(app);

  const handleAddItemGroup = async () => {
    if (!itemGroup.trim()) {
      toast.warning("Item group name is required.");
      return;
    }

    try {
      await addDoc(collection(db, "itemGroups"), {
        itemName: itemGroup,
      });

      toast.success("Item group added!");
      setTimeout(() => {
        setItemGroup(""); // Reset input
        handleClose(); // Close modal
      }, 1000);

    } catch (error) {
      console.error("Error adding item group:", error);
      toast.error("Failed to add item group.");
    }
  };

  // to fetch item groups
   useEffect(() => {
  const feachItemGroups = async () => {
  const querySnapshot = await getDocs(collection(db, "itemGroups"));
  const items = [];
  querySnapshot.forEach((doc) => {
  items.push({ id: doc.id, ...doc.data() });
});
  }
 
    feachItemGroups();  },[]);
    console.log(itemGroup);
    return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Item Group
        </Typography>
        <TextField
          fullWidth
          label="Item Group"
          variant="outlined"
          value={itemGroup}
          onChange={(e) => setItemGroup(e.target.value)}
          placeholder="Enter Item Group"
          sx={{ mt: 2 }}
        />
        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-end"
          sx={{ mt: 3 }}
        >
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddItemGroup}>
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddItemGroup;

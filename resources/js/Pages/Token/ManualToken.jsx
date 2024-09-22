import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import { pink } from "@mui/material/colors";
import React, { useState } from "react";
import { postData } from "../../apis/apiCalls";

const PinkButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(pink[500]),
  backgroundColor: pink[500],
  "&:hover": {
    backgroundColor: pink[700],
  },
}));

const numberVarients = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "CLR",
  "BACK",
];

function ManualToken({ open, handleClose, url }) {
  const [token, setToken] = useState("0");
  const handleSubmit = () => {
    if (token || token !== "0") {
      postData(url, {
        counter: open,
        token: token,
      }).then((response) => {
        if (response.status) {
          handleClose(response.data);
        } else {
          alert("Some error occured");
        }
      });
    } else {
      alert("enter token number");
    }
  };
  return (
    <Dialog
      open={open ? true : false}
      keepMounted
      maxWidth={"xs"}
      onClose={() => handleClose(null)}
    >
      <DialogContent>
        <Stack alignItems={"center"} spacing={2}>
          <TextField
            size="small"
            fullWidth={true}
            label="TOKEN NUMBER"
            onChange={(e) => setToken(e.target.value)}
            value={token}
          />
          <Grid container spacing={2}>
            {numberVarients.map((item, index) => {
              return (
                <Grid item xs={4} key={index}>
                  <PinkButton
                    size="large"
                    variant="outlined"
                    style={{ fontSize: "25px", fontWeight: 800 }}
                    onClick={() => {
                      if (item === "CLR") {
                        setToken("0");
                      } else if (item === "BACK") {
                        setToken(token.slice(0, -1));
                      } else {
                        setToken(token !== "0" ? token + item : item);
                      }
                    }}
                    sx={{ width: "100%" }}
                  >
                    {item}
                  </PinkButton>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          sx={{ fontWeight: 800 }}
          variant="contained"
          onClick={() => handleClose(null)}
        >
          CLOSE
        </Button>
        <Button
          color="warning"
          sx={{ fontWeight: 800 }}
          variant="contained"
          onClick={handleSubmit}
        >
          UPDATE
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManualToken;

import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useState } from "react";
import TextError from "../reusable/textError";
import style from "./dialog.module.css";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";

const ShipProductDialog = (props: any) => {
  const { id, open, handleClose, refreshPage } = props;

  const [loading, setLoading] = useState(false);
  const [arrivalDate, setArrivalDate] = useState<any>("");

  const initialValues = {
    location: "",
  };

  const validationSchema = Yup.object({
    location: Yup.string().required("Please enter location"),
  });

  const onSubmit = async (values: any) => {
    console.log(values);
    if (!arrivalDate) return;
    setLoading(true);
    const finalData = {
      id: id,
      locationData: {
        current: {
          arrivalDate: arrivalDate,
          location: values.location,
        },
        previous: [],
      },
    };
    axios({
      method: "post",
      url: "http://localhost:3003/shipProduct",
      headers: {
        "Content-Type": "application/json",
      },
      data: finalData,
    })
      .then((response) => {
        refreshPage();
        setLoading(false);
        console.log(response);
        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <Dialog open={open} onClose={!loading ? handleClose : false}>
      <DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form method="post" style={{ width: "30vw" }}>
                <div className={style.inputBox}>
                  <Typography variant="h5">Ship Product</Typography>
                </div>
                <div className={style.inputBox}>
                  <TextField
                    fullWidth
                    type="text"
                    id="location"
                    label="Enter location"
                    variant="outlined"
                    {...formik.getFieldProps("location")}
                  />
                  <div className={style.errorBox}>
                    <ErrorMessage component={TextError} name="location" />
                  </div>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Arrival Date"
                    value={arrivalDate}
                    onChange={(newValue) => {
                      setArrivalDate(newValue);
                    }}
                  />
                </LocalizationProvider>

                <div className={style.inputButtonBox}>
                  <Button
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={
                      loading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : null
                    }
                  >
                    {loading ? "Processing " : "Submit"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogTitle>
    </Dialog>
  );
};

export default ShipProductDialog;

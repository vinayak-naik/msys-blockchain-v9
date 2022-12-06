import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import style from "../../styles/components/small/participateDialog.module.css";
import { ErrorMessage, Form, Formik } from "formik";
import TextError from "../reusable/textError";
import * as Yup from "yup";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const ParticipateDialog = (props: any) => {
  const { participateDialog, handleClose, refreshPage } = props;
  const { query } = useRouter();
  const { contract, signer } = useSelector(
    (state: RootState) => state.contract
  );
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues = {
    amount: 0,
  };

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required("Please enter any amount")
      .typeError("You must specify a number")
      .min(1, "Minimum bet amount is 1 MSCN")
      .max(1000, "Maximum bet amount is 1000 MSCN"),
  });

  const checkEvents = () => {
    contract.on("Transfer", () => {
      refreshPage();
      setLoading(false);
      handleClose();
    });
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    await contract
      .connect(signer)
      .participate(query.matchId, participateDialog, values.amount);
    checkEvents();
  };
  return (
    <Dialog
      open={Boolean(participateDialog)}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      // maxWidth="md"
    >
      <DialogTitle>
        <Typography
          textAlign="center"
          variant="h5"
          sx={{ paddingTop: "10px", fontSize: "26px" }}
        >
          {`Participate for ${
            participateDialog === 1 ? "match.team1" : "match.team2"
          }`}
        </Typography>
        <div className={style.formBox}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <div className={style.formContainer}>
                  <Form method="post" className={style.formBox}>
                    <div className={style.inputBox}>
                      <TextField
                        fullWidth
                        type="number"
                        id="amount"
                        label="Amount"
                        variant="outlined"
                        {...formik.getFieldProps("amount")}
                      />
                      <div className={style.errorBox}>
                        <ErrorMessage component={TextError} name="amount" />
                      </div>
                    </div>
                    <div className={style.inputBox}>
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
                        {loading ? "Processing " : "Participate"}
                      </Button>
                    </div>
                  </Form>
                </div>
              );
            }}
          </Formik>
        </div>
      </DialogTitle>
    </Dialog>
  );
};

export default ParticipateDialog;

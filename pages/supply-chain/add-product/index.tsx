import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import style from "./addProduct.module.css";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import TextError from "../../../components/reusable/textError";
import { useRouter } from "next/router";

const AddProduct = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [productionDate, setProductionDate] = useState<any>("");
  const [expirationDate, setExpirationDate] = useState<any>("");

  const initialValues = {
    name: "",
    category: "",
    barcode: "",
    batchQuantity: "",
    location: "",
    placeOfOrigin: "",
    id: "",
    unitPrice: "",
    unitQuantity: "",
    unitQuantityType: "",
    veriety: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter name"),
    category: Yup.string().required("Please enter category"),
    barcode: Yup.number().required("Please enter barcode"),
    batchQuantity: Yup.number().required("Please enter batch Quantity"),
    location: Yup.string().required("Please enter location Data"),
    placeOfOrigin: Yup.string().required("Please enter place Of Origin"),
    id: Yup.string().required("Please enter id"),
    unitPrice: Yup.number().required("Please enter unitPrice"),
    unitQuantity: Yup.number().required("Please enter unitQuantity"),
    unitQuantityType: Yup.string().required("Please enter unitQuantityType"),
    veriety: Yup.string().required("Please enter veriety"),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    const finalData = {
      barcode: values.barcode, //
      batchQuantity: values.batchQuantity, //
      category: values.category, //
      componentProductIds: [],
      expirationDate: expirationDate || "2022-06-24T18:25:43.511Z",
      id: values.id, //
      locationData: {
        current: {
          arrivalDate: new Date(),
          location: values.location,
        },
        previous: [],
      },
      misc: "{}",
      name: values.name, //
      placeOfOrigin: values.placeOfOrigin,
      productionDate: productionDate || "2021-06-24T18:25:43.511Z",
      unitPrice: values.unitPrice,
      unitQuantity: values.unitQuantity,
      unitQuantityType: values.unitQuantityType,
      variety: null,
      componentProducts: [],
    };
    console.log("finalData==================", finalData);

    axios({
      method: "post",
      url: "http://localhost:3003/createProduct",
      headers: {
        "Content-Type": "application/json",
      },
      data: finalData,
    })
      .then((response) => {
        setLoading(false);
        console.log(response);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <div className={style.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form method="post">
              <div className={style.headerBox}>
                <div></div>
                <div className={style.headerText}>Add Product</div>
                <Button
                  variant="outlined"
                  onClick={() => push("/supply-chain/get-product")}
                  className={style.getButton}
                >
                  Get Product
                </Button>
              </div>
              <div className={style.textFieldContainer}>
                <div className={style.formBox}>
                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="string"
                      id="name"
                      label="Enter name"
                      variant="outlined"
                      {...formik.getFieldProps("name")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage component={TextError} name="name" />
                    </div>
                  </div>

                  <div className={style.inputBox}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Select Category
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select category"
                        {...formik.getFieldProps("category")}
                      >
                        <MenuItem className={style.menuItem} value={1}>
                          Fruit
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <div className={style.errorBox}>
                      <ErrorMessage component={TextError} name="category" />
                    </div>
                  </div>

                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="number"
                      id="barcode"
                      label="Enter Barcode"
                      variant="outlined"
                      {...formik.getFieldProps("barcode")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage component={TextError} name="barcode" />
                    </div>
                  </div>
                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="number"
                      id="batchQuantity"
                      label="Enter batch Quantity"
                      variant="outlined"
                      {...formik.getFieldProps("batchQuantity")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage
                        component={TextError}
                        name="batchQuantity"
                      />
                    </div>
                  </div>
                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="string"
                      id="location"
                      label="Enter Location Data"
                      variant="outlined"
                      {...formik.getFieldProps("location")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage component={TextError} name="location" />
                    </div>
                  </div>
                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="string"
                      id="placeOfOrigin"
                      label="Enter place of Origin"
                      variant="outlined"
                      {...formik.getFieldProps("placeOfOrigin")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage
                        component={TextError}
                        name="placeOfOrigin"
                      />
                    </div>
                  </div>
                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="text"
                      id="id"
                      label="Enter Id"
                      variant="outlined"
                      {...formik.getFieldProps("id")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage component={TextError} name="id" />
                    </div>
                  </div>
                </div>
                <div className={style.formBox}>
                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="number"
                      id="unitPrice"
                      label="Enter Unit Price"
                      variant="outlined"
                      {...formik.getFieldProps("unitPrice")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage component={TextError} name="unitPrice" />
                    </div>
                  </div>
                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="number"
                      id="unitQuantity"
                      label="Enter Unit Quantity"
                      variant="outlined"
                      {...formik.getFieldProps("unitQuantity")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage component={TextError} name="unitQuantity" />
                    </div>
                  </div>

                  <div className={style.inputBox}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Select Unit Quantity Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select Unit Quantity Type"
                        {...formik.getFieldProps("unitQuantityType")}
                      >
                        <MenuItem className={style.menuItem} value="kg">
                          Kilogram
                        </MenuItem>
                        <MenuItem className={style.menuItem} value="g">
                          Gram
                        </MenuItem>
                        <MenuItem className={style.menuItem} value="l">
                          Leter
                        </MenuItem>
                        <MenuItem className={style.menuItem} value="ml">
                          Millileter
                        </MenuItem>
                        <MenuItem className={style.menuItem} value="m">
                          Meter
                        </MenuItem>
                        <MenuItem className={style.menuItem} value="mm">
                          Millimeter
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <div className={style.errorBox}>
                      <ErrorMessage
                        component={TextError}
                        name="unitQuantityType"
                      />
                    </div>
                  </div>
                  <div className={style.inputBox}>
                    <TextField
                      fullWidth
                      type="text"
                      id="veriety"
                      label="Enter Veriety"
                      variant="outlined"
                      {...formik.getFieldProps("veriety")}
                    />
                    <div className={style.errorBox}>
                      <ErrorMessage component={TextError} name="veriety" />
                    </div>
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Production Date"
                      value={productionDate}
                      onChange={(newValue) => {
                        setProductionDate(newValue);
                      }}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Expiration Date"
                      value={expirationDate}
                      onChange={(newValue) => {
                        setExpirationDate(newValue);
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
                      {loading ? "Processing " : "Add Product"}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddProduct;

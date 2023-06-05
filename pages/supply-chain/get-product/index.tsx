import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import style from "./getProduct.module.css";
import ShipProductDialog from "../../../components/dialogs/ship-product-dialog";
import { useRouter } from "next/router";

const TextContainer = (props: any) => {
  const { head, body, noBorder } = props;
  return (
    <div
      className={style.textContainer}
      style={noBorder ? { border: "none" } : {}}
    >
      <div className={style.textHead}>{head}</div>

      <div className={style.textBody}>
        {body ? <div>&nbsp;:&nbsp;{body}</div> : ""}
      </div>
    </div>
  );
};

const GetProduct = () => {
  const { push } = useRouter();
  const [productId, setProductId] = useState("");
  const [data, setData] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  const getProduct = () => {
    axios({
      method: "get",
      url: `http://localhost:3003/getProductWithHistory?id=${
        productId ? productId : id
      }`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response.data.result);
        setData(response.data.result);
        setId(response.data.result.id);
        // setLoading(false)
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error);
      });
  };
  return (
    <div className={style.container}>
      <div className={style.headerBox}>
        <div></div>
        <div className={style.headerText}>Get Product</div>
        <Button
          onClick={() => push("/supply-chain/add-product")}
          variant="outlined"
          className={style.addButton}
        >
          Add Product
        </Button>
      </div>
      <div className={style.productDetailsContainer}>
        <TextField
          fullWidth
          type="number"
          id="name"
          label="Enter Product Id"
          variant="outlined"
          sx={{ width: "50vw" }}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <div className={style.searchButtonBox}>
          <Button
            onClick={getProduct}
            variant="outlined"
            className={style.searchButton}
          >
            Search Product
          </Button>
        </div>
        {data && (
          <div className={style.productDetailsBox}>
            <div className={style.leftBox}>
              <TextContainer head="id" body={data.id} />
              <TextContainer head="Name" body={data.name} />
              <TextContainer head="Place of Origin" body={data.placeOfOrigin} />
              <TextContainer head="Barcode" body={data.barcode} />
              <TextContainer head="Batch Quantity" body={data.batchQuantity} />
              <TextContainer head="Category" body={data.category} />
              <TextContainer head="Unit Price" body={data.unitPrice} />
              <TextContainer head="Unit Quantity" body={data.unitQuantity} />
            </div>

            <div className={style.rightBox}>
              <TextContainer
                head="Unit Quantity Type"
                body={data.unitQuantityType}
              />
              <TextContainer
                head="Production Date"
                body={data.productionDate}
              />
              <TextContainer
                head="Expiration Date"
                body={data.expirationDate}
              />
              <div className={style.currentLocationBox}>
                <TextContainer noBorder head="Current Location" />
                <div className={style.currentLocationInnerBox}>
                  <TextContainer
                    noBorder
                    head="Location"
                    body={data.locationData?.current?.location}
                  />
                  <TextContainer
                    noBorder
                    head="Arival Date"
                    body={data.locationData?.current?.arrivalDate}
                  />
                </div>{" "}
                <div className={style.searchButtonBox}>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outlined"
                    className={style.searchButton}
                  >
                    Ship Product
                  </Button>
                </div>
              </div>
              <div className={style.currentLocationBox}>
                <TextContainer noBorder head="Previous Locations" />
                <div className={style.peviousLocationsBox}>
                  {data.locationData?.previous.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className={style.currentLocationInnerBox}
                      >
                        <TextContainer
                          noBorder
                          head="Location"
                          body={item.location}
                        />
                        <TextContainer
                          noBorder
                          head="Arival Date"
                          body={item.arrivalDate}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ShipProductDialog
        refreshPage={getProduct}
        id={id}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
};

export default GetProduct;

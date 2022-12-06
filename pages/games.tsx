import React from "react";
import style from "../styles/pages/games.module.css";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import HeaderComponent from "../components/header/header";

const Services = () => {
  const router = useRouter();
  const serviceList = [
    {
      serviceName: "MSys Betting",
      route: "betting",
      src: "cricket.jpg",
      id: 1,
    },
    {
      serviceName: "MSys Lottery",
      route: "lottery",
      src: "lottery.webp",
      id: 2,
    },
    {
      serviceName: "MSys NFT",
      route: "nft",
      src: "nft.jpg",
      id: 3,
    },
  ];
  return (
    <div className={style.container}>
      <HeaderComponent />
      <div className={style.containerLayer}>
        <div className={style.cardsContainer}>
          <Grid container sx={{ width: "100%" }}>
            {serviceList.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                key={index}
                padding={1}
                sx={{ marginBottom: "50px" }}
              >
                <div
                  onClick={() =>
                    router.push(`/${item.id !== 3 ? item.route : "games"}`)
                  }
                  className={style.serviceCard}
                  style={{
                    backgroundImage: `url(/static/img/${item.src})`,
                  }}
                >
                  {item.id !== 3 ? (
                    <>
                      <div className={style.serviceCardLayer}></div>
                      <h2>{item.serviceName}</h2>
                    </>
                  ) : (
                    <>
                      <div className={style.serviceCardLayerCommingSoon}></div>
                      <h2>{item.serviceName}</h2>
                    </>
                  )}
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Services;

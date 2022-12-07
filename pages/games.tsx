import React, { useEffect, useState } from "react";
import style from "../styles/pages/games.module.css";
import { useRouter } from "next/router";
import { CircularProgress, Grid } from "@mui/material";
import HeaderComponent from "../components/header/header";
import { getGames } from "../web3-interface/services/game/get-games";

const Services = () => {
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  let ignore = false;

  console.log(data);

  const getAllMatches = async () => {
    const response = await getGames();
    setData(response);
  };

  useEffect(() => {
    if (!ignore) getAllMatches();
    ignore = true; // eslint-disable-line
  }, []); // eslint-disable-line
  if (data && data.success)
    return (
      <>
        <HeaderComponent />
        <div className={style.container}>
          <div className={style.containerLayer}>
            <div className={style.cardsContainer}>
              <Grid container sx={{ width: "100%" }}>
                {data?.data?.map((item: any) => {
                  if (!item.visibility) return;
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      key={item.gameId}
                      padding={1}
                      sx={{ marginBottom: "50px" }}
                    >
                      <div
                        onClick={() =>
                          router.push(`${item.active ? item.route : "games"}`)
                        }
                        className={style.serviceCard}
                        style={{
                          backgroundImage: item.externalUrl
                            ? `url(${item.externalUrl})`
                            : `url(/static/img/${item.internalUrl})`,
                          // backgroundImage: `url(/static/img/${item.src})`,
                        }}
                      >
                        {item.active ? (
                          <>
                            <div className={style.serviceCardLayer}></div>
                            <h2>{item.name}</h2>
                          </>
                        ) : (
                          <>
                            <div
                              className={style.serviceCardLayerCommingSoon}
                            ></div>
                            <h2>{item.name}</h2>
                          </>
                        )}
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </div>
        </div>
      </>
    );
  return (
    <div style={styleObj}>
      <CircularProgress color="success" />
    </div>
  );
};

export default Services;

// ================================Objects=============================

const styleObj = {
  height: "80vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

// const serviceList = [
//   {
//     serviceName: "Todays Match Winner",
//     route: "betting",
//     internalUrl: "cricket.jpg",
//     externalUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT84AurZv-0UNWbGd9348qnMgh1Ffv7DNWje9FQ3lkzVPDiJog1uT0V9SF4wtQ8ICP6yi0&usqp=CAU",

//     active: true,
//     visibility: true,
//   },
//   {
//     serviceName: "MSys Lottery",
//     route: "lottery",
//     internalUrl: "lottery.webp",
//     externalUrl:
//       "https://img.freepik.com/premium-photo/gold-inscription-sports-betting-smartphone-background-stadium_99433-3127.jpg?w=2000",

//     active: true,
//     visibility: true,
//   },
//   {
//     serviceName: "MSys NFT",
//     route: "nft",
//     internalUrl: "nft.jpg",
//     externalUrl: "https://ifccd.net/uploads/image/betting-vs-trading.jpg",
//     active: false,
//     visibility: true,
//   },
// ];

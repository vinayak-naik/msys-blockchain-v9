import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React from "react";
import style from "../styles/pages/guide.module.css";
import Image from "next/image";
import { guideJson } from "../public/guideJson";
import HeaderComponent from "../components/header/header";

const Guide = () => {
  const [expanded, setExpanded] = React.useState<number | false>(false);

  const handleChange = (isExpanded: number) => {
    setExpanded(isExpanded ? isExpanded : false);
  };
  return (
    <div className={style.container}>
      <HeaderComponent />
      <div className={style.containerLayer}>
        <div
          className={style.handleClose}
          onClick={() => handleChange(1000)}
        ></div>
        <div className={style.accordion}>
          {guideJson.map((item: any, index: number) => (
            <>
              <Accordion
                expanded={expanded === item.id}
                onChange={() =>
                  handleChange(expanded === item.id ? 1000 : item.id)
                }
                sx={{
                  width: "100%",
                  backgroundColor: "#1d1b1b",
                  color: "white",
                  // maxWidth: "1500px",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: "white" }} />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography>
                    {index + 1})&nbsp;{item.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {item.description.map((data: any) => (
                    <>
                      <Typography sx={{ paddingBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>
                          {data.stepTitle}
                        </span>
                        &nbsp;{data.paragraph}&nbsp;
                        {data.link ? (
                          <a
                            target="blank"
                            href={data.link}
                            style={{ color: "#8fbcf3" }}
                          >
                            {data.link}
                          </a>
                        ) : (
                          <></>
                        )}
                      </Typography>
                      {data.imageUrl !== "" && (
                        <div style={{ margin: "20px" }}>
                          <Image
                            src={`/static/img/guide/${data.imageUrl}`}
                            alt="GFG logo served with static path of public directory"
                            height={data.imageHeight || 300}
                            width={data.imageWidth || 500}
                          />
                        </div>
                      )}
                    </>
                  ))}
                </AccordionDetails>
              </Accordion>
            </>
          ))}
        </div>
        <div
          className={style.handleClose}
          onClick={() => handleChange(1000)}
        ></div>
      </div>
    </div>
  );
};

export default Guide;

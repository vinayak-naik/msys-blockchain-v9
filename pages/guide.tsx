import React, { useEffect, useState } from "react";
import style from "../styles/pages/guide.module.css";
import guides from "../public/static/guides/guides.json";
import guidesIndex from "../public/static/guides/guide-index.json";
import { CircularProgress, Switch, Typography } from "@mui/material";
import HeaderComponent from "../components/header/header";
import Image from "next/image";

const Guides = () => {
  const [theme, setTheme] = useState(true);
  const [guide, setGuide] = useState<any>(null);
  const [guideId, setGuideId] = useState(1);

  useEffect(() => {
    const result = guides.find((item) => item.id === Number(guideId));
    setGuide(result);
  }, [guideId]);

  if (guide)
    return (
      <div className={`${style.container} ${theme && style.containerBlack}`}>
        <HeaderComponent />
        <div className={style.containerLayer}>
          <div className={style.themeBox}>
            {!theme && <div className={style.switchLabel}>Light</div>}
            <Switch
              defaultChecked
              onChange={(e) => setTheme(e.target.checked)}
            />
            {theme && <div className={style.switchLabel}>Dark</div>}
          </div>
          <div className={style.guidesContainer}>
            <div className={style.leftBox}>
              <div
                className={`${style.chapterBox} ${
                  theme && style.chapterBoxBlack
                }`}
              >
                {guidesIndex.map((item: any) => (
                  <div key={item.chapterId}>
                    <div
                      className={`${style.chapterName} ${
                        theme && style.chapterNameBlack
                      }`}
                    >
                      {item.chapterId}. {item.chapterName}
                    </div>
                    <div
                      className={`${style.chapterBody} ${
                        theme && style.chapterBodyBlack
                      }`}
                    >
                      {item.guides.map((data: any) => (
                        <div key={data.guideId}>
                          <div
                            className={`${style.guideName} 
                          ${
                            data.guideId === guideId
                              ? style.activeGuideName
                              : ""
                          } 
                          ${
                            data.guideId === guideId
                              ? theme && style.activeGuideNameBlack
                              : ""
                          } 
                          ${theme && style.guideNameBlack} `}
                            onClick={() => setGuideId(data.guideId)}
                          >
                            {data.guideName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={style.rightBox}>
              <h1 className={`${style.head} ${theme && style.headBlack}`}>
                {guide?.title}
              </h1>
              {guide?.description.map((data: any) => (
                <>
                  <Typography sx={{ paddingBottom: "10px" }}>
                    <span
                      className={`${style.stepTitle} ${
                        theme && style.stepTitleBlack
                      }`}
                    >
                      {data.stepTitle}
                    </span>
                    <div
                      style={{ paddingBottom: "10px" }}
                      className={`${style.paragraph} ${
                        theme && style.paragraphBlack
                      }`}
                    >
                      {data.paragraph}
                    </div>
                    {data.link && (
                      <a
                        target="blank"
                        href={data.link}
                        style={{ color: "#8fbcf3" }}
                      >
                        {data.link}
                      </a>
                    )}
                  </Typography>
                  {data.imageUrl !== "" && (
                    <div style={{ margin: "20px" }}>
                      <Image
                        src={`/static/guides/images/${data.imageUrl}`}
                        alt="GFG logo served with static path of public directory"
                        height={data.imageHeight || 300}
                        width={data.imageWidth || 500}
                      />
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div style={styleObj}>
      <CircularProgress color="success" />
    </div>
  );
};

export default Guides;

// ================================Objects=============================

const styleObj = {
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

import React, { useState } from "react";
import style from "../../styles/pages/articles.module.css";
import articles from "../../public/static/article/articles.json";
import { Switch } from "@mui/material";
import { useRouter } from "next/router";
import HeaderComponent from "../../components/header/header";

const Articles = () => {
  const { push } = useRouter();
  const [theme, setTheme] = useState(true);
  return (
    <div className={`${style.container} ${theme && style.containerBlack}`}>
      <HeaderComponent />
      <div className={style.containerLayer}>
        <div className={style.themeBox}>
          {!theme && <div className={style.switchLabel}>Light</div>}
          <Switch defaultChecked onChange={(e) => setTheme(e.target.checked)} />
          {theme && <div className={style.switchLabel}>Dark</div>}
        </div>
        <div className={style.articalContainer}>
          <div className={style.leftBox}>
            <div
              className={`${style.chapterBox} ${
                theme && style.chapterBoxBlack
              }`}
            >
              <div
                className={`${style.chapterName} ${
                  theme && style.chapterNameBlack
                }`}
              >
                1. Introduction to Blockchain
              </div>
            </div>
          </div>
          <div className={style.rightBox}>
            <div
              className={`${style.briefNote} ${theme && style.briefNoteBlack}`}
            >
              Chapter 1
            </div>
            <h1 className={`${style.head} ${theme && style.headBlack}`}>
              Introduction to Blockchain
            </h1>
            {articles.map((item: any, index: any) => (
              <div
                key={index}
                className={`${style.questionBox} ${
                  theme && style.questionBoxBlack
                }`}
                onClick={() => push(`/article/${item.id}`)}
              >
                <div
                  className={`${style.question} ${
                    theme && style.questionBlack
                  }`}
                >
                  {item.title}
                </div>
                {item.briefNote && (
                  <div
                    className={`${style.briefNote} ${
                      theme && style.briefNoteBlack
                    }`}
                  >
                    {item.briefNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;

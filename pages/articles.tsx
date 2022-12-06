import React, { useEffect, useState } from "react";
import style from "../styles/pages/articles.module.css";
import articles from "../public/static/articles/articles.json";
import articlesIndex from "../public/static/articles/article-index.json";
import { CircularProgress, Switch } from "@mui/material";
import HeaderComponent from "../components/header/header";
import Image from "next/image";

const Articles = () => {
  const [theme, setTheme] = useState(true);
  const [article, setArticle] = useState<any>(null);
  const [articleId, setArticleId] = useState(1);

  useEffect(() => {
    const result = articles.find((item) => item.id === Number(articleId));
    setArticle(result);
  }, [articleId]);

  if (article)
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
          <div className={style.articalContainer}>
            <div className={style.leftBox}>
              <div
                className={`${style.chapterBox} ${
                  theme && style.chapterBoxBlack
                }`}
              >
                {articlesIndex.map((item: any) => (
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
                      {item.articles.map((data: any) => (
                        <div key={data.articleId}>
                          <div
                            className={`${style.articleName} 
                          ${
                            data.articleId === articleId
                              ? style.activeArticleName
                              : ""
                          } 
                          ${
                            data.articleId === articleId
                              ? theme && style.activeArticleNameBlack
                              : ""
                          } 
                          ${theme && style.articleNameBlack} `}
                            onClick={() => setArticleId(data.articleId)}
                          >
                            {data.articleName}
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
                {article?.title}
              </h1>
              {article?.description.map((data: any) => (
                <>
                  {data.imageUrl !== "" && (
                    <div style={{ margin: "20px" }}>
                      <Image
                        src={`/static/articles/images/${data.imageUrl}`}
                        alt="image"
                        height={data.imageHeight || 300}
                        width={data.imageWidth || 500}
                      />
                    </div>
                  )}
                  <div
                    style={{ paddingBottom: "10px" }}
                    className={`${style.paragraph} ${
                      theme && style.paragraphBlack
                    }`}
                  >
                    {data.paragraph}
                  </div>
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

export default Articles;

// ================================Objects=============================

const styleObj = {
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

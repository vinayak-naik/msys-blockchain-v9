import React, { useEffect, useState } from "react";
import style from "../styles/pages/articles.module.css";
import { CircularProgress, Switch } from "@mui/material";
import HeaderComponent from "../components/header/header";
import Image from "next/image";
import { articlesJson } from "../public/static/articles/json";

const Articles = () => {
  const [theme, setTheme] = useState(true);
  const [article, setArticle] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState({
    chapterId: 3,
    articleId: 2,
  });

  useEffect(() => {
    const chapter = articlesJson.find(
      (item) => item.chapterId === Number(selectedArticle.chapterId)
    );
    if (!chapter) return;
    const _article = chapter.chapterBody.find(
      (item) => item.articleId === Number(selectedArticle.articleId)
    );

    setArticle(_article);
  }, [selectedArticle]);

  if (articlesJson)
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
          <div className={style.articlesContainer}>
            <div className={style.leftBox}>
              <div
                className={`${style.chapterBox} ${
                  theme && style.chapterBoxBlack
                } `}
              >
                {articlesJson.map((item: any) => (
                  <div key={item.chapterId}>
                    <div
                      className={`${style.chapterName} ${
                        theme && style.chapterNameBlack
                      }  ${
                        item.chapterId === selectedArticle.chapterId
                          ? style.activeChapterName
                          : ""
                      } 
                      ${
                        item.chapterId === selectedArticle.chapterId
                          ? theme && style.activeChapterNameBlack
                          : ""
                      } `}
                      onClick={() =>
                        setSelectedArticle({
                          chapterId: item.chapterId,
                          articleId: 1,
                        })
                      }
                    >
                      {item.chapterId}. {item.chapterName}
                    </div>
                    <div
                      className={`${style.chapterBody} ${
                        theme && style.chapterBodyBlack
                      }`}
                    >
                      {item.chapterBody.map((data: any, index: any) => (
                        <div key={data.articleId}>
                          <div
                            className={`${style.articleName}  
                          ${
                            item.chapterId === selectedArticle.chapterId &&
                            data.articleId === selectedArticle.articleId
                              ? style.activeArticleName
                              : ""
                          } 
                          ${
                            item.chapterId === selectedArticle.chapterId &&
                            data.articleId === selectedArticle.articleId
                              ? theme && style.activeArticleNameBlack
                              : ""
                          } 
                          ${theme && style.articleNameBlack} `}
                            onClick={() =>
                              setSelectedArticle({
                                chapterId: item.chapterId,
                                articleId: data.articleId,
                              })
                            }
                          >
                            <span style={{ fontWeight: "400" }}>
                              {item.chapterId}.{index + 1}
                            </span>
                            &nbsp;
                            {data.name}
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
                {article?.name}
              </h1>
              {article?.description.map((data: any) => (
                <>
                  {data.imageUrl !== "" && (
                    <div style={{ margin: "20px" }}>
                      <Image
                        alt="image"
                        height={data.imageHeight || 300}
                        width={data.imageWidth || 500}
                        loader={({ src }: any) => src}
                        // src={`/static/articles/images/${data.imageUrl}`}
                        src={data.imageUrl}
                      />
                    </div>
                  )}
                  {data.subHeading && (
                    <h2 className={`${style.head} ${theme && style.headBlack}`}>
                      {data.subHeading}
                    </h2>
                  )}
                  {data.paragraph && (
                    <div
                      style={{ paddingBottom: "10px" }}
                      className={`${style.paragraph} ${
                        theme && style.paragraphBlack
                      }`}
                    >
                      {data.paragraph}
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

export default Articles;

// ================================Objects=============================

const styleObj = {
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

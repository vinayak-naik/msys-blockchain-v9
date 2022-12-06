import React, { useEffect, useState } from "react";
import style from "../../styles/pages/articles.module.css";
import articles from "../../public/static/article/articles.json";
import { Switch } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import HeaderComponent from "../../components/header/header";

const Articles = () => {
  const { query } = useRouter();
  const [theme, setTheme] = useState(true);
  const [article, setArticle] = useState<any>({ description: [] });

  useEffect(() => {
    if (query.articleId) {
      const result = articles.find(
        (item) => item.id === Number(query.articleId)
      );
      setArticle(result);
    }
  }, [query.articleId]);

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
          <div className={style.rightBox}>
            <h1 className={`${style.head} ${theme && style.headBlack}`}>
              {article.title}
            </h1>
            {article.description.map((data: any) => (
              <>
                {data.imageUrl !== "" && (
                  <div style={{ margin: "20px" }}>
                    <Image
                      src={`/static/article/${data.imageUrl}`}
                      alt="image"
                      height={data.imageHeight || 300}
                      width={data.imageWidth || 500}
                    />
                  </div>
                )}
                <div
                  style={{ paddingBottom: "10px" }}
                  className={`${style.briefNote} ${
                    theme && style.briefNoteBlack
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
};

export default Articles;

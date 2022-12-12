import React, { useState } from "react";
import style from ".././styles/pages/articles.module.css";
import { Switch } from "@mui/material";
import Image from "next/image";
import logo from ".././public/static/img/msys-logo-big.png";
import HeaderComponent from "../components/header/header";

const Articles = () => {
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
          <div className={style.rightBox}>
            <div style={{ margin: "20px" }}>
              <Image src={logo} alt="image" height="250" width="500" />
            </div>
            <h1 className={`${style.head} ${theme && style.headBlack}`}>
              Underlining Our Clients Vision for the Future
            </h1>

            <div
              style={{ paddingBottom: "10px" }}
              className={`${style.paragraph} ${theme && style.paragraphBlack}`}
            >
              It is a matter of pride, and responsibility to work with clients
              who are defining the future of business operations and customer
              experience management. We ensure they are able to create an impact
              by making technology as an enabler for them. For this, we offer
              our niche engineering skills and design software products, which
              are multi-layered in complexities in the area of product
              architecture, product development, integration and interplay of
              products.
            </div>
            <h1 className={`${style.head} ${theme && style.headBlack}`}>
              Bringing Software Products to Life by Imparting Digital Readiness
            </h1>
            <div
              style={{ paddingBottom: "10px" }}
              className={`${style.paragraph} ${theme && style.paragraphBlack}`}
            >
              We empower our clients to leapfrog the competition by stitching
              advanced technologies like Big Data Analytics, Artificial
              Intelligence/Machine Learning, Automation, Robotics, Internet of
              Things (IoT), among others with their software products. Our
              Technical Architects ensure that clients experience the true value
              of these technologies without compromising on costs. For this,
              they make the cloud as an enabler that ensures maximum
              responsiveness and business scalability.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;

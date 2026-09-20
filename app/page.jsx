'use client';

import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import "moment/min/locales";
import { useTranslation } from 'react-i18next';

let cancelAxios = null;

export default function HomePage() {
  const theme = createTheme({
    typography: {
      fontFamily: ["IBM"],
      fontWeightBold: 800
    }
  });

  const { t, i18n } = useTranslation();
  const [locales, setLocales] = useState("ar");
  const [dateAndtime, setDateandTime] = useState(null);
  const [temp, setTemp] = useState({
    number: null,
    newdescription: " ",
    max: null,
    min: null,
    icon: null
  });

  function handleLanguageclick() {
    if (locales === "en") {
      setLocales("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocales("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateandTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }

  useEffect(() => {
    setDateandTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
    axios.get('https://api.openweathermap.org/data/2.5/weather?lat=36.2021047&lon=37.1342603&appid=f9b1009df79543ed9d36ee5d46c4fa56', {
      cancelToken: new axios.CancelToken((c) => {
        cancelAxios = c;
      })
    })
    .then(function (response) {
      const description = response.data.weather[0].description;
      const reponsTemp = Math.round((response.data.main.temp) - 272.15);
      const minTemp = Math.round((response.data.main.temp_min) - 272.15);
      const maxTemp = Math.round((response.data.main.temp_max) - 272.15);
      const icons = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
      
      setTemp({
        number: reponsTemp,
        newdescription: description,
        max: maxTemp,
        min: minTemp,
        icon: icons
      });
    })
    .catch(function (error) {
      console.log(error);
    });

    return () => {
      if (cancelAxios) cancelAxios();
    };
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flexDirection: "column" }}>
            
            {/* Weather Card */}
            <div style={{
              backgroundColor: "rgba(28, 52, 91, 0.36)",
              color: "white",
              width: "100%",
              padding: "10px",
              borderRadius: "15px",
              boxShadow: "0px 11px 1px rgba(0,0,0,0.05)"
            }}>
              <div>
                {/* City & Time */}
                <div
                  dir={locales === "ar" ? "rtl" : "ltr"}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography variant="h1" style={{ fontSize: "40px", fontWeight: "900", marginRight: "20px" }}>
                    {t("Damascus")}
                  </Typography>
                  <Typography variant="h6" style={{ fontSize: "16px", marginRight: "20px" }}>
                    {dateAndtime}
                  </Typography>
                </div>

                <hr />

                {/* Degree & Description */}
                <div
                  dir={locales === "ar" ? "rtl" : "ltr"}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Typography variant='h3' style={{ textAlign: "right", fontWeight: "bold" }}>
                        {temp.number}
                      </Typography>
                      {temp.icon && <img src={temp.icon} alt="weather icon" />}
                    </div>

                    <Typography variant='h6'>
                      {t(temp.newdescription)}
                    </Typography>

                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", direction: "ltr" }}>
                      <h6 style={{ marginRight: "15px" }}> {temp.min} : {t("min")} </h6>
                      |
                      <h6 style={{ marginLeft: "15px" }}> {temp.max} : {t("max")} </h6>
                    </div>
                  </div>

                  <CloudIcon style={{ fontSize: "200px" }} />
                </div>
              </div>
            </div>

            {/* Language Toggle Button */}
            <div style={{ textAlign: "left", width: "100%", margin: "10px 0" }}>
              <Button style={{ color: "white" }} onClick={handleLanguageclick}>
                {locales === "ar" ? "انجليزي" : "Arabic"}
              </Button>
            </div>

          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}
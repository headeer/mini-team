"use client";
import { useEffect } from "react";

const TidioChat = () => {
  useEffect(() => {
    const existing = document.getElementById("tidio-script");
    if (existing) return;
    const s = document.createElement("script");
    s.id = "tidio-script";
    s.src = "//code.tidio.co/04zpgftznaiwfj5pofrrdvg8wpfzmnns.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);
  return null;
};

export default TidioChat;


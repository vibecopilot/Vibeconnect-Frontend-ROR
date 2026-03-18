import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Footer = () => {
const themeColor = useSelector((state)=> state.theme.color)
  const location = useLocation();
  const isSurveyPage = location.pathname.includes('/survey/');

  useEffect(() => {
    if (isSurveyPage) return;
    const footer = document.querySelector(".hideIt");
    if (!footer) return;

    const hideFooter = () => {
      if (window.innerWidth <= 786) {
        footer.classList.add('hide-on-small-screen');
      }
    };

    const handleMouseEnter = () => {
      if (window.innerWidth <= 786) {
        footer.classList.remove('hide-on-small-screen');
      }
    };

    const handleMouseLeave = () => {
      if (window.innerWidth <= 786) {
        footer.classList.add('hide-on-small-screen');
      }
    };
    setTimeout(hideFooter, 5000);
    footer.addEventListener('mouseenter', handleMouseEnter);
    footer.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      footer.removeEventListener('mouseenter', handleMouseEnter);
      footer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isSurveyPage]);

  return (
    !isSurveyPage && (
      <footer className="hideIt fixed bottom-0 w-screen z-10">
        <div style={{background: themeColor}}>
          <p className="text-center text-white">
            Copyright © 2023-2026 Digielves Tech Wizards Private Limited. All rights
            reserved
          </p>
        </div>
      </footer>
    )
  );
};

export default Footer;

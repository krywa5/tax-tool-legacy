import React from "react";

import PrintButton from "./PrintButton";

const Footer = () => {
  return (
    <>
      <footer className="no-print">
        created by <strong>Krystian Wasilewski</strong> 2019
      </footer>
      <PrintButton />
    </>
  );
};

export default Footer;

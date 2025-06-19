import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";

const Footer = () => {
  return (
    <div className="">
      <Container className="text-center flex flex-col items-center justify-evenly bottom-full ">
        <FooterTop />
        <div className="flex flex-row items-center w-full  justify-evenly">
          <p>© 2025 - Ecommerce solutions - Se reservan los derechos.</p>
          <img
            src="src/assets/pay_images.png"
            className="w-18"
            alt="Pay_kind"
          />
        </div>
      </Container>
    </div>
  );
};

export default Footer;

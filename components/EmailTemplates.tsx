import React from "react";

import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Button,
  Section,
  Row,
  Column,
} from "@react-email/components";

interface Props {
  userName?: string;
  heading?: string;
  text?: string;
  buttonUrl?: string;
  buttonTitle?: string;
  footerText?: string;
  typeOfEmail?: string;
}

const EmailTemplates = ({
  userName,
  heading,
  text,
  buttonUrl,
  buttonTitle,
  footerText = "",
  typeOfEmail = "simple",
}: Props) => {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Row>
            <Column
              style={{
                display: "flex",
                flex: "1",
                width: "100%",
              }}
            >
              <img
                src="https://university-library-jsm-red.vercel.app/icons/logo.svg"
                alt="BookWise Logo"
                width="50"
                style={{ verticalAlign: "" }}
              />
              &nbsp;&nbsp;<Text style={styles.companyName}>BookWise</Text>
            </Column>
          </Row>
          <Heading style={styles.title}>{heading}</Heading>
          <Text style={styles.message}>
            Welcome, {userName}!<br />
            <br />
            {text?.includes("<") ? (
              <Text dangerouslySetInnerHTML={{ __html: text }} />
            ) : (
              text?.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))
            )}
          </Text>

          {/* Call-to-Action Button */}
          {buttonTitle != "" ? (
            <Button style={styles.button} href={buttonUrl}>
              {buttonTitle}
            </Button>
          ) : (
            ""
          )}

          {/* Footer Message */}
          {footerText == "" ? (
            <Text style={styles.footer}>
              Happy Reading,
              <br />
              <strong>Team BookWise</strong>
            </Text>
          ) : (
            <Text style={styles.footer}>
              <Text dangerouslySetInnerHTML={{ __html: footerText }}></Text>
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
};
export default EmailTemplates;

const styles = {
  body: {
    backgroundColor: "#000",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: "transparent",
    color: "#fff",
    padding: "15px 20px",
  },
  companyName: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#232839",
    padding: "2rem",
    display: "flex",
  },
  title: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "600",
    backgroundColor: "transparent",
    borderRadius: "5px",
    marginTop: "1rem",
  },
  message: {
    fontSize: "16px",
    margin: "15px 0",
    align: "left",
  },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#fcd34d", // Tailwind: bg-amber-100
    color: "#000",
    textDecoration: "none",
    fontWeight: "bold",
    borderRadius: "5px",
    marginTop: "10px",
  },
  footer: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#6b7280",
  },
};

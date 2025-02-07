import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";
import EmailTemplates from "@/components/EmailTemplates";
import { render } from "@react-email/render";
import BorrowReceiptTemplate from "@/components/BorrowReceiptTemplate";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qStashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

interface message {
  userName?: string;
  buttonTitle?: string;
  text?: string;
  buttonUrl?: string;
  heading?: string;
  footerText?: string;
  typeOfEmail?: string;
  receipt?: {
    id: string;
    dateIssued: string;
    bookTitle: string;
    bookAuthor: string;
    bookGenre: string;
    borrowDate: string;
    dueDate: string;
    duration: number;
    overdueFlag: number;
  };
}

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: message;
}) => {
  // ✅ Convert React component to HTML string

  let emailHtml;

  if (message.typeOfEmail === "simple") {
    emailHtml = await render(
      EmailTemplates({
        userName: message.userName,
        buttonTitle: message.buttonTitle,
        buttonUrl: message.buttonUrl,
        text: message.text,
        heading: message.heading,
        footerText: message.footerText,
        typeOfEmail: message.typeOfEmail,
      }),
    );
  } else if (message.typeOfEmail === "receipt") {
    emailHtml = await render(
      BorrowReceiptTemplate({
        receipt: message?.receipt!,
        userName: message?.userName!,
      }),
    );
  } else {
    emailHtml = await render(
      EmailTemplates({
        userName: message.userName,
        buttonTitle: message.buttonTitle,
        buttonUrl: message.buttonUrl,
        text: message.text,
        heading: message.heading,
        footerText: message.footerText,
        typeOfEmail: message.typeOfEmail,
      }),
    );
  }

  await qStashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "BYRAGHAVLIB <contact@mail.raghavjhawar.in>",
      to: [email],
      subject,
      html: emailHtml,
    },
  });
};

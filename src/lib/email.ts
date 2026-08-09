import { createServerFn } from "@tanstack/react-start";
import { business } from "./site";

export interface AppointmentEmailData {
  full_name: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  service: string;
  preferred_date: string;
  preferred_time: string;
  people_count: number;
  message?: string | null;
}

const OWNER_EMAIL = "queensclozet9@gmail.com";

/**
 * Server Function to send notification emails via Resend REST API on the server side:
 * 1. Alert email to store owner (queensclozet9@gmail.com)
 * 2. Confirmation email to customer (if email provided)
 */
export const sendAppointmentNotificationEmails = createServerFn({ method: "POST" })
  .validator((data: AppointmentEmailData) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env["RESEND_API_KEY"];


    if (!apiKey) {
      console.warn(
        "[Resend Email] RESEND_API_KEY is not set in .env. Please add RESEND_API_KEY='re_...' to your .env file."
      );
      return { success: false, reason: "MISSING_API_KEY" };
    }

    const fromAddress = "Queens Clozet <onboarding@resend.dev>";
    let ownerSent = false;
    let customerSent = false;

    // 1. Send Alert Email to Owner (queensclozet9@gmail.com)
    try {
      const ownerHtml = generateOwnerEmailHtml(data);
      const ownerRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [OWNER_EMAIL],
          subject: `✨ New Appointment Request: ${data.full_name} (${data.service})`,
          html: ownerHtml,
        }),
      });

      const resBody = await ownerRes.json().catch(() => ({}));
      if (!ownerRes.ok) {
        console.error(
          `[Resend Email] Owner alert failed (${ownerRes.status}):`,
          JSON.stringify(resBody)
        );
      } else {
        console.log("[Resend Email] Owner alert email sent successfully!", resBody);
        ownerSent = true;
      }
    } catch (err) {
      console.error("[Resend Email] Error sending owner email:", err);
    }

    // 2. Send Confirmation Email to Customer (if email provided)
    if (data.email && data.email.trim()) {
      try {
        const customerHtml = generateCustomerEmailHtml(data);
        const customerRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [data.email.trim()],
            subject: `Appointment Request Received — Queens Clozet`,
            html: customerHtml,
          }),
        });

        const resBody = await customerRes.json().catch(() => ({}));
        if (!customerRes.ok) {
          console.error(
            `[Resend Email] Customer email failed (${customerRes.status}):`,
            JSON.stringify(resBody),
            "\nNote: In Resend test mode (onboarding@resend.dev), emails can only be sent to the email address registered on your Resend account until you add a verified domain."
          );
        } else {
          console.log("[Resend Email] Customer confirmation email sent successfully!", resBody);
          customerSent = true;
        }
      } catch (err) {
        console.error("[Resend Email] Error sending customer email:", err);
      }
    }

    return { success: true, ownerSent, customerSent };
  });

/**
 * Generates an elegant HTML template for the Owner Alert Email.
 */
function generateOwnerEmailHtml(app: AppointmentEmailData): string {
  const cleanPhone = app.phone.replace(/[\s-]/g, "");
  const waNumber = (app.whatsapp || app.phone).replace(/[\s-]/g, "");
  const whatsappUrl = `https://wa.me/${waNumber.startsWith("+") ? waNumber.slice(1) : "91" + waNumber}?text=${encodeURIComponent(
    `Hello ${app.full_name}, regarding your appointment request for ${app.service} on ${app.preferred_date} at ${app.preferred_time}:`
  )}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Appointment Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1A362B; padding: 36px; text-align: center; border-bottom: 3px solid #C5A059;">
              <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 26px; font-weight: normal; margin: 0; letter-spacing: 2px; text-transform: uppercase;">QUEENS CLOZET</h1>
              <p style="color: #C5A059; font-size: 11px; margin: 8px 0 0 0; letter-spacing: 3px; text-transform: uppercase;">New Appointment Request</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 40px; color: #2D3748;">
              <h2 style="font-family: 'Georgia', serif; font-size: 20px; color: #1A362B; margin-top: 0; font-weight: normal; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px;">
                Client Booking Details
              </h2>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px; line-height: 1.6; margin-top: 16px;">
                <tr>
                  <td width="35%" style="color: #718096; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Customer Name</td>
                  <td width="65%" style="color: #1A202C; font-weight: 600;">${app.full_name}</td>
                </tr>
                <tr style="background-color: #F8FAFC;">
                  <td style="color: #718096; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Service Requested</td>
                  <td style="color: #1A362B; font-weight: 600;">${app.service}</td>
                </tr>
                <tr>
                  <td style="color: #718096; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Date & Time Slot</td>
                  <td style="color: #C5A059; font-weight: 700;">${app.preferred_date} @ ${app.preferred_time}</td>
                </tr>
                <tr style="background-color: #F8FAFC;">
                  <td style="color: #718096; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Number of People</td>
                  <td style="color: #1A202C;">${app.people_count} person(s)</td>
                </tr>
                <tr>
                  <td style="color: #718096; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Mobile Number</td>
                  <td style="color: #1A202C;"><a href="tel:${cleanPhone}" style="color: #1A362B; text-decoration: none; font-weight: 600;">${app.phone}</a></td>
                </tr>
                <tr style="background-color: #F8FAFC;">
                  <td style="color: #718096; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">WhatsApp</td>
                  <td style="color: #1A202C;">${app.whatsapp || "Same as mobile"}</td>
                </tr>
                <tr>
                  <td style="color: #718096; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Email Address</td>
                  <td style="color: #1A202C;">${app.email ? `<a href="mailto:${app.email}" style="color: #1A362B;">${app.email}</a>` : "Not provided"}</td>
                </tr>
                ${
                  app.message
                    ? `<tr style="background-color: #F8FAFC;">
                        <td style="color: #718096; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; vertical-align: top;">Message / Notes</td>
                        <td style="color: #2D3748; line-height: 1.5;">${app.message}</td>
                      </tr>`
                    : ""
                }
              </table>

              <!-- Quick Action Button -->
              <div style="margin-top: 32px; text-align: center;">
                <a href="${whatsappUrl}" target="_blank" style="background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-weight: 600; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; display: inline-block;">
                  💬 Contact Client on WhatsApp
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 20px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #A0AEC0;">
              Queens Clozet Atelier Management System · Perambalur
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates an elegant HTML template for Customer Confirmation Email.
 */
function generateCustomerEmailHtml(app: AppointmentEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Appointment Confirmation Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1A362B; padding: 40px; text-align: center; border-bottom: 3px solid #C5A059;">
              <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 28px; font-weight: normal; margin: 0; letter-spacing: 3px; text-transform: uppercase;">QUEENS CLOZET</h1>
              <p style="color: #C5A059; font-size: 12px; margin: 8px 0 0 0; letter-spacing: 2px; text-transform: uppercase;">Fashion · Art · Personal Atelier</p>
            </td>
          </tr>

          <!-- Greeting Body -->
          <tr>
            <td style="padding: 40px; color: #2D3748; line-height: 1.7;">
              <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #1A362B; margin-top: 0; font-weight: normal;">
                Dear ${app.full_name},
              </h2>
              <p style="font-size: 15px; color: #4A5568;">
                Thank you for requesting an appointment with <strong>Queens Clozet</strong>. We have received your booking request and are preparing to welcome you!
              </p>

              <!-- Appointment Details Box -->
              <div style="background-color: #FDFBF7; border: 1px solid #E5DECF; border-left: 4px solid #C5A059; border-radius: 4px; padding: 24px; margin: 28px 0;">
                <h3 style="font-family: 'Georgia', serif; font-size: 16px; color: #1A362B; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1px;">
                  Your Requested Appointment Summary
                </h3>
                <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 14px;">
                  <tr>
                    <td width="40%" style="color: #718096;">Service:</td>
                    <td width="60%" style="color: #1A202C; font-weight: 600;">${app.service}</td>
                  </tr>
                  <tr>
                    <td style="color: #718096;">Date:</td>
                    <td style="color: #1A202C; font-weight: 600;">${app.preferred_date}</td>
                  </tr>
                  <tr>
                    <td style="color: #718096;">Time Slot:</td>
                    <td style="color: #C5A059; font-weight: 700;">${app.preferred_time}</td>
                  </tr>
                  <tr>
                    <td style="color: #718096;">Guests:</td>
                    <td style="color: #1A202C;">${app.people_count} person(s)</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 14px; color: #4A5568;">
                Our team will review your requested time slot and reach out to you via phone or WhatsApp at <strong>${app.phone}</strong> shortly to confirm your booking.
              </p>

              <!-- Address Box -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E2E8F0; font-size: 13px; color: #718096;">
                <p style="margin: 0; font-weight: 600; color: #1A362B; text-transform: uppercase; letter-spacing: 1px;">Visit Our Atelier</p>
                <p style="margin: 4px 0 0 0; color: #4A5568;">${business.addressOneLine}</p>
                <p style="margin: 4px 0 0 0; color: #4A5568;">Phone / WhatsApp: ${business.phone}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1A362B; padding: 24px; text-align: center; color: #A0AEC0; font-size: 12px;">
              <p style="margin: 0; color: #C5A059;">Queens Clozet — Crafting fashion, art and creativity with a personal touch.</p>
              <p style="margin: 8px 0 0 0;">© Queens Clozet. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

package com.smartparking.service;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Slf4j
@Service
public class OtpService {

    private final SecureRandom random = new SecureRandom();

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:simghgaurav001@gmail.com}")
    private String fromEmail;

    @Value("${app.server.base-url:http://localhost:8080}")
    private String baseUrl;

    public String generate6DigitOtp() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public void sendOtpEmail(String recipientEmail, String otpCode, String purpose) {
        log.info("==================================================================");
        log.info("📧 [REAL GMAIL SMTP DISPATCH]");
        log.info("From     : {}", fromEmail);
        log.info("To       : {}", recipientEmail);
        log.info("Purpose  : {}", purpose);
        log.info("🔑 OTP   : [{}]", otpCode);
        log.info("==================================================================");

        if (mailSender != null && recipientEmail != null && !recipientEmail.isBlank()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail.isBlank() ? "simghgaurav001@gmail.com" : fromEmail);
                message.setTo(recipientEmail);
                message.setSubject("SmartParking Verification OTP Code: " + otpCode);
                message.setText("Hello,\n\n" +
                        "Your SmartParking verification OTP code for " + purpose + " is:\n\n" +
                        "    " + otpCode + "\n\n" +
                        "This code will expire in 15 minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "SmartParking Security Team");

                mailSender.send(message);
                log.info("✅ REAL GMAIL EMAIL SENT SUCCESSFULLY to {}", recipientEmail);
            } catch (Exception e) {
                log.error("❌ Gmail SMTP Dispatch Error to {}: {}", recipientEmail, e.getMessage(), e);
            }
        }
    }

    public void sendAdminNotificationEmail(String adminEmail, String staffName, String staffEmail, String companyName, Long pendingId, String approvalToken) {
        log.info("==================================================================");
        log.info("📧 [REAL GMAIL ADMIN NOTIFICATION DISPATCH - HTML]");
        log.info("From        : {}", fromEmail);
        log.info("Admin Email : {}", adminEmail);
        log.info("Company Name: {}", companyName);
        log.info("Staff Name  : {}", staffName);
        log.info("Staff Email : {}", staffEmail);
        log.info("Pending ID  : {}", pendingId);
        log.info("==================================================================");

        String approveUrl = baseUrl + "/api/v1/auth/signup/staff/approve-direct?id=" + pendingId + "&token=" + approvalToken;
        String rejectUrl = baseUrl + "/api/v1/auth/signup/staff/reject-direct?id=" + pendingId + "&token=" + approvalToken;

        if (mailSender != null && adminEmail != null && !adminEmail.isBlank()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail.isBlank() ? "simghgaurav001@gmail.com" : fromEmail);
                helper.setTo(adminEmail);
                helper.setSubject("SmartParking: Staff Registration Request from " + staffName);

                String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #0f172a; color: #f8fafc;\">" +
                        "<div style=\"text-align: center; margin-bottom: 20px;\">" +
                        "<h2 style=\"color: #6366f1; margin: 0;\">SmartParking Portal</h2>" +
                        "<p style=\"color: #94a3b8; font-size: 14px; margin-top: 5px;\">Staff Registration Request</p>" +
                        "</div>" +
                        "<hr style=\"border: none; border-top: 1px solid #1e293b; margin: 20px 0;\" />" +
                        "<p style=\"font-size: 15px;\">Hello <strong>Admin</strong>,</p>" +
                        "<p style=\"font-size: 14px; color: #cbd5e1;\">A new staff member has requested registration access to your organization (<strong>" + companyName + "</strong>):</p>" +
                        "<div style=\"background-color: #1e293b; padding: 15px; border-radius: 6px; margin: 15px 0;\">" +
                        "<p style=\"margin: 5px 0; font-size: 14px;\"><strong>Full Name:</strong> " + staffName + "</p>" +
                        "<p style=\"margin: 5px 0; font-size: 14px;\"><strong>Email Address:</strong> <a href=\"mailto:" + staffEmail + "\" style=\"color: #818cf8;\">" + staffEmail + "</a></p>" +
                        "</div>" +
                        "<p style=\"font-size: 14px; color: #cbd5e1;\">Please review this request and choose an action below:</p>" +
                        "<div style=\"display: flex; gap: 15px; margin: 25px 0; text-align: center;\">" +
                        "<a href=\"" + approveUrl + "\" style=\"background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; margin-right: 10px;\">✔ Approve Request</a>" +
                        "<a href=\"" + rejectUrl + "\" style=\"background-color: #ef4444; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;\">✖ Reject Request</a>" +
                        "</div>" +
                        "<p style=\"font-size: 12px; color: #64748b; margin-top: 20px;\">Clicking <strong>Approve</strong> will automatically dispatch a 6-digit OTP verification code to the staff member's email.<br/>You can also manage pending requests by logging in to the SmartParking Admin Portal.</p>" +
                        "<hr style=\"border: none; border-top: 1px solid #1e293b; margin: 20px 0;\" />" +
                        "<p style=\"font-size: 12px; color: #64748b; text-align: center;\">SmartParking Enterprise Security System</p>" +
                        "</div>";

                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("✅ REAL GMAIL ADMIN NOTIFICATION HTML SENT to {}", adminEmail);
            } catch (Exception e) {
                log.error("❌ Gmail SMTP Admin Dispatch Error to {}: {}", adminEmail, e.getMessage(), e);
            }
        }
    }

    public void sendStaffRejectionEmail(String staffEmail, String staffName, String companyName) {
        log.info("==================================================================");
        log.info("📧 [REAL GMAIL STAFF REJECTION NOTIFICATION]");
        log.info("To          : {}", staffEmail);
        log.info("Staff Name  : {}", staffName);
        log.info("Company Name: {}", companyName);
        log.info("==================================================================");

        if (mailSender != null && staffEmail != null && !staffEmail.isBlank()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail.isBlank() ? "simghgaurav001@gmail.com" : fromEmail);
                message.setTo(staffEmail);
                message.setSubject("SmartParking: Registration Request Status for " + companyName);
                message.setText("Hello " + staffName + ",\n\n" +
                        "Your registration request for joining " + companyName + " as Staff was rejected by the organization administrator.\n\n" +
                        "If you believe this was an error, please contact your company administrator directly.\n\n" +
                        "Best regards,\n" +
                        "SmartParking Portal Support");

                mailSender.send(message);
                log.info("✅ STAFF REJECTION NOTIFICATION SENT to {}", staffEmail);
            } catch (Exception e) {
                log.error("❌ Gmail SMTP Staff Rejection Error to {}: {}", staffEmail, e.getMessage(), e);
            }
        }
    }
}

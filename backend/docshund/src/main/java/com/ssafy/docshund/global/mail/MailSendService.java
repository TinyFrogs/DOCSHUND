package com.ssafy.docshund.global.mail;

import static com.ssafy.docshund.global.mail.exception.MailExceptionCode.IMAGE_NOT_DOWNLOAD;
import static com.ssafy.docshund.global.mail.exception.MailExceptionCode.MAIL_NOT_SEND;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ssafy.docshund.global.mail.exception.MailException;

import jakarta.activation.DataSource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailSendService {

	private final JavaMailSender mailSender;

	public void sendEmail(String sendEmail, String subject, String body, String imageUrl) {
		try {
			log.info("Sending email to " + sendEmail);

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = null;

			helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(sendEmail);
			helper.setSubject(subject);
			helper.setText(body, true);
			if (imageUrl != null && !imageUrl.isEmpty()) {
				byte[] imageBytes = downloadImageFromUrl(imageUrl);
				DataSource dataSource = new ByteArrayDataSource(imageBytes, "image/png");
				helper.addInline("image", dataSource);
			}

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new MailException(MAIL_NOT_SEND);
		}
	}

	private byte[] downloadImageFromUrl(String imageUrl) {
		try (InputStream in = new URL(imageUrl).openStream()) {
			return in.readAllBytes();
		} catch (IOException e) {
			throw new MailException(IMAGE_NOT_DOWNLOAD);
		}
	}
}

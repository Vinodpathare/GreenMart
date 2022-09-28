package com.app;

import java.util.Properties;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication(exclude=SecurityAutoConfiguration.class)
public class GreenMartApplication{
	//@Value => annotation to inject value of SpEL expression into a field
	@Value("${spring.mail.protocol}")
	private String protocol;
	
	@Value("${spring.mail.username}")
	private String userName;
	
	@Value("${spring.mail.password}")
	private String password;

	public static void main(String[] args) {
		SpringApplication.run(GreenMartApplication.class, args);
	}
	 @Bean
	    public JavaMailSender getJavaMailSender() {
	        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
	        mailSender.setHost("smtp.gmail.com");
	        mailSender.setPort(587);
	        
	        mailSender.setUsername(userName);
	        mailSender.setPassword(password);
	        
	        Properties props = mailSender.getJavaMailProperties();
	        props.put("mail.transport.protocol", protocol);
	        props.put("mail.smtp.auth", "true");
	        props.put("mail.smtp.starttls.enable", "true");
	        props.put("mail.debug", "true");
	        
	        return mailSender;
	    }
	//configure ModelMapper as a spring bean
	@Bean //equivalent to <bean> tag in xml file
	public ModelMapper mapper()
	{
		System.out.println("in mapper");
		return new ModelMapper();
	}
	@Bean
	public PasswordEncoder passwordEncoder() {
		PasswordEncoder encoder=new BCryptPasswordEncoder();
		return encoder;
	}
	
	

}

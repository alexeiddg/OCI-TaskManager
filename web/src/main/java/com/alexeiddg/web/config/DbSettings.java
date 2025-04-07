package com.alexeiddg.web.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

// This is only used for local testing.
@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "spring.datasource")
public class DbSettings {
    private String url;
    private String username;
    private String password;
    private String driver_class_name;
}

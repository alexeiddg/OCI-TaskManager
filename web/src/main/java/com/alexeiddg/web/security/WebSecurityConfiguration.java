package com.alexeiddg.web.security;

import com.alexeiddg.web.security.util.JwtAuthenticationFilter;
import com.alexeiddg.web.security.util.JwtTokenProvider;
import com.alexeiddg.web.service.AppUserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class WebSecurityConfiguration {

    private final JwtTokenProvider jwtTokenProvider;
    private final AppUserService appUserService;

    public WebSecurityConfiguration(JwtTokenProvider jwtTokenProvider, AppUserService appUserService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.appUserService = appUserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v2/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, appUserService),
                        UsernamePasswordAuthenticationFilter.class)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}
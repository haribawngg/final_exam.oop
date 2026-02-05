package com.school.grademanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (Thủ phạm chính gây lỗi 403 khi gọi API POST)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Cấu hình CORS (Cho phép React gọi sang)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Cho phép tất cả các request (Không cần đăng nhập cũng gọi được API)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    // Bean cấu hình CORS chi tiết
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép Frontend chạy ở cổng 3000
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));

        // Cho phép đủ các method: GET (xem), POST (thêm), PUT (sửa), DELETE (xóa)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Cho phép mọi header
        configuration.setAllowedHeaders(List.of("*"));

        // Cho phép gửi credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
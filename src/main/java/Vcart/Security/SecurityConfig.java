
package Vcart.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

       
       config.setAllowedOrigins(List.of(
    "http://localhost:5500",
    "http://127.0.0.1:5500"
));

        config.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
            "Authorization", "Content-Type"
        ));

        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter)
            throws Exception {

        http.csrf(csrf -> csrf.disable());

        // Frontend se aane wali cross-origin requests allow karo
        http.cors(cors -> {});

        http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/register", "/auth/login")
            .permitAll()

            .requestMatchers(HttpMethod.GET, "/products", "/products/**")
            .hasAnyRole("ADMIN", "CUSTOMER")

            .requestMatchers(HttpMethod.POST, "/products", "/products/**")
            .hasRole("ADMIN")

            .requestMatchers(HttpMethod.PUT, "/products", "/products/**")
            .hasRole("ADMIN")

            .requestMatchers(HttpMethod.DELETE, "/products", "/products/**")
            .hasRole("ADMIN")

            .anyRequest().authenticated()
        );

        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}

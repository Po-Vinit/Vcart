
package Vcart.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey key = Keys.hmacShaKeyFor(
        java.util.Base64.getDecoder().decode(
            "bXlTdXBlclNlY3JldEtleUZvclZjYXJ0QXBwMTIzNDU2Nzg5MDEyMzQ1Njc4OTA="
        )
    );

    public String generateToken(String email, String role) {
        long currentTime = System.currentTimeMillis();

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + 1000L * 60 * 60))
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public String extractRole(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("role", String.class);
    }
}

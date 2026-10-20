
package Vcart.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import Vcart.entity.User;
import Vcart.service.JwtService;
import Vcart.service.UserService;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(@RequestBody User user) {
        userService.register(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Map<String, String> data) {

        String email = data.get("email");
        String password = data.get("password");

        User user = userService.login(email, password);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
        }

        String token = jwtService.generateToken(
                user.getEmail(), user.getRole());
System.out.println("LOGIN ROLE: " + user.getRole());
                return ResponseEntity.ok(Map.of(
        "message", "Login successful",
        "token", token,
        "role", user.getRole()
));
       
    }
}

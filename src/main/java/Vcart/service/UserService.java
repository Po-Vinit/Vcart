
package Vcart.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import Vcart.entity.User;
import Vcart.repository.UserRepo;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User register(User user) {

        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(encoder.encode(user.getPassword()));

       user.setRole("CUSTOMER");

        return userRepo.save(user);
    }
    

public User login(String email, String password) {
    User user = userRepo.findByEmail(email);

    if (user == null) {
        return null;
    }

    if (!encoder.matches(password, user.getPassword())) {
        return null;
    }

    return user;
}

}


package Vcart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Vcart.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {
boolean existsByEmail(String email);
    User findByEmail(String email);

}

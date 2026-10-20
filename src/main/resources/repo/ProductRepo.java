
package Vcart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Vcart.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Long> {
}
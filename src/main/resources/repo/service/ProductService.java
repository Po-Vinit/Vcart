package Vcart.service;

import org.springframework.stereotype.Service;

import Vcart.repository.ProductRepo;
@Service
public class ProductService {

    private final ProductRepo productRepo;

    public ProductService(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }
     public Product saveProduct(Product product) {
        return productRepo.save(product);
     }
     

}
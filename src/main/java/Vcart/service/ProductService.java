package Vcart.service;
import java.util.List;

import org.springframework.stereotype.Service;

import Vcart.entity.Product;
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
     public List<Product> getAllProducts() {
    return productRepo.findAll();
}
public Product getProductById(Long id) {
    return productRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
}
 public Product updateProduct(Long id, Product newProduct) {
    Product oldProduct = getProductById(id);

    oldProduct.setName(newProduct.getName());
    oldProduct.setDescription(newProduct.getDescription());
    oldProduct.setPrice(newProduct.getPrice());
    oldProduct.setQuantity(newProduct.getQuantity());

    return productRepo.save(oldProduct);
}
public void deleteProduct(Long id) {
    Product product = getProductById(id);
    productRepo.delete(product);
}
}
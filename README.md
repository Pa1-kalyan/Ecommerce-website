# System Architecture Documentation

## 1. High-Level System Architecture
This diagram illustrates the overall data flow from the client (Browser) to the backend services, database, and external storage.

```mermaid
graph TD
    Client[Client Browser]
    RenderFE[Frontend Render Static Site]
    RenderBE[Backend API Render Docker]
    RailwayDB[(MySQL Database Railway)]
    S3[AWS S3 Bucket]

    Client -->|HTTPS Request| RenderFE
    Client -->|REST API Calls JSON| RenderBE
    RenderBE -->|JPA/Hibernate| RailwayDB
    RenderBE -->|Put/Get Objects| S3
```

## 2. Backend Component Diagram
Breakdown of the Spring Boot Backend architecture showing the layered approach.

```mermaid
classDiagram
    direction TB
    namespace Controllers {
        class AuthController
        class ProductController
        class CategoryController
    }
    
    namespace Services {
        class UserService
        class ProductService
        class CategoryService
        class AwsS3Service
    }
    
    namespace Repositories {
        class UserRepo
        class ProductRepo
        class CategoryRepo
    }

    AuthController ..> UserService
    ProductController ..> ProductService
    CategoryController ..> CategoryService
    
    UserService ..> UserRepo
    ProductService ..> ProductRepo
    ProductService ..> AwsS3Service
    CategoryService ..> CategoryRepo
```

## 3. Class Diagram
Core Entities and Security Classes.

```mermaid
classDiagram
    class User {
        +Long id
        +String name
        +String email
        +String role
    }

    class Product {
        +Long id
        +String name
        +BigDecimal price
        +String imageUrl
    }

    class Category {
        +Long id
        +String name
    }

    class Order {
        +Long id
        +BigDecimal totalPrice
    }
    
    class OrderItem {
        +Long id
        +int quantity
    }

    class JwtUtils {
        +generateToken()
        +validateToken()
    }

    User "1" --> "*" Order : places
    Category "1" --> "*" Product : contains
    Order "1" --> "*" OrderItem : contains
    OrderItem "*" --> "1" Product : references
```

## 4. Sequence Diagrams

### 4.1 User Login Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthController
    participant AuthManager
    participant JwtUtils
    
    User->>Frontend: Enter Credentials
    Frontend->>AuthController: POST /auth/login
    AuthController->>AuthManager: authenticate()
    AuthManager-->>AuthController: Success
    AuthController->>JwtUtils: generateToken()
    JwtUtils-->>AuthController: Token
    AuthController-->>Frontend: 200 OK (Token)
    Frontend->>Frontend: Store Token
```

### 4.2 Product Fetch Request
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant ProductController
    participant ProductService
    participant Database

    User->>Frontend: View Products
    Frontend->>ProductController: GET /product/get-all
    ProductController->>ProductService: getAllProducts()
    ProductService->>Database: SELECT * FROM products
    Database-->>ProductService: Result
    ProductService-->>ProductController: Product List
    ProductController-->>Frontend: JSON Response
    Frontend-->>User: Render UI
```

## 5. Deployment Diagram
Physical deployment architecture.

```mermaid
graph TB
    subgraph Client [Client Device]
        Browser[Web Browser]
    end

    subgraph Render [Render.com Cloud]
        FrontendHost[React Frontend]
        BackendContainer[Spring Boot Container]
    end

    subgraph Railway [Railway.app]
        MySQL[MySQL Database]
    end

    subgraph AWS [AWS Cloud]
        S3Bucket[S3 Bucket]
    end

    Browser -- HTTPS --> FrontendHost
    Browser -- REST/JSON --> BackendContainer
    BackendContainer -- TCP --> MySQL
    BackendContainer -- HTTPS --> S3Bucket
```

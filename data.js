import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'Dmitriy',
            surname:"Sevostyanov",
            email: 'admin@example.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
            isSeller: true,
            seller: {
                name: 'Puma',
                logo: '/images/logo1.png',
            },
        },
        {
            name: 'John',
            surname:"Dou",
            email: 'user@example.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: false,
        },
    ],
    products: [
        {
            name: 'Nike Slim Shirt',
            image: '/images/p1.jpg',
            price: 120,
            countInStock: 10,
            description: 'high quality product',
        },
        {
            name: 'Adidas Fit Shirt',
            image: '/images/p2.jpg',
            price: 100,
            countInStock: 20,
            description: 'high quality product',
        },
        {
            name: 'Lacoste Free Shirt',
            image: '/images/p3.jpg',
            price: 220,
            countInStock: 0,
            description: 'high quality product',
        },
        {
            name: 'Nike Slim Pant',
            image: '/images/p4.jpg',
            price: 78,
            countInStock: 15,
            description: 'high quality product',
        },
        {
            name: 'Puma Slim Pant',
            image: '/images/p5.jpg',
            price: 65,
            countInStock: 5,
            description: 'high quality product',
        },
        {
            name: 'Adidas Fit Pant',
            category: 'Pants',
            image: '/images/p6.jpg',
            price: 139,
            countInStock: 12,
            description: 'high quality product',
        },
    ],
};
export default data;
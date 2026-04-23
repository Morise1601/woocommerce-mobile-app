# WooCommerce React Native App

A complete React Native (Expo) eCommerce mobile app connected to a WordPress WooCommerce REST API. 

## Features

- **Authentication:** JWT Auth plugin integration for User Login, Registration, and secure session management.
- **User Screens:** Home, Product Details, Cart, Checkout (3 steps), Order Confirmation, Profile.
- **Admin Screens:** Admin Dashboard, Orders, Products, Customers.
- **UI:** Dark theme (#0F172A background, #6366F1 indigo accent) with fluid navigation and proper loading states.

## WordPress + JWT Setup Guide

To ensure this app works, your WordPress site must have the following plugins installed and configured:

1. **WooCommerce**
   - After installation, go to WooCommerce > Settings > Advanced > REST API.
   - Add a Key (Read/Write permissions).
   - Copy the `Consumer Key` and `Consumer Secret` into `src/services/woocommerce.js`.

2. **JWT Authentication for WP REST API**
   - Install the plugin: "JWT Authentication for WP REST API" by Enrique J. Ros.
   - Configure your `wp-config.php` file by adding:
     ```php
     define('JWT_AUTH_SECRET_KEY', 'your-top-secret-key');
     define('JWT_AUTH_CORS_ENABLE', true);
     ```
   - Make sure your `.htaccess` (if using Apache) has the necessary Authorization header passes:
     ```apache
     RewriteCond %{HTTP:Authorization} ^(.*)
     RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
     ```

## Project Setup

1. Extract the zip file or clone the source.
2. Run `npm install` within the project root.
3. Replace the `baseURL`, `consumerKey`, `consumerSecret` in `src/services/woocommerce.js`.
4. Run `npx expo start` to launch the Expo bundler!

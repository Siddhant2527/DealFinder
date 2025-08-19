// server/controllers/productController.js
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Sample results for demo mode when MongoDB is not connected
const sampleResults = {
    'iphone': [
        { id: 'iphone1', platform: 'Amazon', price: 59999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Apple-iPhone-13-128GB-Pink/dp/B09G9HD6PD/', name: 'iPhone 13 128GB', image: 'https://m.media-amazon.com/images/I/71GLMJ7TQiL._AC_UY218_.jpg' },
        { id: 'iphone2', platform: 'Flipkart', price: 57999, delivery: 3, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/apple-iphone-13-pink-128-gb/p/itm6e30c6ee045d2', name: 'iPhone 13 128GB', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imagfhu75eupxyft.jpeg' },
        { id: 'iphone3', platform: 'Reliance Digital', price: 60999, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.reliancedigital.in/apple-iphone-13-128gb-pink/p/491997555', name: 'iPhone 13 128GB', image: 'https://www.reliancedigital.in/medias/Apple-iPhone-13-128GB-Pink-491997555-1.jpg' },
        { id: 'iphone4', platform: 'Croma', price: 58999, delivery: 4, rating: 4.2, logo: '🛒', link: 'https://www.croma.com/apple-iphone-13-128gb-pink/p/241145', name: 'iPhone 13 128GB', image: 'https://www.croma.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/a/p/apple-iphone-13-128gb-pink_1.png' },
        { id: 'iphone5', platform: 'Apple Store', price: 62999, delivery: 1, rating: 4.8, logo: '🛒', link: 'https://www.apple.com/in/iphone-13/', name: 'iPhone 13 128GB', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pink-select-2021?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1645572388068' },
        { id: 'iphone6', platform: 'Amazon', price: 89999, delivery: 2, rating: 4.7, logo: '🛒', link: 'https://www.amazon.in/Apple-iPhone-14-Pro-128GB/dp/B0BDJ6ZMYM/', name: 'iPhone 14 Pro 128GB', image: 'https://m.media-amazon.com/images/I/71yzJoE7WlL._AC_UY218_.jpg' },
        { id: 'iphone7', platform: 'Flipkart', price: 87999, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.flipkart.com/apple-iphone-14-pro-deep-purple-128-gb/p/itm8c9c5c5c5c5c5', name: 'iPhone 14 Pro 128GB', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imagfhu75eupxyft.jpeg' },
    ],
    'samsung': [
        { id: 'samsung1', platform: 'Amazon', price: 45999, delivery: 2, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/Samsung-Galaxy-S21-FE-5G/dp/B09V3QK8YF/', name: 'Samsung Galaxy S21 FE', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'samsung2', platform: 'Flipkart', price: 43999, delivery: 3, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/samsung-galaxy-s21-fe-5g-lavender-128-gb/p/itm8c9c5c5c5c5c5', name: 'Samsung Galaxy S21 FE', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imagfhu75eupxyft.jpeg' },
        { id: 'samsung3', platform: 'Samsung Store', price: 46999, delivery: 1, rating: 4.7, logo: '🛒', link: 'https://www.samsung.com/in/smartphones/galaxy-s21-fe-5g/', name: 'Samsung Galaxy S21 FE', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-g990elgdin/gallery/in-galaxy-s21-fe-5g-sm-g990elgdin-thumb-530968926' },
        { id: 'samsung4', platform: 'Amazon', price: 69999, delivery: 2, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Samsung-Galaxy-S23-Ultra/dp/B0BT7QK8YF/', name: 'Samsung Galaxy S23 Ultra', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'samsung5', platform: 'Flipkart', price: 67999, delivery: 3, rating: 4.5, logo: '🛒', link: 'https://www.flipkart.com/samsung-galaxy-s23-ultra-256-gb/p/itm8c9c5c5c5c5c5', name: 'Samsung Galaxy S23 Ultra', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imagfhu75eupxyft.jpeg' },
        { id: 'samsung6', platform: 'Samsung Store', price: 71999, delivery: 1, rating: 4.8, logo: '🛒', link: 'https://www.samsung.com/in/smartphones/galaxy-s23-ultra/', name: 'Samsung Galaxy S23 Ultra', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-s918bzgdin/gallery/in-galaxy-s23-ultra-sm-s918bzgdin-thumb-530968926' },
    ],
    'laptop': [
        { id: 'laptop1', platform: 'Amazon', price: 89999, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Dell-Inspiron-3511-15-6-inch-i5-1135G7/dp/B08N5WRWNW/', name: 'Dell Inspiron 15', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'laptop2', platform: 'Flipkart', price: 87999, delivery: 4, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/dell-inspiron-3511-core-i5-11th-gen-8-gb-512-gb-ssd-windows-10-home-15-6-inch-laptop/p/itm8c9c5c5c5c5c5', name: 'Dell Inspiron 15', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/computer/8/8/8/inspiron-3511-dell-original-imagfhu75eupxyft.jpeg' },
        { id: 'laptop3', platform: 'Dell Store', price: 91999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.dell.com/en-in/shop/laptops-2-in-1-pcs/inspiron-15-laptop/spd/inspiron-15-3511-laptop', name: 'Dell Inspiron 15', image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dellwww/products/laptops-and-2-in-1s/inspiron/15-3511/media-gallery/in3511t-xnb-lf-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402' },
        { id: 'laptop4', platform: 'Amazon', price: 129999, delivery: 3, rating: 4.7, logo: '🛒', link: 'https://www.amazon.in/Apple-MacBook-Air-13-inch-256GB/dp/B08N5WRWNW/', name: 'MacBook Air M1', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'laptop5', platform: 'Flipkart', price: 127999, delivery: 4, rating: 4.6, logo: '🛒', link: 'https://www.flipkart.com/apple-macbook-air-m1-8-gb-256-gb-ssd-mac-os-big-sur-mgn63hn-a/p/itm8c9c5c5c5c5c5', name: 'MacBook Air M1', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/computer/8/8/8/macbook-air-m1-apple-original-imagfhu75eupxyft.jpeg' },
        { id: 'laptop6', platform: 'Apple Store', price: 131999, delivery: 2, rating: 4.8, logo: '🛒', link: 'https://www.apple.com/in/macbook-air/', name: 'MacBook Air M1', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-space-gray-select-201810?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1633027804000' },
        { id: 'laptop7', platform: 'Amazon', price: 79999, delivery: 3, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/HP-Pavilion-15-6-inch-i5-1135G7/dp/B08N5WRWNW/', name: 'HP Pavilion 15', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'laptop8', platform: 'Flipkart', price: 77999, delivery: 4, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/hp-pavilion-15-core-i5-11th-gen-8-gb-512-gb-ssd-windows-10-home-15-6-inch-laptop/p/itm8c9c5c5c5c5c5', name: 'HP Pavilion 15', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/computer/8/8/8/pavilion-15-hp-original-imagfhu75eupxyft.jpeg' },
    ],
    'tv': [
        { id: 'tv1', platform: 'Amazon', price: 29999, delivery: 2, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/LG-55-inch-Ultra-Smart-55UQ7500PSF/dp/B09V3QK8YF/', name: 'LG 55" Smart TV', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'tv2', platform: 'Flipkart', price: 27999, delivery: 3, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/lg-55-inch-4k-ultra-hd-smart-led-tv-55uq7500psf/p/itm8c9c5c5c5c5c5', name: 'LG 55" Smart TV', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/television/l/g/l/lg-55-inch-4k-ultra-hd-smart-led-tv-55uq7500psf-original-imagfhu75eupxyft.jpeg' },
        { id: 'tv3', platform: 'Croma', price: 30999, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.croma.com/lg-55-inch-4k-ultra-hd-smart-led-tv-55uq7500psf-/p/241145', name: 'LG 55" Smart TV', image: 'https://www.croma.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/l/g/lg-55-inch-4k-ultra-hd-smart-led-tv-55uq7500psf-_1.png' },
        { id: 'tv4', platform: 'Amazon', price: 39999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Samsung-55-inch-Crystal-4K-UA55AUE65AKLXL/dp/B09V3QK8YF/', name: 'Samsung 55" Crystal 4K TV', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'tv5', platform: 'Flipkart', price: 37999, delivery: 3, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/samsung-55-inch-crystal-4k-ultra-hd-smart-led-tv-ua55aue65aklxl/p/itm8c9c5c5c5c5c5', name: 'Samsung 55" Crystal 4K TV', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/television/s/a/m/samsung-55-inch-crystal-4k-ultra-hd-smart-led-tv-ua55aue65aklxl-original-imagfhu75eupxyft.jpeg' },
        { id: 'tv6', platform: 'Samsung Store', price: 41999, delivery: 1, rating: 4.7, logo: '🛒', link: 'https://www.samsung.com/in/tvs/crystal-uhd-tv/', name: 'Samsung 55" Crystal 4K TV', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/ua55aue65aklxl/gallery/in-crystal-uhd-tv-ua55aue65aklxl-thumb-530968926' },
    ],
    'headphones': [
        { id: 'headphones1', platform: 'Amazon', price: 2499, delivery: 1, rating: 4.3, logo: '🛒', link: 'https://www.amazon.in/Sony-WH-1000XM4-Cancelling-Headphones-Bluetooth/dp/B0863TXGM3/', name: 'Sony WH-1000XM4', image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_UY218_.jpg' },
        { id: 'headphones2', platform: 'Flipkart', price: 2299, delivery: 2, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/sony-wh-1000xm4-wireless-noise-cancelling-headphones/p/itm8c9c5c5c5c5c5', name: 'Sony WH-1000XM4', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/headphone/s/o/n/sony-wh-1000xm4-original-imagfhu75eupxyft.jpeg' },
        { id: 'headphones3', platform: 'Croma', price: 2599, delivery: 1, rating: 4.4, logo: '🛒', link: 'https://www.croma.com/sony-wh-1000xm4-wireless-noise-cancelling-headphones/p/241145', name: 'Sony WH-1000XM4', image: 'https://www.croma.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/o/sony-wh-1000xm4_1.png' },
        { id: 'headphones4', platform: 'Amazon', price: 18999, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Apple-AirPods-Pro-2nd-Generation/dp/B0BDJ6ZMYM/', name: 'Apple AirPods Pro 2', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'headphones5', platform: 'Flipkart', price: 18799, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.flipkart.com/apple-airpods-pro-2nd-generation/p/itm8c9c5c5c5c5c5', name: 'Apple AirPods Pro 2', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/headphone/a/i/r/apple-airpods-pro-2nd-generation-original-imagfhu75eupxyft.jpeg' },
        { id: 'headphones6', platform: 'Apple Store', price: 19199, delivery: 1, rating: 4.7, logo: '🛒', link: 'https://www.apple.com/in/airpods-pro/', name: 'Apple AirPods Pro 2', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361' },
        { id: 'headphones7', platform: 'Amazon', price: 899, delivery: 1, rating: 4.2, logo: '🛒', link: 'https://www.amazon.in/boAt-Rockerz-450-Bluetooth-Headphones/dp/B01LSUQSB0/', name: 'boAt Rockerz 450', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'headphones8', platform: 'Flipkart', price: 799, delivery: 2, rating: 4.0, logo: '🛒', link: 'https://www.flipkart.com/boat-rockerz-450-bluetooth-headphones/p/itm8c9c5c5c5c5c5', name: 'boAt Rockerz 450', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/headphone/r/o/c/boat-rockerz-450-original-imagfhu75eupxyft.jpeg' },
    ],
    'camera': [
        { id: 'camera1', platform: 'Amazon', price: 89999, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Canon-EOS-R6-Mark-II-Mirrorless/dp/B0B7QK8YF/', name: 'Canon EOS R6 Mark II', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'camera2', platform: 'Flipkart', price: 87999, delivery: 4, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/canon-eos-r6-mark-ii-mirrorless-camera/p/itm8c9c5c5c5c5c5', name: 'Canon EOS R6 Mark II', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/camera/c/a/n/canon-eos-r6-mark-ii-original-imagfhu75eupxyft.jpeg' },
        { id: 'camera3', platform: 'Canon Store', price: 91999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.canon.in/cameras/eos-r6-mark-ii/', name: 'Canon EOS R6 Mark II', image: 'https://www.canon.in/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/c/a/canon-eos-r6-mark-ii_1.png' },
        { id: 'camera4', platform: 'Amazon', price: 129999, delivery: 3, rating: 4.7, logo: '🛒', link: 'https://www.amazon.in/Sony-A7-IV-Mirrorless-Camera/dp/B0B7QK8YF/', name: 'Sony A7 IV', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'camera5', platform: 'Flipkart', price: 127999, delivery: 4, rating: 4.6, logo: '🛒', link: 'https://www.flipkart.com/sony-a7-iv-mirrorless-camera/p/itm8c9c5c5c5c5c5', name: 'Sony A7 IV', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/camera/s/o/n/sony-a7-iv-original-imagfhu75eupxyft.jpeg' },
        { id: 'camera6', platform: 'Sony Store', price: 131999, delivery: 2, rating: 4.8, logo: '🛒', link: 'https://www.sony.in/electronics/interchangeable-lens-cameras/ilce-7m4', name: 'Sony A7 IV', image: 'https://www.sony.in/image/5d02da5df552836db89418f5c5c5c5c5?fmt=png-alpha&wid=720&hei=720' },
    ],
    'tablet': [
        { id: 'tablet1', platform: 'Amazon', price: 39999, delivery: 2, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/Apple-iPad-Air-10-9-inch-Wi-Fi/dp/B08J6FLLZ8/', name: 'iPad Air 10.9"', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'tablet2', platform: 'Flipkart', price: 37999, delivery: 3, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/apple-ipad-air-10-9-inch-wi-fi-64-gb/p/itm8c9c5c5c5c5c5', name: 'iPad Air 10.9"', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/tablet/i/p/a/apple-ipad-air-10-9-inch-original-imagfhu75eupxyft.jpeg' },
        { id: 'tablet3', platform: 'Apple Store', price: 41999, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.apple.com/in/ipad-air/', name: 'iPad Air 10.9"', image: 'https://www.apple.com/in/ipad-air/images/overview/hero/hero_ipad_air__d1tfa5zby7e6_large.png' },
        { id: 'tablet4', platform: 'Amazon', price: 29999, delivery: 2, rating: 4.3, logo: '🛒', link: 'https://www.amazon.in/Samsung-Galaxy-Tab-S8-Wi-Fi/dp/B08J6FLLZ8/', name: 'Samsung Galaxy Tab S8', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'tablet5', platform: 'Flipkart', price: 27999, delivery: 3, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/samsung-galaxy-tab-s8-wi-fi-128-gb/p/itm8c9c5c5c5c5c5', name: 'Samsung Galaxy Tab S8', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/tablet/s/a/m/samsung-galaxy-tab-s8-original-imagfhu75eupxyft.jpeg' },
        { id: 'tablet6', platform: 'Samsung Store', price: 31999, delivery: 1, rating: 4.5, logo: '🛒', link: 'https://www.samsung.com/in/tablets/galaxy-tab-s8/', name: 'Samsung Galaxy Tab S8', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-x700nzaain/gallery/in-galaxy-tab-s8-sm-x700nzaain-thumb-530968926' },
    ],
    'smartwatch': [
        { id: 'watch1', platform: 'Amazon', price: 39999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Apple-Watch-Series-8-GPS/dp/B0BDJ6ZMYM/', name: 'Apple Watch Series 8', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'watch2', platform: 'Flipkart', price: 37999, delivery: 3, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/apple-watch-series-8-gps-41mm/p/itm8c9c5c5c5c5c5', name: 'Apple Watch Series 8', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/smartwatch/a/p/p/apple-watch-series-8-original-imagfhu75eupxyft.jpeg' },
        { id: 'watch3', platform: 'Apple Store', price: 41999, delivery: 1, rating: 4.7, logo: '🛒', link: 'https://www.apple.com/in/apple-watch-series-8/', name: 'Apple Watch Series 8', image: 'https://www.apple.com/in/apple-watch-series-8/images/overview/hero/hero_apple_watch_series_8__d1tfa5zby7e6_large.png' },
        { id: 'watch4', platform: 'Amazon', price: 29999, delivery: 2, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/Samsung-Galaxy-Watch-5-Bluetooth/dp/B0BDJ6ZMYM/', name: 'Samsung Galaxy Watch 5', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'watch5', platform: 'Flipkart', price: 27999, delivery: 3, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/samsung-galaxy-watch-5-bluetooth-44mm/p/itm8c9c5c5c5c5c5', name: 'Samsung Galaxy Watch 5', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/smartwatch/s/a/m/samsung-galaxy-watch-5-original-imagfhu75eupxyft.jpeg' },
        { id: 'watch6', platform: 'Samsung Store', price: 31999, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.samsung.com/in/watches/galaxy-watch5/', name: 'Samsung Galaxy Watch 5', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-r910nzaain/gallery/in-galaxy-watch5-sm-r910nzaain-thumb-530968926' },
    ],
    'gaming': [
        { id: 'gaming1', platform: 'Amazon', price: 49999, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/PlayStation-5-Console/dp/B08FC5L3RG/', name: 'PlayStation 5 Console', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'gaming2', platform: 'Flipkart', price: 47999, delivery: 4, rating: 4.4, logo: '🛒', link: 'https://www.flipkart.com/playstation-5-console/p/itm8c9c5c5c5c5c5', name: 'PlayStation 5 Console', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/gaming-console/p/l/s/playstation-5-console-original-imagfhu75eupxyft.jpeg' },
        { id: 'gaming3', platform: 'Sony Store', price: 51999, delivery: 2, rating: 4.7, logo: '🛒', link: 'https://www.sony.in/electronics/playstation-5', name: 'PlayStation 5 Console', image: 'https://www.sony.in/medias/playstation-5-console-1.jpg' },
        { id: 'gaming4', platform: 'Amazon', price: 39999, delivery: 3, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Xbox-Series-X-1TB-Console/dp/B08FC5L3RG/', name: 'Xbox Series X', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'gaming5', platform: 'Flipkart', price: 37999, delivery: 4, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/xbox-series-x-1tb-console/p/itm8c9c5c5c5c5c5', name: 'Xbox Series X', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/gaming-console/x/b/x/xbox-series-x-original-imagfhu75eupxyft.jpeg' },
        { id: 'gaming6', platform: 'Microsoft Store', price: 41999, delivery: 2, rating: 4.6, logo: '🛒', link: 'https://www.microsoft.com/en-in/d/xbox-series-x/8wj714n2rktl', name: 'Xbox Series X', image: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4XwkE' },
    ],
    'speaker': [
        { id: 'speaker1', platform: 'Amazon', price: 8999, delivery: 2, rating: 4.3, logo: '🛒', link: 'https://www.amazon.in/JBL-Boombox-2-Portable-Bluetooth-Speaker/dp/B07V4R3N9F/', name: 'JBL Boombox 2', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'speaker2', platform: 'Flipkart', price: 8799, delivery: 3, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/jbl-boombox-2-portable-bluetooth-speaker/p/itm8c9c5c5c5c5c5', name: 'JBL Boombox 2', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/speaker/j/b/l/jbl-boombox-2-original-imagfhu75eupxyft.jpeg' },
        { id: 'speaker3', platform: 'JBL Store', price: 9199, delivery: 1, rating: 4.5, logo: '🛒', link: 'https://www.jbl.com/portable-speakers/BOOMBOX2.html', name: 'JBL Boombox 2', image: 'https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1a0c1e6a/images/J/BOOMBOX2_Product%20Image_Hero_001_x2.png' },
        { id: 'speaker4', platform: 'Amazon', price: 19999, delivery: 2, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Sony-SRS-XB43-Portable-Bluetooth-Speaker/dp/B07V4R3N9F/', name: 'Sony SRS-XB43', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'speaker5', platform: 'Flipkart', price: 19799, delivery: 3, rating: 4.4, logo: '🛒', link: 'https://www.flipkart.com/sony-srs-xb43-portable-bluetooth-speaker/p/itm8c9c5c5c5c5c5', name: 'Sony SRS-XB43', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/speaker/s/o/n/sony-srs-xb43-original-imagfhu75eupxyft.jpeg' },
        { id: 'speaker6', platform: 'Sony Store', price: 20199, delivery: 1, rating: 4.7, logo: '🛒', link: 'https://www.sony.in/audio/speakers/srs-xb43', name: 'Sony SRS-XB43', image: 'https://www.sony.in/image/5d02da5df552836db89418f5c5c5c5c5?fmt=png-alpha&wid=720&hei=720' },
    ],
    'accessories': [
        { id: 'acc1', platform: 'Amazon', price: 1499, delivery: 1, rating: 4.2, logo: '🛒', link: 'https://www.amazon.in/Anker-PowerCore-10000mAh-Portable-Charger/dp/B01MZAX6W8/', name: 'Anker PowerCore 10000mAh', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'acc2', platform: 'Flipkart', price: 1399, delivery: 2, rating: 4.0, logo: '🛒', link: 'https://www.flipkart.com/anker-powercore-10000mah-portable-charger/p/itm8c9c5c5c5c5c5', name: 'Anker PowerCore 10000mAh', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/power-bank/a/n/k/anker-powercore-10000mah-original-imagfhu75eupxyft.jpeg' },
        { id: 'acc3', platform: 'Amazon', price: 2999, delivery: 1, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/Logitech-MX-Master-Wireless-Mouse/dp/B00TZR3WRM/', name: 'Logitech MX Master 3', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'acc4', platform: 'Flipkart', price: 2799, delivery: 2, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/logitech-mx-master-3-wireless-mouse/p/itm8c9c5c5c5c5c5', name: 'Logitech MX Master 3', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/mouse/l/o/g/logitech-mx-master-3-original-imagfhu75eupxyft.jpeg' },
        { id: 'acc5', platform: 'Amazon', price: 1999, delivery: 1, rating: 4.3, logo: '🛒', link: 'https://www.amazon.in/Apple-Magic-Keyboard-Wireless-Rechargable/dp/B01MZAX6W8/', name: 'Apple Magic Keyboard', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'acc6', platform: 'Flipkart', price: 1899, delivery: 2, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/apple-magic-keyboard-wireless-rechargable/p/itm8c9c5c5c5c5c5', name: 'Apple Magic Keyboard', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/keyboard/a/p/p/apple-magic-keyboard-original-imagfhu75eupxyft.jpeg' },
    ],
    'fitness': [
        { id: 'fit1', platform: 'Amazon', price: 39999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Peloton-Bike-Plus-Exercise/dp/B08FC5L3RG/', name: 'Peloton Bike+', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'fit2', platform: 'Flipkart', price: 37999, delivery: 3, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/peloton-bike-plus-exercise-bike/p/itm8c9c5c5c5c5c5', name: 'Peloton Bike+', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/exercise-bike/p/e/l/peloton-bike-plus-original-imagfhu75eupxyft.jpeg' },
        { id: 'fit3', platform: 'Amazon', price: 19999, delivery: 2, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/Mirror-Interactive-Fitness-Display/dp/B08FC5L3RG/', name: 'Mirror Interactive Fitness', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'fit4', platform: 'Flipkart', price: 18799, delivery: 3, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/mirror-interactive-fitness-display/p/itm8c9c5c5c5c5c5', name: 'Mirror Interactive Fitness', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/fitness-equipment/m/i/r/mirror-interactive-fitness-original-imagfhu75eupxyft.jpeg' },
    ]
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        console.log('🔍 Searching for:', query);

        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('📱 Demo mode: Using sample data');
            
            // Always return ALL products for comparison
            const allProducts = Object.values(sampleResults).flat();
            
            console.log(`📱 Returning ALL ${allProducts.length} products for comparison`);
            return res.json(allProducts);
        }

        // Real MongoDB search
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.json(products);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    searchProducts
};

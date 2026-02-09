// server/controllers/productController.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { scrapeFlipkart, scrapeAmazon, getBestDeal } = require('../utils/scrapeHelpers');

// Sample results for demo mode when scraping returns empty or MongoDB is not connected
const sampleResults = {
    'iphone': [
        { id: 'iphone1', platform: 'Amazon', price: 52999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.com/Apple-iPhone-13-128GB-Midnight/dp/B09LNW3CY2/ref=sr_1_1?crid=3JOZQWBKH7QQ9&dib=eyJ2IjoiMSJ9.J7watNo42r8f2OldjXl0Ioy6Sq-kzyLs75MnnaiC35sBSa4iBsZtM4oCr4JfB4btKvDTG-mnvB1CxD3GJDtE_ALl2IXHO6ZgoUAUEcBM1BUr0yneAiIVXxYMPAN-dFKuBccZMRpo7BTdiVj1uX9Eh0Btn1e-xMXzh98ODTSDL67cPFltuOyDULnmLdyymuEEdtrdUOIdHFqLY-cCW0J8NgNgmydwgmFhyNsMcomvkBE.wXhEu8Elj6G8jtAdTEeyWjnl6FBIack0bDhw7k3b1J4&dib_tag=se&keywords=i%2Bphone%2B13&qid=1763702639&sprefix=%2Caps%2C258&sr=8-1&th=1', name: 'iPhone 13 128GB', image: 'https://m.media-amazon.com/images/I/71GLMJ7TQiL._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'iphone2', platform: 'Flipkart', price: 41999, delivery: 3, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/apple-iphone-13-blue-128-gb/p/itm6e30c6ee045d2', name: 'iPhone 13 128GB', image: 'https://d1eh9yux7w8iql.cloudfront.net/product_images/512310_8dff631d-c28c-4e85-af59-7cb9c3439ffa.jpg' },
        { id: 'iphone3', platform: 'Croma', price: 51999, delivery: 4, rating: 4.2, logo: '🛒', link: 'https://www.croma.com/apple-iphone-15-128gb-blue-/p/316879', name: 'iPhone 13 128GB', image: 'https://media.croma.com/image/upload/v1662443349/Croma%20Assets/Communication/Mobiles/Images/243463_0_onc1ut.png' },
        { id: 'iphone4', platform: 'Apple Store', price: 59900, delivery: 1, rating: 4.8, logo: '🛒', link: 'https://www.apple.com/in/iphone-13/', name: 'iPhone 13 128GB', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-blue-select-2021?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1645572388068' },
        { id: 'iphone5', platform: 'Amazon', price: 69999, delivery: 2, rating: 4.7, logo: '🛒', link: 'https://www.amazon.in/Apple-iPhone-14-128GB-Blue/dp/B0BDJ6ZMYM/', name: 'iPhone 14 128GB', image: 'https://m.media-amazon.com/images/I/61cKjmcMHL._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'iphone6', platform: 'Flipkart', price: 46999, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.flipkart.com/apple-iphone-14-starlight-128-gb/p/itm3485a56f6e676?pid=MOBGHWFHABH3G73H&lid=LSTMOBGHWFHABH3G73HHJP0CG&marketplace=FLIPKART&q=i+phone+14&store=tyy%2F4io&srno=s_1_1&otracker=AS_Query_OrganicAutoSuggest_3_9_na_na_ps&otracker1=AS_Query_OrganicAutoSuggest_3_9_na_na_ps&fm=search-autosuggest&iid=c790c30a-9df4-416a-ad83-dd42a020008a.MOBGHWFHABH3G73H.SEARCH&ppt=sp&ppn=sp&ssid=8lu4sfhkqo0000001763702812954&qH=f98a4cf733a9a474', name: 'iPhone 14 128GB', image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/mobile/k/v/8/-original-imaghxemc3wbxgcy.jpeg' },
        { id: 'iphone7', platform: 'Amazon', price: 127999, delivery: 2, rating: 4.8, logo: '🛒', link: 'https://www.amazon.in/Apple-iPhone-15-Pro-128GB-Natural-Titanium/dp/B0CHX1W1XY/', name: 'iPhone 15 Pro 128GB', image: 'https://m.media-amazon.com/images/I/81CgtJni5VL._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'iphone8', platform: 'Flipkart', price: 124999, delivery: 3, rating: 4.7, logo: '🛒', link: 'https://www.flipkart.com/apple-iphone-15-pro-natural-titanium-128-gb/p/itm8c9c5c5c5c5c5', name: 'iPhone 15 Pro 128GB', image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/mobile/5/h/8/-original-imagtc3kfbxqs9nq.jpeg' },
    ],
    'samsung': [
        { id: 'samsung1', platform: 'Amazon', price: 74999, delivery: 2, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Samsung-Galaxy-S23-5G-Phantom/dp/B0BYHZB7VW/', name: 'Samsung Galaxy S23 5G', image: 'https://m.media-amazon.com/images/I/71L8Y-oO6TL._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'samsung2', platform: 'Flipkart', price: 72999, delivery: 3, rating: 4.4, logo: '🛒', link: 'https://www.flipkart.com/samsung-galaxy-s23-phantom-black-128-gb/p/itm4c0f6c6c6c6c6', name: 'Samsung Galaxy S23 5G', image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/mobile/y/j/5/-original-imagmg6gz3bdsyhv.jpeg' },
        { id: 'samsung3', platform: 'Samsung Store', price: 79999, delivery: 1, rating: 4.8, logo: '🛒', link: 'https://www.samsung.com/in/smartphones/galaxy-s23/', name: 'Samsung Galaxy S23 5G', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/2202/gallery/in-galaxy-s23-s911-sm-s911bzgcins-534977426' },
        { id: 'samsung4', platform: 'Amazon', price: 50599, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Samsung-Galaxy-S21-FE-5G/dp/B09QH6DW1K/', name: 'Samsung Galaxy S21 FE 5G', image: 'https://m.media-amazon.com/images/I/71jGEnOqWVL._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'samsung5', platform: 'Flipkart', price: 47999, delivery: 3, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/samsung-galaxy-s21-fe-5g-olive-128-gb/p/itm5e8e8e8e8e8e8', name: 'Samsung Galaxy S21 FE 5G', image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/mobile/z/i/7/-original-imagbzxyycdxqy8h.jpeg' },
        { id: 'samsung6', platform: 'Amazon', price: 54999, delivery: 2, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Samsung-Galaxy-S22-5G-Phantom/dp/B09V3QK8YF/', name: 'Samsung Galaxy S22 5G', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'samsung7', platform: 'Flipkart', price: 52999, delivery: 3, rating: 4.4, logo: '🛒', link: 'https://www.flipkart.com/samsung-galaxy-s22-phantom-black-128-gb/p/itm8c9c5c5c5c5c5', name: 'Samsung Galaxy S22 5G', image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/mobile/s/a/m/samsung-galaxy-s22-original-imagfhu75eupxyft.jpeg' },
        { id: 'samsung8', platform: 'Croma', price: 18999, delivery: 4, rating: 4.1, logo: '🛒', link: 'https://www.croma.com/samsung-galaxy-m54-5g-128gb-silver/p/243569', name: 'Samsung Galaxy M54 5G', image: 'https://media.croma.com/image/upload/v1662443349/Croma%20Assets/Communication/Mobiles/Images/243569_0_onc1ut.png' },
    ],
    'laptop': [
        { id: 'laptop1', platform: 'Amazon', price: 58990, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Dell-Inspiron-3511-15-6-inch-i5-1135G7/dp/B08N5WRWNW/', name: 'Dell Inspiron 15 (i5/8GB/512GB SSD)', image: 'https://m.media-amazon.com/images/I/61QGMX+LeVL._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'laptop2', platform: 'Flipkart', price: 57990, delivery: 4, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/dell-inspiron-3511-core-i5-11th-gen-8-gb-512-gb-ssd-windows-11-home-15-6-inch-laptop/p/itm8c9c5c5c5c5c5', name: 'Dell Inspiron 15 (i5/8GB/512GB SSD)', image: 'https://rukminim1.flixcart.com/image/612/612/l5jxt3k0/computer/y/x/c/inspiron-15-3511-laptop-dell-original-imagg7v3rgecqzwy.jpeg' },
        { id: 'laptop3', platform: 'HP Store', price: 62990, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.hp.com/in-en/shop/laptops-tablets/hp-pavilion-laptop-15-eh2009tu.html', name: 'HP Pavilion 15 (Ryzen 5/8GB/512GB SSD)', image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3511/media-gallery/notebook-inspiron-15-3511-ppdg-campaign-hero-504x350.jpg' },
        { id: 'laptop4', platform: 'Amazon', price: 94990, delivery: 3, rating: 4.7, logo: '🛒', link: 'https://www.amazon.in/Apple-MacBook-Air-13-inch-256GB/dp/B08N5WRWNW/', name: 'MacBook Air M1 (8GB/256GB)', image: 'https://m.media-amazon.com/images/I/71vFKBpC+YL._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'laptop5', platform: 'Flipkart', price: 92990, delivery: 4, rating: 4.6, logo: '🛒', link: 'https://www.flipkart.com/apple-macbook-air-m1-8-gb-256-gb-ssd-mac-os-big-sur-mgn63hn-a/p/itm8c9c5c5c5c5c5', name: 'MacBook Air M1 (8GB/256GB)', image: 'https://rukminim1.flixcart.com/image/612/612/kg8avm80/computer/f/3/n/apple-original-imafwge7gbhwfevf.jpeg' },
        { id: 'laptop6', platform: 'Lenovo', price: 52990, delivery: 3, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/Lenovo-IdeaPad-3-15-6-inch-Laptop/dp/B08N5WRWNW/', name: 'Lenovo IdeaPad 3 (Ryzen 5/8GB/512GB SSD)', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'laptop7', platform: 'Flipkart', price: 51990, delivery: 4, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/lenovo-ideapad-3-ryzen-5-5500u-8-gb-512-gb-ssd-windows-11-home-15-6-inch-laptop/p/itm8c9c5c5c5c5c5', name: 'Lenovo IdeaPad 3 (Ryzen 5/8GB/512GB SSD)', image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/computer/8/8/8/ideapad-3-lenovo-original-imagfhu75eupxyft.jpeg' },
        { id: 'laptop8', platform: 'Amazon', price: 44990, delivery: 3, rating: 4.1, logo: '🛒', link: 'https://www.amazon.in/ASUS-VivoBook-15-15-6-inch-Laptop/dp/B08N5WRWNW/', name: 'ASUS VivoBook 15 (i3/8GB/512GB SSD)', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
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
        { id: 'speaker2', platform: 'Flipkart', price: 8799, delivery: 3, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/jbl-boombox-2-portable-bluetooth-speaker/p/itm8c9c5c5c5c5c5', name: 'JBL Boombox 2', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/speaker/h/p/k/jbl-boombox-2-original-imagfhu75eupxyft.jpeg' },
        { id: 'speaker3', platform: 'JBL Store', price: 9199, delivery: 1, rating: 4.4, logo: '🛒', link: 'https://www.jbl.com/portable-speakers/boombox-2/', name: 'JBL Boombox 2', image: 'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw5c9c5c5c5c5c5c5/JBL_Boombox_2_Hero_1.png' },
        { id: 'speaker4', platform: 'Amazon', price: 14999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Bose-SoundLink-Revolve-Bluetooth-Speaker/dp/B07V4R3N9F/', name: 'Bose SoundLink Revolve', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
        { id: 'speaker5', platform: 'Flipkart', price: 14799, delivery: 3, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/bose-soundlink-revolve-bluetooth-speaker/p/itm8c9c5c5c5c5c5', name: 'Bose SoundLink Revolve', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/speaker/r/e/v/bose-soundlink-revolve-original-imagfhu75eupxyft.jpeg' },
        { id: 'speaker6', platform: 'Bose Store', price: 15199, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.bose.com/speakers/portable-speakers/soundlink-revolve/', name: 'Bose SoundLink Revolve', image: 'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/speakers/soundlink_revolve/product_page/product_page_hero/SoundLink_Revolve_Hero.png' },
    ],
};

// Search products from MongoDB
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, return sample data
      const key = query.toLowerCase();
      const results = sampleResults[key] || sampleResults.iphone || [];
      const bestDeal = getBestDeal(results);
      return res.json({ query, results, bestDeal });
    }

    // Search in MongoDB
    const regex = new RegExp(query, 'i');
    const products = await Product.find({ name: regex }).limit(20);

    if (products.length === 0) {
      // No products found, return sample data
      const key = query.toLowerCase();
      const results = sampleResults[key] || sampleResults.iphone || [];
      const bestDeal = getBestDeal(results);
      return res.json({ query, results, bestDeal });
    }

    const results = products.map(product => ({
      id: product._id.toString(),
      platform: product.platform,
      price: product.price,
      delivery: product.delivery,
      rating: product.rating,
      logo: '🛒',
      link: product.link,
      name: product.name,
      image: product.image
    }));

    const bestDeal = getBestDeal(results);
    res.json({ query, results, bestDeal });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

// Scrape products in real-time from Flipkart & Amazon
const scrapeProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log(`Scraping live data for: ${query}`);

    // Run scrapers concurrently
    const [flipkartResults, amazonResults] = await Promise.all([
      scrapeFlipkart(query),
      scrapeAmazon(query),
    ]);

    // Merge and normalize results
    const results = [...flipkartResults, ...amazonResults].filter(p => p && p.name && p.price > 0);

    // Fallback to demo data if scraping returns nothing
    if (results.length === 0) {
      const key = query.toLowerCase();
      const allProducts = Object.values(sampleResults).flat();
      const fallback = sampleResults[key] || allProducts.slice(0, 12);
      const bestDeal = getBestDeal(fallback);
      return res.json({ query, results: fallback, bestDeal, source: 'mock' });
    }

    const bestDeal = getBestDeal(results);
    return res.json({
      query,
      results,
      bestDeal,
      source: 'scraped',
      counts: { flipkart: flipkartResults.length, amazon: amazonResults.length },
    });
  } catch (err) {
    console.error('Scraping error:', err.message);
    return res.status(500).json({ error: 'Scraping failed', details: err.message });
  }
};

module.exports = {
  searchProducts,
  scrapeProducts,
};

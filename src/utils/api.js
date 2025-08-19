const GEMINI_API_KEY = "AIzaSyCmMU-J-APus5yknEN5_hSisOIxg3OBrgw"; // Gemini API Key

export const callGeminiAPI = async (prompt) => {
    try {
        // Call backend Gemini API endpoint
        const response = await fetch('http://localhost:5000/api/ai/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`API error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            return result.response;
        } else {
            throw new Error(result.error || 'Failed to get AI response');
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        
        // Fallback to mock responses when API is not available
        const mockResponses = {
            'iphone': {
                summary: `**Pros:**
• Excellent camera quality with advanced features
• Powerful A15 Bionic chip for smooth performance
• Premium build quality and design
• Great battery life for daily use
• iOS ecosystem integration

**Cons:**
• No 120Hz refresh rate (only 60Hz)
• No USB-C port (still uses Lightning)
• Higher price compared to Android alternatives
• Limited customization options`,
                guide: `**Key Features to Consider:**

**1. Camera System**
The iPhone 13 features a dual-camera setup with advanced computational photography. Perfect for photography enthusiasts.

**2. Performance**
Powered by A15 Bionic chip, offering excellent performance for gaming, multitasking, and productivity tasks.

**3. Battery Life**
All-day battery life with optimized power management for heavy usage.

**4. Storage Options**
Available in 128GB, 256GB, and 512GB variants. Choose based on your media and app storage needs.`
            },
            'samsung': {
                summary: `**Pros:**
• Excellent 5G connectivity and performance
• Versatile camera system with multiple modes
• Premium design with IP68 water resistance
• Long battery life with fast charging
• One UI offers great customization

**Cons:**
• No expandable storage
• Some bloatware pre-installed
• Camera processing can be inconsistent
• Higher price point for flagship features`,
                guide: `**Key Features to Consider:**

**1. 5G Performance**
Samsung Galaxy S21 FE offers excellent 5G connectivity for future-proof usage.

**2. Camera Versatility**
Triple camera setup with 8K video recording and various shooting modes.

**3. Display Quality**
6.4-inch Dynamic AMOLED display with 120Hz refresh rate for smooth visuals.

**4. Battery & Charging**
4500mAh battery with 25W fast charging and 15W wireless charging.`
            },
            'laptop': {
                summary: `**Pros:**
• Reliable performance for daily tasks
• Good build quality and durability
• Windows 11 compatibility
• Decent battery life
• Affordable price point

**Cons:**
• Limited gaming capabilities
• Average display quality
• Bulky design compared to ultrabooks
• Limited upgrade options`,
                guide: `**Key Features to Consider:**

**1. Processor Performance**
Intel Core i5 processor provides good performance for office work, web browsing, and light multitasking.

**2. Storage & Memory**
8GB RAM with 512GB SSD offers decent speed and storage for most users.

**3. Display Quality**
15.6-inch display suitable for productivity tasks and entertainment.

**4. Portability**
Consider weight and battery life if you need to carry it frequently.`
            },
            'tv': {
                summary: `**Pros:**
• Excellent 4K picture quality
• Smart TV features with webOS
• Good sound quality
• Multiple connectivity options
• Energy efficient

**Cons:**
• Limited app selection compared to Android TV
• Remote control could be better
• Some features require internet connection
• Higher price than budget alternatives`,
                guide: `**Key Features to Consider:**

**1. Picture Quality**
4K Ultra HD resolution with HDR support for stunning visual experience.

**2. Smart Features**
webOS platform provides access to popular streaming apps and smart home integration.

**3. Audio Quality**
Built-in speakers with AI Sound technology for immersive audio experience.

**4. Connectivity**
Multiple HDMI ports, USB, and wireless connectivity options for various devices.`
            },
            'headphones': {
                summary: `**Pros:**
• Industry-leading noise cancellation
• Exceptional sound quality
• Long battery life (30+ hours)
• Comfortable for extended wear
• Premium build quality

**Cons:**
• High price point
• Bulky design for travel
• No water resistance
• Limited color options`,
                guide: `**Key Features to Consider:**

**1. Noise Cancellation**
Advanced ANC technology blocks ambient noise for immersive listening.

**2. Sound Quality**
High-resolution audio with balanced bass, mids, and treble.

**3. Battery Life**
30+ hours of playback with quick charging capability.

**4. Comfort & Design**
Lightweight design with soft ear cushions for extended comfort.`
            },
            'camera': {
                summary: `**Pros:**
• Professional-grade image quality
• Fast autofocus system
• Excellent low-light performance
• 4K video recording
• Weather-sealed body

**Cons:**
• Expensive investment
• Steep learning curve
• Requires additional lenses
• Heavy and bulky`,
                guide: `**Key Features to Consider:**

**1. Sensor & Image Quality**
Full-frame sensor delivers exceptional image quality and dynamic range.

**2. Autofocus System**
Advanced AF with eye-tracking for sharp, accurate focus.

**3. Video Capabilities**
4K video recording with professional features and stabilization.

**4. Build Quality**
Weather-sealed magnesium alloy body for durability in various conditions.`
            },
            'tablet': {
                summary: `**Pros:**
• Powerful M1 chip performance
• Beautiful Liquid Retina display
• All-day battery life
• Premium build quality
• Excellent app ecosystem

**Cons:**
• No expandable storage
• Limited file management
• Higher price than Android alternatives
• No headphone jack`,
                guide: `**Key Features to Consider:**

**1. Performance**
M1 chip provides desktop-class performance for productivity and creativity.

**2. Display Quality**
10.9-inch Liquid Retina display with True Tone technology.

**3. Battery Life**
All-day battery life for work, entertainment, and creativity.

**4. Versatility**
Perfect for note-taking, drawing, video editing, and entertainment.`
            },
            'smartwatch': {
                summary: `**Pros:**
• Advanced health monitoring
• Seamless iOS integration
• Premium design and build
• Extensive app ecosystem
• Excellent battery life

**Cons:**
• Expensive compared to alternatives
• Limited Android compatibility
• Requires iPhone for setup
• Annual hardware updates`,
                guide: `**Key Features to Consider:**

**1. Health Monitoring**
Advanced sensors for heart rate, ECG, blood oxygen, and fitness tracking.

**2. Design & Comfort**
Premium materials with customizable bands and watch faces.

**3. Performance**
Fast processor with smooth animations and responsive interface.

**4. Battery Life**
18+ hours of battery life with optimized power management.`
            },
            'gaming': {
                summary: `**Pros:**
• Next-gen gaming performance
• 4K gaming capabilities
• Fast loading with SSD
• DualSense controller innovation
• Backward compatibility

**Cons:**
• Limited game library initially
• Expensive compared to PC
• Large physical size
• Limited customization options`,
                guide: `**Key Features to Consider:**

**1. Performance**
Custom AMD Zen 2 processor with RDNA 2 graphics for stunning visuals.

**2. Storage & Loading**
Ultra-fast SSD reduces loading times and enables instant game switching.

**3. Controller Innovation**
DualSense controller with haptic feedback and adaptive triggers.

**4. Gaming Experience**
4K gaming at 60fps with ray tracing support for immersive gameplay.`
            },
            'speaker': {
                summary: `**Pros:**
• Powerful, room-filling sound
• Long battery life (24 hours)
• Waterproof and durable
• PartyBoost for multi-speaker setup
• Premium build quality

**Cons:**
• Large and heavy
• Expensive price point
• Limited portability
• No voice assistant integration`,
                guide: `**Key Features to Consider:**

**1. Sound Quality**
Four active transducers and two JBL bass radiators for powerful audio.

**2. Battery Life**
24 hours of playtime for extended listening sessions.

**3. Durability**
IPX7 waterproof rating and rugged design for outdoor use.

**4. Connectivity**
Bluetooth 5.1 with PartyBoost for connecting multiple speakers.`
            }
        };

        // Determine product type from prompt
        const promptLower = prompt.toLowerCase();
        let productType = 'iphone';
        
        if (promptLower.includes('samsung') || promptLower.includes('galaxy')) {
            productType = 'samsung';
        } else if (promptLower.includes('laptop') || promptLower.includes('dell') || promptLower.includes('computer')) {
            productType = 'laptop';
        } else if (promptLower.includes('tv') || promptLower.includes('television')) {
            productType = 'tv';
        } else if (promptLower.includes('headphone') || promptLower.includes('earphone') || promptLower.includes('sony')) {
            productType = 'headphones';
        } else if (promptLower.includes('camera') || promptLower.includes('canon') || promptLower.includes('mirrorless')) {
            productType = 'camera';
        } else if (promptLower.includes('tablet') || promptLower.includes('ipad')) {
            productType = 'tablet';
        } else if (promptLower.includes('watch') || promptLower.includes('smartwatch')) {
            productType = 'smartwatch';
        } else if (promptLower.includes('gaming') || promptLower.includes('playstation') || promptLower.includes('ps5')) {
            productType = 'gaming';
        } else if (promptLower.includes('speaker') || promptLower.includes('jbl') || promptLower.includes('bluetooth')) {
            productType = 'speaker';
        }

        const mockData = mockResponses[productType];
        
        if (promptLower.includes('summary')) {
            return mockData.summary;
        } else if (promptLower.includes('guide')) {
            return mockData.guide;
        } else {
            return mockData.summary;
        }
    }
};

// Mock authentication for demo mode
export const mockAuth = async (username, password, isLogin = true) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!username || !password) {
        throw new Error('Username and password are required');
    }
    
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }
    
    const token = 'demo_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    return {
        token,
        username: username.trim()
    };
};

export const searchProductsAPI = async (query) => {
    try {
        const response = await fetch(`http://localhost:5000/api/products/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch products:", error);
        // Return demo data when backend is not available
        const demoData = {
            'iphone': [
                { id: 'iphone1', platform: 'Amazon', price: 59999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Apple-iPhone-13-128GB-Pink/dp/B09G9HD6PD/', name: 'iPhone 13 128GB', image: 'https://m.media-amazon.com/images/I/71GLMJ7TQiL._AC_UY218_.jpg' },
                { id: 'iphone2', platform: 'Flipkart', price: 57999, delivery: 3, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/apple-iphone-13-pink-128-gb/p/itm6e30c6ee045d2', name: 'iPhone 13 128GB', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imagfhu75eupxyft.jpeg' },
                { id: 'iphone3', platform: 'Reliance Digital', price: 60999, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.reliancedigital.in/apple-iphone-13-128gb-pink/p/491997555', name: 'iPhone 13 128GB', image: 'https://www.reliancedigital.in/medias/Apple-iPhone-13-128GB-Pink-491997555-1.jpg' },
                { id: 'iphone4', platform: 'Croma', price: 58999, delivery: 4, rating: 4.2, logo: '🛒', link: 'https://www.croma.com/apple-iphone-13-128gb-pink/p/241145', name: 'iPhone 13 128GB', image: 'https://www.croma.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/a/p/apple-iphone-13-128gb-pink_1.png' },
            ],
            'samsung': [
                { id: 'samsung1', platform: 'Amazon', price: 45999, delivery: 2, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/Samsung-Galaxy-S21-FE-5G/dp/B09V3QK8YF/', name: 'Samsung Galaxy S21 FE', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
                { id: 'samsung2', platform: 'Flipkart', price: 43999, delivery: 3, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/samsung-galaxy-s21-fe-5g-lavender-128-gb/p/itm8c9c5c5c5c5c5', name: 'Samsung Galaxy S21 FE', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imagfhu75eupxyft.jpeg' },
                { id: 'samsung3', platform: 'Samsung Store', price: 46999, delivery: 1, rating: 4.7, logo: '🛒', link: 'https://www.samsung.com/in/smartphones/galaxy-s21-fe-5g/', name: 'Samsung Galaxy S21 FE', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-g990elgdin/gallery/in-galaxy-s21-fe-5g-sm-g990elgdin-thumb-530968926' },
            ],
            'laptop': [
                { id: 'laptop1', platform: 'Amazon', price: 89999, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Dell-Inspiron-3511-15-6-inch-i5-1135G7/dp/B08N5WRWNW/', name: 'Dell Inspiron 15', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
                { id: 'laptop2', platform: 'Flipkart', price: 87999, delivery: 4, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/dell-inspiron-3511-core-i5-11th-gen-8-gb-512-gb-ssd-windows-10-home-15-6-inch-laptop/p/itm8c9c5c5c5c5c5', name: 'Dell Inspiron 15', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/computer/8/8/8/inspiron-3511-dell-original-imagfhu75eupxyft.jpeg' },
                { id: 'laptop3', platform: 'Dell Store', price: 91999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.dell.com/en-in/shop/laptops-2-in-1-pcs/inspiron-15-laptop/spd/inspiron-15-3511-laptop', name: 'Dell Inspiron 15', image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dellwww/products/laptops-and-2-in-1s/inspiron/15-3511/media-gallery/in3511t-xnb-lf-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402' },
            ],
            'tv': [
                { id: 'tv1', platform: 'Amazon', price: 29999, delivery: 2, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/LG-55-inch-Ultra-Smart-55UQ7500PSF/dp/B09V3QK8YF/', name: 'LG 55" Smart TV', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
                { id: 'tv2', platform: 'Flipkart', price: 27999, delivery: 3, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/lg-55-inch-4k-ultra-hd-smart-led-tv-55uq7500psf/p/itm8c9c5c5c5c5c5', name: 'LG 55" Smart TV', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/television/l/g/l/lg-55-inch-4k-ultra-hd-smart-led-tv-55uq7500psf-original-imagfhu75eupxyft.jpeg' },
                { id: 'tv3', platform: 'Croma', price: 30999, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.croma.com/lg-55-inch-4k-ultra-hd-smart-led-tv-55uq7500psf-/p/241145', name: 'LG 55" Smart TV', image: 'https://www.croma.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/l/g/lg-55-inch-4k-ultra-hd-smart-led-tv-55uq7500psf-_1.png' },
            ],
            'headphones': [
                { id: 'headphones1', platform: 'Amazon', price: 2499, delivery: 1, rating: 4.3, logo: '🛒', link: 'https://www.amazon.in/Sony-WH-1000XM4-Cancelling-Headphones-Bluetooth/dp/B0863TXGM3/', name: 'Sony WH-1000XM4', image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_UY218_.jpg' },
                { id: 'headphones2', platform: 'Flipkart', price: 2299, delivery: 2, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/sony-wh-1000xm4-wireless-noise-cancelling-headphones/p/itm8c9c5c5c5c5c5', name: 'Sony WH-1000XM4', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/headphone/s/o/n/sony-wh-1000xm4-original-imagfhu75eupxyft.jpeg' },
                { id: 'headphones3', platform: 'Croma', price: 2599, delivery: 1, rating: 4.4, logo: '🛒', link: 'https://www.croma.com/sony-wh-1000xm4-wireless-noise-cancelling-headphones/p/241145', name: 'Sony WH-1000XM4', image: 'https://www.croma.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/o/sony-wh-1000xm4_1.png' },
            ],
            'camera': [
                { id: 'camera1', platform: 'Amazon', price: 89999, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/Canon-EOS-R6-Mark-II-Mirrorless/dp/B0B7QK8YF/', name: 'Canon EOS R6 Mark II', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
                { id: 'camera2', platform: 'Flipkart', price: 87999, delivery: 4, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/canon-eos-r6-mark-ii-mirrorless-camera/p/itm8c9c5c5c5c5c5', name: 'Canon EOS R6 Mark II', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/camera/c/a/n/canon-eos-r6-mark-ii-original-imagfhu75eupxyft.jpeg' },
                { id: 'camera3', platform: 'Canon Store', price: 91999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.canon.in/cameras/eos-r6-mark-ii/', name: 'Canon EOS R6 Mark II', image: 'https://www.canon.in/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/c/a/canon-eos-r6-mark-ii_1.png' },
            ],
            'tablet': [
                { id: 'tablet1', platform: 'Amazon', price: 39999, delivery: 2, rating: 4.4, logo: '🛒', link: 'https://www.amazon.in/Apple-iPad-Air-10-9-inch-Wi-Fi/dp/B08J6FLLZ8/', name: 'iPad Air 10.9"', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
                { id: 'tablet2', platform: 'Flipkart', price: 37999, delivery: 3, rating: 4.2, logo: '🛒', link: 'https://www.flipkart.com/apple-ipad-air-10-9-inch-wi-fi-64-gb/p/itm8c9c5c5c5c5c5', name: 'iPad Air 10.9"', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/tablet/i/p/a/apple-ipad-air-10-9-inch-original-imagfhu75eupxyft.jpeg' },
                { id: 'tablet3', platform: 'Apple Store', price: 41999, delivery: 1, rating: 4.6, logo: '🛒', link: 'https://www.apple.com/in/ipad-air/', name: 'iPad Air 10.9"', image: 'https://www.apple.com/in/ipad-air/images/overview/hero/hero_ipad_air__d1tfa5zby7e6_large.png' },
            ],
            'smartwatch': [
                { id: 'watch1', platform: 'Amazon', price: 39999, delivery: 2, rating: 4.5, logo: '🛒', link: 'https://www.amazon.in/Apple-Watch-Series-8-GPS/dp/B0BDJ6ZMYM/', name: 'Apple Watch Series 8', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
                { id: 'watch2', platform: 'Flipkart', price: 37999, delivery: 3, rating: 4.3, logo: '🛒', link: 'https://www.flipkart.com/apple-watch-series-8-gps-41mm/p/itm8c9c5c5c5c5c5', name: 'Apple Watch Series 8', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/smartwatch/a/p/p/apple-watch-series-8-original-imagfhu75eupxyft.jpeg' },
                { id: 'watch3', platform: 'Apple Store', price: 41999, delivery: 1, rating: 4.7, logo: '🛒', link: 'https://www.apple.com/in/apple-watch-series-8/', name: 'Apple Watch Series 8', image: 'https://www.apple.com/in/apple-watch-series-8/images/overview/hero/hero_apple_watch_series_8__d1tfa5zby7e6_large.png' },
            ],
            'gaming': [
                { id: 'gaming1', platform: 'Amazon', price: 49999, delivery: 3, rating: 4.6, logo: '🛒', link: 'https://www.amazon.in/PlayStation-5-Console/dp/B08FC5L3RG/', name: 'PlayStation 5 Console', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
                { id: 'gaming2', platform: 'Flipkart', price: 47999, delivery: 4, rating: 4.4, logo: '🛒', link: 'https://www.flipkart.com/playstation-5-console/p/itm8c9c5c5c5c5c5', name: 'PlayStation 5 Console', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/gaming-console/p/l/s/playstation-5-console-original-imagfhu75eupxyft.jpeg' },
                { id: 'gaming3', platform: 'Sony Store', price: 51999, delivery: 2, rating: 4.7, logo: '🛒', link: 'https://www.sony.in/electronics/playstation-5', name: 'PlayStation 5 Console', image: 'https://www.sony.in/medias/playstation-5-console-1.jpg' },
            ],
            'speaker': [
                { id: 'speaker1', platform: 'Amazon', price: 8999, delivery: 2, rating: 4.3, logo: '🛒', link: 'https://www.amazon.in/JBL-Boombox-2-Portable-Bluetooth-Speaker/dp/B07V4R3N9F/', name: 'JBL Boombox 2', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg' },
                { id: 'speaker2', platform: 'Flipkart', price: 8799, delivery: 3, rating: 4.1, logo: '🛒', link: 'https://www.flipkart.com/jbl-boombox-2-portable-bluetooth-speaker/p/itm8c9c5c5c5c5c5', name: 'JBL Boombox 2', image: 'https://rukminim1.flixcart.com/image/312/312/xif0q/speaker/j/b/l/jbl-boombox-2-original-imagfhu75eupxyft.jpeg' },
                { id: 'speaker3', platform: 'JBL Store', price: 9199, delivery: 1, rating: 4.5, logo: '🛒', link: 'https://www.jbl.com/portable-speakers/BOOMBOX2.html', name: 'JBL Boombox 2', image: 'https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1a0c1e6a/images/J/BOOMBOX2_Product%20Image_Hero_001_x2.png' },
            ]
        };
        
        const queryLower = query.toLowerCase();
        let results = [];
        
        for (const [category, products] of Object.entries(demoData)) {
            if (category.includes(queryLower) || queryLower.includes(category)) {
                results = [...results, ...products];
            }
        }
        
        if (results.length === 0) {
            const allProducts = Object.values(demoData).flat();
            results = allProducts.slice(0, 6);
        }
        
        return results;
    }
};
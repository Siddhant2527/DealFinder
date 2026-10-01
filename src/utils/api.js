export const readApiResponse = async (response, serviceName = 'API') => {
    const body = await response.text();
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.toLowerCase().includes('application/json')) {
        throw new Error(
            `${serviceName} returned an unexpected response (HTTP ${response.status}). The Vercel API route may be unavailable or deployment-protected.`,
        );
    }

    let data;
    try {
        data = JSON.parse(body);
    } catch {
        throw new Error(`${serviceName} returned invalid JSON (HTTP ${response.status}). Please try again later.`);
    }

    if (!response.ok) {
        throw new Error(data.error || data.msg || `${serviceName} failed (HTTP ${response.status}).`);
    }

    return data;
};

export const callGeminiAPI = async (prompt) => {
    try {
        const response = await fetch('/api/ai/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        const result = await readApiResponse(response, 'AI assistant');
        
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
export const mockAuth = async (username, password) => {
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
    const response = await fetch(`/api/products/scrape?query=${encodeURIComponent(query)}`);
    const data = await readApiResponse(response, 'Product search');
    return Array.isArray(data.results) ? data.results : [];
};
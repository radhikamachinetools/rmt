// data/products.js

export const products = [
  {
    id: 1,
    slug: 'single-blade-granite-cutter',
    name: 'Single Blade Granite Cutter',
    category: 'Granite Cutting Machines',
    image: '/images/single-blade-cutter-image.webp',
    shortDescription: 'Precision cutting for all types of granite slabs. High efficiency and robust build.',
    description: 'The Radhika Single Blade Granite Cutter is engineered for perfection. It offers unparalleled precision in cutting granite and other hard stones. With a powerful motor and a durable frame, this machine is designed for continuous operation in demanding environments. Its user-friendly interface ensures ease of operation, maximizing productivity while minimizing waste.',
    keyFeatures: [
      'High-precision 20HP motor',
      'Laser guide for accurate cutting alignment',
      'Heavy-duty cast iron bridge',
      'Variable cutting speed control',
      'Water cooling system to prevent blade overheating'
    ],
    specifications: [
      { spec: 'Blade Diameter', value: '450-600 mm' },
      { spec: 'Max Cutting Length', value: '3200 mm' },
      { spec: 'Max Cutting Depth', value: '200 mm' },
      { spec: 'Main Motor Power', value: '20 HP' },
      { spec: 'Weight', value: '4500 kg' },
    ],
    gallery: [
      '/images/single-blade-cutter-image.webp',
      '/images/sdp-img-2.png',
      '/images/conventional-5-blade.jpg',
    ]
  },
  {
    id: 2,
    slug: 'conventional-5-blade-block-cutter',
    name: 'Conventional 5-Blade Block Cutter',
    category: 'Granite Cutting Machines',
    image: '/images/conventional-5-blade.png',
    shortDescription: 'Multi-blade system for high-volume block cutting. The industry standard for productivity.',
    description: 'This 5-blade block cutter is a powerhouse designed for quarries and large-scale stone processing units. It can slice through large blocks of granite and marble with ease, producing multiple slabs in a single pass. The robust construction ensures stability and vibration-free operation, leading to a superior finish on every slab.',
    keyFeatures: [
        'Five-blade simultaneous cutting',
        'PLC controlled automated operations',
        'Rigid structure for vibration-free cutting',
        'Efficient water recycling system',
        'Can be configured for different slab thicknesses'
    ],
    specifications: [
      { spec: 'Number of Blades', value: '5' },
      { spec: 'Max Block Size (LxWxH)', value: '3.5m x 2m x 2m' },
      { spec: 'Main Motor Power', value: '75 HP' },
      { spec: 'Total Power', value: '90 HP' },
      { spec: 'Machine Weight', value: '22 Tons' },
    ],
    gallery: [
      '/images/conventional-5-blade.jpg',
      '/images/sdp-img-2.png',
      '/images/single-blade-cutter-image.webp',
    ]
  },
  {
    id: 3,
    slug: 'gantry-crane-heavy-duty',
    name: 'Gantry Crane - Heavy Duty',
    category: 'Handling Cranes',
    image: '/images/sdp-img-2.png',
    shortDescription: 'Reliable and powerful gantry crane for handling heavy stone blocks and slabs.',
    description: 'Our Heavy Duty Gantry Cranes are essential for any serious stone processing facility. They provide the power and stability needed to lift and move massive blocks of marble and granite safely and efficiently. With dual-speed controls and advanced safety features, these cranes are built to handle the toughest jobs with precision.',
    keyFeatures: [
        'Lifting capacity up to 40 tons',
        'Wireless remote control operation',
        'Overload protection sensors',
        'Durable steel structure with anti-corrosion paint',
        'VFD for smooth start and stop movements'
    ],
    specifications: [
      { spec: 'Lifting Capacity', value: '10-40 Tons' },
      { spec: 'Span', value: 'Up to 25 meters' },
      { spec: 'Lifting Height', value: 'Up to 12 meters' },
      { spec: 'Hoist Speed', value: '0.8/5 m/min' },
      { spec: 'Control System', value: 'Pendant + Wireless Remote' },
    ],
    gallery: [
      '/images/sdp-img-2.png',
      '/images/conventional-5-blade.jpg',
      '/images/single-blade-cutter-image.webp',
    ]
  },
  {
    id: 4,
    slug: 'line-polishing-machine',
    name: 'Automatic Line Polishing Machine',
    category: 'Line Polishing Machines',
    image: '/images/single-blade-cutter-image.webp', // Placeholder
    shortDescription: 'Achieve a mirror-like finish on your stone slabs with our automated polishing line.',
    description: 'The Radhika Automatic Line Polishing Machine delivers a flawless, high-gloss finish on marble, granite, and other stone surfaces. With multiple polishing heads and an intelligent pressure control system, it ensures consistent quality across the entire slab. The conveyor system allows for a continuous workflow, drastically increasing your facility\'s output.',
    keyFeatures: [
        '16 to 24 polishing heads',
        'PLC touch screen for easy programming',
        'Automatic tool wear compensation',
        'Sensor-based slab profiling system',
        'Low maintenance and high durability'
    ],
    specifications: [
      { spec: 'Number of Heads', value: '16' },
      { spec: 'Working Width', value: '2200 mm' },
      { spec: 'Polishing Thickness', value: '10-50 mm' },
      { spec: 'Conveyor Speed', value: '0-3 m/min' },
      { spec: 'Total Power', value: '120 kW' },
    ],
    gallery: [
      '/images/sdp-img-2.png',
      '/images/conventional-5-blade.jpg',
      '/images/single-blade-cutter-image.webp',
    ]
  },
];
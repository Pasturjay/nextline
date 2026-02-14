// Step interface defined locally to avoid react-joyride dependency
export interface Step {
    target: string | HTMLElement;
    content: React.ReactNode;
    disableBeacon?: boolean;
    placement?: string | 'top' | 'bottom' | 'left' | 'right' | 'auto' | 'center';
    title?: React.ReactNode;
    [key: string]: any;
}

export const dashboardTour: Step[] = [
    {
        target: 'body',
        content: 'Welcome to NexaLine! Let\'s take a quick tour to help you get started. This will only take a minute.',
        placement: 'center',
        disableBeacon: true,
        title: 'Welcome to NexaLine!',
    },
    {
        target: '[data-tour="stats-cards"]',
        content: 'These cards show your key metrics: active virtual numbers, API usage, and travel eSIM rentals. Click any link to dive deeper.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="getting-started"]',
        content: 'Track your onboarding progress here. Complete all steps to unlock the full potential of the platform.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="recommendations"]',
        content: 'We\'ll suggest smart actions based on your account status to help you get the most out of NexaLine.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="quick-actions"]',
        content: 'Use these quick actions to buy numbers, rent eSIMs, manage API keys, and handle billing.',
        placement: 'top',
    },
    {
        target: '[data-tour="recent-activity"]',
        content: 'Your latest transactions and activities appear here so you can track everything at a glance.',
        placement: 'left',
    },
];

export const buyNumberTour: Step[] = [
    {
        target: 'body',
        content: 'Search and acquire phone numbers from 150+ countries in just a few clicks.',
        placement: 'center',
        disableBeacon: true,
        title: 'Buy Virtual Numbers',
    },
    {
        target: '[data-tour="usage-type-tabs"]',
        content: 'Choose between monthly subscription (best for long-term use) or one-time 30-day rental (perfect for temporary needs).',
        placement: 'bottom',
    },
    {
        target: '[data-tour="search-filters"]',
        content: 'Select your country, number type (local/toll-free/mobile), and optionally filter by area code.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="search-button"]',
        content: 'Click search to find available numbers matching your criteria.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="number-results"]',
        content: 'Browse available numbers with pricing, location details, and number type. Each card shows monthly cost and setup fees.',
        placement: 'top',
    },
    {
        target: '[data-tour="buy-button"]',
        content: 'Click "Buy Number" to proceed to checkout and activate your new virtual number instantly.',
        placement: 'top',
    },
];

export const developerTour: Step[] = [
    {
        target: 'body',
        content: 'Manage your API keys and integrate NexaLine into your applications.',
        placement: 'center',
        disableBeacon: true,
        title: 'Developer Tools',
    },
    {
        target: '[data-tour="api-keys-list"]',
        content: 'View all your API keys here. Each key can be used to authenticate API requests to NexaLine services.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="generate-key"]',
        content: 'Generate a new API key by giving it a descriptive name. Keys are shown only once, so save them securely!',
        placement: 'bottom',
    },
    {
        target: '[data-tour="key-security"]',
        content: 'Treat API keys like passwords. Never share them publicly or commit them to version control.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="docs-link"]',
        content: 'Visit our documentation to learn how to make API calls, handle webhooks, and integrate seamlessly.',
        placement: 'top',
    },
];

export const virtualNumbersTour: Step[] = [
    {
        target: 'body',
        content: 'Configure call forwarding, SMS settings, and view analytics for your numbers.',
        placement: 'center',
        disableBeacon: true,
        title: 'Manage Virtual Numbers',
    },
    {
        target: '[data-tour="numbers-list"]',
        content: 'All your active virtual numbers are listed here with their current status and configuration.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="call-forwarding"]',
        content: 'Set up call forwarding to route incoming calls to any number worldwide.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="sms-config"]',
        content: 'Configure SMS webhooks to receive messages programmatically via API.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="analytics"]',
        content: 'View detailed call logs, SMS history, and usage analytics for each number.',
        placement: 'left',
    },
];

export const travelTour: Step[] = [
    {
        target: 'body',
        content: 'Stay connected globally with instant eSIM activation for 150+ destinations.',
        placement: 'center',
        disableBeacon: true,
        title: 'Travel eSIMs',
    },
    {
        target: '[data-tour="destination-select"]',
        content: 'Select your travel destination to see available eSIM plans.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="plan-comparison"]',
        content: 'Compare different data plans with pricing, duration, and data allowances.',
        placement: 'top',
    },
    {
        target: '[data-tour="pricing"]',
        content: 'All prices are shown upfront with no hidden fees or surprises.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="activation"]',
        content: 'After purchase, you\'ll receive QR codes and activation instructions instantly via email.',
        placement: 'top',
    },
];

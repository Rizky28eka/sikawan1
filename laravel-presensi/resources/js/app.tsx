import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/Components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        console.group('%c 🚀 SIKAWAN - Enterprise Attendance System ', 'background: #222; color: #bada55; padding: 2px; border-radius: 4px;');
        console.log('App Name:', appName);
        console.log('Initial Page:', props.initialPage.component);
        console.groupEnd();

        // Logger: request lifecycle
        router.on('start', (event) => {
            console.log(`%c 🛫 [Inertia Request] -> ${event.detail.visit.url} [${event.detail.visit.method}]`, 'font-weight: bold; color: #f59e0b;');
            if (event.detail.visit.data) console.dir(event.detail.visit.data);
        });

        router.on('success', (event) => {
            console.log(`%c ✅ [Inertia Success] -> ${event.detail.page.component}`, 'font-weight: bold; color: #10b981;');
            console.dir(event.detail.page.props);
        });

        router.on('error', (errors) => {
            console.error('%c ❌ [Inertia Validation Errors]', 'font-weight: bold; color: #ef4444;', errors);
        });

        router.on('finish', () => {
            console.log('%c 🏁 [Inertia Finished]', 'color: #9ca3af;');
        });

        root.render(
            <>
                <App {...props} />
                <Toaster richColors position="top-right" />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- MediaSession Shim -->
        <script>
            (function() {
                try {
                    const target = window.MediaSession?.prototype || (window.navigator?.mediaSession ? Object.getPrototypeOf(window.navigator.mediaSession) : null);
                    if (target && typeof target.setActionHandler === 'function') {
                        const original = target.setActionHandler;
                        const supportedActions = ["nexttrack", "pause", "play", "previoustrack", "seekbackward", "seekforward", "seekto", "skipad", "stop"];
                        
                        target.setActionHandler = function(action, handler) {
                            if (!supportedActions.includes(action)) {
                                console.warn(`MediaSession: Action "${action}" is not officially supported and was ignored to prevent errors.`);
                                return;
                            }
                            try {
                                return original.call(this, action, handler);
                            } catch (e) {
                                console.warn(`MediaSession: Failed to set action "${action}":`, e.message);
                            }
                        };
                    }
                } catch (e) {
                    console.error("MediaSession Shim Error:", e);
                }
            })();
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

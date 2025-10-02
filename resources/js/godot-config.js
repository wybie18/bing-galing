window.godotConfig = {
    api: {
        base_url: import.meta.env.VITE_API_URL
    },
    pusher: {
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        useTLS: true
    }
}
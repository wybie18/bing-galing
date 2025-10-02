
window.godotConfig = {
    api: {
        base_url: import.meta.env.VITE_API_URL
    },
    ws: {
        host: `ws://${import.meta.env.VITE_REVERB_HOST}:${import.meta.env.VITE_REVERB_PORT}/app`,
        key: import.meta.env.VITE_REVERB_APP_KEY,
    }
}
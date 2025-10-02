import { LuPause, LuRefreshCw, LuPlay } from "react-icons/lu";

export default function PauseGameModal({
    show,
    onClose,
    onConfirm,
    loading,
    isPaused = false,
}) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center mb-4">
                    {isPaused ? (
                        <LuPlay className="w-6 h-6 text-green-600 mr-3" />
                    ) : (
                        <LuPause className="w-6 h-6 text-orange-600 mr-3" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isPaused ? "I-resume ang Laro" : "I-pause ang Laro"}
                    </h3>
                </div>
                <p className="text-gray-600 mb-6">
                    {isPaused
                        ? "Sigurado ka bang gusto mong i-resume ang laro? Maaabisuhan ang mga manlalaro at magpapatuloy ang laro."
                        : "Sigurado ka bang gusto mong i-pause ang laro? Maaabisuhan ang mga manlalaro at pansamantalang ihihinto ang laro."}
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Kanselahin
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 ${
                            isPaused
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-orange-600 hover:bg-orange-700"
                        } disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200`}
                    >
                        {loading ? (
                            <LuRefreshCw className="w-4 h-4 animate-spin" />
                        ) : isPaused ? (
                            "I-resume ang Laro"
                        ) : (
                            "I-pause ang Laro"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

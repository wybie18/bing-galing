import { LuRefreshCw } from "react-icons/lu";
import { MdOutlineStopCircle } from "react-icons/md";

export default function EndGameModal({ show, onClose, onConfirm, loading }) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center mb-4">
                    <MdOutlineStopCircle className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Tapusin ang Laro
                    </h3>
                </div>
                <p className="text-gray-600 mb-6">
                    Sigurado ka bang gusto mong tapusin ang laro? Hindi na ito maibabalik at ang lahat ng manlalaro ay maaabisuhan.
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        {loading ? (
                            <LuRefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            "Tapusin ang Laro"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

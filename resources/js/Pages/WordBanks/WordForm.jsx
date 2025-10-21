import { useRef } from "react";
import { LuImage, LuX, LuCircleAlert } from "react-icons/lu";

const WordForm = ({
    word,
    onSubmit,
    onCancel,
    title,
    submitLabel,
    errors,
    onWordChange,
    onMeaningChange,
    onActiveChange,
    onImageChange,
    onImageRemove,
    imagePreview,
}) => {
    const fileInputRef = useRef(null);

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">{title}</h4>
            <form onSubmit={onSubmit} className="space-y-4">
                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Larawan (Opsyonal)
                    </label>
                    
                    {imagePreview ? (
                        <div className="relative inline-block">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={onImageRemove}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <LuX className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="hidden"
                                id={`picture-upload-${word.id || 'new'}`}
                            />
                            <label
                                htmlFor={`picture-upload-${word.id || 'new'}`}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <LuImage className="w-5 h-5 mr-2" />
                                Pumili ng Larawan
                            </label>
                            <span className="text-sm text-gray-500">
                                PNG, JPG, GIF hanggang 2MB
                            </span>
                        </div>
                    )}
                    
                    {errors.picture && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <LuCircleAlert className="w-4 h-4" />
                            {errors.picture}
                        </p>
                    )}
                </div>

                {/* Word Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salita *
                    </label>
                    <input
                        type="text"
                        value={word.word}
                        onChange={(e) => onWordChange(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Ilagay ang salita..."
                        required
                    />
                    {errors.word && (
                        <p className="mt-1 text-sm text-red-600">{errors.word}</p>
                    )}
                </div>

                {/* Meaning Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kahulugan *
                    </label>
                    <textarea
                        value={word.meaning}
                        onChange={(e) => onMeaningChange(e.target.value)}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Ilagay ang kahulugan..."
                        required
                    />
                    {errors.meaning && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.meaning}
                        </p>
                    )}
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id={`active-${word.id || "new"}`}
                        checked={word.is_active}
                        onChange={(e) => onActiveChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor={`active-${word.id || "new"}`}
                        className="ml-2 block text-sm text-gray-700"
                    >
                        Aktibo
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        {submitLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                    >
                        Kanselahin
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WordForm;
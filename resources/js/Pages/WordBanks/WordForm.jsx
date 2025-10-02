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
}) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h4 className="text-lg font-medium text-gray-900 mb-4">{title}</h4>
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salita
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
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kahulugan
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

export default WordForm;

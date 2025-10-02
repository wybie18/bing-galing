import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import {
    LuBookOpen,
    LuPlus,
    LuSave,
    LuTrash,
    LuImage,
    LuX,
    LuArrowLeft,
    LuCircleAlert,
} from "react-icons/lu";

export default function Create() {
    const [words, setWords] = useState([]);
    const [showWordForm, setShowWordForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        is_active: true,
        words: [],
    });

    const [wordForm, setWordForm] = useState({
        word: "",
        meaning: "",
        is_active: true,
    });

    const [wordFormErrors, setWordFormErrors] = useState({});

    const handleWordFormChange = (field, value) => {
        setWordForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (wordFormErrors[field]) {
            setWordFormErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateWordForm = () => {
        const errors = {};

        if (!wordForm.word.trim()) {
            errors.word = "Word is required";
        } else if (
            words.some(
                (w) => w.word.toLowerCase() === wordForm.word.toLowerCase()
            )
        ) {
            errors.word = "This word already exists in the list";
        }

        if (!wordForm.meaning.trim()) {
            errors.meaning = "Meaning is required";
        }

        return errors;
    };

    const addWord = () => {
        const errors = validateWordForm();

        if (Object.keys(errors).length > 0) {
            setWordFormErrors(errors);
            return;
        }

        const newWord = {
            id: Date.now(),
            ...wordForm,
            word: wordForm.word.trim(),
            meaning: wordForm.meaning.trim(),
        };

        setWords((prev) => [...prev, newWord]);
        setWordForm({
            word: "",
            meaning: "",
            is_active: true,
        });
        setWordFormErrors({});
        setShowWordForm(false);
    };

    const removeWord = (wordId) => {
        setWords((prev) => prev.filter((w) => w.id !== wordId));
    };

    const editWord = (wordId) => {
        const word = words.find((w) => w.id === wordId);
        if (word) {
            setWordForm({
                word: word.word,
                meaning: word.meaning,
                is_active: word.is_active,
            });
            setWords((prev) => prev.filter((w) => w.id !== wordId));
            setShowWordForm(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const wordsData = words.map(({ id, ...word }) => word);

        router.post(
            route("word-banks.store"),
            {
                ...data,
                words: wordsData,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const cancelWordForm = () => {
        setShowWordForm(false);
        setWordForm({
            word: "",
            meaning: "",
            is_active: true,
        });
        setWordFormErrors({});
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.visit(route("word-banks.index"))}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <LuArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <LuBookOpen className="w-8 h-8 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                    Gumawa ng Word Bank
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Gumawa ng bagong koleksyon ng salita para sa edukasyon
                                </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Gumawa ng Word Bank" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Word Bank Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Impormasyon ng Word Bank
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Pangunahing detalye tungkol sa iyong word bank
                                </p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                        <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Pangalan *
                                    </label>

                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                        isFocused
                                    />

                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <LuCircleAlert className="w-4 h-4" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Paglalarawan
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.description
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Opsyonal na paglalarawan ng word bank"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <LuCircleAlert className="w-4 h-4" />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="is_active"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        Aktibo (makikita ng iba)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Words Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Mga Salita
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Magdagdag ng mga salita sa iyong word bank (
                                            {words.length} salita)
                                        </p>
                                    </div>
                                    {!showWordForm && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowWordForm(true)
                                            }
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                        >
                                            <LuPlus className="w-4 h-4 mr-2" />
                                            Magdagdag ng Salita
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Add Word Form */}
                                {showWordForm && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-md font-medium text-gray-900">
                                                Magdagdag ng Bagong Salita
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={cancelWordForm}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <LuX className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Salita *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={wordForm.word}
                                                    onChange={(e) =>
                                                        handleWordFormChange(
                                                            "word",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                        wordFormErrors.word
                                                            ? "border-red-300"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Ilagay ang salita"
                                                />
                                                {wordFormErrors.word && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {wordFormErrors.word}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Kahulugan *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={wordForm.meaning}
                                                    onChange={(e) =>
                                                        handleWordFormChange(
                                                            "meaning",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                        wordFormErrors.meaning
                                                            ? "border-red-300"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Ilagay ang kahulugan"
                                                />
                                                {wordFormErrors.meaning && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {wordFormErrors.meaning}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={cancelWordForm}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Kanselahin
                                            </button>
                                            <button
                                                type="button"
                                                onClick={addWord}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Magdagdag ng Salita
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Words List */}
                                {words.length > 0 ? (
                                    <div className="space-y-3">
                                        {words.map((word) => (
                                            <div
                                                key={word.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-lg font-semibold text-gray-900">
                                                                {word.word}
                                                            </h4>
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                    word.is_active
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {word.is_active
                                                                    ? "Aktibo"
                                                                    : "Hindi Aktibo"}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 mb-2">
                                                            {word.meaning}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                editWord(
                                                                    word.id
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                                                            title="Edit word"
                                                        >
                                                            <LuBookOpen className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeWord(
                                                                    word.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                            title="Remove word"
                                                        >
                                                            <LuTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : !showWordForm ? (
                                    <div className="text-center py-8">
                                        <LuBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            Walang idinagdag na salita
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Magsimula sa pamamagitan ng pagdagdag ng
                                            unang salita sa koleksyon.
                                        </p>
                                        <div className="mt-6">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowWordForm(true)
                                                }
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                <LuPlus className="w-5 h-5 mr-2" />
                                                Magdagdag ng Unang Salita
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-3 pt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    router.visit(route("word-banks.index"))
                                }
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Kanselahin
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Ginagawa...
                                    </>
                                ) : (
                                    <>
                                        <LuSave className="w-4 h-4 mr-2" />
                                        Lumikha ng Word Bank
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

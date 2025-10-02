import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    LuBookOpen,
    LuCalendar,
    LuChevronLeft,
    LuEye,
    LuHash,
    LuPencil,
    LuPlus,
    LuTrash,
    LuUser,
    LuX,
    LuToggleLeft,
    LuToggleRight,
} from "react-icons/lu";
import { HiMagnifyingGlass, HiMiniDocumentDuplicate } from "react-icons/hi2";
import WordForm from "./WordForm";

export default function Show({
    wordBank,
    words,
    filters = {},
    queryParams = null,
}) {
    queryParams = queryParams || {};
    const [searchTerm, setSearchTerm] = useState(filters?.search ?? "");
    const [showAddWordForm, setShowAddWordForm] = useState(false);
    const [editingWord, setEditingWord] = useState(null);
    const [newWord, setNewWord] = useState({
        word: "",
        meaning: "",
        is_active: true,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const handleSearch = () => {
        const params = { ...queryParams };

        if (searchTerm) {
            params.search = searchTerm;
        } else {
            delete params.search;
        }

        if (searchTerm !== (filters?.search ?? "")) {
            delete params.page;
        }

        router.get(route("word-banks.show", wordBank.id), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleAddWord = (e) => {
        e.preventDefault();
        setErrors({});

        router.post(route("word-banks.words.store", wordBank.id), newWord, {
            onSuccess: () => {
                setNewWord({ word: "", meaning: "", is_active: true });
                setShowAddWordForm(false);
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    const handleUpdateWord = (e) => {
        e.preventDefault();
        setErrors({});

        router.put(
            route("word-banks.words.update", [wordBank.id, editingWord.id]),
            editingWord,
            {
                onSuccess: () => {
                    setEditingWord(null);
                },
                onError: (errors) => {
                    setErrors(errors);
                },
            }
        );
    };

    const handleDeleteWord = (word) => {
        if (confirm("Are you sure you want to delete this word?")) {
            router.delete(
                route("word-banks.words.destroy", [wordBank.id, word.id])
            );
        }
    };

    const handleToggleWordStatus = (word) => {
        router.patch(route("word-banks.words.toggle", [wordBank.id, word.id]));
    };

    const handleDuplicateWordBank = () => {
        router.post(route("word-banks.duplicate", wordBank.id));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Handler functions for WordForm
    const handleNewWordChange = (value) => {
        setNewWord((prev) => ({ ...prev, word: value }));
    };

    const handleNewMeaningChange = (value) => {
        setNewWord((prev) => ({ ...prev, meaning: value }));
    };

    const handleNewActiveChange = (value) => {
        setNewWord((prev) => ({ ...prev, is_active: value }));
    };

    const handleEditWordChange = (value) => {
        setEditingWord((prev) => ({ ...prev, word: value }));
    };

    const handleEditMeaningChange = (value) => {
        setEditingWord((prev) => ({ ...prev, meaning: value }));
    };

    const handleEditActiveChange = (value) => {
        setEditingWord((prev) => ({ ...prev, is_active: value }));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("word-banks.index")}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <LuChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <LuBookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                {wordBank.name}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                    <LuUser className="w-4 h-4 mr-1" />
                                    {wordBank.teacher.name}
                                </span>
                                <span className="flex items-center">
                                    <LuCalendar className="w-4 h-4 mr-1" />
                                    {formatDate(wordBank.created_at)}
                                </span>
                                <span className="flex items-center">
                                    <LuHash className="w-4 h-4 mr-1" />
                                    {words.total} words
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {wordBank.is_owner ? (
                            <>
                                <button
                                    onClick={() => setShowAddWordForm(true)}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <LuPlus className="w-5 h-5 mr-2" />
                                    Magdagdag ng Salita
                                </button>
                                <Link
                                    href={route("word-banks.edit", wordBank.id)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <LuPencil className="w-5 h-5 mr-2" />
                                    I-edit
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleDuplicateWordBank}
                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                <HiMiniDocumentDuplicate className="w-5 h-5 mr-2" />
                                Kopyahin
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`${wordBank.name} - Word Banks`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Word Bank Description */}
                    {wordBank.description && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Paglalarawan
                            </h3>
                            <p className="text-gray-600">
                                {wordBank.description}
                            </p>
                        </div>
                    )}

                    {/* Add Word Form */}
                    {showAddWordForm && wordBank.is_owner && (
                        <div className="mb-6">
                            <WordForm
                                word={newWord}
                                onSubmit={handleAddWord}
                                onCancel={() => {
                                    setShowAddWordForm(false);
                                    setNewWord({
                                        word: "",
                                        meaning: "",
                                        is_active: true,
                                    });
                                    setErrors({});
                                }}
                                title="Add New Word"
                                submitLabel="Add Word"
                                errors={errors}
                                onWordChange={handleNewWordChange}
                                onMeaningChange={handleNewMeaningChange}
                                onActiveChange={handleNewActiveChange}
                            />
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Maghanap ng salita o kahulugan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Words List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {words.data.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Word
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Meaning
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                {wordBank.is_owner && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {words.data.map((word) => (
                                                <tr
                                                    key={word.id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {word.word}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-700 max-w-md">
                                                            {word.meaning}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                word.is_active
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {word.is_active
                                                                ? "Aktibo"
                                                                : "Hindi Aktibo"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <LuCalendar className="w-4 h-4 mr-1" />
                                                            {formatDate(
                                                                word.created_at
                                                            )}
                                                        </div>
                                                    </td>
                                                    {wordBank.is_owner && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleToggleWordStatus(
                                                                            word
                                                                        )
                                                                    }
                                                                    className={`p-1 rounded-lg transition-colors ${
                                                                        word.is_active
                                                                            ? "text-green-600 hover:text-green-900 hover:bg-green-50"
                                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                                    }`}
                                                                    title={
                                                                        word.is_active
                                                                            ? "I-deactivate"
                                                                            : "I-activate"
                                                                    }
                                                                >
                                                                    {word.is_active ? (
                                                                        <LuToggleRight className="w-4 h-4" />
                                                                    ) : (
                                                                        <LuToggleLeft className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        setEditingWord(
                                                                            word
                                                                        )
                                                                    }
                                                                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                                    title="I-edit"
                                                                >
                                                                    <LuPencil className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteWord(
                                                                            word
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                                    title="Tanggalin"
                                                                >
                                                                    <LuTrash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="lg:hidden divide-y divide-gray-200">
                                    {words.data.map((word) => (
                                        <div
                                            key={word.id}
                                            className="p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {word.word}
                                                        </h3>
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                word.is_active
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {word.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mb-2">
                                                        {word.meaning}
                                                    </p>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <LuCalendar className="w-3 h-3 mr-1" />
                                                        {formatDate(
                                                            word.created_at
                                                        )}
                                                    </div>
                                                </div>
                                                {wordBank.is_owner && (
                                                    <div className="flex items-center space-x-1 ml-2">
                                                        <button
                                                            onClick={() =>
                                                                handleToggleWordStatus(
                                                                    word
                                                                )
                                                            }
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                word.is_active
                                                                    ? "text-green-600 hover:text-green-900 hover:bg-green-50"
                                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {word.is_active ? (
                                                                <LuToggleRight className="w-4 h-4" />
                                                            ) : (
                                                                <LuToggleLeft className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setEditingWord(
                                                                    word
                                                                )
                                                            }
                                                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        >
                                                            <LuPencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteWord(
                                                                    word
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <LuTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Edit Word Form */}
                                {editingWord && (
                                    <div className="p-6 border-t border-gray-200">
                                        <WordForm
                                            word={editingWord}
                                            onSubmit={handleUpdateWord}
                                            onCancel={() => {
                                                setEditingWord(null);
                                                setErrors({});
                                            }}
                                            title="Edit Word"
                                            submitLabel="Update Word"
                                            errors={errors}
                                            onWordChange={handleEditWordChange}
                                            onMeaningChange={
                                                handleEditMeaningChange
                                            }
                                            onActiveChange={
                                                handleEditActiveChange
                                            }
                                        />
                                    </div>
                                )}

                                {/* Pagination */}
                                {words.links && words.links.length > 3 && (
                                    <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                {words.prev_page_url && (
                                                    <Link
                                                        href={
                                                            words.prev_page_url
                                                        }
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Nakaraan
                                                    </Link>
                                                )}
                                                {words.next_page_url && (
                                                    <Link
                                                        href={
                                                            words.next_page_url
                                                        }
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Susunod
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Ipinapakita ang{" "}
                                                        <span className="font-medium">
                                                            {words.from || 0}
                                                        </span>{" "}
                                                        hanggang{" "}
                                                        <span className="font-medium">
                                                            {words.to || 0}
                                                        </span>{" "}
                                                        ng{" "}
                                                        <span className="font-medium">
                                                            {words.total}
                                                        </span>{" "}
                                                        salita
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                        {words.links.map(
                                                            (link, index) => (
                                                                <Link
                                                                    key={index}
                                                                    href={
                                                                        link.url ||
                                                                        "#"
                                                                    }
                                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                        link.active
                                                                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                                    } ${
                                                                        index ===
                                                                        0
                                                                            ? "rounded-l-md"
                                                                            : index ===
                                                                              words
                                                                                  .links
                                                                                  .length -
                                                                                  1
                                                                            ? "rounded-r-md"
                                                                            : ""
                                                                    } ${
                                                                        !link.url
                                                                            ? "cursor-not-allowed opacity-50"
                                                                            : "cursor-pointer"
                                                                    }`}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            )
                                                        )}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <LuHash className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    Walang salita na natagpuan
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm
                                        ? "Subukang baguhin ang iyong hinahanap."
                                        : "Walang salita sa word bank na ito."}
                                </p>
                                {wordBank.is_owner && !searchTerm && (
                                    <div className="mt-6">
                                        <button
                                            onClick={() =>
                                                setShowAddWordForm(true)
                                            }
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <LuPlus className="w-5 h-5 mr-2" />
                                            Magdagdag ng Unang Salita
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

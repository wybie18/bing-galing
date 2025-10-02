import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { LuBookOpen, LuCalendar, LuChevronDown, LuChevronUp, LuEye, LuFilter, LuHash, LuPencil, LuPlus, LuTrash, LuUser, LuX } from 'react-icons/lu';
import { HiMagnifyingGlass, HiMiniDocumentDuplicate } from "react-icons/hi2";

export default function Index({ wordBanks, filters = {}, queryParams = null }) {
    queryParams = queryParams || {};

    const [searchTerm, setSearchTerm] = useState(filters?.search ?? '');
    const [selectedFilter, setSelectedFilter] = useState(filters?.queryFilter ?? 'all');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        
        delete params.page;
        
        router.get(route('word-banks.index'), params, {
            preserveState: true,
            replace: true
        });
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        const params = { ...queryParams };
        
        if (filter === 'all') {
            delete params.filter;
        } else {
            params.filter = filter;
        }
        
        delete params.page;
        
        router.get(route('word-banks.index'), params, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        const params = { ...queryParams };
        
        if (params.sort_field === field) {
            params.sort_direction = params.sort_direction === 'asc' ? 'desc' : 'asc';
        } else {
            params.sort_field = field;
            params.sort_direction = 'asc';
        }
        
        router.get(route('word-banks.index'), params, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedFilter('all');
        router.get(route('word-banks.index'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (wordBank) => {
        if (confirm('Are you sure you want to delete this word bank?')) {
            router.delete(route('word-banks.destroy', wordBank.id));
        }
    };

    const handleDuplicate = (wordBank) => {
        router.post(route('word-banks.duplicate', wordBank.id));
    };

    const getSortIcon = (field) => {
        if (queryParams.sort_field !== field) {
            return null;
        }
        return queryParams.sort_direction === 'asc' ? 
            <LuChevronUp className="w-4 h-4" /> : 
            <LuChevronDown className="w-4 h-4" />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedFilter !== 'all') count++;
        return count;
    }, [searchTerm, selectedFilter]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <LuBookOpen className="w-8 h-8 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Word Banks
                            </h2>
                            <p className="text-sm text-gray-600">
                                Pamahalaan at tuklasin ang mga koleksyon ng salita para sa edukasyon
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('word-banks.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                    >
                        <LuPlus className="w-5 h-5 mr-2" />
                        Gumawa ng Word Bank
                    </Link>
                </div>
            }
        >
            <Head title="Word Banks" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <LuBookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Kabuuang Word Banks</p>
                                    <p className="text-2xl font-bold text-gray-900">{wordBanks.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <LuUser className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Aking Word Banks</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {wordBanks?.data.filter(wb => wb.is_owner).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <LuHash className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Kabuuang Salita</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {wordBanks.data.reduce((sum, wb) => sum + wb.word_count, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-4 sm:p-6">
                            {/* Mobile Filter Toggle */}
                            <div className="flex items-center justify-between mb-4 sm:hidden">
                                <button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <LuFilter className="w-4 h-4 mr-2" />
                                    Mga Filter
                                    {activeFiltersCount > 0 && (
                                        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Search and Filters */}
                            <div className={`space-y-4 ${showMobileFilters ? 'block' : 'hidden sm:block'}`}>
                                {/* Search Bar */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Maghanap ng word bank, paglalarawan, o guro..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex flex-wrap gap-2">
                                        {[
                                        { key: 'all', label: 'Lahat ng Word Banks', count: wordBanks.total },
                                        { 
                                            key: 'my_wordbanks', 
                                            label: 'Aking Word Banks', 
                                            count: wordBanks?.data.filter(wb => wb.is_owner).length 
                                        }
                                    ].map(({ key, label, count }) => (
                                        <button
                                            key={key}
                                            onClick={() => handleFilterChange(key)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                selectedFilter === key
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                        >
                                            {label}
                                            <span className="ml-2 text-xs opacity-75">({count})</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Clear Filters */}
                                {activeFiltersCount > 0 && (
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                        <span className="text-sm text-gray-600">
                                            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} na naka-aplay
                                        </span>
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            <LuX className="w-4 h-4 mr-1" />
                                            I-clear lahat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Word Banks Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {wordBanks.data.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {[
                                                    { key: 'name', label: 'Name' },
                                                    { key: 'teacher', label: 'Teacher' },
                                                    { key: 'word_count', label: 'Words' },
                                                    { key: 'created_at', label: 'Created' },
                                                    { key: 'actions', label: 'Actions' }
                                                ].map(({ key, label }) => (
                                                    <th
                                                        key={key}
                                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                                            key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''
                                                        }`}
                                                        onClick={key !== 'actions' ? () => handleSort(key) : undefined}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span>{label}</span>
                                                            {key !== 'actions' && getSortIcon(key)}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {wordBanks.data.map((wordBank) => (
                                                <tr key={wordBank.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 w-10 h-10">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                                                                    <LuBookOpen className="w-5 h-5 text-white" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {wordBank.name}
                                                                    </div>
                                                                    {wordBank.is_owner && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            Owner
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {wordBank.description && (
                                                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                                                        {wordBank.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <LuUser className="w-4 h-4 text-gray-600" />
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {wordBank.teacher.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {wordBank.word_count} words
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <LuCalendar className="w-4 h-4 mr-1" />
                                                            {formatDate(wordBank.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={route('word-banks.show', wordBank.id)}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                                                                title="View"
                                                            >
                                                                <LuEye className="w-4 h-4" />
                                                            </Link>
                                                            {wordBank.is_owner && (
                                                                <Link
                                                                    href={route('word-banks.edit', wordBank.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <LuPencil className="w-4 h-4" />
                                                                </Link>
                                                            )}
                                                            {!wordBank.is_owner && (
                                                                <button
                                                                    onClick={() => handleDuplicate(wordBank)}
                                                                    className="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors"
                                                                    title="Duplicate"
                                                                >
                                                                    <HiMiniDocumentDuplicate className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {wordBank.is_owner && (
                                                                <button
                                                                    onClick={() => handleDelete(wordBank)}
                                                                    className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <LuTrash className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="lg:hidden divide-y divide-gray-200">
                                    {wordBanks.data.map((wordBank) => (
                                        <div key={wordBank.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3 flex-1">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <LuBookOpen className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                                {wordBank.name}
                                                            </h3>
                                                            {wordBank.is_owner && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Owner
                                                                </span>
                                                            )}
                                                        </div>
                                                        {wordBank.description && (
                                                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                                                {wordBank.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                                                            <span className="flex items-center">
                                                                <LuUser className="w-3 h-3 mr-1" />
                                                                {wordBank.teacher.name}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <LuHash className="w-3 h-3 mr-1" />
                                                                {wordBank.word_count} words
                                                            </span>
                                                            <span className="flex items-center">
                                                                <LuCalendar className="w-3 h-3 mr-1" />
                                                                {formatDate(wordBank.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1 ml-2">
                                                    <Link
                                                        href={route('word-banks.show', wordBank.id)}
                                                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <LuEye className="w-4 h-4" />
                                                    </Link>
                                                    {wordBank.is_owner ? (
                                                        <>
                                                            <Link
                                                                href={route('word-banks.edit', wordBank.id)}
                                                                className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            >
                                                                <LuPencil className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(wordBank)}
                                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <LuTrash className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDuplicate(wordBank)}
                                                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            <HiMiniDocumentDuplicate className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {wordBanks.links && wordBanks.links.length > 3 && (
                                    <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                {wordBanks.prev_page_url && (
                                                    <Link
                                                        href={wordBanks.prev_page_url}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Previous
                                                    </Link>
                                                )}
                                                {wordBanks.next_page_url && (
                                                    <Link
                                                        href={wordBanks.next_page_url}
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Next
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Showing{' '}
                                                        <span className="font-medium">{wordBanks.from || 0}</span>{' '}
                                                        to{' '}
                                                        <span className="font-medium">{wordBanks.to || 0}</span>{' '}
                                                        of{' '}
                                                        <span className="font-medium">{wordBanks.total}</span>{' '}
                                                        results
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                        {wordBanks.links.map((link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={link.url || '#'}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                } ${
                                                                    index === 0
                                                                        ? 'rounded-l-md'
                                                                        : index === wordBanks.links.length - 1
                                                                        ? 'rounded-r-md'
                                                                        : ''
                                                                } ${
                                                                    !link.url ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <LuBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No word banks found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm || selectedFilter !== 'all' 
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating a new word bank.'
                                    }
                                </p>
                                {(!searchTerm && selectedFilter === 'all') && (
                                    <div className="mt-6">
                                        <Link
                                            href={route('word-banks.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <LuPlus className="w-5 h-5 mr-2" />
                                            Create Word Bank
                                        </Link>
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
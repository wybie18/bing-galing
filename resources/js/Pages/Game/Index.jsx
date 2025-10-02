import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import {
    LuGamepad2,
    LuCalendar,
    LuChevronDown,
    LuChevronUp,
    LuEye,
    LuFilter,
    LuHash,
    LuPlus,
    LuTrash,
    LuX,
    LuUsers,
} from "react-icons/lu";
import { HiMagnifyingGlass } from "react-icons/hi2";
import CreateModal from "./Modals/CreateModal";

export default function Index({
    games,
    filters = {},
    queryParams = null
}) {
    queryParams = queryParams || {};

    const [searchTerm, setSearchTerm] = useState(filters?.search ?? "");
    const [selectedStatus, setSelectedStatus] = useState(
        filters?.status ?? "all"
    );
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const openCreateModal = () => {
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

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

        router.get(route("games.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        const params = { ...queryParams };

        if (status === "all") {
            delete params.status;
        } else {
            params.status = status;
        }

        delete params.page;

        router.get(route("games.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (field) => {
        const params = { ...queryParams };

        if (params.sort_field === field) {
            params.sort_direction =
                params.sort_direction === "asc" ? "desc" : "asc";
        } else {
            params.sort_field = field;
            params.sort_direction = "asc";
        }

        router.get(route("games.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedStatus("all");
        router.get(
            route("games.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (game) => {
        if (confirm("Are you sure you want to delete this game?")) {
            router.delete(route("games.destroy", game.game_code));
        }
    };

    const getSortIcon = (field) => {
        if (queryParams.sort_field !== field) {
            return null;
        }
        return queryParams.sort_direction === "asc" ? (
            <LuChevronUp className="w-4 h-4" />
        ) : (
            <LuChevronDown className="w-4 h-4" />
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            waiting: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Waiting",
            },
            active: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Active",
            },
            paused: {
                bg: "bg-orange-100",
                text: "text-orange-800",
                label: "Paused",
            },
            finished: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                label: "Finished",
            },
        };

        const config = statusConfig[status] || statusConfig.waiting;

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
                {config.label}
            </span>
        );
    };

    const getStatusCounts = () => {
        return {
            all: games.data.length || 0,
            waiting: games.data.filter((g) => g.status === "waiting").length,
            active: games.data.filter((g) => g.status === "active").length,
            paused: games.data.filter((g) => g.status === "paused").length,
            finished: games.data.filter((g) => g.status === "finished").length,
        };
    };

    const statusCounts = getStatusCounts();

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedStatus !== "all") count++;
        return count;
    }, [searchTerm, selectedStatus]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <LuGamepad2 className="w-8 h-8 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Kasaysayan ng Laro
                            </h2>
                            <p className="text-sm text-gray-600">
                                Pamahalaan at subaybayan ang iyong mga pang-edukasyong word bingo na laro
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                    >
                        <LuPlus className="w-5 h-5 mr-2" />
                        Gumawa ng Laro
                    </button>
                </div>
            }
        >
            <Head title="Games" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowMobileFilters(!showMobileFilters)
                                    }
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <LuFilter className="w-4 h-4 mr-2" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div
                                className={`space-y-4 ${
                                    showMobileFilters
                                        ? "block"
                                        : "hidden sm:block"
                                }`}
                            >
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Maghanap gamit ang game code..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                {/* Status Filter Tabs */}
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        {
                                            key: "all",
                                            label: "Lahat ng Laro",
                                            count: statusCounts.all,
                                        },
                                        {
                                            key: "waiting",
                                            label: "Naghihintay",
                                            count: statusCounts.waiting,
                                        },
                                        {
                                            key: "active",
                                            label: "Aktibo",
                                            count: statusCounts.active,
                                        },
                                        {
                                            key: "paused",
                                            label: "Naka-pause",
                                            count: statusCounts.paused,
                                        },
                                        {
                                            key: "finished",
                                            label: "Natapos",
                                            count: statusCounts.finished,
                                        },
                                    ].map(({ key, label, count }) => (
                                        <button
                                            key={key}
                                            onClick={() =>
                                                handleStatusFilter(key)
                                            }
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                selectedStatus === key
                                                    ? "bg-blue-600 text-white shadow-sm"
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            }`}
                                        >
                                            {label}
                                            <span className="ml-2 text-xs opacity-75">
                                                ({count})
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Clear Filters */}
                                {activeFiltersCount > 0 && (
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                        <span className="text-sm text-gray-600">
                                            {activeFiltersCount} filter
                                            {activeFiltersCount !== 1
                                                ? "s"
                                                : ""}{" "}
                                            na naka-aplay
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

                    {/* Games Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {games.data.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {[
                                                    {
                                                        key: "game_code",
                                                        label: "Game Code",
                                                    },
                                                    {
                                                        key: "word_bank",
                                                        label: "Word Bank",
                                                    },
                                                    {
                                                        key: "status",
                                                        label: "Status",
                                                    },
                                                    {
                                                        key: "players_count",
                                                        label: "Mga Manlalaro",
                                                    },
                                                    {
                                                        key: "created_at",
                                                        label: "Nilikha",
                                                    },
                                                    {
                                                        key: "actions",
                                                        label: "Mga Aksyon",
                                                    },
                                                ].map(({ key, label }) => (
                                                    <th
                                                        key={key}
                                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                                            key !== "actions"
                                                                ? "cursor-pointer hover:bg-gray-100"
                                                                : ""
                                                        }`}
                                                        onClick={
                                                            key !== "actions"
                                                                ? () =>
                                                                      handleSort(
                                                                          key
                                                                      )
                                                                : undefined
                                                        }
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span>{label}</span>
                                                            {key !==
                                                                "actions" &&
                                                                getSortIcon(
                                                                    key
                                                                )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {games.data.map((game) => (
                                                <tr
                                                    key={game.id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 w-10 h-10">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                                                    <LuGamepad2 className="w-5 h-5 text-white" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        game.game_code
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {
                                                                game.word_bank
                                                                    ?.name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                game.word_bank
                                                                    ?.word_count
                                                            }{" "}
                                                            words
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(
                                                            game.status
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            {game.players.length}
                                                            /{game.max_players}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <LuCalendar className="w-4 h-4 mr-1" />
                                                            {formatDate(
                                                                game.created_at
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "games.show",
                                                                    game.game_code
                                                                )}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                                                                title="View"
                                                            >
                                                                <LuEye className="w-4 h-4" />
                                                            </Link>
                                                            {(game.status ===
                                                                "waiting" ||
                                                                game.status ===
                                                                    "finished") && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            game
                                                                        )
                                                                    }
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
                                    {games.data.map((game) => (
                                        <div
                                            key={game.id}
                                            className="p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3 flex-1">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <LuGamepad2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-sm font-medium text-gray-900">
                                                                {game.game_code}
                                                            </h3>
                                                            {getStatusBadge(
                                                                game.status
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-700 mb-2">
                                                            {
                                                                game.word_bank
                                                                    ?.name
                                                            }
                                                        </p>
                                                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                                                            <span className="flex items-center">
                                                                <LuUsers className="w-3 h-3 mr-1" />
                                                                {
                                                                    game.players_count
                                                                }
                                                                /
                                                                {
                                                                    game.max_players
                                                                }
                                                            </span>
                                                            <span className="flex items-center">
                                                                <LuHash className="w-3 h-3 mr-1" />
                                                                {
                                                                    game
                                                                        .word_bank
                                                                        ?.word_count
                                                                }{" "}
                                                                words
                                                            </span>
                                                            <span className="flex items-center">
                                                                <LuCalendar className="w-3 h-3 mr-1" />
                                                                {formatDate(
                                                                    game.created_at
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1 ml-2">
                                                    <Link
                                                        href={route(
                                                            "games.show",
                                                            game.game_code
                                                        )}
                                                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <LuEye className="w-4 h-4" />
                                                    </Link>
                                                    {(game.status ===
                                                        "waiting" ||
                                                        game.status ===
                                                            "finished") && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    game
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <LuTrash className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {games.links && games.links.length > 3 && (
                                    <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                {games.prev_page_url && (
                                                            <Link
                                                                href={
                                                                    games.prev_page_url
                                                                }
                                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                            >
                                                        Nakaraan
                                                    </Link>
                                                )}
                                                {games.next_page_url && (
                                                        <Link
                                                            href={
                                                                games.next_page_url
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
                                                        Showing{" "}
                                                        <span className="font-medium">
                                                            {games.from || 0}
                                                        </span>{" "}
                                                        to{" "}
                                                        <span className="font-medium">
                                                            {games.to || 0}
                                                        </span>{" "}
                                                        of{" "}
                                                        <span className="font-medium">
                                                            {games.total}
                                                        </span>{" "}
                                                        results
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                        {games.links.map(
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
                                                                              games
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
                                <LuGamepad2 className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    Walang natagpuang laro
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm || selectedStatus !== "all"
                                        ? "Subukan i-adjust ang iyong paghahanap o filter criteria."
                                        : "Magsimula sa pamamagitan ng paglikha ng iyong unang laro."}
                                </p>
                                {!searchTerm && selectedStatus === "all" && (
                                    <div className="mt-6">
                                        <button
                                            onClick={openCreateModal}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <LuPlus className="w-5 h-5 mr-2" />
                                            Gumawa ng Laro
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateModal
                openModal={createModalOpen}
                closeModal={closeCreateModal}
            />
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    LuGamepad2,
    LuUser,
    LuArrowLeft,
    LuTrophy,
    LuCircleCheck,
    LuTarget,
    LuStar,
} from "react-icons/lu";

export default function PlayerCard({
    game,
    player,
    bingo_card,
    bingo_lines,
    has_bingo,
    statistics,
}) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getBingoCellClasses = (position, wordData) => {
        const baseClasses =
            "aspect-square border-2 flex flex-col items-center justify-center p-2 text-center relative transition-all duration-300";

        if (wordData.is_crossed) {
            if (wordData.id === "FREE") {
                return `${baseClasses} bg-yellow-100 border-yellow-400 text-yellow-800`;
            }
            return `${baseClasses} bg-green-100 border-green-400 text-green-800`;
        }

        return `${baseClasses} bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100`;
    };

    const isPositionInBingoLine = (position) => {
        return bingo_lines.some((line) => line.positions.includes(position));
    };

    const getBingoLineClasses = (position, wordData) => {
        if (!has_bingo || !isPositionInBingoLine(position)) {
            return "";
        }

        return "ring-4 ring-yellow-400 shadow-lg animate-pulse";
    };

    const getStatusBadgeClasses = (status) => {
        const configs = {
            joined: "bg-blue-100 text-blue-800",
            playing: "bg-green-100 text-green-800",
            won: "bg-yellow-100 text-yellow-800",
            disconnected: "bg-red-100 text-red-800",
        };
        return configs[status] || "bg-gray-100 text-gray-800";
    };

    const translateStatusLabel = (status) => {
        const map = {
            joined: 'Sumali',
            playing: 'Naglalaro',
            won: 'Panalo',
            disconnected: 'Nawalan ng koneksyon',
        };

        return map[status] || status;
    };

    const translateLineType = (type) => {
        const map = {
            row: 'Hanay',
            column: 'Kolum',
            diagonal: 'Dayagonal',
        };

        return map[type] || type;
    };

    const renderBingoCard = () => {
        const cardSize = 5;
        const cards = [];

        for (let position = 0; position < 25; position++) {
            const wordData = bingo_card[position];
            const bingoLineClasses = getBingoLineClasses(position, wordData);

            cards.push(
                <div
                    key={position}
                    className={`${getBingoCellClasses(
                        position,
                        wordData
                    )} ${bingoLineClasses}`}
                >
                    {/* Word */}
                    <div className="font-bold text-sm mb-1">
                        {wordData.word}
                    </div>

                    {/* Meaning */}
                    <div className="text-xs opacity-75 line-clamp-2">
                        {wordData.meaning}
                    </div>

                    {/* Crossed indicator */}
                    {wordData.is_crossed && (
                        <div className="absolute top-1 right-1">
                            <LuCircleCheck className="w-4 h-4 text-green-600" />
                        </div>
                    )}

                    {/* Position number (for debugging, can be removed) */}
                    <div className="absolute bottom-1 left-1 text-xs opacity-30">
                        {position}
                    </div>
                </div>
            );
        }

        return cards;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                            <LuUser className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                {player.name} - Bingo Card
                            </h2>
                            <p className="text-sm text-gray-600">
                                Laro: {game.game_code} • {game.word_bank?.name}
                            </p>
                        </div>
                    </div>

                    {has_bingo && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
                            <LuTrophy className="w-5 h-5" />
                            <span className="font-medium">BINGO!</span>
                        </div>
                    )}
                </div>
            }
        >
            <Head
                title={`${player.name}'s Bingo Card - Game ${game.game_code}`}
            />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                            <button
                            onClick={() =>
                                router.get(
                                    document.referrer || route("games.index"),
                                    {},
                                    {
                                        preserveState: true,
                                    }
                                )
                            }
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <LuArrowLeft className="w-4 h-4 mr-1" />
                            Bumalik sa Laro
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Bingo Card */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Bingo Card
                                    </h3>
                                    {has_bingo && (
                                        <div className="text-sm text-yellow-600 font-medium">
                                            {bingo_lines.length} panalong linya
                                            {bingo_lines.length !== 1
                                                ? "s"
                                                : ""}
                                        </div>
                                    )}
                                </div>

                                {/* Bingo Grid */}
                                <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
                                    {renderBingoCard()}
                                </div>

                                {/* Bingo Lines Info */}
                                {has_bingo && bingo_lines.length > 0 && (
                                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div className="flex items-center mb-2">
                                            <LuStar className="w-5 h-5 text-yellow-600 mr-2" />
                                            <h4 className="font-medium text-yellow-800">
                                                Mga Panalong Linya
                                            </h4>
                                        </div>
                                        <div className="space-y-1">
                                            {bingo_lines.map((line, index) => (
                                                <div
                                                    key={index}
                                                    className="text-sm text-yellow-700"
                                                >
                                                    {translateLineType(line.type)} linya
                                                    {line.positions &&
                                                        ` (positions: ${line.positions.join(
                                                            ", "
                                                        )})`}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Player Info & Stats */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Player Info */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-medium text-gray-900">
                                            {player.name}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeClasses(
                                                player.status
                                            )}`}
                                        >
                                            {translateStatusLabel(player.status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Sumali
                                        </span>
                                        <span className="text-sm text-gray-900">
                                            {formatDate(player.joined_at)}
                                        </span>
                                    </div>

                                    {player.won_at && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Nanalo
                                            </span>
                                            <span className="text-sm text-gray-900">
                                                {formatDate(player.won_at)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Progress Stats */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Progreso
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <LuTarget className="w-5 h-5 text-blue-600 mr-2" />
                                            <span className="text-sm text-blue-800">
                                                Mga Naputol na Salita
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600 mt-1">
                                            {player.crossed_words_count + 1}/25
                                        </div>
                                            <div className="text-sm text-blue-700">
                                            Kasama ang FREE space
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <LuCircleCheck className="w-5 h-5 text-green-600 mr-2" />
                                            <span className="text-sm text-green-800">
                                                Kompletong Porsyento
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold text-green-600 mt-1">
                                            {statistics.completion_percentage}%
                                        </div>
                                        <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${statistics.completion_percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <LuGamepad2 className="w-5 h-5 text-purple-600 mr-2" />
                                            <span className="text-sm text-purple-800">
                                                Game Progress
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold text-purple-600 mt-1">
                                            {statistics.words_called}/
                                            {statistics.total_words}
                                        </div>
                                            <div className="text-sm text-purple-700">
                                            Mga salita na tinawag
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Legend
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded mr-3"></div>
                                        <span className="text-sm text-gray-700">
                                            Salitang naputol
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded mr-3"></div>
                                        <span className="text-sm text-gray-700">
                                            FREE space
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-50 border-2 border-gray-300 rounded mr-3"></div>
                                        <span className="text-sm text-gray-700">
                                            Magagamit na salita
                                        </span>
                                    </div>
                                    {has_bingo && (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 bg-green-100 border-2 border-yellow-400 rounded mr-3 ring-2 ring-yellow-400"></div>
                                            <span className="text-sm text-gray-700">
                                                Panalong linya
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

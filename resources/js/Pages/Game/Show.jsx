import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    LuGamepad2,
    LuCalendar,
    LuUsers,
    LuHash,
    LuPlay,
    LuPause,
    LuCopy,
    LuCheck,
    LuClock,
    LuPencil,
    LuX,
    LuSave,
    LuRefreshCw,
    LuUserPlus,
    LuArrowLeft,
} from "react-icons/lu";

import { MdOutlineStopCircle } from "react-icons/md";
import PauseGameModal from "./Modals/PauseGameModal";
import EndGameModal from "./Modals/EndGameModal";
import toast from "react-hot-toast";

export default function Show({ game }) {
    const [gameData, setGameData] = useState(game.data);
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState(gameData.max_players);
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Echo.channel(`game.${gameData.game_code}`)
            .listen(".player.joined", (event) => {
                console.log("Player joined:", event);
                setGameData((prev) => ({
                    ...prev,
                    players: [...prev.players, event.player],
                }));
                toast.success(event.message);
            })
            .listen(".player.left", (event) => {
                console.log("Player left:", event);
                setGameData((prev) => ({
                    ...prev,
                    players: prev.players.filter(
                        (p) => p.id !== event.player.id
                    ),
                }));
                toast.error(event.message);
            })
            .error((error) => {
                console.error("Echo error:", error);
            });

        return () => {
            Echo.leaveChannel(`game.${gameData.game_code}`);
        };
    }, [gameData.game_code]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(gameData.game_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const handleUpdateMaxPlayers = () => {
        if (maxPlayers === gameData.max_players) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        router.patch(
            route("games.update", gameData.game_code),
            { max_players: maxPlayers },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setLoading(false);
                    toast.success("Matagumpay na na-update ang laro!");
                },
                onError: () => {
                    setMaxPlayers(gameData.max_players);
                    setIsEditing(false);
                    setLoading(false);
                },
            }
        );
    };

    const handleStartGame = () => {
        if (gameData.players.length === 0) {
            toast.error("Hindi maaaring simulan ang laro nang walang mga manlalaro");
            return;
        }

        setLoading(true);
        router.post(
            route("games.start", gameData.game_code),
            {},
            {
                onSuccess: () => toast.success("Matagumpay na nagsimula ang laro!"),
                onFinish: () => setLoading(false),
            }
        );
    };

    const handlePauseResumeGame = async () => {
        setLoading(true);
        const canPaused = gameData.can_pause;
        const isPaused = gameData.can_resume;
        const action = isPaused ? "resume" : "pause";

        try {
            const routeName = canPaused ? "games.pause" : "games.resume";
            await axios.post(route(routeName, gameData.game_code));

            const message = isPaused
                ? "Matagumpay na na-resume ang laro!"
                : "Matagumpay na na-pause ang laro!";
            toast.success(message);

            router.visit(route("games.start", gameData.game_code));
        } catch (error) {
            console.error(`Error ${action}ing game:`, error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                const errorMessage = isPaused
                    ? "Nabigong i-resume ang laro. Paki-try muli."
                    : "Nabigong i-pause ang laro. Paki-try muli.";
                alert(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEndGame = () => {
        setLoading(true);
        router.post(
            route("games.end", gameData.game_code),
            {},
            {
                onSuccess: () => {
                    setShowEndModal(false);
                    setLoading(false);
                    toast.success("Natapos na ang laro!");
                },
                onError: () => {
                    setLoading(false);
                },
            }
        );
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            waiting: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Naghihintay ng mga Manlalaro",
                icon: LuClock,
            },
            active: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Aktibo",
                icon: LuPlay,
            },
            paused: {
                bg: "bg-orange-100",
                text: "text-orange-800",
                label: "Naka-pause",
                icon: LuPause,
            },
            finished: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                label: "Tapos na ang Laro",
                icon: MdOutlineStopCircle,
            },
        };

        const config = statusConfig[status] || statusConfig.waiting;
        const IconComponent = config.icon;

        return (
            <div
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${config.bg} ${config.text}`}
            >
                <IconComponent className="w-4 h-4 mr-2" />
                {config.label}
            </div>
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

    const getActionButtons = () => {
        const buttons = [];

        if (gameData.status === "waiting") {
            buttons.push(
                <button
                    key="start"
                    onClick={handleStartGame}
                    disabled={loading || game.players_count === 0}
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                    {loading ? (
                        <LuRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        <LuPlay className="w-5 h-5 mr-2" />
                    )}
                    Sisimulan ang Laro
                </button>
            );
        }

        if (gameData.status === "active") {
            buttons.push(
                <button
                    key="pause"
                    onClick={() => setShowPauseModal(true)}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm mr-3"
                >
                    {loading ? (
                        <LuRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <LuPause className="w-4 h-4 mr-2" />
                    )}
                    I-pause
                </button>
            );
        }

        if (gameData.status === "paused") {
            buttons.push(
                <button
                    key="resume"
                    onClick={() => setShowPauseModal(true)}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm mr-3"
                >
                    {loading ? (
                        <LuRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <LuPlay className="w-4 h-4 mr-2" />
                    )}
                    I-resume
                </button>
            );
        }

        if (gameData.status === "active" || gameData.status === "paused") {
            buttons.push(
                <button
                    key="end"
                    onClick={() => setShowEndModal(true)}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                    {loading ? (
                        <LuRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <MdOutlineStopCircle className="w-4 h-4 mr-2" />
                    )}
                    Tapusin ang Laro
                </button>
            );
        }

        return buttons;
    };

    const getBgColor = (status) => {
        const configs = {
            joined: "bg-blue-100 text-blue-800",
            playing: "bg-green-100 text-green-800",
            won: "bg-yellow-100 text-yellow-800",
            disconnected: "bg-red-100 text-red-800",
        };

        return configs[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <LuGamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Game: {gameData.game_code}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {gameData.word_bank?.name} •{" "}
                                {gameData.word_bank?.word_count} words
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {getActionButtons()}
                    </div>
                </div>
            }
        >
            <Head title={`Laro ${gameData.game_code}`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.visit(route("games.index"))}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <LuArrowLeft className="w-4 h-4 mr-1" />
                            Bumalik sa Mga Laro
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Game Details Card */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Detalye ng Laro
                                        </h3>
                                        {getStatusBadge(gameData.status)}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Game Code */}
                                        <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                Game Code
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
                                                    <div className="text-2xl font-bold text-center text-gray-900 tracking-wider">
                                                        {gameData.game_code}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleCopyCode}
                                                    className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Kopyahin ang game code"
                                                >
                                                    {copied ? (
                                                        <LuCheck className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <LuCopy className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Max Players */}
                                        <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                Max Players
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                {isEditing ? (
                                                    <>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="100"
                                                            value={maxPlayers}
                                                            onChange={(e) =>
                                                                setMaxPlayers(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            disabled={loading}
                                                        />
                                                        <button
                                                            onClick={
                                                                handleUpdateMaxPlayers
                                                            }
                                                            disabled={loading}
                                                            className="p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            {loading ? (
                                                                <LuRefreshCw className="w-5 h-5 animate-spin" />
                                                            ) : (
                                                                <LuSave className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setIsEditing(
                                                                    false
                                                                );
                                                                setMaxPlayers(
                                                                    gameData.max_players
                                                                );
                                                            }}
                                                            className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <LuX className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
                                                            <div className="text-lg font-semibold text-center text-gray-900">
                                                                {
                                                                    gameData.max_players
                                                                }
                                                            </div>
                                                        </div>
                                                        {gameData.status ===
                                                            "waiting" && (
                                                            <button
                                                                onClick={() =>
                                                                    setIsEditing(
                                                                        true
                                                                    )
                                                                }
                                                                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                                    title="I-edit ang max players"
                                                            >
                                                                <LuPencil className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Current Players */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                    Kasalukuyang Mga Manlalaro
                                                </label>
                                            <div className="p-3 bg-gray-50 rounded-lg border">
                                                <div className="text-lg font-semibold text-center text-gray-900">
                                                    {gameData.players.length}/
                                                    {gameData.max_players}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Created */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                    Nilikha
                                                </label>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg border">
                                                <LuCalendar className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(
                                                        gameData.created_at
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Word Bank Details */}
                                        <div className="sm:col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Word Bank
                                            </label>
                                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-blue-900">
                                                            {
                                                                gameData
                                                                    .word_bank
                                                                    ?.name
                                                            }
                                                        </h4>
                                                        <p className="text-sm text-blue-700 mt-1">
                                                            {gameData.word_bank
                                                                ?.description ||
                                                                "No description available"}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center text-blue-600">
                                                            <LuHash className="w-4 h-4 mr-1" />
                                                            <span className="font-semibold">
                                                                {
                                                                    gameData
                                                                        .word_bank
                                                                        ?.word_count
                                                                }
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-blue-500">
                                                            words
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Players Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <LuUsers className="w-5 h-5 mr-2" />
                                            Players
                                        </h3>
                                        <span className="text-sm text-gray-600">
                                            {gameData.players.length}/
                                            {gameData.max_players}
                                        </span>
                                    </div>

                                    <div className="space-y-3 overflow-y-auto h-96">
                                        {gameData.players &&
                                        gameData.players.length > 0 ? (
                                            gameData.players.map(
                                                (player, index) => (
                                                    <div
                                                        key={player.id || index}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                                {player.name
                                                                    ? player.name
                                                                          .charAt(
                                                                              0
                                                                          )
                                                                          .toUpperCase()
                                                                    : index + 1}
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {player.name ||
                                                                        `Player ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                </div>
                                                                {player.joined_at && (
                                                                    <div className="text-xs text-gray-500">
                                                                        Joined:{" "}
                                                                        {formatDate(
                                                                            player.joined_at
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`px-2 py-1 inline-flex items-center font-medium rounded-lg border text-xs ${getBgColor(
                                                                player.status_info.label.toLowerCase()
                                                            )}`}
                                                        >
                                                            {
                                                                player
                                                                    .status_info
                                                                    .label
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-center py-8">
                                                <LuUserPlus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    No players yet
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Share the game code to
                                                    invite players
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {gameData.status === "waiting" &&
                                        gameData.players.length <
                                            gameData.max_players && (
                                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <div className="flex">
                                                    <LuClock className="w-4 h-4 text-yellow-600 mt-0.5" />
                                                    <div className="ml-2">
                                                        <p className="text-xs text-yellow-800 font-medium">
                                                            Waiting for players
                                                        </p>
                                                        <p className="text-xs text-yellow-600 mt-1">
                                                            Game will
                                                            auto-refresh when
                                                            new players join
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {gameData.status === "waiting" &&
                                        gameData.players.length === 0 && (
                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex">
                                                    <LuGamepad2 className="w-4 h-4 text-blue-600 mt-0.5" />
                                                    <div className="ml-2">
                                                        <p className="text-xs text-blue-800 font-medium">
                                                            Ready to play!
                                                        </p>
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            Need at least 1
                                                            player to start the
                                                            game
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PauseGameModal
                show={showPauseModal}
                onClose={() => setShowPauseModal(false)}
                onConfirm={handlePauseResumeGame}
                loading={loading}
                isPaused={gameData.status === "paused"}
            />
            <EndGameModal
                show={showEndModal}
                onClose={() => setShowEndModal(false)}
                onConfirm={handleEndGame}
                loading={loading}
            />
        </AuthenticatedLayout>
    );
}

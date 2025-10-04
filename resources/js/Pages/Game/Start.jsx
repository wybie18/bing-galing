import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    LuGamepad2,
    LuUsers,
    LuHash,
    LuPlay,
    LuPause,
    LuRefreshCw,
    LuArrowLeft,
    LuMic,
    LuSkipForward,
    LuTrophy,
    LuCrown,
} from "react-icons/lu";

import { MdOutlineStopCircle } from "react-icons/md";
import PauseGameModal from "./Modals/PauseGameModal";
import EndGameModal from "./Modals/EndGameModal";
import toast from "react-hot-toast";

export default function Start({
    game,
    current_word,
    statistics,
    recent_words,
}) {
    const [gameData, setGameData] = useState(game.data);
    const [loading, setLoading] = useState(false);
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [currentWord, setCurrentWord] = useState(current_word || null);
    const [calledWords, setCalledWords] = useState(recent_words || []);
    const [winners, setWinners] = useState([]);
    const [gameStats, setGameStats] = useState({
        totalWords: statistics.total_words || 0,
        wordsRemaining: statistics.words_remaining || 0,
        playersWithBingo: statistics.calledWordsCount || 0,
    });

    useEffect(() => {
        setGameData(game.data);
        const existingWinners = game.data.players
            .filter((p) => p.status === "won")
            .sort((a, b) => new Date(a.won_at) - new Date(b.won_at));
        setWinners(existingWinners);
    }, [game.data]);

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
            .listen(".player.status.changed", (event) => {
                console.log("Player status changed:", event);

                setGameData((prev) => ({
                    ...prev,
                    players: prev.players.map((p) =>
                        p.id === event.player.id ? event.player : p
                    ),
                }));

                if (event.is_winner) {
                    setWinners((prev) => {
                        const alreadyExists = prev.some(
                            (w) => w.id === event.player.id
                        );
                        if (!alreadyExists) {
                            toast.success(event.message);
                            return [...prev, event.player];
                        }
                        return prev;
                    });

                    setGameStats((prev) => ({
                        ...prev,
                        playersWithBingo: prev.playersWithBingo + 1,
                    }));
                } else {
                    toast(event.message);
                }
            })
            .error((error) => {
                console.error("Echo error:", error);
            });

        return () => {
            Echo.leaveChannel(`game.${gameData.game_code}`);
        };
    }, [gameData.game_code]);

    const handleCallNextWord = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                route("games.call-word", gameData.game_code)
            );

            if (response.data.current_word) {
                const newWordData = response.data.current_word;
                setCurrentWord(newWordData);

                setCalledWords((prev) => [...prev, newWordData]);

                setGameStats({
                    totalWords: response.data.statistics.total_words,
                    wordsRemaining: response.data.statistics.words_remaining,
                    playersWithBingo: gameStats.playersWithBingo,
                });
            }

            if (response.data.game_completed) {
                toast.success("Game completed! All words have been called.");
                router.reload();
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to call next word. Please try again.");
            }
        } finally {
            setLoading(false);
        }
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
                ? "Game resumed successfully!"
                : "Game paused successfully!";
            toast.success(message);
            setShowPauseModal(false);

            router.reload({ only: ["game"] });
        } catch (error) {
            console.error(`Error ${action}ing game:`, error);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                const errorMessage = isPaused
                    ? "Failed to resume game. Please try again."
                    : "Failed to pause game. Please try again.";
                toast.error(errorMessage);
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
                    toast.success("Game ended!");
                },
                onError: () => {
                    setLoading(false);
                },
            }
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

    const getBgColor = (status) => {
        const configs = {
            joined: "bg-blue-100 text-blue-800",
            playing: "bg-green-100 text-green-800",
            won: "bg-yellow-100 text-yellow-800",
            disconnected: "bg-red-100 text-red-800",
        };

        return configs[status] || "bg-gray-100 text-gray-800";
    };

    const getWinnerMedal = (index) => {
        const medals = ["🥇", "🥈", "🥉"];
        return medals[index] || "🏆";
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
                                Laro: {gameData.game_code}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {gameData.word_bank?.name} • {gameData.status}
                            </p>
                        </div>
                    </div>
                    {gameData.status != "finished" && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowPauseModal(true)}
                                disabled={loading}
                                className={`inline-flex items-center px-4 py-2 ${
                                    gameData.can_resume
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-orange-600 hover:bg-orange-700"
                                } disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm`}
                            >
                                {gameData.can_resume ? (
                                    <>
                                        <LuPlay className="w-4 h-4 mr-2" />
                                        Resume
                                    </>
                                ) : (
                                    <>
                                        <LuPause className="w-4 h-4 mr-2" />
                                        Pause
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowEndModal(true)}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                <MdOutlineStopCircle className="w-4 h-4 mr-2" />
                                End Game
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={`Game ${gameData.game_code} - Active`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.visit(route("games.index"))}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <LuArrowLeft className="w-4 h-4 mr-1" />
                            Back to Games
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Game Control Panel */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Current Word Display */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                        Kasalukuyang Salita
                                    </h3>

                                    {currentWord ? (
                                        <div className="text-center">
                                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                                                <span className="text-3xl font-bold text-white">
                                                    {currentWord.word ||
                                                        "Tawagin ang unang salita"}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-lg mb-6">
                                                {currentWord.meaning || ""}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <LuMic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 text-lg">
                                                Handa nang tawagin ang unang
                                                salita
                                            </p>
                                        </div>
                                    )}

                                    {gameData.status != "finished" && (
                                        <div className="flex justify-center">
                                        <button
                                            onClick={handleCallNextWord}
                                            disabled={loading}
                                            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm text-lg"
                                        >
                                            {loading ? (
                                                <LuRefreshCw className="w-5 h-5 mr-3 animate-spin ml-2" />
                                            ) : (
                                                <LuSkipForward className="w-5 h-5 mr-3 ml-2" />
                                            )}
                                            <span className="mr-2">
                                                {currentWord
                                                    ? "Tawagin ang Susunod na Salita"
                                                    : "Tawagin ang Unang Salita"}
                                            </span>
                                        </button>
                                    </div>
                                    )}
                                </div>
                            </div>

                            {/* Game Statistics */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Estadistika ng Laro
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {calledWords.length}
                                            </div>
                                            <div className="text-sm text-blue-800">
                                                Mga Salitang Tinawag
                                            </div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                {gameStats.wordsRemaining}
                                            </div>
                                            <div className="text-sm text-green-800">
                                                Mga Natitirang Salita
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {gameStats.playersWithBingo}
                                            </div>
                                            <div className="text-sm text-purple-800">
                                                Mga Manlalarong may Bingo
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Called Words History */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Mga Tinawag na Salita
                                        </h3>
                                        <span className="text-sm text-gray-600">
                                            {calledWords.length} of{" "}
                                            {gameStats.totalWords}
                                        </span>
                                    </div>

                                    {calledWords.length > 0 ? (
                                        <div className="max-h-64 overflow-y-auto">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                                {calledWords
                                                    .slice()
                                                    .reverse()
                                                    .map((word, index) => (
                                                        <div
                                                            key={word.id}
                                                            className={`p-3 text-center rounded-lg border ${
                                                                index === 0
                                                                    ? "bg-blue-100 border-blue-300 text-blue-800"
                                                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                                            }`}
                                                        >
                                                            <div className="font-medium">
                                                                {word.word}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <LuHash className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600">
                                                Wala pang tinawag na salita
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Players Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Game Info Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Impormasyon ng Laro
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Katayuan
                                            </span>
                                            <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                                                <LuPlay className="w-3 h-3 mr-1" />
                                                Aktibo
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Nagsimula
                                            </span>
                                            <span className="text-sm text-gray-900">
                                                {formatDate(
                                                    gameData.started_at ||
                                                        gameData.created_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Word Bank
                                            </span>
                                            <span className="text-sm text-gray-900">
                                                {gameData.word_bank?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Players Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <LuUsers className="w-5 h-5 mr-2" />
                                            Mga Manlalaro
                                        </h3>
                                        <span className="text-sm text-gray-600">
                                            {gameData.players.length}/
                                            {gameData.max_players}
                                        </span>
                                    </div>

                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {gameData.players &&
                                        gameData.players.length > 0 ? (
                                            gameData.players.map(
                                                (player, index) => (
                                                    <Link
                                                        href={route(
                                                            "games.players.show",
                                                            [
                                                                gameData.game_code,
                                                                player.id,
                                                            ]
                                                        )}
                                                        as="div"
                                                        key={player.id || index}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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
                                                    </Link>
                                                )
                                            )
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-gray-600">
                                                    Walang mga manlalaro
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {winners.length > 0 && (
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border-2 border-yellow-200">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <LuTrophy className="w-5 h-5 mr-2 text-yellow-600" />
                                                Mga Nanalo
                                            </h3>
                                            <LuCrown className="w-6 h-6 text-yellow-600" />
                                        </div>

                                        <div className="space-y-3 overflow-y-auto h-96">
                                            {winners.map((winner, index) => (
                                                <div
                                                    key={winner.id}
                                                    className={`flex items-center justify-between p-4 rounded-lg ${
                                                        index === 0
                                                            ? "bg-yellow-100 border-2 border-yellow-300"
                                                            : index === 1
                                                            ? "bg-gray-100 border-2 border-gray-300"
                                                            : index === 2
                                                            ? "bg-orange-100 border-2 border-orange-300"
                                                            : "bg-white border border-gray-200"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">
                                                            {getWinnerMedal(
                                                                index
                                                            )}
                                                        </span>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">
                                                                {winner.name}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                {winner.won_at &&
                                                                    formatDate(
                                                                        winner.won_at
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-gray-700">
                                                            Rank #{index + 1}
                                                        </div>
                                                        {winner.play_time && (
                                                            <div className="text-xs text-gray-500">
                                                                {
                                                                    winner.play_time
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
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

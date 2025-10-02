import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    LuGamepad2,
    LuUsers,
    LuTrophy,
    LuClock,
    LuTrendingUp,
    LuCalendar,
    LuEye,
    LuPlus,
} from 'react-icons/lu';

export default function Dashboard({ stats, recentGames }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            waiting: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                label: 'Naghihintay',
            },
            active: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                label: 'Aktibo',
            },
            paused: {
                bg: 'bg-orange-100',
                text: 'text-orange-800',
                label: 'Naka-pause',
            },
            finished: {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                label: 'Natapos',
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

    const statCards = [
        {
            title: 'Total Games',
            value: stats?.total_games || 0,
            icon: LuGamepad2,
            color: 'from-blue-400 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: 'Active Games',
            value: stats?.active_games || 0,
            icon: LuClock,
            color: 'from-green-400 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: 'Total Players',
            value: stats?.total_players || 0,
            icon: LuUsers,
            color: 'from-purple-400 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            title: 'Completed Games',
            value: stats?.completed_games || 0,
            icon: LuTrophy,
            color: 'from-yellow-400 to-yellow-600',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <LuTrendingUp className="w-8 h-8 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Dashboard
                            </h2>
                            <p className="text-sm text-gray-600">
                                Pangkalahatang-ideya ng iyong mga pang-edukasyong word bingo na laro
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('games.index')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                    >
                        <LuPlus className="w-5 h-5 mr-2" />
                        Gumawa ng Laro
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div
                                            className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Recent Games Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Mga Kamakailang Laro
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Ang iyong mga pinakabagong word bingo na laro
                                    </p>
                                </div>
                                    <Link
                                        href={route('games.index')}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Tingnan lahat
                                    </Link>
                            </div>
                        </div>

                        {recentGames && recentGames.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Game Code
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Word Bank
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Katayuan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mga Manlalaro
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nilikha
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mga Aksyon
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentGames.map((game) => (
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
                                                                    {game.game_code}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {game.word_bank?.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {game.word_bank?.word_count} words
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(game.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            {game.players_count}/{game.max_players}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <LuCalendar className="w-4 h-4 mr-1" />
                                                            {formatDate(game.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('games.show', game.game_code)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center"
                                                        >
                                                            <LuEye className="w-4 h-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="lg:hidden divide-y divide-gray-200">
                                    {recentGames.map((game) => (
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
                                                            {getStatusBadge(game.status)}
                                                        </div>
                                                        <p className="text-sm text-gray-700 mb-2">
                                                            {game.word_bank?.name}
                                                        </p>
                                                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                                                            <span className="flex items-center">
                                                                <LuUsers className="w-3 h-3 mr-1" />
                                                                {game.players_count}/{game.max_players}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <LuCalendar className="w-3 h-3 mr-1" />
                                                                {formatDate(game.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={route('games.show', game.game_code)}
                                                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors ml-2"
                                                >
                                                    <LuEye className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <LuGamepad2 className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    Wala pang laro
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Magsimula sa pamamagitan ng paglikha ng iyong unang laro.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route('games.index')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <LuPlus className="w-5 h-5 mr-2" />
                                        Gumawa ng Laro
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
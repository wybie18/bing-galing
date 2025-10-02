import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                <header className="mb-8 text-center">
                    <h1
                        className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 drop-shadow-sm pb-4"
                        style={{ fontFamily: "'Fredoka One', cursive" }}
                    >
                        BingGaling!
                    </h1>
                    <p className="mt-2 text-lg text-slate-600 font-medium">
                        A Filipino Word Bingo Adventure!
                    </p>
                </header>

                <main>{children}</main>
            </div>
        </div>
    );
}

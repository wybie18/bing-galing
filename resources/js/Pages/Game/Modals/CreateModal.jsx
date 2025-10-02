import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SearchableSelect from "@/Components/SearchableSelect";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CreateModal({ openModal, closeModal }) {
    const [wordBanks, setWordBanks] = useState([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        word_bank_id: "",
        max_players: 30,
    });

    useEffect(() => {
        if (openModal) {
            axios
                .get(route("word-banks.all"))
                .then((response) => {
                    setWordBanks(response.data.data);
                })
                .catch((error) => {
                    console.error("Error fetching word banks:", error);
                });
        }
    }, [openModal]);

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("games.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                closeModal();
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    return (
        <Modal show={openModal} onClose={closeModal} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Gumawa ng Bagong Laro
                    </h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <InputLabel
                                value="Pumili ng word bank mula sa listahan sa ibaba."
                                className="block text-sm font-medium text-gray-700 mb-1"
                            />

                        <SearchableSelect
                            options={wordBanks}
                            onChange={(value) => setData("word_bank_id", value)}
                            value={data.word_bank_id}
                            labelKey="name"
                            valueKey="id"
                            placeholder="Maghanap ng word bank..."
                        />

                        <InputError
                            message={errors.word_bank_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="max-players"
                            value="Max Players"
                            className="block text-sm font-medium text-gray-700"
                        />
                        <TextInput
                            id="max-players"
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={data.max_players}
                            onChange={(e) =>
                                setData("max_players", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.max_players}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Kanselahin
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 flex text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Ginagawa...
                                </>
                            ) : (
                                "Gumawa"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

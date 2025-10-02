<?php
namespace App\Http\Controllers;

use App\Models\Word;
use App\Models\WordBank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WordBankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = WordBank::with(['teacher:id,name', 'words' => function ($q) {
            $q->where('is_active', true);
        }])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('teacher', function ($teacherQuery) use ($search) {
                        $teacherQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('queryFilter') && $request->queryFilter === 'my_wordbanks') {
            $query->where('teacher_id', Auth::id());
        }

        $sortField     = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query->orderBy($sortField, $sortDirection);

        $wordBanks = $query->paginate(12);

        $wordBanks->getCollection()->transform(function ($wordBank) {
            $wordBank->is_owner   = $wordBank->teacher_id === Auth::id();
            $wordBank->word_count = $wordBank->words->count();
            return $wordBank;
        });

        return Inertia::render('WordBanks/Index', [
            'wordBanks'    => $wordBanks,
            'queryFilters' => $request->only(['search', 'queryFilter']) ?: [],
            'queryParams'  => request()->query() ?: null,
        ]);
    }

    public function getAll()
    {
        $wordBanks = WordBank::select('id', 'name')->get();

        return response()->json([
            "data" => $wordBanks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('WordBanks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Request data:', $request->all());
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string|max:1000',
            'is_active'         => 'boolean',
            'words'             => 'array',
            'words.*.word'      => 'required|string|max:255',
            'words.*.meaning'   => 'required|string|max:1000',
            'words.*.is_active' => 'boolean',
        ]);

        Log::info('Validated data:', $validated);

        $wordBank = WordBank::create([
            'teacher_id'  => Auth::id(),
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active'   => $validated['is_active'] ?? true,
        ]);

        if (! empty($validated['words'])) {
            foreach ($validated['words'] as $wordData) {
                $wordBank->words()->create($wordData);
            }
        }

        return redirect()->route('word-banks.show', $wordBank)
            ->with('success', 'Word bank created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(WordBank $wordBank, Request $request)
    {
        $wordBank->load(['teacher:id,name']);

        // Get words with optional search
        $wordsQuery = $wordBank->words();

        if ($request->filled('search')) {
            $search = $request->search;
            $wordsQuery->where(function ($q) use ($search) {
                $q->where('word', 'like', "%{$search}%")
                    ->orWhere('meaning', 'like', "%{$search}%");
            });
        }

        $words = $wordsQuery->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('WordBanks/Show', [
            'wordBank' => [
                'id'          => $wordBank->id,
                'name'        => $wordBank->name,
                'description' => $wordBank->description,
                'is_active'   => $wordBank->is_active,
                'teacher'     => $wordBank->teacher,
                'created_at'  => $wordBank->created_at,
                'updated_at'  => $wordBank->updated_at,
                'is_owner'    => $wordBank->teacher_id === Auth::id(),
            ],
            'words'    => $words,
            'filters'  => $request->only(['search']),
            'queryParams' => $request->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WordBank $wordBank)
    {
        if ($wordBank->teacher_id !== Auth::id()) {
            abort(403, 'You can only edit your own word banks.');
        }

        $wordBank->load('words');

        return Inertia::render('WordBanks/Edit', [
            'wordBank' => $wordBank,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WordBank $wordBank)
    {
        if ($wordBank->teacher_id !== Auth::id()) {
            abort(403, 'You can only update your own word banks.');
        }

        Log::info('Request data:', $request->all());

        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string|max:1000',
            'is_active'         => 'boolean',
            'words'             => 'array',
            'words.*.id'        => 'sometimes|exists:words,id',
            'words.*.word'      => 'required|string|max:255',
            'words.*.meaning'   => 'required|string|max:1000',
            'words.*.is_active' => 'boolean',
        ]);

        Log::info('Validated data:', $validated);

        $wordBank->update([
            'name'        => $validated['name'],
            'description' => $validated['description'],
            'is_active'   => $validated['is_active'],
        ]);

        if (isset($validated['words'])) {
            $currentWordIds = collect($validated['words'])
                ->filter(fn($word) => isset($word['id']))
                ->pluck('id');

            $wordBank->words()
                ->whereNotIn('id', $currentWordIds)
                ->delete();

            foreach ($validated['words'] as $wordData) {
                if (isset($wordData['id'])) {
                    $wordBank->words()
                        ->where('id', $wordData['id'])
                        ->update(collect($wordData)->except('id')->toArray());
                } else {
                    $wordBank->words()->create($wordData);
                }
            }
        }

        return redirect()->route('word-banks.show', $wordBank)
            ->with('success', 'Word bank updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WordBank $wordBank)
    {
        if ($wordBank->teacher_id !== Auth::id()) {
            abort(403, 'You can only delete your own word banks.');
        }

        $wordBank->delete();

        return redirect()->route('word-banks.index')
            ->with('success', 'Word bank deleted successfully!');
    }

    /**
     * Store a new word in the specified word bank.
     * Only the owner can add words to their word bank.
     */
    public function storeWord(Request $request, WordBank $wordBank)
    {
        if ($wordBank->teacher_id !== Auth::id()) {
            abort(403, 'You can only add words to your own word banks.');
        }

        $validated = $request->validate([
            'word'      => [
                'required',
                'string',
                'max:255',
                Rule::unique('words')->where(function ($query) use ($wordBank) {
                    return $query->where('word_bank_id', $wordBank->id);
                }),
            ],
            'meaning'   => 'required|string|max:1000',
            'is_active' => 'boolean',
        ], [
            'word.unique' => 'This word already exists in this word bank.',
        ]);

        $word = $wordBank->words()->create([
            'word'      => $validated['word'],
            'meaning'   => $validated['meaning'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', 'Word added successfully!');
    }

    /**
     * Update a word in the specified word bank.
     * Only the owner can update words in their word bank.
     */
    public function updateWord(Request $request, WordBank $wordBank, Word $word)
    {
        if ($wordBank->teacher_id !== Auth::id() || $word->word_bank_id !== $wordBank->id) {
            abort(403, 'You can only update words in your own word banks.');
        }

        $validated = $request->validate([
            'word'      => [
                'required',
                'string',
                'max:255',
                Rule::unique('words')->where(function ($query) use ($wordBank) {
                    return $query->where('word_bank_id', $wordBank->id);
                })->ignore($word->id),
            ],
            'meaning'   => 'required|string|max:1000',
            'is_active' => 'boolean',
        ], [
            'word.unique' => 'This word already exists in this word bank.',
        ]);

        $word->update($validated);

        return back()->with('success', 'Word updated successfully!');
    }

    /**
     * Delete a word from the specified word bank.
     * Only the owner can delete words from their word bank.
     */
    public function destroyWord(WordBank $wordBank, Word $word)
    {
        if ($wordBank->teacher_id !== Auth::id() || $word->word_bank_id !== $wordBank->id) {
            abort(403, 'You can only delete words from your own word banks.');
        }

        $word->delete();

        return back()->with('success', 'Word deleted successfully!');
    }

    /**
     * Toggle word activation status.
     * Only the owner can toggle word status in their word bank.
     */
    public function toggleWordStatus(WordBank $wordBank, Word $word)
    {
        if ($wordBank->teacher_id !== Auth::id() || $word->word_bank_id !== $wordBank->id) {
            abort(403, 'You can only modify words in your own word banks.');
        }

        $word->update(['is_active' => ! $word->is_active]);

        $status = $word->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Word {$status} successfully!");
    }

    /**
     * Duplicate a word bank (create a copy for the authenticated teacher).
     * Teachers can duplicate any word bank to create their own version.
     */
    public function duplicate(WordBank $wordBank)
    {
        $duplicatedWordBank = WordBank::create([
            'teacher_id'  => Auth::id(),
            'name'        => $wordBank->name . ' (Copy)',
            'description' => $wordBank->description,
            'is_active'   => true,
        ]);

        $originalWords = $wordBank->words()->where('is_active', true)->get();
        foreach ($originalWords as $originalWord) {
            $duplicatedWordBank->words()->create([
                'word'      => $originalWord->word,
                'meaning'   => $originalWord->meaning,
                'is_active' => true,
            ]);
        }

        return redirect()->route('word-banks.show', $duplicatedWordBank)
            ->with('success', 'Word bank duplicated successfully! You can now modify it as your own.');
    }
}

// Divina Harmonia - script.js
// Main script file for handling UI interactions and future AI logic.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Divina Harmonia UI Loaded");

    // --- DOM Element References ---
    const notificationBar = document.getElementById('notification-bar');
    const generateSongButton = document.getElementById('generate-song-button');
    const mainPromptInput = document.getElementById('main-prompt-input');
    const clearEditorButton = document.getElementById('clear-editor-button');
    
    const songTitleOutput = document.getElementById('song-title-output');
    const songLyricsOutput = document.getElementById('song-lyrics-output');
    const songStructureOutput = document.getElementById('song-structure-output');
    const chordChartOutput = document.getElementById('chord-chart-output');
    const suggestedRewriteOutputDiv = document.getElementById('suggested-rewrite-output');
    const rewriteContentIdentifierPre = document.getElementById('rewrite-content-identifier');
    const rewriteContentLyricsPre = document.getElementById('rewrite-content-lyrics');
    const copyLyricsButton = document.getElementById('copy-lyrics-button');

    // Sidebar elements
    const sidebar = document.getElementById('sidebar');
    const sidebarResizer = document.getElementById('sidebar-resizer');
    const mainContent = document.getElementById('main-content');
    const genreSelect = document.getElementById('genre-select');
    const lyricTargetSelect = document.getElementById('lyric-target-select');
    const promptThemeInput = document.getElementById('prompt-theme');
    const toneSelect = document.getElementById('tone-select');
    const scriptureInput = document.getElementById('scripture-input');
    const structureTypeSelect = document.getElementById('structure-type');
    const voiceArrangementSelect = document.getElementById('voice-arrangement');
    const instrumentationStyleSelect = document.getElementById('instrumentation-style');
    const styleIconSelect = document.getElementById('style-icon');
    const lyricalDepthSlider = document.getElementById('lyrical-depth');

    // Creative Enhancer buttons
    const rewriteVerseButton = document.getElementById('rewrite-verse');
    const buildBridgeButton = document.getElementById('build-bridge');
    const enhanceMetaphorButton = document.getElementById('enhance-metaphor');
    const integrateScriptureButton = document.getElementById('integrate-scripture-button');
    const intensifyHookButton = document.getElementById('intensify-hook'); 

    // Songbook elements
    const songMoodsInput = document.getElementById('song-moods-input');
    const suggestMoodsButton = document.getElementById('suggest-moods-button');
    const saveSongButton = document.getElementById('save-song');
    const songbookSearchInput = document.getElementById('songbook-search');
    const songbookListContainer = document.getElementById('songbook-list-container');
    
    // Version History Modal elements
    const versionHistoryModal = document.getElementById('version-history-modal');
    const closeVersionModalButton = document.getElementById('close-version-modal');
    const versionHistoryTitleSpan = document.getElementById('version-history-title').querySelector('span'); 
    const versionListDiv = document.getElementById('version-list');

    // Divine Flow Mode
    const divineFlowButton = document.getElementById('divine-flow-button');
    const appContainer = document.getElementById('app-container');

    // Preview Player elements
    const previewPlayerDiv = document.getElementById('preview-player');
    const simulateLeadFemaleButton = document.getElementById('simulate-lead-female');
    const simulateLeadMaleButton = document.getElementById('simulate-lead-male');
    const simulateChoirLeadButton = document.getElementById('simulate-choir-lead');

    const SPINNER_HTML = '<span class="spinner-animation"></span>';
    const SONGBOOK_LS_KEY = 'divinaHarmoniaSongbook_v2'; 
    const SIDEBAR_WIDTH_LS_KEY = 'divinaHarmoniaSidebarWidth';
    const MIN_SIDEBAR_WIDTH = 200; // pixels
    const MAX_SIDEBAR_WIDTH = 600; // pixels

    const LYRICAL_DEPTH_MAP = {
        "1": "Simple & Congregational",
        "2": "Poetic & Reflective",
        "3": "Theological & Complex"
    };

    let notificationTimeout = null;
    let isDivineFlowModeActive = false;
    let currentLoadedSongId = null; 
    let songbook = []; 

    // --- Notification System ---
    function showNotification(message, type = 'info', duration = 4000) {
        if (!notificationBar) return;
        clearTimeout(notificationTimeout); 
        notificationBar.textContent = message;
        notificationBar.className = 'notification-bar'; 
        notificationBar.classList.add(type); 
        notificationBar.classList.add('show');
        notificationBar.style.display = 'block'; 
        notificationTimeout = setTimeout(() => {
            notificationBar.classList.remove('show');
            setTimeout(() => {
                 if (!notificationBar.classList.contains('show')) { 
                    notificationBar.style.display = 'none';
                 }
            }, 300); 
        }, duration);
    }

    // --- Event Listeners ---
    if (generateSongButton) {
        generateSongButton.addEventListener('click', handleGenerateSong);
    }
    if (clearEditorButton) {
        clearEditorButton.addEventListener('click', handleClearEditor);
    }
    if (copyLyricsButton) {
        copyLyricsButton.addEventListener('click', handleCopyLyrics);
    }

    if (rewriteVerseButton) rewriteVerseButton.addEventListener('click', handleRewriteVerse);
    if (buildBridgeButton) buildBridgeButton.addEventListener('click', handleBuildBridge);
    if (enhanceMetaphorButton) enhanceMetaphorButton.addEventListener('click', handleEnhanceMetaphor);
    if (integrateScriptureButton) integrateScriptureButton.addEventListener('click', handleIntegrateScripture);
    if (intensifyHookButton) intensifyHookButton.addEventListener('click', handleIntensifyHook);

    // Songbook Listeners
    if (suggestMoodsButton) suggestMoodsButton.addEventListener('click', handleSuggestMoods);
    if (saveSongButton) saveSongButton.addEventListener('click', handleSaveSong);
    if (songbookSearchInput) songbookSearchInput.addEventListener('input', handleSearchSongbook);
    
    // Version Modal Listeners
    if (closeVersionModalButton) {
        closeVersionModalButton.addEventListener('click', () => {
            if (versionHistoryModal) versionHistoryModal.style.display = 'none';
        });
    }
    // Close modal if clicked outside of modal-content
    if (versionHistoryModal) {
        versionHistoryModal.addEventListener('click', (event) => {
            if (event.target === versionHistoryModal) {
                versionHistoryModal.style.display = 'none';
            }
        });
    }

    // Divine Flow Mode Listener
    if (divineFlowButton && appContainer) {
        divineFlowButton.addEventListener('click', () => {
            isDivineFlowModeActive = !isDivineFlowModeActive;
            appContainer.classList.toggle('divine-flow-active', isDivineFlowModeActive);
            divineFlowButton.textContent = isDivineFlowModeActive ? 'Standard View' : 'Divine Flow Mode';
            // Toggle resizer visibility based on divine flow mode
            if (sidebarResizer) {
                sidebarResizer.style.display = isDivineFlowModeActive ? 'none' : (window.innerWidth > 768 ? 'block' : 'none');
            }
            showNotification(isDivineFlowModeActive ? 'Divine Flow Mode: Minimal UI for focused creation.' : 'Standard View: Full toolkit available.', 'info');
        });
    }

    // Vocal Simulation Listeners
    if (simulateLeadFemaleButton) simulateLeadFemaleButton.addEventListener('click', () => handleSimulateVocal('en-female', simulateLeadFemaleButton));
    if (simulateLeadMaleButton) simulateLeadMaleButton.addEventListener('click', () => handleSimulateVocal('en-male', simulateLeadMaleButton));
    if (simulateChoirLeadButton) simulateChoirLeadButton.addEventListener('click', () => handleSimulateVocal('en-female', simulateChoirLeadButton, true));
    
    // --- Sidebar Resizing Logic ---
    if (sidebar && sidebarResizer && mainContent) {
        const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_LS_KEY);
        if (savedWidth) {
            sidebar.style.width = `${Math.max(MIN_SIDEBAR_WIDTH, Math.min(parseInt(savedWidth, 10), MAX_SIDEBAR_WIDTH))}px`;
        } else {
            sidebar.style.width = '300px'; 
        }

        let isResizing = false;
        let startX, startWidth;

        sidebarResizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (appContainer.classList.contains('divine-flow-active') || window.innerWidth <= 768) return;

            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(window.getComputedStyle(sidebar).width, 10);

            document.documentElement.style.cursor = 'col-resize';
            sidebar.style.transition = 'none'; 
            if(mainContent) mainContent.style.transition = 'none';


            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        function handleMouseMove(e) {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            let newWidth = startWidth + dx;
            newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(newWidth, MAX_SIDEBAR_WIDTH));
            sidebar.style.width = `${newWidth}px`;
        }

        function handleMouseUp() {
            if (!isResizing) return;
            isResizing = false;
            document.documentElement.style.cursor = '';
            sidebar.style.transition = ''; 
            if(mainContent) mainContent.style.transition = '';

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            localStorage.setItem(SIDEBAR_WIDTH_LS_KEY, sidebar.style.width);
        }
        // Ensure resizer is hidden/shown correctly on window resize based on media query breakpoints
        window.addEventListener('resize', () => {
            if (sidebarResizer) {
                if (window.innerWidth <= 768 || appContainer.classList.contains('divine-flow-active')) {
                    sidebarResizer.style.display = 'none';
                    if (isResizing) handleMouseUp(); 
                } else {
                    sidebarResizer.style.display = 'block';
                }
            }
        });
    }

    // --- Helper Function for Button Loading State ---
    function setButtonLoadingState(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            if (!button.dataset.originalText && !button.dataset.originalHTML) { 
                if (button.innerHTML.includes('<span') || button.innerHTML.includes('<img')) { 
                    button.dataset.originalHTML = button.innerHTML;
                } else {
                    button.dataset.originalText = button.textContent;
                }
            }
            
            let baseContent = "";
            if (button.dataset.originalText) {
                baseContent = button.dataset.originalText;
            } else if (button.dataset.originalHTML) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = button.dataset.originalHTML;
                baseContent = tempDiv.textContent.trim() || "Loading";
            } else {
                 baseContent = button.textContent.trim() || "Loading";
            }
            if ((button.id === 'generate-song-button' || button.id === 'copy-lyrics-button') && button.dataset.originalHTML) {
                 // Handle cases where originalHTML contains icons/spans
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = button.dataset.originalHTML;
                const iconSpan = tempDiv.querySelector('span.icon, span.wand-emoji');
                if (iconSpan) {
                    tempDiv.removeChild(iconSpan);
                     button.innerHTML = `${iconSpan.outerHTML} ${tempDiv.textContent.trim()} ${SPINNER_HTML}`;
                } else {
                    button.innerHTML = `${tempDiv.textContent.trim()} ${SPINNER_HTML}`;
                }
            } else {
                 button.innerHTML = `${baseContent} ${SPINNER_HTML}`;
            }
        } else {
            button.disabled = false;
            if (button.dataset.originalHTML) {
                button.innerHTML = button.dataset.originalHTML;
                delete button.dataset.originalHTML;
            } else if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
                delete button.dataset.originalText;
            }
            const spinnerElement = button.querySelector('.spinner-animation');
            if (spinnerElement) spinnerElement.remove();
        }
    }

    // --- Utility function to check for existing lyrics ---
    function checkLyricsExist(forFeature = "this feature") {
        const currentLyricsPre = songLyricsOutput.querySelector('pre');
        if (!currentLyricsPre || currentLyricsPre.textContent.trim() === "" || currentLyricsPre.textContent.includes("Your spiritual song will appear here...") || currentLyricsPre.textContent.includes("No lyrics generated.") || currentLyricsPre.textContent.includes("Generating lyrics based on your divine inspiration...")) {
            showNotification(`Please generate or load a song with lyrics first to use ${forFeature}.`, "error");
            return false;
        }
        return currentLyricsPre.textContent;
    }
    
    // --- Helper function to get current sidebar context ---
    function getSidebarContext() {
        return {
            genre: genreSelect.value,
            lyricTarget: lyricTargetSelect.value,
            theme: promptThemeInput.value,
            tone: toneSelect.value,
            scripture: scriptureInput.value,
            structureType: structureTypeSelect.value,
            voiceArrangement: voiceArrangementSelect.value,
            instrumentationStyle: instrumentationStyleSelect.value,
            styleIcon: styleIconSelect.value,
            lyricalDepthValue: lyricalDepthSlider.value,
            lyricalDepthText: LYRICAL_DEPTH_MAP[lyricalDepthSlider.value],
            mainPrompt: mainPromptInput.value // Capture current main prompt
        };
    }

    function isSongReadyForSaving() {
        const title = songTitleOutput.textContent.trim();
        const lyricsPre = songLyricsOutput.querySelector('pre');
        const lyrics = lyricsPre ? lyricsPre.textContent.trim() : "";

        if (title === "Composing..." || title === "Untitled Song" || title === "Generation Failed" || title === "Response Error" || title === "Error" || !title) {
            showNotification("Please ensure the song has a valid title before saving.", "error");
            return false;
        }
        if (lyrics === "" || lyrics.includes("Your spiritual song will appear here...") || lyrics.includes("No lyrics generated.") || lyrics.includes("Generating lyrics based on your divine inspiration...")) {
            showNotification("Please ensure the song has lyrics before saving.", "error");
            return false;
        }
        return true;
    }

    // --- Core Functions ---

    async function handleGenerateSong() {
        const promptText = mainPromptInput.value.trim();
        if (!promptText) {
            showNotification("Please enter a prompt for your song.", "error");
            return;
        }

        if (!generateSongButton.dataset.originalHTML) {
            generateSongButton.dataset.originalHTML = generateSongButton.innerHTML;
        }
        setButtonLoadingState(generateSongButton, true);
        
        songTitleOutput.textContent = "Composing...";
        songLyricsOutput.innerHTML = "<p>Generating lyrics based on your divine inspiration... This may take a moment.</p>";
        songStructureOutput.innerHTML = "";
        chordChartOutput.innerHTML = "";
        suggestedRewriteOutputDiv.style.display = 'none'; 
        if (previewPlayerDiv) previewPlayerDiv.innerHTML = '<p>Audio preview placeholder. Click a simulation button below to generate.</p>';
        
        currentLoadedSongId = null; // New generation, so it's not linked to a previously loaded songbook item by default

        const generationParams = getSidebarContext(); // Use helper to get all params
        generationParams.mainPrompt = promptText; // Override with current main prompt
        generationParams.lyricTarget = lyricTargetSelect.value; // ensure this is picked up too.

        console.log("Generation Parameters:", generationParams);

        const systemPrompt = `You are 'Divina Harmonia', an advanced AI specializing in spiritual and gospel music composition. Your purpose is to help users create authentic and profound musical pieces.
Based on the user's detailed specifications (main prompt, genre, lyric target, theme, tone, scripture, structure type, voice arrangement, instrumentation, style influence, and lyrical depth), generate a complete song.

IMPORTANT: Respond ONLY with a single JSON object. Do not include any other text, greetings, or explanations before or after the JSON.
The JSON object must strictly follow this schema:
\`\`\`json
{
  "title": "string",
  "lyrics": "string",
  "structureNotes": "string",
  "chordChart": "string"
}
\`\`\`
- "title": A creative and fitting title for the song.
- "lyrics": The full lyrics of the song. Use newline characters (\\n) for line breaks within verses, choruses, bridges, etc. Clearly demarcate sections like (Verse 1), (Chorus), (Bridge), (Outro).
- "structureNotes": Detailed notes regarding the song's arrangement. Include information on the chosen structure (e.g., Verse-Chorus, AABA), voice arrangement (e.g., Solo, Lead + Harmony, Full Choir with SATB notes if applicable), instrumentation style (e.g., Orchestral, Band, Acoustic), suggested dynamics, melodic arcs, and any other relevant performance or arrangement details.
- "chordChart": A suggested basic chord progression suitable for the genre and mood. For example: 'Verse: C - G - Am - F | Chorus: G - C - D - G. Keep it relatively simple unless complexity is implied by the prompt.'

Ensure the output is rich, thematically relevant, and accurately reflects all user-provided parameters.
`;

        const userPrompt = `Please compose a song based on the following detailed specifications:
        
        Primary Inspiration / Main Request: "${generationParams.mainPrompt}"
        
        Genre: ${generationParams.genre.replace(/_/g, " ")}
        Specific Output Desired: ${generationParams.lyricTarget.replace(/_/g, " ")}
        Underlying Theme/Idea (if provided): ${generationParams.theme || "Not specified"}
        Desired Tone: ${generationParams.tone}
        Key Scripture Influence (if provided for overall song generation): ${generationParams.scripture || "Not specified"}
        
        Musical & Structural Elements:
        Song Structure Type: ${generationParams.structureType.replace(/_/g, " ")}
        Voice Arrangement: ${generationParams.voiceArrangement.replace(/_/g, " ")}
        Instrumentation Style: ${generationParams.instrumentationStyle.replace(/_/g, " ")}
        
        Stylistic & Depth Elements:
        Iconic Artist Influence: ${generationParams.styleIcon !== 'none' ? generationParams.styleIcon.replace(/_/g, " ") : "None specified"}
        Lyrical Depth: ${generationParams.lyricalDepthText}

        Generate the title, lyrics, comprehensive structure notes, and a suggested chord chart according to the JSON schema provided in the system instructions.
        `;

        try {
            const completion = await websim.chat.completions.create({
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
              ],
              json: true,
            });
            
            const aiResponseContent = completion.content;
            console.log("Raw AI Response (Song Gen):", aiResponseContent);

            let aiResponse;
            if (typeof aiResponseContent === 'string') {
                try {
                    aiResponse = JSON.parse(aiResponseContent);
                } catch (parseError) {
                    console.error("Error parsing AI response JSON (Song Gen):", parseError);
                    songLyricsOutput.innerHTML = `<p>There was an issue understanding the AI's response. It might not be valid JSON. Details: ${parseError.message}</p><p>Raw response: <pre>${aiResponseContent}</pre></p>`;
                    songTitleOutput.textContent = "Response Error";
                    showNotification("Error parsing AI's song data.", "error");
                    return; 
                }
            } else if (typeof aiResponseContent === 'object' && aiResponseContent !== null) {
                aiResponse = aiResponseContent; 
            } else {
                showNotification("AI response is not in a recognized format.", "error");
                throw new Error("AI response is not in a recognized format (string or object).");
            }
            
            console.log("Parsed AI Response (Song Gen):", aiResponse);
            displaySongOutput(aiResponse);
            showNotification("Song composed successfully!", "success");

        } catch (error) {
            console.error("Error generating song:", error);
            songLyricsOutput.innerHTML = `<p>An error occurred while composing with the Spirit. Please try again. Details: ${error.message}</p>`;
            songTitleOutput.textContent = "Generation Failed";
            showNotification(`Error generating song: ${error.message}`, "error");
        } finally {
            setButtonLoadingState(generateSongButton, false); 
        }
    }

    function displaySongOutput(songData, isLoadingVersion = false) {
        if (!songData || typeof songData !== 'object') {
            songTitleOutput.textContent = "Error";
            songLyricsOutput.innerHTML = "<p>Received invalid song data.</p>";
            console.error("Invalid songData received:", songData);
            return;
        }
        songTitleOutput.textContent = songData.title || "Untitled Song";
        const formattedLyrics = songData.lyrics ? songData.lyrics.replace(/\\n/g, '\n') : "No lyrics generated.";
        songLyricsOutput.innerHTML = `<pre>${formattedLyrics}</pre>`;
        if (formattedLyrics === "No lyrics generated." && !isLoadingVersion) { 
            showNotification("The AI did not generate lyrics for this request.", "info");
        }
        
        const formattedStructureNotes = songData.structureNotes ? songData.structureNotes.replace(/\\n/g, '\n') : "No structure notes.";
        songStructureOutput.innerHTML = `<p><strong>Arrangement & Structure Notes:</strong></p><pre>${formattedStructureNotes}</pre>`;
        
        const formattedChordChart = songData.chordChart ? songData.chordChart.replace(/\\n/g, '\n') : "No chord chart suggested.";
        chordChartOutput.innerHTML = `<p><strong>Suggested Chord Chart:</strong></p><pre>${formattedChordChart}</pre>`;
        
        if (songMoodsInput) {
            songMoodsInput.value = (songData.moods && Array.isArray(songData.moods)) ? songData.moods.join(', ') : '';
        }

        if (!isLoadingVersion) {
            mainPromptInput.value = `Generated: "${songData.title}". Refine further or start new.`;
        }
    }
    
    function handleClearEditor() {
        if (!confirm("Are you sure you want to clear the current song from the editor? Unsaved changes will be lost.")) {
            return;
        }
        mainPromptInput.value = "";
        songTitleOutput.textContent = "";
        songLyricsOutput.innerHTML = "<p>Your spiritual song will appear here...</p>";
        songStructureOutput.innerHTML = "";
        chordChartOutput.innerHTML = "";
        if (songMoodsInput) songMoodsInput.value = "";
        if (scriptureInput) scriptureInput.value = "";
        if (promptThemeInput) promptThemeInput.value = "";

        suggestedRewriteOutputDiv.style.display = 'none';
        if (previewPlayerDiv) previewPlayerDiv.innerHTML = '<p>Audio preview placeholder. Click a simulation button below to generate.</p>';
        
        currentLoadedSongId = null;
        showNotification("Editor cleared. Ready for new inspiration!", "info");
    }

    function handleCopyLyrics() {
        const lyricsText = songLyricsOutput.querySelector('pre')?.textContent;
        if (!lyricsText || lyricsText.includes("Your spiritual song will appear here...")) {
            showNotification("No lyrics to copy.", "info");
            return;
        }

        if (!copyLyricsButton.dataset.originalHTML) {
            copyLyricsButton.dataset.originalHTML = copyLyricsButton.innerHTML;
        }
        setButtonLoadingState(copyLyricsButton, true);

        navigator.clipboard.writeText(lyricsText)
            .then(() => {
                showNotification("Lyrics copied to clipboard!", "success");
            })
            .catch(err => {
                console.error("Failed to copy lyrics: ", err);
                showNotification("Failed to copy lyrics. Check console for error.", "error");
            })
            .finally(() => {
                setButtonLoadingState(copyLyricsButton, false);
            });
    }

    async function handleRewriteVerse() {
        const currentLyrics = checkLyricsExist("rewriting a verse");
        if (!currentLyrics) return;

        setButtonLoadingState(rewriteVerseButton, true);
        suggestedRewriteOutputDiv.style.display = 'none'; 
        const context = getSidebarContext();

        const systemPrompt = `You are 'Divina Harmonia - Lyrical Refiner'. Your task is to rewrite a specific part of a song, typically a verse or chorus. Maintain the song's original theme, and approximate length/meter of the section being rewritten. Focus on providing a fresh lyrical perspective, enhanced imagery, or deeper emotional resonance, aligned with the provided song context.
Respond ONLY with a single JSON object following this schema:
\`\`\`json
{
  "identifiedSection": "A brief description of the section you chose to rewrite, e.g., 'Verse 1 starting with...'",
  "rewrittenSection": "The new lyrics for that section. Use \\n for line breaks."
}
\`\`\``;
        const userPrompt = `Current song lyrics:\n\`\`\`\n${currentLyrics}\n\`\`\`\n
Considering the following context for the overall song:
- Genre: ${context.genre.replace(/_/g, " ")}
- Tone: ${context.tone}
- Iconic Style Influence: ${context.styleIcon !== 'none' ? context.styleIcon.replace(/_/g, " ") : "None specified"}
- Desired Lyrical Depth: ${context.lyricalDepthText}

Please identify and rewrite ONE verse (or a significant lyrical section if distinct verses aren't clear). The rewrite should align with this provided song context. If there are multiple verses, you can target the first or second. Respond strictly with the JSON object as specified.`;

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                json: true,
            });

            const aiResponseContent = completion.content;
            console.log("Raw AI Response (Rewrite Verse):", aiResponseContent);
            let aiResponse = typeof aiResponseContent === 'string' ? JSON.parse(aiResponseContent) : aiResponseContent;

            if (aiResponse && aiResponse.rewrittenSection) {
                rewriteContentIdentifierPre.textContent = `Suggestion for: ${aiResponse.identifiedSection || 'a lyrical section'}`;
                rewriteContentLyricsPre.textContent = aiResponse.rewrittenSection.replace(/\\n/g, '\n');
                const existingExplanation = rewriteContentLyricsPre.querySelector('p.explanation-text');
                if (existingExplanation) existingExplanation.remove();
                suggestedRewriteOutputDiv.style.display = 'block';
                showNotification("Verse rewrite suggestion generated!", "success");
            } else {
                showNotification("AI response for rewrite was incomplete.", "error");
                throw new Error("AI response did not contain a rewritten section.");
            }
        } catch (error) {
            console.error("Error rewriting verse:", error);
            rewriteContentIdentifierPre.textContent = "Error during rewrite.";
            rewriteContentLyricsPre.textContent = `Details: ${error.message}. Raw response might be in console.`;
            const existingExplanation = rewriteContentLyricsPre.querySelector('p.explanation-text');
            if (existingExplanation) existingExplanation.remove();
            suggestedRewriteOutputDiv.style.display = 'block';
            showNotification(`Error rewriting verse: ${error.message}`, "error");
        } finally {
            setButtonLoadingState(rewriteVerseButton, false);
        }
    }

    async function handleBuildBridge() {
        const currentLyrics = checkLyricsExist("building a bridge");
        if (!currentLyrics) return;

        setButtonLoadingState(buildBridgeButton, true);
        suggestedRewriteOutputDiv.style.display = 'none'; 
        const context = getSidebarContext();

        const systemPrompt = `You are 'Divina Harmonia - Bridge Architect'. Your task is to create a fitting and impactful bridge section for the provided song lyrics. The bridge should connect existing themes, potentially modulate or shift perspective, and build emotional or spiritual intensity, leading effectively into a subsequent chorus or verse. The bridge must align with the song's established style, tone, lyrical quality, and overall context.
Respond ONLY with a single JSON object following this schema:
\`\`\`json
{
  "updatedLyricsWithBridge": "The complete song lyrics with the newly generated bridge integrated logically within the song structure. Ensure existing song structure (Verse, Chorus tags) is preserved or adapted, and clearly mark the new (Bridge) section with a tag like (Bridge)."
}
\`\`\``;
        const userPrompt = `Current song lyrics:\n\`\`\`\n${currentLyrics}\n\`\`\`\n
Considering the following context for the overall song:
- Genre: ${context.genre.replace(/_/g, " ")}
- Tone: ${context.tone}
- Iconic Style Influence: ${context.styleIcon !== 'none' ? context.styleIcon.replace(/_/g, " ") : "None specified"}
- Desired Lyrical Depth: ${context.lyricalDepthText}
- Current Structure Type: ${context.structureType.replace(/_/g, " ")}

Please generate a bridge for this song that fits this context and provide the full, updated lyrics with the bridge integrated. Ensure the bridge is clearly marked (e.g., with "(Bridge)"). Adhere strictly to the JSON output schema.`;
        
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                json: true,
            });

            const aiResponseContent = completion.content;
            console.log("Raw AI Response (Build Bridge):", aiResponseContent);
            let aiResponse = typeof aiResponseContent === 'string' ? JSON.parse(aiResponseContent) : aiResponseContent;

            if (aiResponse && aiResponse.updatedLyricsWithBridge) {
                songLyricsOutput.innerHTML = `<pre>${aiResponse.updatedLyricsWithBridge.replace(/\\n/g, '\n')}</pre>`;
                showNotification("Bridge successfully added and lyrics updated!", "success");
            } else {
                showNotification("AI response for bridge was incomplete.", "error");
                throw new Error("AI response did not contain the updated lyrics with bridge.");
            }
        } catch (error) {
            console.error("Error building bridge:", error);
            showNotification(`Error building bridge: ${error.message}`, "error");
            const currentLyricsContent = songLyricsOutput.querySelector('pre');
            if (currentLyricsContent) {
                 currentLyricsContent.innerHTML += `<p style="color:red; margin-top:1em;">Error building bridge: ${error.message}</p>`;
            } else {
                 songLyricsOutput.innerHTML = `<p style="color:red;">Error building bridge: ${error.message}</p>`;
            }
        } finally {
            setButtonLoadingState(buildBridgeButton, false);
        }
    }

    async function handleEnhanceMetaphor() {
        const currentLyrics = checkLyricsExist("enhancing a metaphor");
        if (!currentLyrics) return;
    
        setButtonLoadingState(enhanceMetaphorButton, true);
        suggestedRewriteOutputDiv.style.display = 'none'; 
        const context = getSidebarContext();
    
        const systemPrompt = `You are 'Divina Harmonia - Metaphor Weaver'. Your task is to identify a phrase or section in the provided song lyrics that could be elevated with a richer, more evocative metaphor or spiritual imagery. This enhancement must fit the song's established theme, and align with the provided overall song context (genre, tone, style, depth).
Respond ONLY with a single JSON object following this schema:
\`\`\`json
{
  "originalPhrase": "The original phrase, line, or short section you identified for enhancement.",
  "enhancedPhrase": "The new phrase, line, or short section with the enhanced metaphor. Use \\n for line breaks if appropriate.",
  "explanation": "A brief explanation of why this enhancement works, the imagery invoked, or its thematic relevance, considering the song's context."
}
\`\`\``;
        const userPrompt = `Current song lyrics:\n\`\`\`\n${currentLyrics}\n\`\`\`\n
Considering the following context for the overall song:
- Genre: ${context.genre.replace(/_/g, " ")}
- Tone: ${context.tone}
- Iconic Style Influence: ${context.styleIcon !== 'none' ? context.styleIcon.replace(/_/g, " ") : "None specified"}
- Desired Lyrical Depth: ${context.lyricalDepthText}

Please identify one phrase, line, or short section in these lyrics and enhance it with a richer metaphor or spiritual imagery that aligns with the song's context. Respond strictly with the JSON object as specified.`;
    
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                json: true,
            });
    
            const aiResponseContent = completion.content;
            console.log("Raw AI Response (Enhance Metaphor):", aiResponseContent);
            let aiResponse = typeof aiResponseContent === 'string' ? JSON.parse(aiResponseContent) : aiResponseContent;
    
            if (aiResponse && aiResponse.enhancedPhrase && aiResponse.originalPhrase) {
                rewriteContentIdentifierPre.innerHTML = `Original: <pre style="background:transparent; padding:0; border:0; margin-top:0.2em; margin-bottom:0.5em; font-family: 'Courier New', Courier, monospace;">"${aiResponse.originalPhrase.replace(/\\n/g, '\n')}"</pre>Suggestion to enhance:`;
                rewriteContentLyricsPre.textContent = aiResponse.enhancedPhrase.replace(/\\n/g, '\n');
                
                const existingExplanation = rewriteContentLyricsPre.querySelector('p.explanation-text');
                if (existingExplanation) existingExplanation.remove();

                const explanationP = document.createElement('p');
                explanationP.classList.add('explanation-text'); 
                explanationP.style.marginTop = '0.5em';
                explanationP.style.fontSize = '0.9em';
                explanationP.style.color = 'var(--text-dark)';
                explanationP.textContent = `Rationale: ${aiResponse.explanation || 'Enhanced for richer imagery.'}`;
                rewriteContentLyricsPre.appendChild(explanationP);

                suggestedRewriteOutputDiv.style.display = 'block';
                showNotification("Metaphor enhancement suggested!", "success");
            } else {
                showNotification("AI response for metaphor was incomplete.", "error");
                throw new Error("AI response did not contain the expected fields for metaphor enhancement (originalPhrase, enhancedPhrase).");
            }
        } catch (error) {
            console.error("Error enhancing metaphor:", error);
            rewriteContentIdentifierPre.textContent = "Error during metaphor enhancement.";
            rewriteContentLyricsPre.textContent = `Details: ${error.message}. Raw response might be in console.`;
            const existingExplanation = rewriteContentLyricsPre.querySelector('p.explanation-text');
            if (existingExplanation) existingExplanation.remove();
            suggestedRewriteOutputDiv.style.display = 'block';
            showNotification(`Error enhancing metaphor: ${error.message}`, "error");
        } finally {
            setButtonLoadingState(enhanceMetaphorButton, false);
        }
    }

    async function handleIntegrateScripture() {
        const currentLyrics = checkLyricsExist("integrating scripture");
        if (!currentLyrics) return;

        const scriptureText = scriptureInput.value.trim();
        if (!scriptureText) {
            showNotification("Please enter scripture passages in the 'Key Verses/Passages' input.", "error");
            return;
        }

        setButtonLoadingState(integrateScriptureButton, true);
        suggestedRewriteOutputDiv.style.display = 'none'; 
        const context = getSidebarContext();

        const systemPrompt = `You are 'Divina Harmonia - Scriptural Weaver'. Your task is to thoughtfully integrate the essence, themes, or direct (but fitting) quotes from the provided scripture passage(s) into the existing song lyrics. The integration should feel natural, enhancing the song's spiritual depth and message without disrupting its flow. It must align with the song's established style, tone, and overall context. Paraphrase or use direct quotes sparingly and appropriately for the song's context.
Respond ONLY with a single JSON object following this schema:
\`\`\`json
{
  "updatedLyrics": "The complete song lyrics with scripture integrated. Use \\n for line breaks. Ensure original song structure (Verse, Chorus tags) is preserved or adapted logically."
}
\`\`\``;
        const userPrompt = `Current song lyrics:\n\`\`\`\n${currentLyrics}\n\`\`\`\n
Key Scripture passage(s) to integrate:\n\`\`\`\n${scriptureText}\n\`\`\`\n
Considering the following context for the overall song:
- Genre: ${context.genre.replace(/_/g, " ")}
- Tone: ${context.tone}
- Iconic Style Influence: ${context.styleIcon !== 'none' ? context.styleIcon.replace(/_/g, " ") : "None specified"}
- Desired Lyrical Depth: ${context.lyricalDepthText}

Please provide the full, updated lyrics with the scripture integrated in a way that fits this context. Adhere strictly to the JSON output schema.`;
        
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                json: true,
            });

            const aiResponseContent = completion.content;
            console.log("Raw AI Response (Integrate Scripture):", aiResponseContent);
            let aiResponse = typeof aiResponseContent === 'string' ? JSON.parse(aiResponseContent) : aiResponseContent;

            if (aiResponse && aiResponse.updatedLyrics) {
                songLyricsOutput.innerHTML = `<pre>${aiResponse.updatedLyrics.replace(/\\n/g, '\n')}</pre>`;
                showNotification("Scripture successfully integrated into lyrics!", "success");
            } else {
                showNotification("AI response for scripture integration was incomplete.", "error");
                throw new Error("AI response did not contain updated lyrics.");
            }
        } catch (error) {
            console.error("Error integrating scripture:", error);
            showNotification(`Error integrating scripture: ${error.message}`, "error");
            const currentLyricsContent = songLyricsOutput.querySelector('pre');
            if (currentLyricsContent) {
                 currentLyricsContent.innerHTML += `<p style="color:red; margin-top:1em;">Error integrating scripture: ${error.message}</p>`;
            } else {
                 songLyricsOutput.innerHTML = `<p style="color:red;">Error integrating scripture: ${error.message}</p>`;
            }
        } finally {
            setButtonLoadingState(integrateScriptureButton, false);
        }
    }

    async function handleIntensifyHook() {
        const currentLyrics = checkLyricsExist("intensifying the hook");
        if (!currentLyrics) return;

        setButtonLoadingState(intensifyHookButton, true);
        suggestedRewriteOutputDiv.style.display = 'none';
        const context = getSidebarContext();

        const systemPrompt = `You are 'Divina Harmonia - Hook Amplifier'. Your task is to identify the primary hook or most impactful repeated phrase (often in the chorus) of the provided song lyrics. Then, rewrite this hook to make it more powerful, memorable, and spiritually resonant. The intensified hook must stay true to the song's overall theme and align with the provided song context (genre, tone, style, depth).
Respond ONLY with a single JSON object following this schema:
\`\`\`json
{
  "originalHook": "The original hook/phrase you identified. Use \\n for line breaks if it's a multi-line hook.",
  "intensifiedHook": "The new, intensified hook/phrase. Use \\n for line breaks if appropriate.",
  "explanation": "A brief explanation of how the hook was intensified (e.g., stronger verbs, more vivid imagery, deeper theological connection), considering the song's context."
}
\`\`\``;
        const userPrompt = `Current song lyrics:\n\`\`\`\n${currentLyrics}\n\`\`\`\n
Considering the following context for the overall song:
- Genre: ${context.genre.replace(/_/g, " ")}
- Tone: ${context.tone}
- Iconic Style Influence: ${context.styleIcon !== 'none' ? context.styleIcon.replace(/_/g, " ") : "None specified"}
- Desired Lyrical Depth: ${context.lyricalDepthText}

Please identify the main hook (likely in the chorus or a key repeated phrase) and intensify it according to the song's context. Respond strictly with the JSON object as specified.`;

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                json: true,
            });

            const aiResponseContent = completion.content;
            console.log("Raw AI Response (Intensify Hook):", aiResponseContent);
            let aiResponse = typeof aiResponseContent === 'string' ? JSON.parse(aiResponseContent) : aiResponseContent;

            if (aiResponse && aiResponse.intensifiedHook && aiResponse.originalHook) {
                rewriteContentIdentifierPre.innerHTML = `Original Hook: <pre style="background:transparent; padding:0; border:0; margin-top:0.2em; margin-bottom:0.5em; font-family: 'Courier New', Courier, monospace;">"${aiResponse.originalHook.replace(/\\n/g, '\n')}"</pre>Suggestion to intensify:`;
                rewriteContentLyricsPre.textContent = aiResponse.intensifiedHook.replace(/\\n/g, '\n');
                
                const existingExplanation = rewriteContentLyricsPre.querySelector('p.explanation-text');
                if (existingExplanation) existingExplanation.remove();

                const explanationP = document.createElement('p');
                explanationP.classList.add('explanation-text');
                explanationP.style.marginTop = '0.5em';
                explanationP.style.fontSize = '0.9em';
                explanationP.style.color = 'var(--text-dark)';
                explanationP.textContent = `Rationale: ${aiResponse.explanation || 'Hook intensified for greater impact.'}`;
                rewriteContentLyricsPre.appendChild(explanationP);

                suggestedRewriteOutputDiv.style.display = 'block';
                showNotification("Hook intensification suggested!", "success");
            } else {
                showNotification("AI response for hook was incomplete.", "error");
                throw new Error("AI response did not contain the expected fields for hook intensification (originalHook, intensifiedHook).");
            }
        } catch (error) {
            console.error("Error intensifying hook:", error);
            rewriteContentIdentifierPre.textContent = "Error during hook intensification.";
            rewriteContentLyricsPre.textContent = `Details: ${error.message}. Raw response might be in console.`;
            const existingExplanation = rewriteContentLyricsPre.querySelector('p.explanation-text');
            if (existingExplanation) existingExplanation.remove();
            suggestedRewriteOutputDiv.style.display = 'block';
            showNotification(`Error intensifying hook: ${error.message}`, "error");
        } finally {
            setButtonLoadingState(intensifyHookButton, false);
        }
    }

    // --- Vocal Simulation ---
    async function handleSimulateVocal(voice, buttonElement, isChoirLead = false) {
        const rawLyrics = checkLyricsExist(`vocal simulation (${voice})`);
        if (!rawLyrics) return;

        setButtonLoadingState(buttonElement, true);
        if (previewPlayerDiv) {
            previewPlayerDiv.innerHTML = `<p>Simulating ${voice.includes('female') ? 'female' : 'male'} lead vocals... ${SPINNER_HTML}</p>`;
        }
        
        const cleanedLyrics = rawLyrics.replace(/\((Verse \d*|Chorus|Bridge|Intro|Outro|Interlude|Pre-Chorus|Vamp|Tag|Coda|Instrumental Break)\)\s*/gi, '').trim();

        if (!cleanedLyrics) {
            showNotification("Lyrics are empty after removing structural tags. Cannot simulate.", "error");
            if (previewPlayerDiv) previewPlayerDiv.innerHTML = '<p>No lyrics content to simulate.</p>';
            setButtonLoadingState(buttonElement, false);
            return;
        }
        
        try {
            const result = await websim.textToSpeech({
                text: cleanedLyrics,
                voice: voice
            });

            if (previewPlayerDiv) {
                previewPlayerDiv.innerHTML = ''; 
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = result.url;
                previewPlayerDiv.appendChild(audio);
                audio.play();

                if (isChoirLead) {
                    const note = document.createElement('p');
                    note.className = 'simulation-note';
                    note.textContent = 'Note: This is a simplified solo vocal preview of the lead melody. Refer to structure notes for full choir arrangement details.';
                    previewPlayerDiv.appendChild(note);
                }
            }
            showNotification(`Vocal simulation (${voice}) ready!`, "success");

        } catch (error) {
            console.error(`Error simulating vocal (${voice}):`, error);
            if (previewPlayerDiv) {
                previewPlayerDiv.innerHTML = `<p>Error during vocal simulation: ${error.message}</p>`;
            }
            showNotification(`Error during vocal simulation: ${error.message}`, "error");
        } finally {
            setButtonLoadingState(buttonElement, false);
        }
    }

    // --- Songbook Functions ---
    function loadSongbookFromLocalStorage() {
        const songsJSON = localStorage.getItem(SONGBOOK_LS_KEY);
        try {
            songbook = songsJSON ? JSON.parse(songsJSON) : [];
        } catch (e) {
            console.error("Error parsing songbook from localStorage:", e);
            songbook = []; 
        }
    }

    function saveSongbookToLocalStorage() {
        localStorage.setItem(SONGBOOK_LS_KEY, JSON.stringify(songbook));
    }

    async function handleSuggestMoods() {
        const title = songTitleOutput.textContent.trim();
        const lyrics = songLyricsOutput.querySelector('pre')?.textContent.trim();

        if (!title || title === "Composing..." || title === "Untitled Song" || title === "Generation Failed" || title === "Response Error" || title === "Error") {
            showNotification("Cannot suggest moods: Song title is not valid or not yet generated.", "error");
            return;
        }
        if (!lyrics || lyrics.includes("Your spiritual song will appear here...") || lyrics.includes("No lyrics generated.") || lyrics.includes("Generating lyrics based on your divine inspiration...")) {
            showNotification("Cannot suggest moods: Song lyrics are not available or not yet generated.", "error");
            return;
        }
        
        setButtonLoadingState(suggestMoodsButton, true);
        const systemPrompt = `You are a helpful music assistant. Given a song title and its lyrics, suggest 3-5 relevant mood keywords or tags that describe the song's emotional and thematic feel.
Focus on common musical moods like: joyful, uplifting, reflective, somber, hopeful, worshipful, peaceful, energetic, lament, praise, contemplative, triumphant, meditative, etc.
Respond ONLY with a single JSON array of strings, like ["mood1", "mood2", "mood3"]. Do not include any other text or explanations.`;
        const userPrompt = `Song Title: "${title}"\n\nLyrics:\n\`\`\`\n${lyrics.substring(0, 1500)}\n\`\`\`\n\nSuggest 3-5 moods for this song as a JSON array.`;

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                json: true,
            });
            const aiResponseContent = completion.content;
            console.log("Raw AI Response (Suggest Moods):", aiResponseContent);
            let suggestedMoods = typeof aiResponseContent === 'string' ? JSON.parse(aiResponseContent) : aiResponseContent;

            if (Array.isArray(suggestedMoods) && suggestedMoods.every(m => typeof m === 'string')) {
                songMoodsInput.value = suggestedMoods.join(', ');
                showNotification("AI suggested moods populated!", "success");
            } else {
                throw new Error("AI response was not a valid array of mood strings.");
            }
        } catch (error) {
            console.error("Error suggesting moods:", error);
            showNotification(`Could not suggest moods: ${error.message}`, "error");
            songMoodsInput.placeholder = "Error suggesting moods, enter manually";
        } finally {
            setButtonLoadingState(suggestMoodsButton, false);
        }
    }

    function handleSaveSong() {
        if (!isSongReadyForSaving()) {
            return;
        }
    
        setButtonLoadingState(saveSongButton, true);
    
        const songTitle = songTitleOutput.textContent.trim();
        const lyricsPre = songLyricsOutput.querySelector('pre');
        const songLyrics = lyricsPre ? lyricsPre.textContent.trim() : "";
        const structurePre = songStructureOutput.querySelector('pre');
        const songStructure = structurePre ? structurePre.textContent.trim() : "";
        const chordsPre = chordChartOutput.querySelector('pre');
        const songChords = chordsPre ? chordsPre.textContent.trim() : "";
        const moods = songMoodsInput.value.trim() ? songMoodsInput.value.split(',').map(m => m.trim()).filter(m => m) : [];
        
        const now = new Date().toISOString();
        const sidebarContext = getSidebarContext(); // Get full context
    
        const currentVersionData = {
            versionId: `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            savedAt: now,
            title: songTitle,
            lyrics: songLyrics,
            structureNotes: songStructure,
            chordChart: songChords,
            moods: moods, 
            // Include sidebar context for this version
            genre: sidebarContext.genre,
            lyricTarget: sidebarContext.lyricTarget,
            theme: sidebarContext.theme,
            tone: sidebarContext.tone,
            scripture: sidebarContext.scripture,
            structureType: sidebarContext.structureType,
            voiceArrangement: sidebarContext.voiceArrangement,
            instrumentationStyle: sidebarContext.instrumentationStyle,
            styleIcon: sidebarContext.styleIcon,
            lyricalDepthValue: sidebarContext.lyricalDepthValue,
            lyricalDepthText: sidebarContext.lyricalDepthText,
            mainPrompt: sidebarContext.mainPrompt 
        };
        
        let existingSongIndex = -1;
        if (currentLoadedSongId) {
            existingSongIndex = songbook.findIndex(s => s.id === currentLoadedSongId);
        }
    
        if (existingSongIndex !== -1) { // Update existing song
            const songToUpdate = songbook[existingSongIndex];
            songToUpdate.versions.push(currentVersionData);
            
            songToUpdate.title = songTitle;
            songToUpdate.lyrics = songLyrics;
            songToUpdate.structureNotes = songStructure;
            songToUpdate.chordChart = songChords;
            songToUpdate.moods = moods; 
            songToUpdate.updatedAt = now;
    
            songbook[existingSongIndex] = songToUpdate; 
            showNotification(`"${songTitle}" updated with a new version in songbook!`, "success");
        } else { // Save as a new song
            const newSongId = `song_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
            const newSong = {
                id: newSongId,
                title: songTitle,
                lyrics: songLyrics, 
                structureNotes: songStructure, 
                chordChart: songChords, 
                moods: moods, 
                createdAt: now,
                updatedAt: now,
                versions: [currentVersionData] 
            };
            songbook.push(newSong);
            currentLoadedSongId = newSongId; 
            showNotification(`"${songTitle}" saved to songbook!`, "success");
        }
    
        saveSongbookToLocalStorage();
        renderSongbook(songbookSearchInput.value.trim());
        setButtonLoadingState(saveSongButton, false);
    }

    function renderSongbook(searchTerm = '') {
        if (!songbookListContainer) return;
        songbookListContainer.innerHTML = ''; 
        
        let filteredSongs = [...songbook];

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filteredSongs = songbook.filter(song => 
                (song.title && song.title.toLowerCase().includes(lowerSearchTerm)) ||
                (song.lyrics && song.lyrics.toLowerCase().includes(lowerSearchTerm)) || 
                (song.versions && song.versions.some(v => v.lyrics && v.lyrics.toLowerCase().includes(lowerSearchTerm))) || 
                (song.moods && song.moods.some(mood => mood.toLowerCase().includes(lowerSearchTerm)))
            );
        }
        
        filteredSongs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); 

        if (filteredSongs.length === 0) {
            songbookListContainer.innerHTML = `<p>${searchTerm ? 'No matches found.' : 'Your songbook is empty.'}</p>`;
            return;
        }

        filteredSongs.forEach(song => {
            const songItemDiv = document.createElement('div');
            songItemDiv.className = 'songbook-item';
            songItemDiv.dataset.songId = song.id;

            const titleSpan = document.createElement('span');
            titleSpan.className = 'songbook-item-title';
            titleSpan.textContent = song.title || 'Untitled Song';
            
            const metaDiv = document.createElement('div');
            metaDiv.className = 'songbook-item-meta-container';

            const updatedSpan = document.createElement('span');
            updatedSpan.className = 'songbook-item-meta';
            updatedSpan.textContent = `Last Saved: ${new Date(song.updatedAt).toLocaleDateString()}`;
            
            const versionsButton = document.createElement('button');
            versionsButton.className = 'songbook-item-versions-btn';
            versionsButton.innerHTML = `Versions (<span class="version-count">${song.versions ? song.versions.length : 0}</span>)`;
            versionsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                openVersionHistoryModal(song.id);
            });
            
            metaDiv.appendChild(updatedSpan);
            metaDiv.appendChild(versionsButton);


            const moodsDiv = document.createElement('div');
            moodsDiv.className = 'songbook-item-moods';
            if (song.moods && song.moods.length > 0) {
                song.moods.forEach(moodStr => {
                    const moodTag = document.createElement('span');
                    moodTag.className = 'mood-tag';
                    moodTag.textContent = moodStr;
                    moodsDiv.appendChild(moodTag);
                });
            } else {
                const noMoodsSpan = document.createElement('span');
                noMoodsSpan.className = 'mood-tag no-moods';
                noMoodsSpan.textContent = 'No moods';
                moodsDiv.appendChild(noMoodsSpan);
            }

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'songbook-item-actions';

            const loadButton = document.createElement('button');
            loadButton.textContent = 'Load Latest';
            loadButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                loadSongToEditor(song.id); 
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Song';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSongFromSongbook(song.id);
            });

            actionsDiv.appendChild(loadButton);
            actionsDiv.appendChild(deleteButton);
            
            songItemDiv.appendChild(titleSpan);
            songItemDiv.appendChild(metaDiv);
            songItemDiv.appendChild(moodsDiv); 
            songItemDiv.appendChild(actionsDiv);
            
            songbookListContainer.appendChild(songItemDiv);
        });
    }

    function loadSongToEditor(songId) {
        const songToLoad = songbook.find(s => s.id === songId);

        if (songToLoad) {
             // Load the latest version data (which is stored at the top level of the song object)
            const latestVersionData = {
                title: songToLoad.title,
                lyrics: songToLoad.lyrics,
                structureNotes: songToLoad.structureNotes,
                chordChart: songToLoad.chordChart,
                moods: songToLoad.moods,
                // Attempt to find the most recent version object to get sidebar context
                // This assumes versions are pushed and the last one is newest,
                // or that the top-level song data is what we want for sidebar if no specific version context is stored there.
            };
            
            let sidebarContextToLoad = {};
            if (songToLoad.versions && songToLoad.versions.length > 0) {
                const mostRecentVersion = songToLoad.versions[songToLoad.versions.length - 1];
                 sidebarContextToLoad = {
                    genre: mostRecentVersion.genre,
                    lyricTarget: mostRecentVersion.lyricTarget,
                    theme: mostRecentVersion.theme,
                    tone: mostRecentVersion.tone,
                    scripture: mostRecentVersion.scripture,
                    structureType: mostRecentVersion.structureType,
                    voiceArrangement: mostRecentVersion.voiceArrangement,
                    instrumentationStyle: mostRecentVersion.instrumentationStyle,
                    styleIcon: mostRecentVersion.styleIcon,
                    lyricalDepthValue: mostRecentVersion.lyricalDepthValue,
                    mainPrompt: mostRecentVersion.mainPrompt
                };
            }

            displaySongOutput(latestVersionData, true); // true indicates loading, so main prompt isn't overwritten by default

            // Restore sidebar context from the most recent version
            if (sidebarContextToLoad.genre) genreSelect.value = sidebarContextToLoad.genre;
            if (sidebarContextToLoad.lyricTarget) lyricTargetSelect.value = sidebarContextToLoad.lyricTarget;
            if (sidebarContextToLoad.theme) promptThemeInput.value = sidebarContextToLoad.theme;
            if (sidebarContextToLoad.tone) toneSelect.value = sidebarContextToLoad.tone;
            if (sidebarContextToLoad.scripture) scriptureInput.value = sidebarContextToLoad.scripture;
            if (sidebarContextToLoad.structureType) structureTypeSelect.value = sidebarContextToLoad.structureType;
            if (sidebarContextToLoad.voiceArrangement) voiceArrangementSelect.value = sidebarContextToLoad.voiceArrangement;
            if (sidebarContextToLoad.instrumentationStyle) instrumentationStyleSelect.value = sidebarContextToLoad.instrumentationStyle;
            if (sidebarContextToLoad.styleIcon) styleIconSelect.value = sidebarContextToLoad.styleIcon;
            if (sidebarContextToLoad.lyricalDepthValue) lyricalDepthSlider.value = sidebarContextToLoad.lyricalDepthValue;

            mainPromptInput.value = sidebarContextToLoad.mainPrompt || `Loaded from songbook: "${songToLoad.title}". Refine or continue.`;
            
            currentLoadedSongId = songId; // Track that this song is loaded
            
            if (previewPlayerDiv) previewPlayerDiv.innerHTML = '<p>Audio preview placeholder. Click a simulation button below to generate.</p>';
            suggestedRewriteOutputDiv.style.display = 'none';
            
            document.getElementById('main-content').scrollTop = 0;

            showNotification(`Song "${songToLoad.title}" loaded into editor.`, "success");
        } else {
            showNotification('Error: Song not found in songbook.', "error");
        }
    }

    function deleteSongFromSongbook(songId) {
        if (!confirm('Are you sure you want to permanently delete this song from your songbook? This action cannot be undone.')) {
            return;
        }
        songbook = songbook.filter(s => s.id !== songId);
        saveSongbookToLocalStorage();
        
        if (currentLoadedSongId === songId) { // If the deleted song was currently loaded
            currentLoadedSongId = null; 
            // Optionally, clear the editor or leave it as is. Clearing might be safer.
            // handleClearEditor(); // Uncomment if editor should clear.
        }
        renderSongbook(songbookSearchInput.value.trim()); 
        showNotification('Song deleted from songbook.', "success");
    }

    function handleSearchSongbook() {
        const searchTerm = songbookSearchInput.value.trim();
        renderSongbook(searchTerm);
    }

    // Initial Songbook Render
    loadSongbookFromLocalStorage();
    renderSongbook();

    console.log("Divina Harmonia script initialized and event listeners attached.");
});
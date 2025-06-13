/*
 * Advanced Settings Drawer Extension
 *
 * Gathers the controls from "Wrap in Quotes" through "Reasoning Effort" and
 * moves them into an inline-drawer (the same UI component used for “Quick
 * Prompts Edit” and “Utility Prompts”).  The drawer is titled “Advanced
 * Settings” and is collapsed by default, reducing visual clutter while still
 * allowing full access when expanded.
 *
 * – Targets all chat-completion panels because the underlying controls share
 *   the same IDs regardless of provider.
 * – Purely front-end; no backend changes.
 */

(function advancedSettingsDrawer() {
    // Anchor element to start collecting advanced controls
    const FIRST_ID = 'wrap_in_quotes';
    // We collect subsequent sibling blocks up until we reach the next
    // inline-drawer (e.g. “Quick Prompts Edit”).  This approach captures any
    // new controls that might be added in future versions without needing to
    // update the extension.
    const DRAWER_ID = 'advanced_options_drawer';

    /**
     * Build the drawer once the relevant DOM nodes exist.
     */
    function build() {
        if (document.getElementById(DRAWER_ID)) return; // already built

        const firstInput = document.getElementById(FIRST_ID);
        if (!firstInput) return; // anchor missing

        const firstBlock = firstInput.closest('.range-block, .flex-container');
        if (!firstBlock) return;

        // Collect nodes from firstBlock up to (but not including) the next
        // element that starts a new inline-drawer (class inline-drawer).
        const collected = [];
        let node = firstBlock;
        while (node) {
            collected.push(node);
            node = node.nextElementSibling;
            if (node && node.classList.contains('inline-drawer')) {
                break; // stop before Quick Prompts / Utility drawers
            }
        }

        if (!collected.length) return;

        // Create drawer structure
        const drawer = document.createElement('div');
        drawer.className = 'inline-drawer wide100p';
        drawer.id = DRAWER_ID;

        const header = document.createElement('div');
        header.className = 'inline-drawer-toggle inline-drawer-header';

        // Title with embedded info icon
        const title = document.createElement('b');
        title.textContent = 'Advanced Options';

        const info = document.createElement('span');
        info.className = 'opacity50p fa-solid fa-circle-info';
        info.title = 'Advanced response options';
        info.setAttribute('data-i18n', '[title]Advanced response options');
        info.style.marginLeft = '4px';

        title.appendChild(info);
        header.appendChild(title);

        const icon = document.createElement('div');
        icon.className = 'fa-solid fa-circle-chevron-down inline-drawer-icon down';
        header.appendChild(icon);

        const content = document.createElement('div');
        content.className = 'inline-drawer-content';
        content.style.display = 'none'; // start collapsed

        drawer.appendChild(header);
        drawer.appendChild(content);

        // Insert drawer before first block
        firstBlock.parentNode.insertBefore(drawer, firstBlock);

        // Move the collected blocks into the drawer content
        for (const el of collected) {
            content.appendChild(el);
        }
    }

    // Run on DOM ready then observe for future UI re-renders.
    $(function () {
        build();

        const observer = new MutationObserver(() => build());
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();

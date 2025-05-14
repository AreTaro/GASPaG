# index.html - Password Generator Web App Interface

This HTML file defines the complete user interface (UI), styling, and client-side JavaScript logic for the bilingual (English/Japanese) Team Password Generator web application. It is served to the user by the `doGet(e)` function located in the `Code.gs` script file.

---

## Overview

`index.html` provides an interactive and responsive web page where users can:
- Select their preferred language for the UI (English or Japanese).
- Specify the desired length for the password to be generated.
- Choose options for password complexity, such as including special characters or generating a password composed only of numbers.
- Trigger the password generation process.
- View the generated password in a read-only field.
- Copy the generated password to their system clipboard.

All client-side operations, including form input handling, real-time validation of password length, dynamic UI text updates for localization, user feedback messages, and asynchronous communication with the server-side `generatePassword` function (in `Code.gs`), are managed within this file.

---

## HTML Structure

The document's body is primarily contained within a central `div` with the class `container`. Key components of the HTML structure include:

-   **Language Selector (`<div class="language-selector-container">`):**
    -   Contains a label (`<label id="languageSelectorLabel">`) and a dropdown menu (`<select id="languageSelector">`) enabling users to switch the application's display language between "English" and "日本語 (Japanese)".
-   **Application Title (`<h1 id="appTitle">`):**
    -   The main heading of the web app, displaying its title.
-   **Password Length Input (`<div>` containing `<label id="lengthLabel">` and `<input type="number" id="lengthInput">`):**
    -   Allows users to input the desired password length. The input is constrained to a minimum of 8 and a maximum of 128 characters.
-   **Password Options (Checkboxes in `<div class="checkbox-group">`):**
    -   `includeSpecialCheckbox`: An `<input type="checkbox">` allowing users to opt for including special characters in the password.
    -   `onlyNumbersCheckbox`: An `<input type="checkbox">` that, when selected, restricts password generation to numbers only.
    -   Each checkbox is accompanied by a descriptive `<label>` (`specialCharsLabel`, `onlyNumbersLabel`).
-   **Generate Button (`<button id="generateButton">`):**
    -   The primary action button that, when clicked, initiates the password generation process by calling the `handleGeneratePassword()` JavaScript function.
-   **Loader Animation (`<div id="loader" class="loader">`):**
    -   A CSS-animated spinner that provides visual feedback to the user during the asynchronous password generation call to the server. It is hidden by default.
-   **Result Area (`<div id="passwordResultContainer" class="result-area">`):**
    -   This section is initially hidden and becomes visible only after a password has been successfully generated.
    -   It contains a label (`<label id="generatedPasswordLabel">`), a read-only `<input type="text" id="generatedPasswordInput">` to display the generated password, and a "Copy to Clipboard" button (`<button id="copyButton" class="copy-button">`).
-   **Feedback Message Area (`<div id="feedbackMessage">`):**
    -   A dedicated `div` used to display status messages to the user, such as success confirmations (e.g., "Password copied to clipboard!") or error alerts.

---

## CSS Styling (Embedded in `<style>` tags)

The `<style>` block within the `<head>` section defines the visual appearance of the web app.
-   **Overall Layout:** Uses Flexbox for centering the main container and aims for a responsive design suitable for various screen sizes. `box-sizing: border-box;` is used for predictable element sizing.
-   **Typography & Color Scheme:** Employs 'Segoe UI' as the primary font with fallbacks. A professional color palette is used for text, backgrounds, and interactive elements (e.g., blue for primary actions, green for success).
-   **Form Elements:** Custom styling is applied to labels, input fields (number, text, checkbox), and buttons to ensure a consistent and modern look. This includes styles for hover states, disabled states, and specific appearances for different button types (e.g., generate, copy).
-   **Visual Feedback:** Includes styles for the animated loader (spinner) and distinct styles for success and error messages displayed in the `#feedbackMessage` area.
-   **Accessibility & Responsiveness:** The `viewport` meta tag is configured for mobile responsiveness. `max-width` is set on the container to ensure good readability on wider screens.

---

## JavaScript Logic (Embedded in `<script>` tags)

The client-side JavaScript, located at the end of the `<body>`, orchestrates all the interactive features of the password generator.

### Key Global Variables & Constants:
-   **DOM Element References:** A set of constants (e.g., `lengthInput`, `includeSpecialCheckbox`, `generateButton`, `feedbackMessage`) hold references to the HTML elements, obtained using `document.getElementById()`. These are used for reading user input and updating the UI.
-   `currentLanguage` (String): A variable that stores the code of the currently active UI language (e.g., `'en'` for English, `'ja'` for Japanese). It defaults to `'en'`.
-   `uiStrings` (Object): A JavaScript object that serves as a dictionary for localization. It contains nested objects mapping UI text identifiers (e.g., `appTitle`, `lengthLabel`, `copiedSuccess`) to their translated string values in English (`en`) and Japanese (`ja`).

### Core Client-Side Functions:

-   **`updateUI(lang)`:**
    * **Purpose:** Refreshes all translatable text elements on the page to match the selected language (`lang`).
    * **Action:** It updates the `currentLanguage` variable, sets the `lang` attribute of the `<html>` element for accessibility, and iterates through `uiStrings` to set the `textContent` of corresponding DOM elements (identified by their IDs) to the appropriate translation. It also clears any existing feedback messages.
    * **Trigger:** Called on initial page load to set the default language and whenever the user changes the selection in the `languageSelector` dropdown.

-   **`updateCheckboxStates()`:**
    * **Purpose:** Manages the logical dependency between the "Include Special Characters" and "Only Numbers" checkboxes.
    * **Action:** If the "Only Numbers" checkbox is selected, the "Include Special Characters" checkbox is automatically unselected and disabled. If "Only Numbers" is unselected, the "Include Special Characters" checkbox is re-enabled.
    * **Trigger:** Called on initial page load and whenever the `change` event occurs on the `onlyNumbersCheckbox`.

-   **`showFeedback(messageKey, type = 'error', options = {})`:**
    * **Purpose:** Displays messages (errors, warnings, success) to the user in the `#feedbackMessage` div.
    * **Action:** It takes a `messageKey` which is used to retrieve the translated string from `uiStrings` based on the `currentLanguage`. The `type` parameter (`'error'` or `'success'`) determines the styling of the message. An optional `options` object can be used to pass values for placeholder replacement in messages (e.g., `{error}` in error strings).
    * **Called By:** Functions like `handleGeneratePassword` and `handleCopyPassword` to provide operational feedback.

-   **`clearFeedback()`:**
    * **Purpose:** Removes any currently displayed message from the `#feedbackMessage` div and resets its styling.

-   **`setLoadingState(isLoading)`:**
    * **Purpose:** Manages the visual state of the UI during asynchronous operations, specifically when waiting for a response from the server.
    * **Action:** If `isLoading` is `true`, it displays the CSS loader animation and disables the "Generate Password" and "Copy" buttons to prevent concurrent actions. If `isLoading` is `false`, it hides the loader and re-enables the buttons (the "Copy" button is only enabled if there is a password to copy).

-   **`handleGeneratePassword()`:**
    * **Purpose:** Orchestrates the password generation request when the user clicks the "Generate Password" button.
    * **Action:**
        1.  Clears any previous feedback and activates the loading state.
        2.  Retrieves the desired password length and the state of the option checkboxes from the UI.
        3.  Performs client-side validation on the password length (must be between 8 and 128). If invalid, it displays a translated error message using `showFeedback` and aborts.
        4.  Constructs an `options` object (`{ length, includeSpecial, onlyNumbers }`) to be sent to the server.
        5.  Uses `google.script.run` to asynchronously call the `generatePassword(options)` function in `Code.gs`.
            * `.withSuccessHandler(result)`: This callback function is executed if the server-side call is successful. It processes the `result` object from the server. If `result.error` exists, it displays the (potentially translated) server-side error. Otherwise, it populates the `generatedPasswordInput` field with `result.password` and makes the password result container visible.
            * `.withFailureHandler(error)`: This callback is executed if the call to the server-side function fails (e.g., network error, server-side script error). It displays a generic communication error message, incorporating `error.message`.
        6.  Finally, it deactivates the loading state.

-   **`handleCopyPassword()`:**
    * **Purpose:** Handles the "Copy to Clipboard" button click.
    * **Action:**
        1.  It first selects the text within the `generatedPasswordInput` field.
        2.  It attempts to use the modern `navigator.clipboard.writeText()` API to copy the selected text. This is the preferred method.
        3.  If `navigator.clipboard.writeText()` fails or the API is not available (e.g., in older browsers or insecure contexts, though Apps Script web apps are HTTPS), it calls `executeCopyFallback()`.
        4.  Provides feedback to the user about the success or failure of the copy operation using `showFeedback`. The success message is cleared after a short delay.

-   **`executeCopyFallback()`:**
    * **Purpose:** Provides a fallback mechanism for copying text if `navigator.clipboard` is not available.
    * **Action:** It uses the older, deprecated `document.execCommand('copy')` method. While less secure and modern, it offers broader compatibility.

### Initial Setup Script:
At the end of the `<script>` block, several initial setup actions occur when the page first loads:
-   `updateUI(currentLanguage)`: Sets the initial language of the UI elements (defaulting to English).
-   `updateCheckboxStates()`: Establishes the correct initial state and interactivity of the password option checkboxes.
-   `setLoadingState(false)`: Ensures that the loader is hidden and buttons are in their default enabled state.
-   Event listeners are attached:
    -   To the `languageSelector` (`change` event) to trigger `updateUI`.
    -   To the `onlyNumbersCheckbox` (`change` event) to trigger `updateCheckboxStates`.

---

## Meta Tags & Base Tag

-   `<base target="_top">`: Ensures that any links (if present) would open in the top-level window, which is standard practice for Google Apps Script web apps to avoid being trapped in iframes.
-   `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: Configures the viewport for responsiveness on mobile devices.
-   `<meta charset="UTF-8">`: Specifies UTF-8 as the character encoding, which is crucial for correctly displaying international characters, including Japanese.

---

## Dependencies

-   **`Code.gs`:** This HTML interface heavily relies on the `generatePassword(options)` function located in `Code.gs` for the actual password generation logic. Communication is facilitated by `google.script.run`.
-   **Browser APIs:** Utilizes standard web browser APIs for DOM manipulation (`document.getElementById`, `textContent`, `value`, `disabled`, `style.display`), event handling (`addEventListener`), and clipboard operations (`navigator.clipboard`, `document.execCommand`).

---

## Notes

-   The web app is designed to be bilingual, with English and Japanese translations managed client-side via the `uiStrings` object.
-   Client-side validation for password length is implemented as a first check, with server-side validation in `Code.gs` acting as a backup.
-   User feedback mechanisms (loader, status messages) are in place to enhance user experience during operations.

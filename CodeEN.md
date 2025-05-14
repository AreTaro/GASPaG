# Code.gs - Password Generator Server Logic

This script file contains the server-side logic for the Team Password Generator web app. It defines character sets used for password creation, serves the main HTML interface to the user, and handles the core password generation requests based on client-specified options.

The script is bound to the Google Sheet it resides in, as indicated by the `@OnlyCurrentDoc` JSDoc tag at the beginning of the file, which limits its access to the current document only, enhancing security.

---

## Global Constants

These constants define the character sets available for password generation. They are used by the `generatePassword` function to construct the pool of allowed characters.

-   **`LOWER_CASE_CHARS`**
    * **Description:** A string containing all lowercase alphabet characters.
    * **Value:** `"abcdefghijklmnopqrstuvwxyz"`
    ```javascript
    const LOWER_CASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
    ```

-   **`UPPER_CASE_CHARS`**
    * **Description:** A string containing all uppercase alphabet characters.
    * **Value:** `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"`
    ```javascript
    const UPPER_CASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    ```

-   **`NUMBER_CHARS`**
    * **Description:** A string containing all digit characters (0 through 9).
    * **Value:** `"0123456789"`
    ```javascript
    const NUMBER_CHARS = "0123456789";
    ```

-   **`SPECIAL_CHARS`**
    * **Description:** A string containing a predefined set of special characters for password complexity.
    * **Value:** `"!@#$%^&*()_+-=[]{}|;:,.<>?"`
    ```javascript
    const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    ```

---

## Functions

### `doGet(e)`

**NAME**
`doGet` - Serves the main HTML user interface for the web application.

**SYNOPSIS**
```javascript
function doGet(e)
```

**DESCRIPTION**
This is a special callback function in Google Apps Script that is automatically executed when a user accesses the web app's URL via an HTTP GET request. Its primary role is to construct and return the HTML content that forms the user interface. In this script, it serves the `index.html` file, sets the browser window title for the web app, and configures the `X-Frame-Options` mode to `DEFAULT` for security, which helps protect against clickjacking attacks.

**PARAMETERS**
-   `e` (Object): The event object automatically passed by Google Apps Script. It contains parameters related to the HTTP request (e.g., query parameters). While present, this specific implementation of `doGet` does not directly utilize properties from the `e` object for its core logic of serving the HTML file.

**RETURN VALUE**
-   `HtmlOutput` (GoogleAppsScript.HTML.HtmlOutput): An `HtmlOutput` object that the browser will render as the web app's interface. This is generated from the `index.html` file.

**SIDE EFFECTS**
-   Presents the web application interface to the user accessing the URL.

**NOTES**
-   An `index.html` file must exist within the same Google Apps Script project for this function to work correctly.
-   This function is fundamental for deploying any user-facing web application with Google Apps Script.

---

### `generatePassword(options)`

**NAME**
`generatePassword` - Generates a random password based on user-defined criteria.

**SYNOPSIS**
```javascript
function generatePassword(options)
```

**DESCRIPTION**
This function is the core password generation engine. It is designed to be called from the client-side JavaScript of the web app (via `google.script.run`). It accepts an `options` object specifying the desired password length and character types. The function validates the length, constructs a character set based on the options, ensures diversity by attempting to include at least one character from each selected primary type (lowercase, uppercase, number, and special if applicable and not in "only numbers" mode), fills the remaining length with random characters, and shuffles the result to produce the final password.

**PARAMETERS**
-   `options` (Object): An object containing the configuration for password generation.
    * `options.length` (Number): The desired integer length of the password.
    * `options.includeSpecial` (Boolean): If `true`, special characters from `SPECIAL_CHARS` are included in the potential character pool (unless `options.onlyNumbers` is `true`).
    * `options.onlyNumbers` (Boolean): If `true`, the generated password will consist exclusively of characters from `NUMBER_CHARS`. This option takes precedence over `options.includeSpecial` regarding character set composition.

**RETURN VALUE**
-   `Object`: An object that contains either the generated password or an error message.
    * On success: `{ password: "yourGeneratedPassword" }`
    * On failure: `{ error: "Descriptive error message" }` (e.g., if length is invalid or no character types could be selected based on contradictory options, though the latter is unlikely with current UI logic).

**LOGIC DETAILS**
1.  **Validation:** The `length` from `options` is parsed and validated to be within the range of 8 to 128 characters, inclusive. If invalid, an error object is returned.
2.  **Character Set Construction:**
    * If `options.onlyNumbers` is `true`: Only `NUMBER_CHARS` are used. The password is built by randomly selecting `length` number of digits.
    * If `options.onlyNumbers` is `false`:
        * The base character set (`charactersToUseForFill`) includes `LOWER_CASE_CHARS`, `UPPER_CASE_CHARS`, and `NUMBER_CHARS`.
        * If `options.includeSpecial` is `true`, `SPECIAL_CHARS` are added to `charactersToUseForFill`.
3.  **Guaranteed Characters (for non-"only numbers" mode):**
    * To ensure password complexity, the function attempts to include at least one character from each of the active categories (lowercase, uppercase, numbers, and special if `includeSpecial` is true).
    * These "guaranteed" characters are selected randomly from their respective sets and added to the `passwordArray`. This step is skipped if the `length` is too short to accommodate them.
4.  **Filling Remaining Length:** Any remaining spots in the `passwordArray` (up to `options.length`) are filled by randomly selecting characters from the `charactersToUseForFill` pool.
5.  **Shuffling:** The `passwordArray` is then thoroughly shuffled to ensure that the positions of the "guaranteed" characters are randomized within the final password, preventing predictable patterns.
6.  **Output:** The characters in `passwordArray` are joined to form the final password string, which is returned in an object.

**SIDE EFFECTS**
-   None directly within the Google Apps Script server environment (e.g., no modification of files or user properties). Its sole side effect is returning a value to the calling client-side script.

**NOTES**
-   The quality of randomness depends on JavaScript's `Math.random()` function.
-   This function provides server-side validation for password length, acting as a backup to any client-side validation.

```

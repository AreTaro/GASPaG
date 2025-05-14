/**
 * @OnlyCurrentDoc
 */

// Global constants for character sets
const LOWER_CASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPER_CASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_CHARS = "0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * Serves the HTML for the web app.
 * @param {Object} e The event parameter.
 * @return {HtmlOutput} The HTML output.
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Team Password Generator')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/**
 * Generates a password based on the provided options.
 * @param {Object} options The password generation options.
 * @param {number} options.length The desired length of the password.
 * @param {boolean} options.includeSpecial Whether to include special characters.
 * @param {boolean} options.onlyNumbers Whether to generate a password with only numbers.
 * @return {Object} An object containing the generated password or an error message.
 */
function generatePassword(options) {
  const length = parseInt(options.length, 10);
  const includeSpecial = options.includeSpecial;
  const onlyNumbers = options.onlyNumbers;

  // Validate password length (UI also has min/max, but good to have server-side)
  if (isNaN(length) || length < 8 || length > 128) {
    return { error: "Password length must be between 8 and 128." };
  }

  let passwordArray = [];
  let charactersToUseForFill = "";

  if (onlyNumbers) {
    if (length === 0) return { password: "" };
    charactersToUseForFill = NUMBER_CHARS;
    for (let i = 0; i < length; i++) {
      passwordArray.push(NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)]);
    }
    // No complex shuffling needed as it's all from one character set and filled randomly.
  } else {
    charactersToUseForFill = LOWER_CASE_CHARS + UPPER_CASE_CHARS + NUMBER_CHARS;
    if (includeSpecial) {
      charactersToUseForFill += SPECIAL_CHARS;
    }

    if (length === 0) return { password: "" };
    if (charactersToUseForFill.length === 0) {
        return { error: "No character types selected for password generation." }; // Should not happen with UI logic
    }

    let guaranteedChars = [];
    // Attempt to include at least one of each selected character type
    if (LOWER_CASE_CHARS.length > 0) guaranteedChars.push(LOWER_CASE_CHARS[Math.floor(Math.random() * LOWER_CASE_CHARS.length)]);
    if (UPPER_CASE_CHARS.length > 0) guaranteedChars.push(UPPER_CASE_CHARS[Math.floor(Math.random() * UPPER_CASE_CHARS.length)]);
    if (NUMBER_CHARS.length > 0) guaranteedChars.push(NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)]);
    
    if (includeSpecial && SPECIAL_CHARS.length > 0) {
        guaranteedChars.push(SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)]);
    }

    // Add guaranteed characters to the password array, respecting the total length
    let guaranteedCharsIndex = 0;
    while(passwordArray.length < length && guaranteedCharsIndex < guaranteedChars.length) {
        passwordArray.push(guaranteedChars[guaranteedCharsIndex]);
        guaranteedCharsIndex++;
    }
    
    // Fill the remaining length with characters from the broader set of allowed characters
    const remainingLength = length - passwordArray.length;
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * charactersToUseForFill.length);
      passwordArray.push(charactersToUseForFill[randomIndex]);
    }

    // Shuffle the array to ensure randomness of character positions
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]; // Swap elements
    }
  }

  return { password: passwordArray.join('') };
}

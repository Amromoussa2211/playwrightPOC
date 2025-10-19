/**
 * 🧩 Function Name: countDuplicateCharacters
 * ------------------------------------------
 * Description:
 * This function prompts the user to enter a string,
 * then counts how many characters are duplicated within that string.
 * It ignores spaces and is case-insensitive (e.g. "A" and "a" are treated the same).
 *
 * Function Steps:
 * 1. Ask the user for input using `prompt()`.
 * 2. Convert the string to lowercase for consistent comparison.
 * 3. Loop through each character and count how many times it appears.
 * 4. Identify characters that appear more than once (duplicates).
 * 5. Log each duplicate and the number of times it appears.
 * 6. Finally, log how many unique characters were duplicated.
 *
 * Example:
 * Input:  "Hello World"
 * Output:
 *   'l' appears 3 times
 *   'o' appears 2 times
 *   Total number of duplicated characters: 2
 */

function countDuplicateCharacters() {
  // Prompt the user to enter a string
  const input = prompt("Enter a string:");
  
  // Handle case where user enters nothing
  if (!input) {
    console.log("No input provided.");
    return;
  }

  // Convert to lowercase to ignore case sensitivity
  const str = input.toLowerCase();

  // Object to store frequency of each character
  const charCount = {};

  // Loop through each character in the string
  for (let char of str) {
    // Ignore spaces while counting
    if (char !== " ") {
      charCount[char] = (charCount[char] || 0) + 1;
    }
  }

  // Object to store only the duplicated characters
  const duplicates = {};

  // Identify characters that appear more than once
  for (let char in charCount) {
    if (charCount[char] > 1) {
      duplicates[char] = charCount[char];
    }
  }

  // Output the result
  if (Object.keys(duplicates).length === 0) {
    console.log("No duplicate characters found.");
  } else {
    console.log("Duplicate characters:");
    // Log each duplicate and its count
    for (let [char, count] of Object.entries(duplicates)) {
      console.log(`'${char}' appears ${count} times`);
    }
    // Log total number of characters that were duplicated
    console.log(`Total number of duplicated characters: ${Object.keys(duplicates).length}`);
  }
}

// Call the function to run it
countDuplicateCharacters();
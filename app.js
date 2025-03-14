const inputText = document.getElementById("inputText");
const sourceLanguageSelect = document.getElementById("sourceLanguageSelect");
const targetLanguageSelect = document.getElementById("targetLanguageSelect");
const translationTypeSelect = document.getElementById("translationType");
const translateButton = document.getElementById("translateButton");
const outputText = document.getElementById("outputText");

// Language map
const languageMap = {
  'Auto': 'Auto-detect',
  'af': 'Afrikaans',
  'am': 'Amharic',
  'ar': 'Arabic',
  'as': 'Assamese',
  'az': 'Azerbaijani',
  'be': 'Belarusian',
  'bg': 'Bulgarian',
  'bn': 'Bengali',
  'bs': 'Bosnian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'co': 'Corsican',
  'cs': 'Czech',
  'cy': 'Welsh',
  'da': 'Danish',
  'de': 'German',
  'dv': 'Dhivehi',
  'el': 'Greek',
  'en': 'English',
  'eo': 'Esperanto',
  'es': 'Spanish',
  'et': 'Estonian',
  'eu': 'Basque',
  'fa': 'Persian',
  'fi': 'Finnish',
  'fil': 'Filipino',
  'fr': 'French',
  'fy': 'Frisian',
  'ga': 'Irish',
  'gd': 'Scottish Gaelic',
  'gl': 'Galician',
  'gu': 'Gujarati',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'he': 'Hebrew',
  'hi': 'Hindi',
  'hmn': 'Hmong',
  'hr': 'Croatian',
  'ht': 'Haitian Creole',
  'hu': 'Hungarian',
  'hy': 'Armenian',
  'id': 'Indonesian',
  'ig': 'Igbo',
  'ilo': 'Ilocano',
  'is': 'Icelandic',
  'it': 'Italian',
  'ja': 'Japanese',
  'jv': 'Javanese',
  'ka': 'Georgian',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'kn': 'Kannada',
  'ko': 'Korean',
  'ku': 'Kurdish (Kurmanji)',
  'ky': 'Kyrgyz',
  'la': 'Latin',
  'lb': 'Luxembourgish',
  'lo': 'Lao',
  'lt': 'Lithuanian',
  'lv': 'Latvian',
  'mg': 'Malagasy',
  'mi': 'Maori',
  'mk': 'Macedonian',
  'ml': 'Malayalam',
  'mn': 'Mongolian',
  'mr': 'Marathi',
  'ms': 'Malay',
  'mt': 'Maltese',
  'my': 'Burmese',
  'ne': 'Nepali',
  'nl': 'Dutch',
  'no': 'Norwegian',
  'ny': 'Chichewa',
  'or': 'Odia',
  'pa': 'Punjabi',
  'pl': 'Polish',
  'ps': 'Pashto',
  'pt': 'Portuguese',
  'ro': 'Romanian',
  'ru': 'Russian',
  'rw': 'Kinyarwanda',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'sm': 'Samoan',
  'sn': 'Shona',
  'so': 'Somali',
  'sq': 'Albanian',
  'sr': 'Serbian',
  'st': 'Sesotho',
  'su': 'Sundanese',
  'sv': 'Swedish',
  'sw': 'Swahili',
  'ta': 'Tamil',
  'te': 'Telugu',
  'tg': 'Tajik',
  'th': 'Thai',
  'ti': 'Tigrinya',
  'tk': 'Turkmen',
  'tl': 'Tagalog',
  'tr': 'Turkish',
  'tt': 'Tatar',
  'ug': 'Uyghur',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'xh': 'Xhosa',
  'yi': 'Yiddish',
  'yo': 'Yoruba',
  'zh': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'zu': 'Zulu'
};

// Function to populate the language dropdowns with the language map
function populateLanguages() {
  for (let code in languageMap) {
    const optionSource = document.createElement("option");
    optionSource.value = code;
    optionSource.textContent = languageMap[code];
    sourceLanguageSelect.appendChild(optionSource);

    const optionTarget = document.createElement("option");
    optionTarget.value = code;
    optionTarget.textContent = languageMap[code];
    targetLanguageSelect.appendChild(optionTarget);
  }

  // Disable "Auto-detect" for the destination language (targetLanguageSelect)
  targetLanguageSelect.querySelector('option[value="Auto"]').disabled = true;
  
  // Set English as default only for the target/destination language
  targetLanguageSelect.value = 'en';
}

// Call populateLanguages to add options to both selects
populateLanguages();

// Replace YOUR_IP_ADDRESS with your actual computer's IP address
const SERVER_URL = "http://192.168.1.102:5500/translate";

// Translate button functionality
translateButton.addEventListener("click", async () => {
  const textToTranslate = inputText.value.trim();
  const sourceLanguage = sourceLanguageSelect.value;
  const targetLanguage = targetLanguageSelect.value;
  const translationType = translationTypeSelect.value;

  if (!textToTranslate) {
    outputText.textContent = "Please enter text to translate.";
    return;
  }

  // Show loading state
  outputText.textContent = "Translating...";
  translateButton.disabled = true; // Disable button while translating

  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        text: textToTranslate,
        sourceLanguage,
        targetLanguage,
        translationType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    if (data.translation) {
      outputText.textContent = data.translation;
    } else {
      throw new Error("No translation received from server");
    }
  } catch (error) {
    console.error("Translation error:", error);
    
    // More user-friendly error messages
    if (error.message.includes("Failed to fetch") || error.message.includes("Network error")) {
      outputText.textContent = "Unable to connect to translation server. Please check your internet connection and make sure the server is running.";
    } else if (error.message.includes("Server error")) {
      outputText.textContent = "Server error occurred. Please try again later.";
    } else {
      outputText.textContent = "Translation failed. Please try again.";
    }
  } finally {
    // Re-enable button
    translateButton.disabled = false;
  }
});
const express = require("express");
const axios = require("axios");
const unidecode = require("unidecode");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const logger = require("./logger");
const loadMappings = require("./mappings");

dotenv.config();

const app = express();
app.use(express.json());

// Global token counter
let tokenUsage = { usedTokens: 0, maxTokens: 1000000 };

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "catalog_db",
  charset: "utf8mb4",
};

// Load mappings
let LOCATION_MAPPING, ACTIVITY_MAPPING, TOUR_TYPE_MAPPING;
(async () => {
  const mappings = await loadMappings();
  LOCATION_MAPPING = mappings.LOCATION_MAPPING;
  ACTIVITY_MAPPING = mappings.ACTIVITY_MAPPING;
  TOUR_TYPE_MAPPING = mappings.TOUR_TYPE_MAPPING;
})();

// Token calculation function
function calculateTokens(text) {
  if (typeof text !== "string") {
    text = text.text || JSON.stringify(text);
  }
  return text.split(/\s+/).length;
}

// Call Mistral AI API
async function callMistralApi(
  userMessage,
  maxTokens = 500,
  model = "mistral-small-latest"
) {
  const mistralApiUrl = process.env.MISTRAL_API_URL;
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!mistralApiUrl || !apiKey) {
    logger.error(
      "Missing MISTRAL_API_URL or MISTRAL_API_KEY in environment variables"
    );
    return "Không thể kết nối tới dịch vụ AI. Vui lòng thử lại sau.";
  }

  const prompt = `
Provide a natural, conversational response suggesting additional tour options or experiences for '${userMessage}'.
Use engaging language, include details like destinations, activities, or durations, and keep it concise (100-150 words).
Use Markdown for formatting (e.g., ### for headings, - for lists) to enhance readability.
Example:

Ngoài các tour có sẵn, bạn có thể khám phá rừng Amazon với các chuyến đi mạo hiểm, chèo thuyền kayak và ngắm động vật hoang dã.
### Gợi ý khác
- Tham quan đồn điền cà phê.
- *Thưởng thức ẩm thực* tại chợ đêm.
`;

  try {
    logger.debug(
      `Sending request to Mistral API: ${JSON.stringify({ model, prompt })}`
    );
    const response = await axios.post(
      mistralApiUrl,
      {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: Math.min(
          maxTokens,
          tokenUsage.maxTokens - tokenUsage.usedTokens
        ),
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      }
    );

    const reply = response.data.choices?.[0]?.message?.content?.trim();
    if (reply) {
      const botTokens = calculateTokens(reply);
      tokenUsage.usedTokens += botTokens;
      logger.info(`Mistral reply: ${reply} (Tokens: ${botTokens})`);
      return reply;
    } else {
      logger.warn("No valid response from Mistral API");
      return "Không thể tạo nội dung từ AI. Vui lòng thử lại.";
    }
  } catch (e) {
    logger.error(`Mistral API error: ${e.message}`);
    return `Không thể kết nối tới dịch vụ AI: ${e.message}`;
  }
}

// Find compound words (similar to Python's find_compound_words)
function findCompoundWords(text, mapping) {
  const matches = [];
  const words = text.toLowerCase().split(" ");
  const n = words.length;

  for (let length = n; length > 0; length--) {
    for (let i = 0; i <= n - length; i++) {
      const phrase = words.slice(i, i + length).join(" ");
      if (mapping[phrase]) {
        matches.push({
          phrase,
          mappedValue: mapping[phrase],
          start: i,
          end: i + length,
        });
      }
    }
  }

  matches.sort((a, b) => {
    const lengthDiff = b.phrase.split(" ").length - a.phrase.split(" ").length;
    return lengthDiff !== 0 ? lengthDiff : a.start - b.start;
  });

  return matches;
}

// Reset tokens endpoint
app.post("/reset_tokens", (req, res) => {
  logger.info("Resetting token count");
  tokenUsage.usedTokens = 0;
  res.json({ message: "Token count reset successfully" });
});

// server.js (phần endpoint /query)
app.post("/query", async (req, res) => {
  const { sender, message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const userTokens = calculateTokens(message);
  logger.info(`User ${sender} message: ${message} (Tokens: ${userTokens})`);

  if (tokenUsage.usedTokens + userTokens > tokenUsage.maxTokens) {
    logger.warn("Token limit reached");
    return res
      .status(400)
      .json({ error: "Token limit reached. Please reset the conversation." });
  }

  // Normalize input
const normalizedMessage = message.toLowerCase();
  const normalizedNoDiacritics = unidecode(normalizedMessage);
  logger.info(`Normalized message: ${normalizedMessage}`);
  logger.info(`Normalized no diacritics: ${normalizedNoDiacritics}`);

  // Stopwords
  const STOPWORDS = new Set([
    // Vietnamese
    "tôi",
    "muốn",
    "xem",
    "các",
    "ở",
    "những",
    "đi",
    "có",
    "cho",
    "một",
    "cần",
    "nào",
    "là",
    "và",
    "hoặc",
    "tại",
    "trên",
    "dưới",
    "vào",
    "tới",
    "đến",
    "của",
    "với",
    "bởi",
    "từ",
    "khi",
    "nếu",
    "thì",
    "làm",
    "bạn",
    "tìm",
    "tất cả",
    "bất kỳ",
    "là",
    "có",
    "đó",
    "này",
    "điều",
    "mà",
    "cái",
    "để",
    "như",
    "thế nào",
    "không",
    "được",
    "ngắn",
    "dài",
    "kéo",
    "hơn",
    "đã",
    "cũng",
    "có thể",
    "khoảng",
    "trong",
    "ngày",
    "người",
    "giờ",
    "thời gian",
    "tham gia",
    "điểm đến",
    "chuyến đi",
    "hành trình",
    // English
    "i",
    "want",
    "to",
    "see",
    "tours",
    "tour",
    "in",
    "the",
    "a",
    "an",
    "and",
    "or",
    "at",
    "on",
    "for",
    "with",
    "by",
    "from",
    "please",
    "show",
    "me",
    "all",
    "any",
    "is",
    "are",
    "be",
    "of",
    "that",
    "this",
  ]);

  // Find matches
  const locationMatches = [
    ...findCompoundWords(normalizedMessage, LOCATION_MAPPING),
    ...findCompoundWords(normalizedNoDiacritics, LOCATION_MAPPING),
  ];
  const activityMatches = [
    ...findCompoundWords(normalizedMessage, ACTIVITY_MAPPING),
    ...findCompoundWords(normalizedNoDiacritics, ACTIVITY_MAPPING),
  ];
  const tourTypeMatches = [
    ...findCompoundWords(normalizedMessage, TOUR_TYPE_MAPPING),
    ...findCompoundWords(normalizedNoDiacritics, TOUR_TYPE_MAPPING),
  ];

  logger.info(`Location matches: ${JSON.stringify(locationMatches)}`);
  logger.info(`Activity matches: ${JSON.stringify(activityMatches)}`);
  logger.info(`Tour type matches: ${JSON.stringify(tourTypeMatches)}`);

  // Build filters
  const filters = [];
  const params = [];
  const mappedKeywords = new Set();

  // Process location matches
  locationMatches.forEach(({ phrase, mappedValue }) => {
    logger.info(`Location mapping: ${phrase} -> ${mappedValue}`);
    filters.push("l.name LIKE ?");
    params.push(`%${mappedValue}%`);
    mappedKeywords.add(phrase);
    phrase.split(" ").forEach((word) => mappedKeywords.add(word));
  });

  // Process activity matches
  activityMatches.forEach(({ phrase, mappedValue }) => {
    logger.info(`Activity mapping: ${phrase} -> ${mappedValue}`);
    filters.push("a.name LIKE ?");
    params.push(`%${mappedValue}%`);
    mappedKeywords.add(phrase);
    phrase.split(" ").forEach((word) => mappedKeywords.add(word));
  });

  // Process tour type matches
  tourTypeMatches.forEach(({ phrase, mappedValue }) => {
    logger.info(`Tour type mapping: ${phrase} -> ${mappedValue}`);
    filters.push("tt.name LIKE ?");
    params.push(`%${mappedValue}%`);
    mappedKeywords.add(phrase);
    phrase.split(" ").forEach((word) => mappedKeywords.add(word));
  });

  // Extract keywords
  const doc = normalizedMessage.split(" ");
  const keywords = doc.filter(
    (w) => !STOPWORDS.has(w) && !mappedKeywords.has(w)
  );
  logger.info(`Remaining keywords: ${keywords}`);

  // Price filter
const priceMatch = message.match(/giá.*?(\d+)|price.*?(\d+)/i);
  let priceValue = null;
  if (priceMatch) {
    priceValue = parseInt(priceMatch[1] || priceMatch[2]);
if (/thấp hơn|less than/i.test(message)) {
      filters.push("t.price <= ?");
} else if (/cao hơn|more than/i.test(message)) {
      filters.push("t.price >= ?");
    } else {
      filters.push("t.price <= ?");
    }
    params.push(priceValue);
  }

  // Remove price-related words
  const priceRelatedWords = new Set([
    "giá",
    "thấp",
    "hơn",
    "bằng",
    "chừng",
    "gần",
    "cao",
    "khoảng",
    "dưới",
    "trên",
    "price",
    "less",
    "than",
    "more",
    "around",
    "below",
    "above",
  ]);
  if (priceValue) priceRelatedWords.add(String(priceValue));

  // Add title filter for remaining keywords
  const relevantKeywords = keywords.filter(
    (kw) =>
      !mappedKeywords.has(kw) &&
      !STOPWORDS.has(kw) &&
      !priceRelatedWords.has(kw) &&
      kw.length > 2
  );
  relevantKeywords.forEach((kw) => {
    logger.info(`Relevant keyword added to title filter: ${kw}`);
    filters.push("t.title LIKE ?");
    params.push(`%${kw}%`);
  });

  // Duration filter
const durationMatch = message.match(/(\d+)\s*(ngày|ngay|day)/i);
  if (durationMatch) {
    const duration = parseInt(durationMatch[1]);
    if (/ngắn|short/i.test(userMessage)) {
      filters.push("t.duration <= ?");
    } else if (/dài|long/i.test(userMessage)) {
      filters.push("t.duration >= ?");
    } else {
      filters.push("t.duration <= ?");
    }
    params.push(duration);
  }

  // Participants filter
const peopleMatch = message.match(/(\d+)\s*(người|nguoi|participant)/i);
  if (peopleMatch) {
    const participants = parseInt(peopleMatch[1]);
    if (/ít hơn|less than/i.test(userMessage)) {
      filters.push("t.max_participants <= ?");
    } else if (/nhiều hơn|more than/i.test(userMessage)) {
      filters.push("t.max_participants >= ?");
    } else {
      filters.push("t.max_participants <= ?");
    }
    params.push(participants);
  }

  // Build SQL query
  const baseQuery = `
SELECT DISTINCT t.id, t.title, l.name AS location, t.description, t.price, t.duration, tt.name AS tour_type
FROM tours t
JOIN locations l ON t.location_id = l.id
LEFT JOIN tour_activity ta ON t.id = ta.tour_id
LEFT JOIN activity_types a ON a.id = ta.activity_type_id
LEFT JOIN tour_types tt ON tt.id = t.tour_type_id
`;
  const query = filters.length
    ? `${baseQuery} WHERE ${filters.join(" AND ")}`
    : baseQuery;
  logger.debug(`QUERY: ${query}`);
logger.debug(`PARAMS: ${params}`);
params.forEach((param, index) => {
  if (typeof param === 'string' && !isNaN(param)) {
    params[index] = Number(param);
    logger.warn(`Converted param at index ${index} from string to number: ${param}`);
  }
});

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(query, params);
    logger.info(`SQL query returned ${results.length} results`);

    let response;
    if (results.length) {
      const responseParts = results.map((row) => ({
        id: row.id,
        title: row.title,
        location: row.location,
        description: row.description,
        price: row.price,
        duration: row.duration,
        tourType: row.tour_type,
      }));
      const mistralResponse = await callMistralApi(message);
      const suggestions = mistralResponse
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.trim());
      response = {
        tours: responseParts,
        suggestions: suggestions,
        status: "success",
      };
    } else {
      response = {
        response: await callMistralApi(message),
        status: "success",
      };
    }

    const botTokens = calculateTokens(JSON.stringify(response));
    tokenUsage.usedTokens += userTokens + botTokens;
    logger.info(
      `Sending response for user ${sender}: ${JSON.stringify(
        response
      )} (Tokens: ${botTokens})`
    );

    await connection.end();
    res.json(response);
  } catch (err) {
    logger.error(`Error for user ${sender}: ${err.message}`);
    res
      .status(500)
      .json({ error: `Đã xảy ra lỗi: ${err.message}`, status: "error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

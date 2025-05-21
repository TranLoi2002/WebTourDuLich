const mysql = require('mysql2/promise');
const unidecode = require('unidecode');
const logger = require('./logger'); // Sẽ tạo ở bước sau

const VIETNAMESE_ALIASES = {
                           // Locations
'việt nam': 'Việt Nam',
'vn': 'Việt Nam',
'nhật bản': 'Japan',
'nhật': 'Japan',
'japan': 'Japan',
'hàn quốc': 'South Korea',
'hàn': 'South Korea',
'korea': 'South Korea',
'thái lan': 'Thailand',
'thái': 'Thailand',
'thailand': 'Thailand',
// Tour types
'thư giãn': 'Relaxation',
'ngắn ngày': 'Short Trip',
'phiêu lưu': 'Adventure',
'mạo hiểm': 'Thrill',
// Activities
'leo núi': 'Hiking',
'lặn biển': 'Diving',
'tham quan': 'Sightseeing',
};

async function loadMappings() {
    const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'catalog_db',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
};

let LOCATION_MAPPING = {};
let ACTIVITY_MAPPING = {};
let TOUR_TYPE_MAPPING = {};

try {
const connection = await mysql.createConnection(dbConfig);

// Load locations
const [locations] = await connection.execute('SELECT name FROM locations');
locations.forEach(({ name }) => {
LOCATION_MAPPING[name.toLowerCase()] = name;
LOCATION_MAPPING[unidecode(name).toLowerCase()] = name;
});

// Load location aliases
try {
const [aliases] = await connection.execute('SELECT alias, location_name FROM location_aliases');
aliases.forEach(({ alias, location_name }) => {
LOCATION_MAPPING[alias.toLowerCase()] = location_name;
LOCATION_MAPPING[unidecode(alias).toLowerCase()] = location_name;
});
} catch (e) {
logger.warn(`Table location_aliases not found, using VIETNAMESE_ALIASES: ${e.message}`);
}

// Load activity types
const [activities] = await connection.execute('SELECT name FROM activity_types');
activities.forEach(({ name }) => {
    ACTIVITY_MAPPING[name.toLowerCase()] = name;
ACTIVITY_MAPPING[unidecode(name).toLowerCase()] = name;
});

// Load activity aliases
try {
const [activityAliases] = await connection.execute('SELECT alias, activity_name FROM activity_aliases');
activityAliases.forEach(({ alias, activity_name }) => {
ACTIVITY_MAPPING[alias.toLowerCase()] = activity_name;
ACTIVITY_MAPPING[unidecode(alias).toLowerCase()] = activity_name;
});
} catch (e) {
logger.warn(`Table activity_aliases not found, using VIETNAMESE_ALIASES: ${e.message}`);
}

// Load tour types
const [tourTypes] = await connection.execute('SELECT name FROM tour_types');
tourTypes.forEach(({ name }) => {
    TOUR_TYPE_MAPPING[name.toLowerCase()] = name;
TOUR_TYPE_MAPPING[unidecode(name).toLowerCase()] = name;
});

// Load tour type aliases
try {
const [tourTypeAliases] = await connection.execute('SELECT alias, tour_type_name FROM tour_type_aliases');
tourTypeAliases.forEach(({ alias, tour_type_name }) => {
TOUR_TYPE_MAPPING[alias.toLowerCase()] = tour_type_name;
TOUR_TYPE_MAPPING[unidecode(alias).toLowerCase()] = tour_type_name;
});
} catch (e) {
logger.warn(`Table tour_type_aliases not found, using VIETNAMESE_ALIASES: ${e.message}`);
}

// Add VIETNAMESE_ALIASES as fallback
for (const [viAlias, dbName] of Object.entries(VIETNAMESE_ALIASES)) {
if (locations.some(loc => loc.name === dbName)) {
LOCATION_MAPPING[viAlias.toLowerCase()] = dbName;
LOCATION_MAPPING[unidecode(viAlias).toLowerCase()] = dbName;
} else if (tourTypes.some(tt => tt.name === dbName)) {
TOUR_TYPE_MAPPING[viAlias.toLowerCase()] = dbName;
TOUR_TYPE_MAPPING[unidecode(viAlias).toLowerCase()] = dbName;
} else if (activities.some(act => act.name === dbName)) {
ACTIVITY_MAPPING[viAlias.toLowerCase()] = dbName;
ACTIVITY_MAPPING[unidecode(viAlias).toLowerCase()] = dbName;
}
}

logger.info('Successfully loaded mappings from database');
logger.debug(`LOCATION_MAPPING: ${JSON.stringify(LOCATION_MAPPING)}`);
logger.debug(`TOUR_TYPE_MAPPING: ${JSON.stringify(TOUR_TYPE_MAPPING)}`);
logger.debug(`ACTIVITY_MAPPING: ${JSON.stringify(ACTIVITY_MAPPING)}`);

await connection.end();
return { LOCATION_MAPPING, ACTIVITY_MAPPING, TOUR_TYPE_MAPPING };
} catch (err) {
logger.error(`Error loading mappings: ${err.message}`);
return { LOCATION_MAPPING: {}, ACTIVITY_MAPPING: {}, TOUR_TYPE_MAPPING: {} };
}
}

module.exports = loadMappings;
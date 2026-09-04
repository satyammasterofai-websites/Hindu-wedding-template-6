const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove the forced migration block
content = content.replace(
  `          if (dataToUse.eventDetails && dataToUse.eventDetails[0] && (dataToUse.eventDetails[0].date === 'SAT · February 13, 2027' || dataToUse.eventDetails[0].heading === 'Haldi' || dataToUse.eventDetails[0].heading === 'Haldi Ceremony')) {
             // Force migration of events to new default format
             const defaultEvents = defaultSettings.eventDetails;
             dataToUse.eventDetails = defaultEvents;
          }`,
  ``
);

// 2. Fix the missing caricatureUrl in handleSaveAndExit
content = content.replace(
  `         settingsToSave.eventDetails = await Promise.all(settingsToSave.eventDetails.map(async (e, i) => ({
            ...e,
            imageUrl: await prepareUrl(e.imageUrl, \`event-\${e.id || i}\`)
         })));`,
  `         settingsToSave.eventDetails = await Promise.all(settingsToSave.eventDetails.map(async (e, i) => ({
            ...e,
            imageUrl: await prepareUrl(e.imageUrl, \`event-\${e.id || i}\`),
            caricatureUrl: e.caricatureUrl ? await prepareUrl(e.caricatureUrl, \`event-\${e.id || i}-caricature\`) : undefined
         })));`
);

fs.writeFileSync('src/App.tsx', content);

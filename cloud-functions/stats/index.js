const sdk = require('node-appwrite');

module.exports = async function (req, res) {

  console.log('Starting execution from deployment: ', req.variables['APPWRITE_FUNCTION_DEPLOYMENT']);

  const client = new sdk.Client();
  const databases = new sdk.Databases(client);

  if (!req.variables["APPWRITE_FUNCTION_ENDPOINT"]
    || !req.variables["APPWRITE_FUNCTION_API_KEY"]
    || !req.variables["APPWRITE_FUNCTION_PROJECT_ID"]
    || !req.variables["APPWRITE_FUNCTION_EVENT"]
    || !req.variables["APPWRITE_FUNCTION_EVENT_DATA"]
  ) {
    res.json({ success: false, message: "Variables missing." });
    return;
  }

  client
    .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
    .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"]);

  try {

    /** @type string */
    const eventName = req.variables['APPWRITE_FUNCTION_EVENT'] ?? '';
    const eventData = JSON.parse(req.variables['APPWRITE_FUNCTION_EVENT_DATA'] ?? '{}');


    console.log('eventData', eventData);
    console.log('APPWRITE_FUNCTION_EVENT', req.variables['APPWRITE_FUNCTION_EVENT']);
    console.log('req variables', req.variables);

    // example: databases.tinto.collections.likes.documents.647a1c78c8a5cb487043.create
    const parsedEvent = eventName.split('.');
    console.log('parsedEvent', parsedEvent);


    if (eventData.wine_id.indexOf('USER_CUSTOM:') > -1){
      console.log('Wine is user custom, skipping execution');
      res.send({ success: true, message: 'Wine is user custom, skipping execution' });
      return;
    }


    const query = [
      sdk.Query.equal('wine_id', eventData.wine_id),
      sdk.Query.equal('type', eventData.type),
    ];
    console.log('query for stats', query)
    const currentStats = await databases.listDocuments('tinto', 'stats', query);

    console.log('currentStats', currentStats);

    if (!currentStats) {
      res.json({ success: false, message: "Error getting stats" });
      return;
    }

    let dbResponse;

    if (currentStats.total === 0) {
      const metric = parsedEvent[3];
      const metricVal = parsedEvent[6] === 'delete' ? 0 : 1;
      const documentData = {
        'wine_id': eventData.wine_id,
        'type': eventData.type,
        'name': eventData.name,
        [metric]: metricVal,
      };
      console.log('createDocument data:', documentData);
      dbResponse = await databases.createDocument('tinto', 'stats', sdk.ID.unique(), documentData);
    } else {
      const metric = parsedEvent[3];
      const metricVal = parsedEvent[6] === 'delete' ? currentStats.documents[0][metric] - 1 : currentStats.documents[0][metric] + 1;
      const documentData = {
        [metric]: metricVal < 0 ? 0 : metricVal,
      };
      console.log('updateDocument data:', documentData);
      dbResponse = await databases.updateDocument('tinto', 'stats', currentStats.documents[0].$id, documentData)
    }

    res.send({ success: true, message: dbResponse });
    return;

  } catch (e) {
    res.json({ success: false, message: "Unexpected error: " + e });
  }

};

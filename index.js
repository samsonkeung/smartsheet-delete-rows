const moment = require("moment");
const client = require('smartsheet');

const smartsheet = client.createClient({
    accessToken: 'TOKEN HERE'
});

const devRoutesSheetId = "SheetId as a number";

const halfAMonthAgo = moment().subtract(28, "days"); // default to delete rows that are created 28 days or more ago

const deleteRowsOptions = {
    sheetId: devRoutesSheetId,
    queryParameters: {
        ids: [],
        ignoreRowsNotFound: false
    }
};

smartsheet.sheets.getSheet({id: devRoutesSheetId}).then((sheetInfo) => {
    const rows = sheetInfo.rows;

    for (const row of rows) {
        const createdAt = moment(row.createdAt);
        if (createdAt.isBefore(halfAMonthAgo)) {
            deleteRowsOptions.queryParameters.ids.push(row.id);
        }
    }

    smartsheet.sheets.deleteRows(deleteRowsOptions).then(result => { console.log(result); });
});
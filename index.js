const moment = require("moment");
const client = require('smartsheet');
const R = require("ramda");

const smartsheet = client.createClient({
    accessToken: 'TOKEN here as a string'
});

const devRoutesSheetId = "Sheet Id here as a number";

const halfAMonthAgo = moment().subtract(20, "days"); // default to delete rows that are created 20 days or more ago

const rowsToDelete = [];

const deleteRowsOptions = {
    sheetId: devRoutesSheetId,
    queryParameters: {
        ids: [],
        ignoreRowsNotFound: true
    }
};

smartsheet.sheets.getSheet({id: devRoutesSheetId})
    .then((sheetInfo) => {
        const rows = sheetInfo.rows;

        for (const row of rows) {
            const createdAt = moment(row.createdAt);
            if (createdAt.isBefore(halfAMonthAgo)) {
                rowsToDelete.push(row.id);
            }
        }

        return;
    })
    .then( async () => {
        const rowsChunks = R.splitEvery(20, rowsToDelete);

        for (const chunk of rowsChunks) {
            deleteRowsOptions.queryParameters.ids = chunk;
            await smartsheet.sheets.deleteRows(deleteRowsOptions).then(result => {
                console.log(result);
            });
        }
    });
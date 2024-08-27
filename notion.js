const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });

exports.getUnfinishedTaskOnOrBeforeDueDate = function(date) {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            and: [
                {
                    or: [
                        {
                            property: 'Status',
                            status: {
                                equals: 'In progress'
                            }
                        },
                        {
                            property: 'Status',
                            status: {
                                equals: 'Not started'
                            }
                        },
                    ]
                },
                {
                    property: 'Due Date',
                    date: {
                        on_or_before: date
                    }
                },
            ]
        }
    });
}

const { Client } = require("@notionhq/client");
const moment = require("moment");

const notion = new Client({ auth: process.env.NOTION_TOKEN });

exports.getTodoTasks = function() {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            property: 'Status',
            status: {
                equals: 'Not started'
            }
        }    
    });
}

exports.getInProgressTasks = function() {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            property: 'Status',
            status: {
                equals: 'In progress'
            }
        }
    })
}

exports.getDoneTasks = function() {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            property: 'Status',
            status: {
                equals: 'Done'
            }
        }
    })
}

exports.getOverdueTasks = function() {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            and: [
                {
                    or: [
                        {
                            property: 'Status',
                            status: {
                                equals: 'Not started'
                            }
                        },
                        {
                            property: 'Status',
                            status: {
                                equals: 'In Progress'
                            }
                        }
                    ]
                },
                {
                    property: 'Due Date',
                    date: {
                        before: moment().format('YYYY-MM-DD')
                    }
                }
            ]
        }
    })
}

exports.getDueTodayTasks = function() {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            and: [
                {
                    or: [
                        {
                            property: 'Status',
                            status: {
                                equals: 'Not started'
                            }
                        },
                        {
                            property: 'Status',
                            status: {
                                equals: 'In Progress'
                            }
                        }
                    ]
                },
                {
                    property: 'Due Date',
                    date: {
                        equals: moment().format('YYYY-MM-DD')
                    }
                }
            ]
        }
    })
}

exports.getDueTomorrowTasks = function() {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            and: [
                {
                    or: [
                        {
                            property: 'Status',
                            status: {
                                equals: 'Not started'
                            }
                        },
                        {
                            property: 'Status',
                            status: {
                                equals: 'In Progress'
                            }
                        }
                    ]
                },
                {
                    property: 'Due Date',
                    date: {
                        equals: moment().add(1, 'days').format('YYYY-MM-DD')
                    }
                }
            ]
        }
    })
}

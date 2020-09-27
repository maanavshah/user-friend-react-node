const Pool = require('pg').Pool

const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'test',
    password: 'maanavshah',
    port: 5432,
})

// return list of all users
const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// return list of all friends
const getFriends = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM users WHERE id IN (SELECT friend_id FROM friends WHERE user_id = $1) or id IN (SELECT user_id FROM friends WHERE friend_id = $1);', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// return list of all friends of friends
const getAllFriends = (request, response) => {
    const id = parseInt(request.params.id);
    let res = [];

    pool.query('SELECT id FROM users WHERE id IN (SELECT friend_id FROM friends WHERE user_id = $1) or id IN (SELECT user_id FROM friends WHERE friend_id = $1);', [id], (error, results) => {
        if (error) {
            throw error
        }

        for (let i = 0; i < results.rows.length; i++) {
            pool.query('SELECT * FROM users WHERE id IN (SELECT friend_id FROM friends WHERE user_id = $1) or id IN (SELECT user_id FROM friends WHERE friend_id = $1);', [results.rows[i].id], (error1, results1) => {
                if (error1)
                    throw error1;
                res = res.concat(results1.rows);
                if (i == results.rows.length - 1)
                    response.status(200).json(res.filter(el => el['id'] !== id));
            });
        }
    });
}

module.exports = {
    getUsers,
    getFriends,
    getAllFriends,
}
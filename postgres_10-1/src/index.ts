// write a function to create a users table in database
// steps -
// 1 - connect database
// 2 - do query

import { Client } from "pg";

const client = new Client({
  connectionString:
    "postgresql://1_db_owner:DCm0Q5NhxubB@ep-white-voice-a1bdqu1g.ap-southeast-1.aws.neon.tech/1_db?sslmode=require",
});

// creating Users table -----------------------------------------
async function createUsersTable() {
  //   connect database
  await client.connect();
  // trigger users table creation query
  const result = await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
  console.log(result);
}

// createUsersTable();

//
// inserting in users table -------------------------------------
async function insertUsersTable() {
  try {
    await client.connect(); // Ensure client connection is established
    // Use parameterized query to prevent SQL injection
    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
    const values = ["test1", "test1@gmail.com", "Qwer1234"];
    const res = await client.query(insertQuery, values);
    console.log("Insertion success:", res); // Output insertion result
  } catch (err) {
    console.error("Error during the insertion:", err);
  } finally {
    await client.end(); // Close the client connection
  }
}

// insertUsersTable();

//
// Getting user based on gmail ---------------------------------
async function getUser(email: string) {
  try {
    await client.connect(); // Ensure client connection is established
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      console.log("User found:", result.rows[0]); // Output user data
      return result.rows[0]; // Return the user data
    } else {
      console.log("No user found with the given email.");
      return null; // Return null if no user was found
    }
  } catch (err) {
    console.error("Error during fetching user:", err);
    throw err; // Rethrow or handle error appropriately
  } finally {
    await client.end(); // Close the client connection
  }
}

// Example usage
// getUser("test1@gmail.com").catch(console.error);

//
// create addresses table ----------------------------------------
async function createAddressesTable() {
  try {
    //   connect database
    await client.connect();
    // trigger users table creation query
    const result = await client.query(`
      CREATE TABLE addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        street VARCHAR(255) NOT NULL,
        pincode VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `);
    console.log(result);
  } catch (error) {
    console.log(error);
  } finally {
    await client.end(); // Close the client connection
  }
}

// createAddressesTable();

//
// Isert into addresses table -------------------------------------
async function insertAddressesTable(user_id: number) {
  try {
    await client.connect(); // Ensure client connection is established
    // Use parameterized query to prevent SQL injection
    const insertQuery = `INSERT INTO addresses (user_id, city, country, street, pincode) VALUES ($1, $2, $3, $4, $5);`;
    const values = [user_id, "Bhilai", "India", "661 Chiv Chowk", "490025"];
    const res = await client.query(insertQuery, values);
    console.log("Insertion success:", res); // Output insertion result
  } catch (err) {
    console.error("Error during the insertion:", err);
  } finally {
    await client.end(); // Close the client connection
  }
}

// insertAddressesTable(1);

//
// Getting addresses ----------------------------------------------
async function getAddresses(user_id: number) {
  try {
    await client.connect(); // Ensure client connection is established
    const query = `SELECT city, country, street, pincode
                    FROM addresses
                    WHERE user_id = $1;`;
    const values = [user_id];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      console.log("Addresses found:", result.rows); // Output user data
      return result.rows[0]; // Return the user data
    } else {
      console.log("No user found with the given email.");
      return null; // Return null if no user was found
    }
  } catch (err) {
    console.error("Error during fetching user:", err);
    throw err; // Rethrow or handle error appropriately
  } finally {
    await client.end(); // Close the client connection
  }
}

// getAddresses(1);

//
// JOINS ---------------------------------------------------------
// Async function to fetch user data and their address together
async function getUserDetailsWithAddress(userId: string) {
  try {
    await client.connect();
    const query = `
            SELECT u.id AS user_id, u.username, u.email, a.city, a.country, a.street, a.pincode 
            FROM users u
            JOIN addresses a 
            ON u.id = a.user_id
            WHERE u.id = $1;
        `;
    const result = await client.query(query, [userId]);

    if (result.rows.length > 0) {
      console.log("User and address found:", result.rows[0]);
      return result.rows[0];
    } else {
      console.log("No user or address found with the given ID.");
      return null;
    }
  } catch (err) {
    console.error("Error during fetching user and address:", err);
    throw err;
  } finally {
    await client.end();
  }
}

// getUserDetailsWithAddress("1");

//
// JOINS ---------------------------------------------------------
// All addresses together
async function getUserDetailsWithAllAddress(userId: string) {
  try {
    await client.connect();
    const query = `
            SELECT u.id AS user_id, u.username, u.email, 
            json_agg(
                json_build_object(
                    'city', a.city,
                    'country', a.country,
                    'street', a.street,
                    'pincode', a.pincode
                )
            ) AS addresses
            FROM users u
            JOIN addresses a 
            ON u.id = a.user_id
            WHERE u.id = $1
            GROUP BY u.id, u.username, u.email;
        `;
    const result = await client.query(query, [userId]);

    if (result.rows.length > 0) {
      console.log("User and address found:", result.rows[0]);
      return result.rows[0];
    } else {
      console.log("No user or address found with the given ID.");
      return null;
    }
  } catch (err) {
    console.error("Error during fetching user and address:", err);
    throw err;
  } finally {
    await client.end();
  }
}

// getUserDetailsWithAllAddress("1");

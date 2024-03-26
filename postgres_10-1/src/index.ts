// write a function to create a users table in database
// steps -
// 1 - connect database
// 2 - do query

import { Client } from "pg";

const client = new Client({
  connectionString:
    "postgresql://1_db_owner:gzU7rT6uOobh@ep-white-voice-a1bdqu1g.ap-southeast-1.aws.neon.tech/1_db?sslmode=require",
});

//
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
    const values = ["test3", "test3@gmail.com", "Qwer1234"];
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
}

// createAddressesTable();

//
// Isert into addresses table -------------------------------------
async function insertAddressesTable() {
  try {
    await client.connect(); // Ensure client connection is established
    // Use parameterized query to prevent SQL injection
    const insertQuery = `INSERT INTO addresses (user_id, city, country, street, pincode) VALUES ($1, $2, $3, $4, $5);`;
    const values = [1, "New York", "USA", "123 Broadway St", "10001"];
    const res = await client.query(insertQuery, values);
    console.log("Insertion success:", res); // Output insertion result
  } catch (err) {
    console.error("Error during the insertion:", err);
  } finally {
    await client.end(); // Close the client connection
  }
}

// insertAddressesTable();

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
      console.log("Addresses found:", result.rows[0]); // Output user data
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

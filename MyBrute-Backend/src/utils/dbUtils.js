import { pool } from "../config/db.js";

const userTableQuery = `CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const bruteTableQuery = `CREATE TABLE brutes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    hp INT DEFAULT 100,
    strength INT DEFAULT 10,
    agility INT DEFAULT 10,
    speed INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
);`;

const skillTableQuery = `CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);`;

const bruteSkillTableQuery = `CREATE TABLE brute_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brute_id INT NOT NULL,
    skill_id INT NOT NULL,
    unlocked_at_level INT NOT NULL,
    CONSTRAINT fk_brute
        FOREIGN KEY(brute_id) REFERENCES brutes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_skill
        FOREIGN KEY(skill_id) REFERENCES skills(id)
        ON DELETE CASCADE,
    UNIQUE(brute_id, skill_id)
);`;

const weaponTableQuery = `CREATE TABLE weapons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    damage_min INT NOT NULL,
    damage_max INT NOT NULL,
    special_effect VARCHAR(100),
    level INT NOT NULL
);`;

const bruteWeaponTableQuery = `CREATE TABLE brute_weapons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brute_id INT NOT NULL,
    weapon_id INT NOT NULL,
    unlocked_at_level INT NOT NULL,
    CONSTRAINT fk_brute_weapon
        FOREIGN KEY(brute_id) REFERENCES brutes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_weapon
        FOREIGN KEY(weapon_id) REFERENCES weapons(id)
        ON DELETE CASCADE,
    UNIQUE(brute_id, weapon_id)
);`;

const battleTableQuery = `CREATE TABLE battles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attacker_id INT NOT NULL,
    defender_id INT NOT NULL,
    winner_id INT,
    battle_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    experience_gained INT DEFAULT 0,
    CONSTRAINT fk_attacker FOREIGN KEY(attacker_id) REFERENCES brutes(id),
    CONSTRAINT fk_defender FOREIGN KEY(defender_id) REFERENCES brutes(id),
    CONSTRAINT fk_winner FOREIGN KEY(winner_id) REFERENCES brutes(id)
);`;

const createTable = async (tableName, query) => {
  try {
    await pool.query(query);
    console.log(`${tableName} table created or already exists`);
  } catch (error) {
    console.log(`Error creating ${tableName}`, error);
  }
};

const createAllTable = async () => {
  try {
    await createTable("users", userTableQuery);
    await createTable("brutes", bruteTableQuery);
    await createTable("skills", skillTableQuery);
    await createTable("brute_skills", bruteSkillTableQuery);
    await createTable("weapons", weaponTableQuery);
    await createTable("brute_weapons", bruteWeaponTableQuery);
    await createTable("battles", battleTableQuery);
    console.log("All tables created successfully");
  } catch (error) {
    console.log("Error creating tables", error);
    throw error;
  }
};

export default createAllTable;
